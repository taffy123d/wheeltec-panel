#!/usr/bin/env python3
"""
Wheeltec 机器人 SSH 远程连接模块

用法:
    from ssh_robot import connect, run, ros2

    # 执行普通命令
    run("hostname && df -h")

    # 执行ROS2命令
    ros2("topic list")
    ros2("node list")

    # 上下文管理器
    with connect() as r:
        r.exec("hostname")
        r.ros2("topic list")
        r.upload("local.txt", "/home/wheeltec/remote.txt")
        r.download("/home/wheeltec/log.txt", "./log.txt")
"""

import os
import sys
import subprocess

# ---------- 依赖检查 ----------

_DEPS_OK = False


def _check_deps():
    """检查 paramiko 是否安装，未安装则给出指引"""
    global _DEPS_OK
    if _DEPS_OK:
        return True
    try:
        import paramiko  # noqa: F401
        _DEPS_OK = True
        return True
    except ImportError:
        print("[wheeltec-skill] paramiko 未安装，正在尝试自动安装...", file=sys.stderr)
        try:
            subprocess.check_call(
                [sys.executable, "-m", "pip", "install", "paramiko", "-q"],
                stdout=sys.stderr,
                stderr=sys.stderr,
            )
            print("[wheeltec-skill] paramiko 安装成功", file=sys.stderr)
            _DEPS_OK = True
            return True
        except Exception as e:
            print(f"[wheeltec-skill] 自动安装失败: {e}", file=sys.stderr)
            print("[wheeltec-skill] 请手动执行: pip install paramiko", file=sys.stderr)
            return False


# ---------- SSH客户端 ----------

class RobotSSH:
    """Wheeltec机器人SSH连接"""

    # ---- 默认配置（可通过环境变量覆盖） ----
    HOST = os.environ.get("ROBOT_HOST", "100.122.158.62")
    USER = os.environ.get("ROBOT_USER", "wheeltec")
    PASSWORD = os.environ.get("ROBOT_PASSWORD", "dongguan")
    ROS_DISTRO = "humble"
    ROS_SETUP = f"/opt/ros/{ROS_DISTRO}/setup.bash"
    ROS_WS_SETUP = f"/home/{USER}/wheeltec_ros2/install/setup.bash"

    def __init__(self, host=None, user=None, password=None, timeout=15):
        self.host = host or self.HOST
        self.user = user or self.USER
        self.password = password or self.PASSWORD
        self.timeout = timeout
        self._client = None

    # ---- 连接管理 ----

    def connect(self):
        import paramiko
        self._client = paramiko.SSHClient()
        self._client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        self._client.connect(
            hostname=self.host,
            username=self.user,
            password=self.password,
            timeout=self.timeout,
            look_for_keys=False,
            allow_agent=False,
        )
        return self

    def close(self):
        if self._client:
            self._client.close()
            self._client = None

    def __enter__(self):
        return self.connect()

    def __exit__(self, *args):
        self.close()

    # ---- 命令执行 ----

    def exec(self, command, timeout=60):
        """执行shell命令, 返回 (stdout, stderr, exit_code)"""
        if not self._client:
            self.connect()
        chan = self._client.get_transport().open_session()
        chan.exec_command(command)
        chan.settimeout(timeout)
        stdout = chan.makefile("r").read().decode("utf-8", errors="replace")
        stderr = chan.makefile_stderr("r").read().decode("utf-8", errors="replace")
        exit_code = chan.recv_exit_status()
        return stdout, stderr, exit_code

    def ros2(self, command, timeout=60):
        """执行ROS2命令（自动source环境）"""
        full_cmd = (
            f"source {self.ROS_SETUP} && "
            f"[ -f {self.ROS_WS_SETUP} ] && source {self.ROS_WS_SETUP}; "
            f"ros2 {command}"
        )
        return self.exec(f"bash -c {repr(full_cmd)}", timeout=timeout)

    # ---- 文件传输 ----

    def upload(self, local_path, remote_path):
        if not self._client:
            self.connect()
        import posixpath
        remote_dir = posixpath.dirname(remote_path)
        _, _, code = self.exec(f"mkdir -p {remote_dir}")
        if code != 0:
            raise RuntimeError(f"无法创建远程目录: {remote_dir}")
        sftp = self._client.open_sftp()
        sftp.put(local_path, remote_path)
        sftp.close()
        print(f"[上传] {local_path} -> {self.user}@{self.host}:{remote_path}", file=sys.stderr)

    def download(self, remote_path, local_path):
        if not self._client:
            self.connect()
        sftp = self._client.open_sftp()
        sftp.get(remote_path, local_path)
        sftp.close()


# ---------- 便捷函数 ----------

def connect():
    """创建并连接 RobotSSH 实例"""
    if not _check_deps():
        sys.exit(1)
    return RobotSSH().connect()


def _safe_write(text, stream):
    """安全写入，处理 Windows GBK 编码无法表示的字符"""
    try:
        stream.write(text)
    except UnicodeEncodeError:
        stream.write(text.encode(stream.encoding or 'utf-8', errors='replace').decode(stream.encoding or 'utf-8', errors='replace'))


def run(cmd, timeout=60):
    """执行远程命令并打印结果"""
    with connect() as r:
        stdout, stderr, code = r.exec(cmd, timeout)
        if stdout:
            _safe_write(stdout, sys.stdout)
        if stderr:
            _safe_write(stderr, sys.stderr)
        return code


def ros2(cmd, timeout=60):
    """执行ROS2命令并打印结果"""
    with connect() as r:
        stdout, stderr, code = r.ros2(cmd, timeout)
        if stdout:
            _safe_write(stdout, sys.stdout)
        if stderr:
            _safe_write(stderr, sys.stderr)
        return code


# ---------- CLI入口 ----------

def _cli():
    """命令行入口: python ssh_robot.py [--ros2] <command>"""
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(0)

    if sys.argv[1] == "--ros2":
        cmd = " ".join(sys.argv[2:])
        sys.exit(ros2(cmd))
    elif sys.argv[1] == "--upload":
        if len(sys.argv) != 4:
            print("用法: python ssh_robot.py --upload <本地> <远程>")
            sys.exit(1)
        with connect() as r:
            r.upload(sys.argv[2], sys.argv[3])
    elif sys.argv[1] == "--download":
        if len(sys.argv) != 4:
            print("用法: python ssh_robot.py --download <远程> <本地>")
            sys.exit(1)
        with connect() as r:
            r.download(sys.argv[2], sys.argv[3])
    else:
        cmd = " ".join(sys.argv[1:])
        sys.exit(run(cmd))


if __name__ == "__main__":
    _cli()

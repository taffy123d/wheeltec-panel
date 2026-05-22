#!/usr/bin/env python3
"""
ROS2 机器人 SSH 远程连接模块

用法:
    from ssh_robot import connect, run, ros2

    # 执行普通命令
    run("hostname && df -h")

    # 执行ROS2命令（自动 source 环境）
    ros2("topic list")
    ros2("node list")

    # 上下文管理器
    with connect() as r:
        r.exec("hostname")
        r.ros2("topic list")
        r.upload("local.txt", "/home/user/remote.txt")
        r.download("/home/user/log.txt", "./log.txt")
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
        print("[ros2-ssh] paramiko 未安装，正在尝试自动安装...", file=sys.stderr)
        try:
            subprocess.check_call(
                [sys.executable, "-m", "pip", "install", "paramiko", "-q"],
                stdout=sys.stderr,
                stderr=sys.stderr,
            )
            print("[ros2-ssh] paramiko 安装成功", file=sys.stderr)
            _DEPS_OK = True
            return True
        except Exception as e:
            print(f"[ros2-ssh] 自动安装失败: {e}", file=sys.stderr)
            print("[ros2-ssh] 请手动执行: pip install paramiko", file=sys.stderr)
            return False


# ---------- 配置加载 ----------

def _skill_root():
    """返回 skill 根目录（scripts/ 的父目录）"""
    return os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def _load_config():
    """加载配置，优先级：环境变量 > robot.conf > 报错"""
    config = {}

    # 1. 读取 robot.conf（如果存在）
    conf_file = os.path.join(_skill_root(), "robot.conf")
    if os.path.isfile(conf_file):
        with open(conf_file, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                key, _, val = line.partition("=")
                key = key.strip()
                val = val.strip()
                if val:
                    config[key] = val

    # 2. 环境变量覆盖
    for key in ("ROBOT_HOST", "ROBOT_USER", "ROBOT_PASSWORD",
                "ROBOT_ROS_WS_SETUP", "ROBOT_ROS_SETUP"):
        env_val = os.environ.get(key, "")
        if env_val:
            config[key] = env_val

    # 3. 设置 ROS 环境默认值
    if "ROBOT_ROS_SETUP" not in config:
        # 尝试自动检测 ROS 发行版
        config["ROBOT_ROS_SETUP"] = "/opt/ros/humble/setup.bash"

    return config


# ---------- SSH客户端 ----------

class RobotSSH:
    """ROS2 机器人 SSH 连接"""

    def __init__(self, host=None, user=None, password=None,
                 ros_setup=None, ros_ws_setup=None, timeout=15):
        config = _load_config()
        self.host = host or config.get("ROBOT_HOST")
        self.user = user or config.get("ROBOT_USER")
        self.password = password or config.get("ROBOT_PASSWORD")
        self.ros_setup = ros_setup or config.get("ROBOT_ROS_SETUP", "/opt/ros/humble/setup.bash")
        self.ros_ws_setup = ros_ws_setup or config.get("ROBOT_ROS_WS_SETUP", "")
        self.timeout = timeout
        self._client = None

        # 验证必要参数
        if not self.host:
            raise ValueError(
                "未配置 ROBOT_HOST。请在 Skill 根目录创建 robot.conf 或设置环境变量。\n"
                f"参考模板: {os.path.join(_skill_root(), 'robot.conf.example')}"
            )
        if not self.user:
            raise ValueError("未配置 ROBOT_USER。请在 robot.conf 或环境变量中设置。")

    # ---- 连接管理 ----

    def connect(self):
        if not _check_deps():
            sys.exit(1)
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
        parts = [f"source {self.ros_setup}"]
        if self.ros_ws_setup:
            parts.append(f"[ -f {self.ros_ws_setup} ] && source {self.ros_ws_setup}")
        parts.append(f"ros2 {command}")
        full_cmd = "; ".join(parts)
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
    """命令行入口: python ssh_robot.py [--ros2|--upload|--download] <args>"""
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

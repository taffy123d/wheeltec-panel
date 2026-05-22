# Python API 详细用法

## 模块导入

```python
import sys
sys.path.insert(0, '<skill-root>/scripts')
from ssh_robot import connect, run, ros2, RobotSSH
```

## 便捷函数

```python
# 执行远程命令（自动连接+断开）
code = run("hostname && df -h")

# 执行 ROS2 命令（自动 source 环境）
code = ros2("topic list")
code = ros2("launch <pkg> <file>.launch.py")
```

## 上下文管理器（复用连接）

```python
with connect() as r:
    out, err, code = r.exec("hostname")
    out, err, code = r.ros2("topic list")
    r.upload("local.txt", "/home/user/remote.txt")
    r.download("/home/user/log.txt", "./log.txt")
    r.ros2("topic echo /odom --once", timeout=10)
```

## 直接实例化（自定义参数）

```python
from ssh_robot import RobotSSH

with RobotSSH(
    host="10.0.0.5",          # 覆盖配置文件
    user="root",
    password="...",
    ros_setup="/opt/ros/jazzy/setup.bash",
    ros_ws_setup="/home/root/custom_ws/install/setup.bash",
    timeout=30,
).connect() as r:
    r.exec("hostname")

# 或分步操作
r = RobotSSH()
r.connect()
r.exec("uname -a")
r.close()
```

## Python 脚本 CLI 调用

```bash
python scripts/ssh_robot.py "hostname"
python scripts/ssh_robot.py --ros2 "topic list"
python scripts/ssh_robot.py --upload ./local.txt /home/user/remote.txt
python scripts/ssh_robot.py --download /home/user/log.txt ./local.txt
```

## API 参考

| 方法 | 参数 | 返回值 |
|------|------|--------|
| `connect()` | — | `self` |
| `close()` | — | — |
| `exec(cmd, timeout=60)` | 命令字符串, 超时秒数 | `(stdout, stderr, exit_code)` |
| `ros2(cmd, timeout=60)` | ros2 子命令, 超时秒数 | `(stdout, stderr, exit_code)` |
| `upload(local, remote)` | 本地路径, 远程路径 | — |
| `download(remote, local)` | 远程路径, 本地路径 | — |

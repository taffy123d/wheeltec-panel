---
name: wheeltec-ssh
description: 通过 SSH 远程连接控制 Wheeltec 机器人小车（ROS 2 Humble, Ubuntu 22.04, Jetson aarch64），支持命令执行、ROS2 操作和文件传输。基于 Tailscale 组网 + paramiko SSH。
triggers:
  - wheeltec
  - 小车
  - 机器人小车
  - 远程小车
  - 控制小车
  - 遥控小车
  - ros2 topic
  - ros2 node
---

# Wheeltec 机器人远程控制

通过 SSH 远程连接和控制基于 ROS 2 Humble 的 Wheeltec 机器人小车。

> **注意**：本文档所有 `scripts/` 路径均为相对于本 Skill 根目录的路径。执行时需要先 `cd` 到 Skill 根目录。

> **禁止在 plan mode 下进行 SSH 连接**，否则会导致连接失败。

> **⚠️ CRLF 警告**：Windows 克隆/编辑的文件包含 `\r\n` 换行，直接上传到 Linux 后 Python shebang 会变成 `python3\r`（命令未找到），colcon build 会将这些损坏的文件安装到 `install/`。**上传任何源码到小车后，必须立即执行**：
> ```bash
> find <上传目录> -type f -name '*.py' -exec sed -i 's/\r$//' {} \;
> ```

## 快速开始

```bash
cd <skill-root>

# 检查/安装依赖（首次使用）
bash scripts/robot.sh --setup

# 执行远程命令
bash scripts/robot.sh "hostname && df -h"

# 执行 ROS2 命令
bash scripts/robot.sh --ros2 "topic list"

# 检查 ROS2 系统状态
bash scripts/robot.sh --status
```

## 目标环境

| 项目 | 值 |
|------|-----|
| 连接地址 | wheeltec@100.122.158.62 (Tailscale) |
| 系统 | Ubuntu 22.04.5 LTS, aarch64 (NVIDIA Jetson) |
| ROS 版本 | ROS 2 Humble |
| ROS2 安装路径 | /opt/ros/humble/setup.bash |
| 工作空间 | /home/wheeltec/wheeltec_ros2/install/setup.bash |
| 工作空间源码 | /home/wheeltec/wheeltec_ros2/src/ |

## 使用方法

### 方式一：Shell 统一入口 `scripts/robot.sh`（推荐）

```bash
# 基础命令
bash scripts/robot.sh "<shell命令>"

# ROS2 命令（自动 source 环境）
bash scripts/robot.sh --ros2 "<ros2子命令>"

# 文件上传（本地路径用相对路径或 Windows 绝对路径）
bash scripts/robot.sh --upload ./local.txt /home/wheeltec/remote.txt

# 文件下载
bash scripts/robot.sh --download /home/wheeltec/log.txt ./local_log.txt

# ROS2 状态检查
bash scripts/robot.sh --status

# 依赖检查/安装
bash scripts/robot.sh --setup
```

### 方式二：Python 直接调用

```bash
python scripts/ssh_robot.py "hostname"
python scripts/ssh_robot.py --ros2 "topic list"
python scripts/ssh_robot.py --upload ./local.txt /home/wheeltec/remote.txt
python scripts/ssh_robot.py --download /home/wheeltec/log.txt ./local.txt
```

### 方式三：Python 模块导入

```python
import sys
sys.path.insert(0, '<skill-root>/scripts')
from ssh_robot import connect, run, ros2

run("hostname && df -h")          # 执行命令
ros2("topic list")                # 执行ROS2命令

with connect() as r:              # 复用连接
    out, err, code = r.exec("hostname")
    out, err, code = r.ros2("topic list")
    r.upload("local.txt", "/home/wheeltec/remote.txt")
    r.download("/home/wheeltec/log.txt", "./log.txt")
```

## 环境依赖

- **Python 3.8+**
- **paramiko** SSH 库（脚本自动检测并尝试安装）

### 各平台安装指引

```bash
# 自动安装（推荐，Windows/Linux/macOS 通用）
bash scripts/robot.sh --setup

# 手动安装
pip install paramiko             # Windows
pip3 install paramiko            # Linux/macOS
sudo apt install python3-paramiko  # Ubuntu/Debian 备用
```

## 配置覆盖

所有连接参数支持环境变量覆盖：

```bash
export ROBOT_HOST="100.122.158.62"     # 小车IP
export ROBOT_USER="wheeltec"           # SSH用户
export ROBOT_PASSWORD="dongguan"       # SSH密码（建议用SSH密钥替代）
```

## 小车功能包

工作空间包含 30+ wheeltec 功能包：

| 类别 | 包名 | 功能 |
|------|------|------|
| SLAM | `wheeltec_robot_slam` | 即时定位与建图 |
| 导航 | `wheeltec_robot_nav2`, `navigation2-humble` | 自主导航 |
| 路径 | `wheeltec_path_follow`, `simple_follower_ros2` | 路径跟随 |
| 传感 | `wheeltec_imu`, `wheeltec_gps`, `wheeltec_lidar_ros2` | IMU/GPS/激光雷达 |
| 视觉 | `ros2_astra_camera-master`, `usb_cam-ros2`, `aruco_ros-humble-devel` | 深度相机/USB摄像头/ArUco |
| 控制 | `wheeltec_joy`, `wheeltec_robot_keyboard` | 手柄/键盘 |
| AI | `wheeltec_bodyreader`, `ultralytics_ros2`, `ollama_ros_chat` | 人脸/YOLO/Ollama |
| 语音 | `tts_make_ros2`, `wheeltec_aiui`, `wheeltec_mic` | TTS/AI语音/麦克风 |
| 其他 | `wheeltec_robot_kcf`, `wheeltec_robot_rrt2`, `wheeltec_rtab` | KCF追踪/RRT规划/RTAB |

## 典型操作

```bash
# === 系统状态 ===
bash scripts/robot.sh --status

# === 前端一体化启动 ===
bash scripts/robot.sh --ros2 "launch turn_on_wheeltec_robot wheeltec_frontend.launch.py"

# === 启动导航/SLAM ===
bash scripts/robot.sh --ros2 "launch wheeltec_robot_nav2 nav2_bringup.launch.py"
bash scripts/robot.sh --ros2 "launch wheeltec_robot_slam slam.launch.py"

# === 话题调试 ===
bash scripts/robot.sh --ros2 "topic list -t"                    # 列出所有话题+类型
bash scripts/robot.sh --ros2 "topic echo /odom --once"          # 查看里程计
bash scripts/robot.sh --ros2 "topic echo /PowerVoltage --once"  # 查看电池电压
bash scripts/robot.sh --ros2 "topic pub /cmd_vel geometry_msgs/msg/Twist '{linear: {x: 0.2}, angular: {z: 0.0}}' -1"

# === systemd 服务管理 ===
bash scripts/robot.sh "echo 'dongguan' | sudo -S systemctl status wheeltec-frontend --no-pager"
bash scripts/robot.sh "echo 'dongguan' | sudo -S systemctl restart wheeltec-frontend"
bash scripts/robot.sh "echo 'dongguan' | sudo -S journalctl -u wheeltec-frontend -n 30 --no-pager"

# === 文件传输 ===
bash scripts/robot.sh --upload ./test.py /home/wheeltec/test.py
bash scripts/robot.sh "python3 /home/wheeltec/test.py"
bash scripts/robot.sh --download /home/wheeltec/result.log ./result.log

# === 后台长时间任务（避免 SSH 超时）===
# 1. 上传脚本
bash scripts/robot.sh --upload ./build_script.sh /home/wheeltec/build_script.sh
# 2. nohup 后台执行
bash scripts/robot.sh "chmod +x /home/wheeltec/build_script.sh && nohup bash /home/wheeltec/build_script.sh > /tmp/build.log 2>&1 &"
# 3. 检查进度
bash scripts/robot.sh "tail -30 /tmp/build.log"
```

## 踩坑记录与故障排除

### 坑 1：Windows 换行符 `\r\n` 导致 Linux 脚本无法执行

**现象**：上传到小车的 `.py` 或 shell 脚本报 `Exec format error`、`/usr/bin/env: 'python3\r': No such file or directory`。

**根因**：Windows 的 Git/编辑器默认使用 CRLF (`\r\n`) 换行。当文件上传到 Linux 后，shebang 行 `#!/usr/bin/env python3\r` 中的 `\r` 会被当作解释器文件名的一部分，导致系统找不到解释器。

**影响范围**：所有从 Windows 本机 git clone 再上传到小车的源代码仓库（rosbridge_suite 等）。

**修复命令**：
```bash
# 修复指定目录下所有 Python 文件的 CRLF
find <path> -type f -name '*.py' -exec sed -i 's/\r$//' {} \;

# 修复后需重新编译（colcon build 会从源码重新安装文件）
rm -rf build/<pkg_name>
colcon build --packages-select <pkg_name>
```

**预防**：从 Windows 本机 clone 代码上传到小车后，**必须**先在源码目录执行一遍 CRLF 清理再编译。

### 坑 2：小车 GitHub 网络不可达

**现象**：`git clone` 在 robot.sh 中超时（timeout），小车的网络环境可能无法直接访问 GitHub。

**解决**：
```bash
# 1. 本机 clone（网络正常）
git clone https://github.com/xxx/yyy.git -b humble --depth 1

# 2. 打包
tar -czf repo.tar.gz yyy/

# 3. 上传到小车（文件需放在 skill 目录下）
cp repo.tar.gz <skill-root>/
cd <skill-root>
bash scripts/robot.sh --upload repo.tar.gz /home/wheeltec/repo.tar.gz

# 4. SSH 解压到工作空间
bash scripts/robot.sh "cd /home/wheeltec/wheeltec_ros2/src && tar -xzf /home/wheeltec/repo.tar.gz && rm /home/wheeltec/repo.tar.gz"
```

### 坑 3：长时间命令 SSH 超时

**现象**：`colcon build`、`apt install` 等耗时长的命令报 `TimeoutError`（默认 60 秒）。

**根因**：`scripts/ssh_robot.py` 的 `run()` 函数默认 timeout=60s，`ros2()` 同。

**解决**：耗时命令使用 `nohup` 启动后台任务 + 轮询日志：
```bash
# 1. 编写脚本并上传（见坑 2）
# 2. 后台执行
bash scripts/robot.sh "nohup bash /home/wheeltec/build.sh > /tmp/build.log 2>&1 &"

# 3. 等待后检查进度
sleep 10
bash scripts/robot.sh "tail -20 /tmp/build.log"

# 4. 检查进程是否存活
bash scripts/robot.sh "ps aux | grep colcon | grep -v grep"
```

### 坑 4：sudo 需要 TTY

**现象**：`sudo apt install xxx` 报 `sudo: a terminal is required to read the password`。

**根因**：paramiko SSH 连接没有分配伪终端（PTY）。

**解决**：密码通过管道传给 `sudo -S`：
```bash
echo 'dongguan' | sudo -S apt-get install -y <package>
echo 'dongguan' | sudo -S systemctl restart <service>
```

### 坑 5：rosdep 环境问题

**现象**：`rosdep install` 报 `rosdep installation has not been initialized yet`，即使之前已 `rosdep update`。

**根因**：
1. `rosdep update` 和 `rosdep install` 不在同一个 shell 会话中执行
2. `sudo rosdep install` 使用的 HOME 与用户不一致，找不到 `~/.ros/rosdep/sources.cache`

**解决**：同一命令中链式执行，且用 `sudo -S`（保留 HOME）：
```bash
bash scripts/robot.sh "source /opt/ros/humble/setup.bash && rosdep update && cd /home/wheeltec/wheeltec_ros2 && rosdep install -i --from-path src/<pkg> --rosdistro humble -y"
```

### 坑 6：新增包不被 `ros2 launch` 发现

**现象**：`colcon build` 成功后，`ros2 launch` 仍报 `package 'xxx' not found`。

**根因**：
1. 当前 shell 的 ROS 环境是旧的（编译前 source 的），未包含新包
2. ROS 2 daemon 缓存了旧的包列表
3. `install/COLCON_IGNORE` 文件可能导致 `setup.bash` 未正确更新

**解决**：
```bash
# 步骤 1：重新 source 环境
source /home/wheeltec/wheeltec_ros2/install/setup.bash

# 步骤 2：重启 ROS 2 daemon
ros2 daemon stop

# 步骤 3：验证新包可见
ros2 pkg list | grep <package_name>
```

如果仍然不可见，检查并删除 `install/COLCON_IGNORE` 后重新 build。

### 坑 7：ROS GPG 密钥过期

**现象**：`apt install ros-humble-*` 报 `EXPKEYSIG F42ED6FBAB17C654`、HTTP 404。

**根因**：ROS 2 Humble 已 EOL，GPG 密钥过期且部分 .deb 包可能被清理。

**解决**：从 GitHub 源码编译替代 apt 安装（参考坑 2 处理网络问题）。

### 坑 8：Python 依赖缺失导致运行时崩溃

**现象**：rosbridge 启动时 `ModuleNotFoundError: No module named 'bson'` / `'cbor2'` 等。

**解决**：
```bash
# rosbridge 常见缺失依赖
echo 'dongguan' | sudo -S apt-get install -y python3-tornado python3-bson
pip3 install cbor2

# rosbridge 编译依赖
echo 'dongguan' | sudo -S apt-get install -y ros-humble-ament-cmake-mypy
```

### 坑 9：`--symlink-install` 导致重复编译冲突

**现象**：第二次 `colcon build --symlink-install` 报 `failed to create symbolic link: File exists`。

**解决**：不用 `--symlink-install`，或在编译前删除对应 build/install 目录。

### 坑 10：`--upload` 路径问题

**现象**：`--upload d:/path/to/file` 报 `FileNotFoundError`。

**根因**：paramiko SFTP 在 Windows 上解析 Windows 格式绝对路径（`d:/...`）可能失败。

**解决**：将文件复制到 skill 目录后使用相对路径：
```bash
cp d:/path/to/file <skill-root>/file
cd <skill-root>
bash scripts/robot.sh --upload file /home/wheeltec/file
```

---

## 注意事项

- 连接基于 **Tailscale 组网**，确保 Tailscale 已连接且小车在线
- 密码认证存在安全风险，建议配置 SSH 密钥认证：`ssh-copy-id wheeltec@<robot-ip>`
- ROS 2 Humble 命令格式为 `ros2 <verb> <noun>`（如 `ros2 topic list`），与 ROS 1 的 `rostopic list` 不同
- 文件上传时**本地路径**需用 skill 目录下的相对路径
- 小车为 Jetson aarch64 架构，注意 Python/ROS 包的架构兼容性

## 技术选型说明

本项目使用 Python `paramiko` 而非 `sshpass` 实现非交互式 SSH 连接：
- Windows 版 sshpass 在 Git Bash/MSYS2 下存在 PTY 伪终端兼容问题
- paramiko 是纯 Python 实现的 SSH 客户端，跨平台一致性好
- paramiko 同时支持命令执行和 SFTP 文件传输

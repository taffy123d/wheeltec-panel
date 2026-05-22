---
name: ros2-ssh
description: 通过 SSH 远程连接控制 ROS 2 机器人/主机（Ubuntu + ROS 2），支持命令执行、ROS2 操作和文件传输。基于 paramiko SSH + 配置文件。
triggers:
  - 远程ros2
  - ssh ros2
  - ros2 topic
  - ros2 远程
  - ros2 ssh
---

# ROS2 机器人远程控制

通过 SSH 远程连接和控制基于 ROS 2 的机器人或开发主机。

> **禁止在 plan mode 下进行 SSH 连接**，否则连接失败。
> **⚠️ Windows 上传文件到 Linux 后必须先清 CRLF**：`find <dir> -type f -name '*.py' -exec sed -i 's/\r$//' {} \;`

## 快速开始

```bash
cd <skill-root>

# 1. 配置连接信息
cp robot.conf.example robot.conf   # 编辑填入机器人 IP、用户名、密码

# 2. 安装依赖（Python 3.8+ → paramiko）
bash scripts/robot.sh --setup

# 3. 使用
bash scripts/robot.sh --ros2 "topic list"
bash scripts/robot.sh --status
bash scripts/robot.sh "df -h"
```

## 配置

`robot.conf`（环境变量优先级更高）：

```ini
ROBOT_HOST="ssh连接ip地址"
ROBOT_USER="user_name(ssh连接的用户名)"
ROBOT_PASSWORD=your-password
ROBOT_ROS_WS_SETUP=/home/ubuntu/ros2_ws/install/setup.bash  # 可选
```

环境变量: `ROBOT_HOST`, `ROBOT_USER`, `ROBOT_PASSWORD`, `ROBOT_ROS_WS_SETUP`, `ROBOT_ROS_SETUP`

## 用法

```bash
bash scripts/robot.sh "<命令>"                          # 执行远程命令
bash scripts/robot.sh --ros2 "<子命令>"                  # ROS2 命令（自动 source 环境）
bash scripts/robot.sh --upload <本地> <远程>              # 上传文件
bash scripts/robot.sh --download <远程> <本地>            # 下载文件
bash scripts/robot.sh --status                           # ROS2 状态检查
bash scripts/robot.sh --setup                            # 安装依赖
```

Python CLI 调用和模块导入见 [Python API](reference/python-api.md)。

## 重要提示

- 建议通过 VPN/内网穿透组网，配置 SSH 密钥替代密码：`ssh-copy-id <user>@<ip>`
- Windows 上传源码后必须清 CRLF（见顶部警告）
- sudo 需用管道传密码：`echo 'pwd' | sudo -S <cmd>`
- 长耗时操作用 nohup 后台执行避免 SSH 超时（默认 60s）

## 参考文档

| 文档 | 内容 |
|------|------|
| [典型操作示例](reference/common-operations.md) | 话题调试、文件传输、后台任务、服务管理、功能包发现等 |
| [Python API](reference/python-api.md) | 模块导入、上下文管理器、自定义参数、API 参考 |
| [踩坑记录](reference/troubleshooting.md) | CRLF、SSH 超时、sudo TTY、rosdep、GPG 过期等 10 个常见问题 |

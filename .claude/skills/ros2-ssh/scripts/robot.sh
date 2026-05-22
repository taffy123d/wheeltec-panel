#!/usr/bin/env bash
# ============================================================
#  ROS2 机器人远程控制 - 统一入口
# ============================================================
#
# 用法:
#   ./robot.sh <command>              执行shell命令
#   ./robot.sh --ros2 <command>       执行ROS2命令
#   ./robot.sh --upload <本地> <远程>   上传文件
#   ./robot.sh --download <远程> <本地>  下载文件
#   ./robot.sh --status               检查ROS2状态
#   ./robot.sh --setup                检查/安装依赖
#
# 示例:
#   ./robot.sh "hostname && df -h"
#   ./robot.sh --ros2 "topic list"
#   ./robot.sh --ros2 "node list"
#   ./robot.sh --upload ./test.py /home/user/test.py
#   ./robot.sh --download /home/user/log.txt ./log.txt
# ============================================================

set -euo pipefail

# 获取 Windows 格式的项目路径（避免 MSYS2 路径转换问题）
SCRIPT_DIR_WIN="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -W)"
SCRIPT_FILE="$SCRIPT_DIR_WIN/ssh_robot.py"

# 智能检测可用的Python解释器
_find_python() {
    for candidate in "${PYTHON:-}" python3 python python3.12 python3.11 python3.10; do
        [ -z "$candidate" ] && continue
        if command -v "$candidate" &>/dev/null && "$candidate" -c "print('ok')" 2>/dev/null | grep -q ok; then
            echo "$candidate"
            return 0
        fi
    done
    echo ""
    return 1
}

PYTHON="$(_find_python)"
if [ -z "$PYTHON" ]; then
    echo "[robot] 错误: 未找到可用的Python (3.8+), 请安装并确保在PATH中" >&2
    echo "[robot] 下载: https://www.python.org/downloads/" >&2
    exit 1
fi

# 调用Python脚本
# MSYS_NO_PATHCONV=1 彻底禁用MSYS2路径自动转换
# 本地文件请使用相对路径或Windows绝对路径，远程路径为Linux路径不受影响
_call_py() {
    MSYS_NO_PATHCONV=1 "$PYTHON" "$SCRIPT_FILE" "$@"
}

# 依赖安装
do_setup() {
    echo "[robot] 检查依赖..." >&2
    echo "[robot] 使用Python: $PYTHON" >&2
    if "$PYTHON" -c "import paramiko" 2>/dev/null; then
        echo "[robot] paramiko 已就绪" >&2
        return 0
    fi
    echo "[robot] paramiko 未安装，正在安装..." >&2
    if "$PYTHON" -m pip install paramiko; then
        echo "[robot] 安装成功" >&2
    else
        echo "[robot] 安装失败，请手动执行: $PYTHON -m pip install paramiko" >&2
        exit 1
    fi
}

# ROS2状态检查
do_status() {
    echo "=== ROS2 状态检查 ==="
    echo ""
    echo "--- 话题列表 ---"
    _call_py --ros2 "topic list"
    echo ""
    echo "--- 活动节点 ---"
    _call_py --ros2 "node list"
    echo ""
    echo "--- 话题详情 ---"
    _call_py --ros2 "topic list -t"
}

case "${1:-}" in
    --setup)
        do_setup
        ;;
    --status)
        do_setup && do_status
        ;;
    *)
        do_setup
        _call_py "$@"
        ;;
esac

# 典型操作示例

## 功能包发现

```bash
bash scripts/robot.sh --ros2 "pkg list"                    # 列出所有包
bash scripts/robot.sh --ros2 "pkg list | grep slam"        # 按关键词筛选
bash scripts/robot.sh --ros2 "pkg prefix <package_name>"   # 查看包路径
```

## 系统状态

```bash
bash scripts/robot.sh --status                             # 话题+节点总览
bash scripts/robot.sh --ros2 "node list"                   # 节点列表
bash scripts/robot.sh --ros2 "node info /<node_name>"      # 节点详情
```

## 话题调试

```bash
bash scripts/robot.sh --ros2 "topic list -t"               # 话题+类型
bash scripts/robot.sh --ros2 "topic echo /odom --once"     # 单次回显
bash scripts/robot.sh --ros2 "topic hz /odom"              # 发布频率
bash scripts/robot.sh --ros2 "topic pub /cmd_vel geometry_msgs/msg/Twist '{linear: {x: 0.2}, angular: {z: 0.0}}' -1"
```

## 启动/停止节点

```bash
bash scripts/robot.sh --ros2 "launch <pkg> <launch_file>.launch.py"
bash scripts/robot.sh --ros2 "run <pkg> <node>"
```

## systemd 服务

```bash
bash scripts/robot.sh "sudo systemctl status <service> --no-pager"
bash scripts/robot.sh "sudo systemctl restart <service>"
bash scripts/robot.sh "sudo journalctl -u <service> -n 30 --no-pager"
```

## 文件传输

```bash
bash scripts/robot.sh --upload ./test.py /home/user/test.py
bash scripts/robot.sh --download /home/user/result.log ./result.log
```

## colcon 编译

```bash
bash scripts/robot.sh "cd /home/user/ros2_ws && colcon build --packages-select <pkg>"
```

## 后台长时间任务

```bash
bash scripts/robot.sh --upload ./build.sh /home/user/build.sh
bash scripts/robot.sh "chmod +x /home/user/build.sh && nohup bash /home/user/build.sh > /tmp/build.log 2>&1 &"
bash scripts/robot.sh "tail -30 /tmp/build.log"
```

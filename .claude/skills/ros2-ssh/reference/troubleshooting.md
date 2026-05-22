# 踩坑记录与故障排除

## 坑 1：Windows 换行符 `\r\n` 导致 Linux 脚本无法执行

**现象**：上传的 `.py` 或 shell 脚本报 `Exec format error`、`/usr/bin/env: 'python3\r': No such file or directory`。

**根因**：Windows 的 Git/编辑器默认使用 CRLF。shebang 行 `#!/usr/bin/env python3\r` 中的 `\r` 被当作解释器文件名的一部分。

**修复**：
```bash
find <path> -type f -name '*.py' -exec sed -i 's/\r$//' {} \;
# 修复后需重新编译
rm -rf build/<pkg_name>
colcon build --packages-select <pkg_name>
```

## 坑 2：远程主机 GitHub 网络不可达

**现象**：`git clone` 在远程主机上超时。

**解决**：本机 clone → 打包 → 上传 → 解压：
```bash
git clone https://github.com/xxx/yyy.git -b humble --depth 1
tar -czf repo.tar.gz yyy/
cp repo.tar.gz <skill-root>/
bash scripts/robot.sh --upload repo.tar.gz /home/user/repo.tar.gz
bash scripts/robot.sh "cd /home/user/ros2_ws/src && tar -xzf /home/user/repo.tar.gz && rm /home/user/repo.tar.gz"
```

## 坑 3：长时间命令 SSH 超时

**现象**：`colcon build`、`apt install` 等报 `TimeoutError`（默认 60 秒）。

**解决**：后台执行 + 轮询：
```bash
bash scripts/robot.sh --upload ./build.sh /home/user/build.sh
bash scripts/robot.sh "chmod +x /home/user/build.sh && nohup bash /home/user/build.sh > /tmp/build.log 2>&1 &"
sleep 10
bash scripts/robot.sh "tail -20 /tmp/build.log"
bash scripts/robot.sh "ps aux | grep colcon | grep -v grep"
```

## 坑 4：sudo 需要 TTY

**现象**：`sudo apt install xxx` 报 `sudo: a terminal is required to read the password`。

**根因**：paramiko 未分配 PTY。

**解决**：密码通过管道传给 `sudo -S`：
```bash
echo 'your-pwd' | sudo -S apt-get install -y <package>
echo 'your-pwd' | sudo -S systemctl restart <service>
```

## 坑 5：rosdep 环境问题

**现象**：`rosdep install` 报 `rosdep installation has not been initialized yet`。

**根因**：`rosdep update` 和 `rosdep install` 不在同一 shell 会话；`sudo rosdep` 的 HOME 与用户不一致。

**解决**：链式执行，用 `sudo -S` 保留 HOME：
```bash
bash scripts/robot.sh "source /opt/ros/humble/setup.bash && rosdep update && cd /home/user/ros2_ws && rosdep install -i --from-path src/<pkg> --rosdistro humble -y"
```

## 坑 6：新增包不被 `ros2 launch` 发现

**现象**：`colcon build` 成功后，`ros2 launch` 仍报 `package not found`。

**解决**：
```bash
source /home/user/ros2_ws/install/setup.bash
ros2 daemon stop
ros2 pkg list | grep <package_name>
```
如仍不可见，检查并删除 `install/COLCON_IGNORE` 后重新 build。

## 坑 7：ROS GPG 密钥过期

**现象**：`apt install ros-<distro>-*` 报 `EXPKEYSIG`、HTTP 404。

**根因**：旧发行版（如 Humble）已 EOL。

**解决**：从 GitHub 源码编译替代 apt 安装（参考坑 2 处理网络）。

## 坑 8：Python 依赖缺失导致运行时崩溃

**现象**：rosbridge 等包启动时报 `ModuleNotFoundError`。

**解决**：
```bash
echo 'your-pwd' | sudo -S apt-get install -y python3-tornado python3-bson
pip3 install cbor2
```

## 坑 9：`--symlink-install` 导致重复编译冲突

**现象**：第二次 `colcon build --symlink-install` 报 `failed to create symbolic link: File exists`。

**解决**：不用 `--symlink-install`，或在编译前删除对应 build/install 目录。

## 坑 10：`--upload` 路径问题

**现象**：`--upload d:/path/to/file` 报 `FileNotFoundError`。

**根因**：paramiko SFTP 在 Windows 上解析 Windows 绝对路径可能失败。

**解决**：复制到 skill 目录后使用相对路径：
```bash
cp d:/path/to/file <skill-root>/file
bash scripts/robot.sh --upload file /home/user/file
```

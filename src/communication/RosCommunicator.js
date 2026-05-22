import { bus } from '../events/EventBus';
const HEARTBEAT_INTERVAL = 5000;
const MAX_RECONNECT = 5;
const RECONNECT_DELAY = 3000;
export class RosCommunicator {
    get status() {
        return this._status;
    }
    constructor(url = 'ws://100.122.158.62:9090') {
        this.ws = null;
        this.heartbeatTimer = null;
        this.reconnectCount = 0;
        this.reconnectTimer = null;
        this.subscribed = new Set();
        this.msgSeq = 0;
        this._status = 'disconnected';
        this.url = url;
    }
    setUrl(url) {
        this.url = url;
    }
    connect() {
        if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
            return;
        }
        this.setStatus('connecting');
        try {
            this.ws = new WebSocket(this.url);
            this.ws.onopen = () => this.onOpen();
            this.ws.onmessage = (e) => this.onMessage(e.data);
            this.ws.onclose = (e) => this.onClose(e);
            this.ws.onerror = () => this.onError();
        }
        catch {
            this.setStatus('error');
            this.scheduleReconnect();
        }
    }
    disconnect() {
        this.clearTimers();
        this.reconnectCount = MAX_RECONNECT;
        this.subscribed.clear();
        if (this.ws) {
            this.ws.onclose = null;
            this.ws.close();
            this.ws = null;
        }
        this.setStatus('disconnected');
    }
    /** 发布话题消息 */
    publish(topic, type, msg) {
        this.send({
            op: 'publish',
            topic,
            msg,
        });
        void type;
    }
    /** 订阅话题 */
    subscribe(topic, type) {
        if (this.subscribed.has(topic))
            return;
        this.subscribed.add(topic);
        this.send({
            op: 'subscribe',
            id: `sub_${topic.replace(/\//g, '_')}`,
            topic,
            type,
        });
    }
    /** 取消订阅 */
    unsubscribe(topic) {
        if (!this.subscribed.has(topic))
            return;
        this.subscribed.delete(topic);
        this.send({
            op: 'unsubscribe',
            id: `sub_${topic.replace(/\//g, '_')}`,
            topic,
        });
    }
    /** 调用服务 */
    callService(service, args) {
        this.send({
            op: 'call_service',
            id: `svc_${this.msgSeq++}`,
            service,
            args,
        });
    }
    /** 发送移动控制指令 */
    sendCmdVel(linearX, angularZ) {
        const msg = {
            linear: { x: linearX, y: 0, z: 0 },
            angular: { x: 0, y: 0, z: angularZ },
        };
        this.publish('/cmd_vel', 'geometry_msgs/msg/Twist', msg);
    }
    /** 急停 */
    emergencyStop() {
        this.sendCmdVel(0, 0);
    }
    send(data) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        }
        else {
            console.warn('[RosCommunicator] send skipped, ws state:', this.ws?.readyState);
        }
    }
    onOpen() {
        this.setStatus('connected');
        this.reconnectCount = 0;
        this.startHeartbeat();
        this.advertiseTopics();
        // 订阅机器人状态话题
        this.subscribe('/odom', 'nav_msgs/msg/Odometry');
        this.subscribe('/PowerVoltage', 'std_msgs/msg/Float32');
        this.subscribe('/robot_charging_flag', 'std_msgs/msg/Bool');
        this.subscribe('/robot_charging_current', 'std_msgs/msg/Float32');
        this.subscribe('/imu/data_raw', 'sensor_msgs/msg/Imu');
        bus.emit('ros:connected', undefined);
    }
    advertiseTopics() {
        // 声明发布 /cmd_vel 话题
        this.send({
            op: 'advertise',
            topic: '/cmd_vel',
            type: 'geometry_msgs/msg/Twist',
        });
    }
    onMessage(raw) {
        try {
            const data = JSON.parse(raw);
            switch (data.op) {
                case 'publish':
                    this.handlePublish(data);
                    break;
                case 'service_response':
                    bus.emit('ros:service_response', data);
                    break;
                case 'status':
                    if (data.level === 'error') {
                        console.error('[RosCommunicator] rosbridge 错误:', data.msg);
                    }
                    break;
            }
        }
        catch {
            // 忽略非 JSON 消息
        }
    }
    handlePublish(data) {
        const topic = data.topic;
        const msg = data.msg;
        switch (topic) {
            case '/odom':
                bus.emit('ros:odom', msg);
                break;
            case '/PowerVoltage':
                bus.emit('ros:voltage', msg.data);
                break;
            case '/robot_charging_flag':
                bus.emit('ros:charging', msg.data);
                break;
            case '/robot_charging_current':
                bus.emit('ros:charging_current', msg.data);
                break;
            case '/imu/data_raw':
                bus.emit('ros:imu', msg);
                break;
            default:
                bus.emit(`ros:topic:${topic}`, msg);
        }
    }
    onClose(event) {
        this.clearTimers();
        this.setStatus('disconnected');
        bus.emit('ros:disconnected', undefined);
        // 检测是否为异常关闭
        if (!event || event.code !== 1000) {
            this.scheduleReconnect();
        }
    }
    onError() {
        this.setStatus('error');
        bus.emit('ros:error', undefined);
    }
    scheduleReconnect() {
        if (this.reconnectCount >= MAX_RECONNECT) {
            bus.emit('ros:reconnect_failed', undefined);
            return;
        }
        this.reconnectCount++;
        this.setStatus('connecting');
        bus.emit('ros:reconnecting', this.reconnectCount);
        this.reconnectTimer = setTimeout(() => {
            this.connect();
        }, RECONNECT_DELAY);
    }
    startHeartbeat() {
        this.clearHeartbeat();
        this.heartbeatTimer = setInterval(() => {
            this.send({ op: 'publish', topic: '/heartbeat', msg: {} });
        }, HEARTBEAT_INTERVAL);
    }
    clearHeartbeat() {
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = null;
        }
    }
    clearTimers() {
        this.clearHeartbeat();
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }
    }
    setStatus(s) {
        this._status = s;
        bus.emit('ros:status', s);
    }
}
/** 全局单例 */
export const communicator = new RosCommunicator();
//# sourceMappingURL=RosCommunicator.js.map
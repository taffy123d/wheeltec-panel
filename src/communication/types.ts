/** geometry_msgs/msg/Twist — 移动控制指令 */
export interface TwistMsg {
  linear: { x: number; y: number; z: number }
  angular: { x: number; y: number; z: number }
}

/** geometry_msgs/msg/Vector3 */
export interface Vector3 {
  x: number
  y: number
  z: number
}

/** geometry_msgs/msg/Quaternion */
export interface Quaternion {
  x: number
  y: number
  z: number
  w: number
}

/** geometry_msgs/msg/Pose */
export interface PoseMsg {
  position: Vector3
  orientation: Quaternion
}

/** geometry_msgs/msg/Twist (with covariance) */
export interface TwistCovariance {
  linear: Vector3
  angular: Vector3
}

/** nav_msgs/msg/Odometry — 里程计数据 */
export interface OdometryMsg {
  header: { frame_id: string; stamp: { sec: number; nanosec: number } }
  child_frame_id: string
  pose: { pose: PoseMsg; covariance: number[] }
  twist: { twist: TwistCovariance; covariance: number[] }
}

/** sensor_msgs/msg/Imu — IMU 数据 */
export interface ImuMsg {
  header: { frame_id: string; stamp: { sec: number; nanosec: number } }
  orientation: Quaternion
  orientation_covariance: number[]
  angular_velocity: Vector3
  angular_velocity_covariance: number[]
  linear_acceleration: Vector3
  linear_acceleration_covariance: number[]
}

/** 小车实时状态（从各话题数据合并） */
export interface RobotState {
  /** 线速度 (m/s)，来自 /odom */
  linearVelocity: Vec2
  /** 角速度 (rad/s)，来自 /odom */
  angularVelocity: number
  /** 位置 (m)，来自 /odom */
  position: Vec2
  /** 姿态角 (rad)，来自 /odom */
  heading: number
  /** 电池电压 (V)，来自 /PowerVoltage */
  voltage: number
  /** 充电状态，来自 /robot_charging_flag */
  charging: boolean
  /** 充电电流 (A)，来自 /robot_charging_current */
  chargingCurrent: number
  /** IMU 角速度 (rad/s) */
  imuAngular: Vec3
  /** IMU 线加速度 (m/s²) */
  imuAccel: Vec3
}

export interface Vec2 {
  x: number
  y: number
}

export interface Vec3 {
  x: number
  y: number
  z: number
}

/** 默认初始状态 */
export function defaultRobotState(): RobotState {
  return {
    linearVelocity: { x: 0, y: 0 },
    angularVelocity: 0,
    position: { x: 0, y: 0 },
    heading: 0,
    voltage: 0,
    charging: false,
    chargingCurrent: 0,
    imuAngular: { x: 0, y: 0, z: 0 },
    imuAccel: { x: 0, y: 0, z: 0 },
  }
}

/** 连接状态 */
export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error'

/** rosbridge 协议消息 */
export interface RosBridgeMessage {
  op: string
  id?: string
  topic?: string
  type?: string
  msg?: unknown
  level?: string
  service?: string
  args?: unknown
  result?: boolean
  values?: unknown
}

import { ref } from 'vue'
import { bus } from '../events/EventBus'
import { defaultRobotState } from '../communication/types'
import type { RobotState, OdometryMsg, ImuMsg } from '../communication/types'

// 模块级单例状态
const state = ref<RobotState>(defaultRobotState())
const lastUpdate = ref<number>(0)

// 监听 odom 数据
bus.on<OdometryMsg>('ros:odom', (msg) => {
  state.value.linearVelocity = {
    x: msg.twist.twist.linear.x,
    y: msg.twist.twist.linear.y,
  }
  state.value.angularVelocity = msg.twist.twist.angular.z
  state.value.position = {
    x: msg.pose.pose.position.x,
    y: msg.pose.pose.position.y,
  }
  // 从四元数提取偏航角
  const q = msg.pose.pose.orientation
  const siny = 2 * (q.w * q.z + q.x * q.y)
  const cosy = 1 - 2 * (q.y * q.y + q.z * q.z)
  state.value.heading = Math.atan2(siny, cosy)
  lastUpdate.value = Date.now()
})

// 监听电池电压
bus.on<number>('ros:voltage', (voltage) => {
  state.value.voltage = voltage
  lastUpdate.value = Date.now()
})

// 监听充电状态
bus.on<boolean>('ros:charging', (charging) => {
  state.value.charging = charging
  lastUpdate.value = Date.now()
})

// 监听充电电流
bus.on<number>('ros:charging_current', (current) => {
  state.value.chargingCurrent = current
  lastUpdate.value = Date.now()
})

// 监听 IMU 数据
bus.on<ImuMsg>('ros:imu', (msg) => {
  state.value.imuAngular = msg.angular_velocity
  state.value.imuAccel = msg.linear_acceleration
  lastUpdate.value = Date.now()
})

export function useRobotState() {
  return {
    state,
    lastUpdate,
  }
}

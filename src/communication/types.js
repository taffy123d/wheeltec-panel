/** 默认初始状态 */
export function defaultRobotState() {
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
    };
}
//# sourceMappingURL=types.js.map
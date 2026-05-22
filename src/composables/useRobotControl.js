import { ref } from 'vue';
import { communicator } from '../communication/RosCommunicator';
import { useLocalStorage } from './useLocalStorage';
// 模块级单例配置
const maxLinearSpeed = useLocalStorage('wheeltec:maxLinearSpeed', 0.5);
const maxAngularSpeed = useLocalStorage('wheeltec:maxAngularSpeed', 1.0);
const speedStep = useLocalStorage('wheeltec:speedStep', 0.1);
const controlMode = useLocalStorage('wheeltec:controlMode', 'joystick');
// 当前发送的指令值（用于显示）
const currentLinear = ref(0);
const currentAngular = ref(0);
// 定时器：D-pad 模式下持续发送指令
let dpadTimer = null;
export function useRobotControl() {
    function sendCmdVel(linearX, angularZ) {
        const clampedLinear = clamp(linearX, -maxLinearSpeed.value, maxLinearSpeed.value);
        const clampedAngular = clamp(angularZ, -maxAngularSpeed.value, maxAngularSpeed.value);
        currentLinear.value = clampedLinear;
        currentAngular.value = clampedAngular;
        communicator.sendCmdVel(clampedLinear, clampedAngular);
    }
    function stop() {
        currentLinear.value = 0;
        currentAngular.value = 0;
        communicator.emergencyStop();
        stopDpad();
    }
    // D-pad 开始移动（持续发送，直到 stop）
    function startDpadMove(linearX, angularZ) {
        stopDpad();
        const clampedLinear = clamp(linearX, -maxLinearSpeed.value, maxLinearSpeed.value);
        const clampedAngular = clamp(angularZ, -maxAngularSpeed.value, maxAngularSpeed.value);
        currentLinear.value = clampedLinear;
        currentAngular.value = clampedAngular;
        communicator.sendCmdVel(clampedLinear, clampedAngular);
        dpadTimer = setInterval(() => {
            communicator.sendCmdVel(clampedLinear, clampedAngular);
        }, 100);
    }
    function stopDpad() {
        if (dpadTimer) {
            clearInterval(dpadTimer);
            dpadTimer = null;
        }
        communicator.emergencyStop();
        currentLinear.value = 0;
        currentAngular.value = 0;
    }
    /** 启动数据记录 */
    function startRecord() {
        communicator.callService('/record/start');
    }
    /** 停止数据记录 */
    function stopRecord() {
        communicator.callService('/record/stop');
    }
    return {
        maxLinearSpeed,
        maxAngularSpeed,
        speedStep,
        controlMode,
        currentLinear,
        currentAngular,
        sendCmdVel,
        stop,
        startDpadMove,
        stopDpad,
        startRecord,
        stopRecord,
    };
}
function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
}
//# sourceMappingURL=useRobotControl.js.map
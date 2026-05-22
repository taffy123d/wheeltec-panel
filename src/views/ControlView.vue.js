import { useRobotControl } from '../composables/useRobotControl';
import Joystick from '../components/Joystick.vue';
import DirectionPad from '../components/DirectionPad.vue';
import EmergencyStop from '../components/EmergencyStop.vue';
import VideoDisplay from '../components/VideoDisplay.vue';
import StatusPanel from '../components/StatusPanel.vue';
import RecordPanel from '../components/RecordPanel.vue';
import ConfigPanel from '../components/ConfigPanel.vue';
import ConnectionBar from '../components/ConnectionBar.vue';
const { controlMode } = useRobotControl();
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['control-view']} */ ;
/** @type {__VLS_StyleScopedClasses['main-area']} */ ;
/** @type {__VLS_StyleScopedClasses['right-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['control-view']} */ ;
/** @type {__VLS_StyleScopedClasses['main-area']} */ ;
/** @type {__VLS_StyleScopedClasses['left-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['control-area']} */ ;
/** @type {__VLS_StyleScopedClasses['center-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['right-panel']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "control-view" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "top-bar" },
});
/** @type {[typeof ConnectionBar, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(ConnectionBar, new ConnectionBar({}));
const __VLS_1 = __VLS_0({}, ...__VLS_functionalComponentArgsRest(__VLS_0));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "main-area" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "left-panel" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "control-area" },
});
if (__VLS_ctx.controlMode === 'joystick') {
    /** @type {[typeof Joystick, ]} */ ;
    // @ts-ignore
    const __VLS_3 = __VLS_asFunctionalComponent(Joystick, new Joystick({}));
    const __VLS_4 = __VLS_3({}, ...__VLS_functionalComponentArgsRest(__VLS_3));
}
else {
    /** @type {[typeof DirectionPad, ]} */ ;
    // @ts-ignore
    const __VLS_6 = __VLS_asFunctionalComponent(DirectionPad, new DirectionPad({}));
    const __VLS_7 = __VLS_6({}, ...__VLS_functionalComponentArgsRest(__VLS_6));
}
/** @type {[typeof EmergencyStop, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(EmergencyStop, new EmergencyStop({}));
const __VLS_10 = __VLS_9({}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "center-panel" },
});
/** @type {[typeof VideoDisplay, ]} */ ;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent(VideoDisplay, new VideoDisplay({}));
const __VLS_13 = __VLS_12({}, ...__VLS_functionalComponentArgsRest(__VLS_12));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "right-panel" },
});
/** @type {[typeof StatusPanel, ]} */ ;
// @ts-ignore
const __VLS_15 = __VLS_asFunctionalComponent(StatusPanel, new StatusPanel({}));
const __VLS_16 = __VLS_15({}, ...__VLS_functionalComponentArgsRest(__VLS_15));
/** @type {[typeof RecordPanel, ]} */ ;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent(RecordPanel, new RecordPanel({}));
const __VLS_19 = __VLS_18({}, ...__VLS_functionalComponentArgsRest(__VLS_18));
/** @type {[typeof ConfigPanel, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(ConfigPanel, new ConfigPanel({}));
const __VLS_22 = __VLS_21({}, ...__VLS_functionalComponentArgsRest(__VLS_21));
/** @type {__VLS_StyleScopedClasses['control-view']} */ ;
/** @type {__VLS_StyleScopedClasses['top-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['main-area']} */ ;
/** @type {__VLS_StyleScopedClasses['left-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['control-area']} */ ;
/** @type {__VLS_StyleScopedClasses['center-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['right-panel']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Joystick: Joystick,
            DirectionPad: DirectionPad,
            EmergencyStop: EmergencyStop,
            VideoDisplay: VideoDisplay,
            StatusPanel: StatusPanel,
            RecordPanel: RecordPanel,
            ConfigPanel: ConfigPanel,
            ConnectionBar: ConnectionBar,
            controlMode: controlMode,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=ControlView.vue.js.map
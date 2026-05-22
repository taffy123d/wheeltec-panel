import { ref, onMounted, onUnmounted } from 'vue';
import { useRobotControl } from '../composables/useRobotControl';
const { sendCmdVel, stop } = useRobotControl();
const containerRef = ref();
const knobRef = ref();
const knobX = ref(0);
const knobY = ref(0);
const isDragging = ref(false);
// 响应式尺寸：大屏用 160x160，小屏用 130x130
const containerSize = 150;
const knobSize = 52;
const maxTravel = (containerSize - knobSize) / 2;
function getCenter() {
    if (!containerRef.value)
        return { cx: 0, cy: 0 };
    const rect = containerRef.value.getBoundingClientRect();
    return {
        cx: rect.left + rect.width / 2,
        cy: rect.top + rect.height / 2,
    };
}
function handleStart(e) {
    e.preventDefault();
    isDragging.value = true;
    e.target?.setPointerCapture?.(e.pointerId);
    handleMove(e);
}
function handleMove(e) {
    if (!isDragging.value)
        return;
    const { cx, cy } = getCenter();
    let dx = e.clientX - cx;
    let dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > maxTravel) {
        dx = (dx / dist) * maxTravel;
        dy = (dy / dist) * maxTravel;
    }
    knobX.value = dx;
    knobY.value = dy;
    // 转换为速度指令：x 方向 = 线速度，y 方向(反转) = 角速度
    const linearX = (dy / maxTravel) * -0.5; // 上推前进（正）
    const angularZ = (dx / maxTravel) * -1.0; // 左推左转（正）
    sendCmdVel(linearX, angularZ);
}
function handleEnd() {
    if (!isDragging.value)
        return;
    isDragging.value = false;
    knobX.value = 0;
    knobY.value = 0;
    stop();
}
onMounted(() => {
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleEnd);
    window.addEventListener('pointercancel', handleEnd);
});
onUnmounted(() => {
    window.removeEventListener('pointermove', handleMove);
    window.removeEventListener('pointerup', handleEnd);
    window.removeEventListener('pointercancel', handleEnd);
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['joystick-knob']} */ ;
/** @type {__VLS_StyleScopedClasses['joystick-container']} */ ;
/** @type {__VLS_StyleScopedClasses['joystick-ring']} */ ;
/** @type {__VLS_StyleScopedClasses['joystick-knob']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "joystick-wrapper" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onPointerdown: (__VLS_ctx.handleStart) },
    ref: "containerRef",
    ...{ class: "joystick-container" },
});
/** @type {typeof __VLS_ctx.containerRef} */ ;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div)({
    ...{ class: "joystick-ring" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div)({
    ...{ class: "joystick-arrow arrow-up" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div)({
    ...{ class: "joystick-arrow arrow-down" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div)({
    ...{ class: "joystick-arrow arrow-left" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div)({
    ...{ class: "joystick-arrow arrow-right" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div)({
    ref: "knobRef",
    ...{ class: "joystick-knob" },
    ...{ style: ({
            transform: `translate(${__VLS_ctx.knobX}px, ${__VLS_ctx.knobY}px)`,
            transition: __VLS_ctx.isDragging ? 'none' : 'transform 0.2s ease-out',
        }) },
});
/** @type {typeof __VLS_ctx.knobRef} */ ;
/** @type {__VLS_StyleScopedClasses['joystick-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['joystick-container']} */ ;
/** @type {__VLS_StyleScopedClasses['joystick-ring']} */ ;
/** @type {__VLS_StyleScopedClasses['joystick-arrow']} */ ;
/** @type {__VLS_StyleScopedClasses['arrow-up']} */ ;
/** @type {__VLS_StyleScopedClasses['joystick-arrow']} */ ;
/** @type {__VLS_StyleScopedClasses['arrow-down']} */ ;
/** @type {__VLS_StyleScopedClasses['joystick-arrow']} */ ;
/** @type {__VLS_StyleScopedClasses['arrow-left']} */ ;
/** @type {__VLS_StyleScopedClasses['joystick-arrow']} */ ;
/** @type {__VLS_StyleScopedClasses['arrow-right']} */ ;
/** @type {__VLS_StyleScopedClasses['joystick-knob']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            containerRef: containerRef,
            knobRef: knobRef,
            knobX: knobX,
            knobY: knobY,
            isDragging: isDragging,
            handleStart: handleStart,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=Joystick.vue.js.map
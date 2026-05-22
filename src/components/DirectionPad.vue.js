import { useRobotControl } from '../composables/useRobotControl';
import SvgIcon from './common/SvgIcon.vue';
const { startDpadMove, stopDpad, maxLinearSpeed, maxAngularSpeed } = useRobotControl();
function onForwardStart() {
    startDpadMove(maxLinearSpeed.value, 0);
}
function onBackwardStart() {
    startDpadMove(-maxLinearSpeed.value, 0);
}
function onLeftStart() {
    startDpadMove(0, maxAngularSpeed.value);
}
function onRightStart() {
    startDpadMove(0, -maxAngularSpeed.value);
}
function onForwardLeftStart() {
    startDpadMove(maxLinearSpeed.value * 0.7, maxAngularSpeed.value * 0.7);
}
function onForwardRightStart() {
    startDpadMove(maxLinearSpeed.value * 0.7, -maxAngularSpeed.value * 0.7);
}
function onBackwardLeftStart() {
    startDpadMove(-maxLinearSpeed.value * 0.7, -maxAngularSpeed.value * 0.7);
}
function onBackwardRightStart() {
    startDpadMove(-maxLinearSpeed.value * 0.7, maxAngularSpeed.value * 0.7);
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['dpad-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['dpad-btn']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "dpad" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "dpad-row" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onPointerdown: (__VLS_ctx.onForwardLeftStart) },
    ...{ onPointerup: (__VLS_ctx.stopDpad) },
    ...{ onPointerleave: (__VLS_ctx.stopDpad) },
    ...{ class: "dpad-btn diagonal" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onPointerdown: (__VLS_ctx.onForwardStart) },
    ...{ onPointerup: (__VLS_ctx.stopDpad) },
    ...{ onPointerleave: (__VLS_ctx.stopDpad) },
    ...{ class: "dpad-btn" },
});
/** @type {[typeof SvgIcon, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(SvgIcon, new SvgIcon({
    name: "arrow-up",
    size: (28),
}));
const __VLS_1 = __VLS_0({
    name: "arrow-up",
    size: (28),
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onPointerdown: (__VLS_ctx.onForwardRightStart) },
    ...{ onPointerup: (__VLS_ctx.stopDpad) },
    ...{ onPointerleave: (__VLS_ctx.stopDpad) },
    ...{ class: "dpad-btn diagonal" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "dpad-row" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onPointerdown: (__VLS_ctx.onLeftStart) },
    ...{ onPointerup: (__VLS_ctx.stopDpad) },
    ...{ onPointerleave: (__VLS_ctx.stopDpad) },
    ...{ class: "dpad-btn" },
});
/** @type {[typeof SvgIcon, ]} */ ;
// @ts-ignore
const __VLS_3 = __VLS_asFunctionalComponent(SvgIcon, new SvgIcon({
    name: "arrow-left",
    size: (28),
}));
const __VLS_4 = __VLS_3({
    name: "arrow-left",
    size: (28),
}, ...__VLS_functionalComponentArgsRest(__VLS_3));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div)({
    ...{ class: "dpad-center" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onPointerdown: (__VLS_ctx.onRightStart) },
    ...{ onPointerup: (__VLS_ctx.stopDpad) },
    ...{ onPointerleave: (__VLS_ctx.stopDpad) },
    ...{ class: "dpad-btn" },
});
/** @type {[typeof SvgIcon, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(SvgIcon, new SvgIcon({
    name: "arrow-right",
    size: (28),
}));
const __VLS_7 = __VLS_6({
    name: "arrow-right",
    size: (28),
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "dpad-row" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onPointerdown: (__VLS_ctx.onBackwardLeftStart) },
    ...{ onPointerup: (__VLS_ctx.stopDpad) },
    ...{ onPointerleave: (__VLS_ctx.stopDpad) },
    ...{ class: "dpad-btn diagonal" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onPointerdown: (__VLS_ctx.onBackwardStart) },
    ...{ onPointerup: (__VLS_ctx.stopDpad) },
    ...{ onPointerleave: (__VLS_ctx.stopDpad) },
    ...{ class: "dpad-btn" },
});
/** @type {[typeof SvgIcon, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(SvgIcon, new SvgIcon({
    name: "arrow-down",
    size: (28),
}));
const __VLS_10 = __VLS_9({
    name: "arrow-down",
    size: (28),
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onPointerdown: (__VLS_ctx.onBackwardRightStart) },
    ...{ onPointerup: (__VLS_ctx.stopDpad) },
    ...{ onPointerleave: (__VLS_ctx.stopDpad) },
    ...{ class: "dpad-btn diagonal" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
/** @type {__VLS_StyleScopedClasses['dpad']} */ ;
/** @type {__VLS_StyleScopedClasses['dpad-row']} */ ;
/** @type {__VLS_StyleScopedClasses['dpad-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['diagonal']} */ ;
/** @type {__VLS_StyleScopedClasses['dpad-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['dpad-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['diagonal']} */ ;
/** @type {__VLS_StyleScopedClasses['dpad-row']} */ ;
/** @type {__VLS_StyleScopedClasses['dpad-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['dpad-center']} */ ;
/** @type {__VLS_StyleScopedClasses['dpad-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['dpad-row']} */ ;
/** @type {__VLS_StyleScopedClasses['dpad-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['diagonal']} */ ;
/** @type {__VLS_StyleScopedClasses['dpad-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['dpad-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['diagonal']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            SvgIcon: SvgIcon,
            stopDpad: stopDpad,
            onForwardStart: onForwardStart,
            onBackwardStart: onBackwardStart,
            onLeftStart: onLeftStart,
            onRightStart: onRightStart,
            onForwardLeftStart: onForwardLeftStart,
            onForwardRightStart: onForwardRightStart,
            onBackwardLeftStart: onBackwardLeftStart,
            onBackwardRightStart: onBackwardRightStart,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=DirectionPad.vue.js.map
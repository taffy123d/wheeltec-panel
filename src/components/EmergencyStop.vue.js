import { ref } from 'vue';
import { useRobotControl } from '../composables/useRobotControl';
import SvgIcon from './common/SvgIcon.vue';
const { stop } = useRobotControl();
const pressed = ref(false);
function onPress() {
    pressed.value = true;
    stop();
}
function onRelease() {
    pressed.value = false;
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['emergency-stop']} */ ;
/** @type {__VLS_StyleScopedClasses['emergency-stop']} */ ;
/** @type {__VLS_StyleScopedClasses['emergency-stop']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onPointerdown: (__VLS_ctx.onPress) },
    ...{ onPointerup: (__VLS_ctx.onRelease) },
    ...{ onPointerleave: (__VLS_ctx.onRelease) },
    ...{ onPointercancel: (__VLS_ctx.onRelease) },
    ...{ class: "emergency-stop" },
    ...{ class: ({ pressed: __VLS_ctx.pressed }) },
});
/** @type {[typeof SvgIcon, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(SvgIcon, new SvgIcon({
    name: "stop",
    size: (28),
    color: "#ff1744",
}));
const __VLS_1 = __VLS_0({
    name: "stop",
    size: (28),
    color: "#ff1744",
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
/** @type {__VLS_StyleScopedClasses['emergency-stop']} */ ;
/** @type {__VLS_StyleScopedClasses['pressed']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            SvgIcon: SvgIcon,
            pressed: pressed,
            onPress: onPress,
            onRelease: onRelease,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=EmergencyStop.vue.js.map
import { useRobotControl } from '../composables/useRobotControl';
import SvgIcon from './common/SvgIcon.vue';
const { startRecord, stopRecord } = useRobotControl();
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['record-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['record-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['start']} */ ;
/** @type {__VLS_StyleScopedClasses['record-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['record-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['stop']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "record-panel" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
    ...{ class: "panel-title" },
});
/** @type {[typeof SvgIcon, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(SvgIcon, new SvgIcon({
    name: "record",
    size: (18),
}));
const __VLS_1 = __VLS_0({
    name: "record",
    size: (18),
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "record-buttons" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.startRecord) },
    ...{ class: "record-btn start" },
});
/** @type {[typeof SvgIcon, ]} */ ;
// @ts-ignore
const __VLS_3 = __VLS_asFunctionalComponent(SvgIcon, new SvgIcon({
    name: "record",
    size: (24),
    color: "#ff1744",
}));
const __VLS_4 = __VLS_3({
    name: "record",
    size: (24),
    color: "#ff1744",
}, ...__VLS_functionalComponentArgsRest(__VLS_3));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.stopRecord) },
    ...{ class: "record-btn stop" },
});
/** @type {[typeof SvgIcon, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(SvgIcon, new SvgIcon({
    name: "record-stop",
    size: (24),
}));
const __VLS_7 = __VLS_6({
    name: "record-stop",
    size: (24),
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "record-hint" },
});
/** @type {__VLS_StyleScopedClasses['record-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-title']} */ ;
/** @type {__VLS_StyleScopedClasses['record-buttons']} */ ;
/** @type {__VLS_StyleScopedClasses['record-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['start']} */ ;
/** @type {__VLS_StyleScopedClasses['record-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['stop']} */ ;
/** @type {__VLS_StyleScopedClasses['record-hint']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            SvgIcon: SvgIcon,
            startRecord: startRecord,
            stopRecord: stopRecord,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=RecordPanel.vue.js.map
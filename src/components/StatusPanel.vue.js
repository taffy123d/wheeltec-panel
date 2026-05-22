import { computed } from 'vue';
import { useRobotState } from '../composables/useRobotState';
import SvgIcon from './common/SvgIcon.vue';
const { state, lastUpdate } = useRobotState();
const voltagePercent = computed(() => {
    // 12V 为满，10V 为空
    const pct = ((state.value.voltage - 10) / (12.6 - 10)) * 100;
    return Math.max(0, Math.min(100, Math.round(pct)));
});
const voltageColor = computed(() => {
    if (voltagePercent.value < 20)
        return '#ff1744';
    if (voltagePercent.value < 50)
        return '#ffab00';
    return '#00e676';
});
const speed = computed(() => {
    const v = state.value.linearVelocity;
    return Math.sqrt(v.x * v.x + v.y * v.y);
});
function toFixed(v, d = 2) {
    return v.toFixed(d);
}
function timeAgo(ts) {
    const s = Math.floor((Date.now() - ts) / 1000);
    if (s < 5)
        return '实时';
    if (s < 60)
        return `${s}秒前`;
    return `${Math.floor(s / 60)}分钟前`;
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['value']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "status-panel" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
    ...{ class: "panel-title" },
});
/** @type {[typeof SvgIcon, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(SvgIcon, new SvgIcon({
    name: "info",
    size: (18),
}));
const __VLS_1 = __VLS_0({
    name: "info",
    size: (18),
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "status-item" },
});
/** @type {[typeof SvgIcon, ]} */ ;
// @ts-ignore
const __VLS_3 = __VLS_asFunctionalComponent(SvgIcon, new SvgIcon({
    name: "battery",
    size: (18),
    color: (__VLS_ctx.voltageColor),
}));
const __VLS_4 = __VLS_3({
    name: "battery",
    size: (18),
    color: (__VLS_ctx.voltageColor),
}, ...__VLS_functionalComponentArgsRest(__VLS_3));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "value" },
    ...{ style: ({ color: __VLS_ctx.voltageColor }) },
});
(__VLS_ctx.toFixed(__VLS_ctx.state.voltage, 2));
(__VLS_ctx.voltagePercent);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "battery-bar" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div)({
    ...{ class: "battery-fill" },
    ...{ style: ({ width: __VLS_ctx.voltagePercent + '%', background: __VLS_ctx.voltageColor }) },
});
if (__VLS_ctx.state.charging) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "status-item" },
    });
    /** @type {[typeof SvgIcon, ]} */ ;
    // @ts-ignore
    const __VLS_6 = __VLS_asFunctionalComponent(SvgIcon, new SvgIcon({
        name: "charging",
        size: (18),
        color: "#ffab00",
    }));
    const __VLS_7 = __VLS_6({
        name: "charging",
        size: (18),
        color: "#ffab00",
    }, ...__VLS_functionalComponentArgsRest(__VLS_6));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "value" },
        ...{ style: {} },
    });
    (__VLS_ctx.toFixed(__VLS_ctx.state.chargingCurrent, 2));
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "status-item" },
});
/** @type {[typeof SvgIcon, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(SvgIcon, new SvgIcon({
    name: "speed",
    size: (18),
    color: "#00e5ff",
}));
const __VLS_10 = __VLS_9({
    name: "speed",
    size: (18),
    color: "#00e5ff",
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "value" },
});
(__VLS_ctx.toFixed(__VLS_ctx.speed));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "status-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "label sub" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "value small" },
});
(__VLS_ctx.toFixed(__VLS_ctx.state.linearVelocity.x));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "label sub" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "value small" },
});
(__VLS_ctx.toFixed(__VLS_ctx.state.linearVelocity.y));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "status-item" },
});
/** @type {[typeof SvgIcon, ]} */ ;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent(SvgIcon, new SvgIcon({
    name: "compass",
    size: (18),
    color: "#00e5ff",
}));
const __VLS_13 = __VLS_12({
    name: "compass",
    size: (18),
    color: "#00e5ff",
}, ...__VLS_functionalComponentArgsRest(__VLS_12));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "value" },
});
(__VLS_ctx.toFixed(__VLS_ctx.state.angularVelocity, 3));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "status-item" },
});
/** @type {[typeof SvgIcon, ]} */ ;
// @ts-ignore
const __VLS_15 = __VLS_asFunctionalComponent(SvgIcon, new SvgIcon({
    name: "location",
    size: (18),
    color: "#00e5ff",
}));
const __VLS_16 = __VLS_15({
    name: "location",
    size: (18),
    color: "#00e5ff",
}, ...__VLS_functionalComponentArgsRest(__VLS_15));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "value small" },
});
(__VLS_ctx.toFixed(__VLS_ctx.state.position.x));
(__VLS_ctx.toFixed(__VLS_ctx.state.position.y));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "status-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "value" },
});
(__VLS_ctx.toFixed((__VLS_ctx.state.heading * 180) / Math.PI, 1));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "update-time" },
});
(__VLS_ctx.lastUpdate ? __VLS_ctx.timeAgo(__VLS_ctx.lastUpdate) : '等待数据...');
/** @type {__VLS_StyleScopedClasses['status-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-title']} */ ;
/** @type {__VLS_StyleScopedClasses['status-item']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['value']} */ ;
/** @type {__VLS_StyleScopedClasses['battery-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['battery-fill']} */ ;
/** @type {__VLS_StyleScopedClasses['status-item']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['value']} */ ;
/** @type {__VLS_StyleScopedClasses['status-item']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['value']} */ ;
/** @type {__VLS_StyleScopedClasses['status-item']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['sub']} */ ;
/** @type {__VLS_StyleScopedClasses['value']} */ ;
/** @type {__VLS_StyleScopedClasses['small']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['sub']} */ ;
/** @type {__VLS_StyleScopedClasses['value']} */ ;
/** @type {__VLS_StyleScopedClasses['small']} */ ;
/** @type {__VLS_StyleScopedClasses['status-item']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['value']} */ ;
/** @type {__VLS_StyleScopedClasses['status-item']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['value']} */ ;
/** @type {__VLS_StyleScopedClasses['small']} */ ;
/** @type {__VLS_StyleScopedClasses['status-item']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['value']} */ ;
/** @type {__VLS_StyleScopedClasses['update-time']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            SvgIcon: SvgIcon,
            state: state,
            lastUpdate: lastUpdate,
            voltagePercent: voltagePercent,
            voltageColor: voltageColor,
            speed: speed,
            toFixed: toFixed,
            timeAgo: timeAgo,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=StatusPanel.vue.js.map
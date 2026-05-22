import { useConnection } from '../composables/useConnection';
import SvgIcon from './common/SvgIcon.vue';
const { status, isConnected, isConnecting, reconnectAttempt, errorMessage, connect, disconnect } = useConnection();
const statusText = {
    disconnected: '未连接',
    connecting: '连接中...',
    connected: '已连接',
    error: '连接错误',
};
const statusColor = {
    disconnected: '#9e9e9e',
    connecting: '#ffab00',
    connected: '#00e676',
    error: '#ff1744',
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['btn-connect']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-connect']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-disconnect']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "connection-bar" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div)({
    ...{ class: "status-dot" },
    ...{ style: ({ background: __VLS_ctx.statusColor[__VLS_ctx.status] }) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "status-text" },
});
(__VLS_ctx.statusText[__VLS_ctx.status] || __VLS_ctx.status);
if (__VLS_ctx.isConnecting) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "reconnect-info" },
    });
    (__VLS_ctx.reconnectAttempt);
}
if (__VLS_ctx.errorMessage && !__VLS_ctx.isConnected) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "error-msg" },
    });
    (__VLS_ctx.errorMessage);
}
if (!__VLS_ctx.isConnected) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.connect) },
        ...{ class: "btn-connect" },
        disabled: (__VLS_ctx.isConnecting),
    });
    /** @type {[typeof SvgIcon, ]} */ ;
    // @ts-ignore
    const __VLS_0 = __VLS_asFunctionalComponent(SvgIcon, new SvgIcon({
        name: "link",
        size: (20),
    }));
    const __VLS_1 = __VLS_0({
        name: "link",
        size: (20),
    }, ...__VLS_functionalComponentArgsRest(__VLS_0));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.disconnect) },
        ...{ class: "btn-disconnect" },
    });
    /** @type {[typeof SvgIcon, ]} */ ;
    // @ts-ignore
    const __VLS_3 = __VLS_asFunctionalComponent(SvgIcon, new SvgIcon({
        name: "link-off",
        size: (20),
    }));
    const __VLS_4 = __VLS_3({
        name: "link-off",
        size: (20),
    }, ...__VLS_functionalComponentArgsRest(__VLS_3));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
/** @type {__VLS_StyleScopedClasses['connection-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['status-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['status-text']} */ ;
/** @type {__VLS_StyleScopedClasses['reconnect-info']} */ ;
/** @type {__VLS_StyleScopedClasses['error-msg']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-connect']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-disconnect']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            SvgIcon: SvgIcon,
            status: status,
            isConnected: isConnected,
            isConnecting: isConnecting,
            reconnectAttempt: reconnectAttempt,
            errorMessage: errorMessage,
            connect: connect,
            disconnect: disconnect,
            statusText: statusText,
            statusColor: statusColor,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=ConnectionBar.vue.js.map
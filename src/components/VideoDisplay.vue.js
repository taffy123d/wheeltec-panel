import { useConnection } from '../composables/useConnection';
import SvgIcon from './common/SvgIcon.vue';
const { videoUrl, isConnected } = useConnection();
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "video-display" },
});
if (!__VLS_ctx.isConnected || !__VLS_ctx.videoUrl) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "video-placeholder" },
    });
    /** @type {[typeof SvgIcon, ]} */ ;
    // @ts-ignore
    const __VLS_0 = __VLS_asFunctionalComponent(SvgIcon, new SvgIcon({
        name: "camera",
        size: (48),
        color: "#37474f",
    }));
    const __VLS_1 = __VLS_0({
        name: "camera",
        size: (48),
        color: "#37474f",
    }, ...__VLS_functionalComponentArgsRest(__VLS_0));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
        src: (__VLS_ctx.videoUrl),
        ...{ class: "video-stream" },
        alt: "摄像头视频流",
    });
}
/** @type {__VLS_StyleScopedClasses['video-display']} */ ;
/** @type {__VLS_StyleScopedClasses['video-placeholder']} */ ;
/** @type {__VLS_StyleScopedClasses['video-stream']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            SvgIcon: SvgIcon,
            videoUrl: videoUrl,
            isConnected: isConnected,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=VideoDisplay.vue.js.map
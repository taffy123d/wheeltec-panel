import { ref, watch } from 'vue';
export function useLocalStorage(key, defaultValue) {
    let initial = defaultValue;
    try {
        const stored = localStorage.getItem(key);
        if (stored !== null)
            initial = JSON.parse(stored);
    }
    catch {
        /* 解析失败使用默认值 */
    }
    const data = ref(initial);
    watch(data, (val) => {
        try {
            localStorage.setItem(key, JSON.stringify(val));
        }
        catch {
            /* 存储满等异常忽略 */
        }
    }, { deep: true });
    return data;
}
//# sourceMappingURL=useLocalStorage.js.map
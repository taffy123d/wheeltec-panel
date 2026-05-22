import { ref, watch, type Ref } from 'vue'

export function useLocalStorage<T>(key: string, defaultValue: T): Ref<T> {
  let initial = defaultValue
  try {
    const stored = localStorage.getItem(key)
    if (stored !== null) initial = JSON.parse(stored) as T
  } catch {
    /* 解析失败使用默认值 */
  }

  const data = ref<T>(initial) as Ref<T>

  watch(
    data,
    (val) => {
      try {
        localStorage.setItem(key, JSON.stringify(val))
      } catch {
        /* 存储满等异常忽略 */
      }
    },
    { deep: true },
  )

  return data
}

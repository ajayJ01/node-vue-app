import { getCurrentInstance } from 'vue'

export function useToast() {
  const { appContext } = getCurrentInstance()
  return appContext.config.globalProperties.$toast
}
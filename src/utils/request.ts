import axios from 'axios'
import { message } from 'ant-design-vue'
import type { AxiosRequestConfig } from 'axios'

export default async function request<T>(url: string, options?: AxiosRequestConfig): Promise<T> {
  return await axios
    .request({
      url: url,
      ...(options || {})
    })
    .then((response) => {
      if (response.status >= 200 && response.status < 300) {
        const responseContent = response.data
        if (responseContent && responseContent.success) {
          return responseContent.data
        } else {
          throw new Error(response.data.message)
        }
      } else {
        throw new Error(`请求失败: ${response.status}`)
      }
    })
    .catch((error) => {
      if (error?.response?.status == 500) {
        message.error(`请求失败, 请检查网络状态`)
      } else {
        message.error(`请求失败: ${error.message}`)
      }
      throw error
    })
}

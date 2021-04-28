// 搜索相关请求
import { get } from './base'

export function getHotKeys() {
  return get('/api/getHotKeys')
}

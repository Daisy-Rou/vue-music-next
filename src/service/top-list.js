// 排行榜相关请求
import { get } from './base'

export function getTopList() {
  return get('/api/getTopList')
}

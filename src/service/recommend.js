// 轮播图相关请求
import { get } from './base'
export function getRecommend () {
  return get('/api/getRecommend')
}

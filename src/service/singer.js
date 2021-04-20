// 歌手相关请求
import { get } from './base'
export function getSingerList () {
  return get('/api/getSingerList')
}

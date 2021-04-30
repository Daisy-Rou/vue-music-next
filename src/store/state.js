import { PLAY_MODE, FAVORITE_KEY, SEARCH_KEY, PLAY_KEY } from '@/assets/js/constant'
import { load } from '@/assets/js/array-store'

const state = {
  sequenceList: [], // 顺序播放列表
  playList: [], // 正在播放列表
  playing: false, // 是否播放
  playMode: PLAY_MODE.sequence, // 播放模式
  currentIndex: 0, // 当前正在播放歌曲
  fullScreen: false, // 是否全屏播放
  favoriteList: load(FAVORITE_KEY), // 收藏歌曲列表
  searchHistory: load(SEARCH_KEY), // 搜索历史记录
  playHistory: load(PLAY_KEY) // 播放歌曲记录
}

export default state

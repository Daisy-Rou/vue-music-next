import { PLAY_MODE } from '@/assets/js/constant'

const state = {
  sequenceList: [], // 顺序播放列表
  playList: [], // 正在播放列表
  playing: false, // 是否播放
  playMode: PLAY_MODE.sequence, // 播放模式
  currentIndex: 0, // 当前正在播放歌曲
  fullScreen: false // 是否全屏播放
}

export default state

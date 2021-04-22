const mutations = {
  // 修改歌曲播放状态
  setPlayingState(state, playing) {
    state.playing = playing
  },

  // 设置顺序播放列表
  setSequenceList(state, list) {
    state.sequenceList = list
  },

  // 设置播放列表
  setPlayList(state, list) {
    state.playList = list
  },

  // 设置播放模式
  setPlayMode(state, mode) {
    state.playMode = mode
  },

  // 设置当前播放歌曲
  setCurrentIndex(state, index) {
    state.currentIndex = index
  },

  // 设置是否全屏展示
  setFullScreen(state, fullScreen) {
    state.fullscreen = fullScreen
  }
}

export default mutations

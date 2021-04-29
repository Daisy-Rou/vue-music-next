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
    state.fullScreen = fullScreen
  },

  // 设置收藏列表
  setFavoriteList(state, list) {
    state.favoriteList = list
  },

  // 添加歌词
  addSongLyric(state, { song, lyric }) {
    state.sequenceList.map((item) => {
      // 同一首歌
      if (item.mid === song.mid) {
        item.lyric = lyric
      }
      return item
    })
  },

  // 设置搜索历史
  setSearchHistory(state, searches) {
    state.searchHistory = searches
  }
}

export default mutations

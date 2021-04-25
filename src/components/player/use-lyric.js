import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import Lyric from 'lyric-parser'
import { getLyric } from '@/service/song'

export default function useLyric({ songReady, currentTime }) {
  const currentLyric = ref(null)
  const currentLineNum = ref(0)
  const playingLyric = ref('')
  const lyricScrollRef = ref(null)
  const lyricListRef = ref(null)
  const pureMusicLyric = ref('')
  const store = useStore()
  const currentSong = computed(() => store.getters.currentSong)

  watch(currentSong, async (newSong) => {
    // 歌曲不合法
    if (!newSong.url || !newSong.id) {
      return
    }
    stopLyric()
    // 数据重置
    currentLyric.value = null
    currentLineNum.value = 0
    pureMusicLyric.value = ''
    playingLyric.value = ''

    const lyric = await getLyric(newSong)
    // 给一首歌添加歌词
    store.commit('addSongLyric', { song: newSong, lyric })
    // 切换a歌曲之后有切换b歌曲此时a歌曲返回的歌词需要丢弃
    if (currentSong.value.lyric !== lyric) {
      return
    }
    currentLyric.value = new Lyric(lyric, handleLyric)
    const hasLyric = currentLyric.value.lines.length
    if (hasLyric) {
      if (songReady.value) {
        playLyric()
      }
    } else {
      playingLyric.value = pureMusicLyric.value = lyric.replace(/\[(\d{2}:\d{2}:\d{2})\]/g, '')
    }

    // 缓存歌曲
  })

  // 播放歌词
  function playLyric() {
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      currentLyricVal.seek(currentTime.value * 1000)
    }
  }

  // 暂停歌词
  function stopLyric() {
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      currentLyricVal.stop()
    }
  }

  function handleLyric({ lineNum, txt }) {
    currentLineNum.value = lineNum
    playingLyric.value = txt
    const scrollComp = lyricScrollRef.value
    const listEl = lyricListRef.value
    if (!listEl) {
      return
    }
    // 高亮歌词偏中间
    if (currentLineNum.value > 5) {
      const lineEl = listEl.children[lineNum - 5]
      scrollComp.scroll.scrollToElement(lineEl, 1000)
    } else {
      scrollComp.scroll.scrollTo(0, 0, 1000)
    }
  }

  return {
    playingLyric,
    currentLyric,
    currentLineNum,
    pureMusicLyric,
    playLyric,
    stopLyric,
    lyricScrollRef,
    lyricListRef
  }
}

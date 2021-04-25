import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import Lyric from 'lyric-parser'
import { getLyric } from '@/service/song'

export default function useLyric() {
  const currentLyric = ref(null)
  const playingLyric = ref(null)
  const store = useStore()
  const currentSong = computed(() => store.getters.currentSong)

  watch(currentSong, async (newSong) => {
    if (!newSong.url || !newSong.id) {
      return
    }
    const lyric = await getLyric(newSong)
    // newSong.lyric = lyric
    store.commit('addSongLyric', { song: newSong, lyric })
    if (currentSong.value.lyric !== lyric) {
      return
    }
    currentLyric.value = new Lyric(lyric, handleLyric)
    // 缓存歌曲
    console.log(lyric)
  })

  function handleLyric() {

  }

  return {
    playingLyric
  }
}

import { ref, onMounted, onUnmounted } from 'vue'
import BSroll from '@better-scroll/core'
import PullUp from '@better-scroll/pull-up'
import ObserveDOM from '@better-scroll/slide'

BSroll.use(PullUp)
BSroll.use(ObserveDOM)

export default function usePullUpLoad(requestData, preventPullUpload) {
  const scroll = ref(null)
  const rootRef = ref(null)
  const isPullUpLoad = ref(false)

  onMounted(() => {
    const scrollVal = scroll.value = new BSroll(rootRef.value, {
      pullUpLoad: true,
      observeDOM: true,
      click: true
    })
    scrollVal.on('pullingUp', pullingUpHandler)

    async function pullingUpHandler() {
      if (preventPullUpload.value) {
        scrollVal.finishPullUp()
        return
      }
      isPullUpLoad.value = true
      await requestData()
      scrollVal.finishPullUp()
      scrollVal.refresh()
      isPullUpLoad.value = false
    }
  })

  onUnmounted(() => {
    scroll.value.destroy()
  })

  return {
    scroll,
    rootRef,
    isPullUpLoad
  }
}

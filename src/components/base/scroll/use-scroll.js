import { ref, onMounted, onUnmounted } from 'vue'
import BScroll from '@better-scroll/core'
import ObserveDOM from '@better-scroll/observe-dom'
BScroll.use(ObserveDOM)

export default function useScroll(wrapperRef, options, emit) {
  const scroll = ref(null)
  onMounted(() => {
    const scrollVal = scroll.value = new BScroll(wrapperRef.value, {
      observeDOM: true,
      ...options
    })
    // 实时派发滚动位置
    if (options.probeType > 0) {
      scrollVal.on('scroll', (pos) => {
        // 事件派发
        emit('scroll', pos)
      })
    }
  })
  onUnmounted(() => {
    scroll.value.destroy()
  })
  return scroll
}

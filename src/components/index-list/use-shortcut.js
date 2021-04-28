import { computed, ref } from 'vue'

export default function useShortcut(props, groupRef) {
  // 锚点高度
  const ANCHOR_HEIGHT = 18
  const scrollRef = ref(null)
  const touch = {}

  const shortcutList = computed(() => {
    return props.data.map((group) => {
      return group.title
    })
  })

  // 滚动歌手列表右侧导航跟随滚动切换
  function onShortcutTouchStart(e) {
    // 通过绑定data-index属性获取当前滚动index
    const anchorIndex = parseInt(e.target.dataset.index)
    // 第一个纵坐标
    touch.y1 = e.touches[0].pageY
    // 将索引保留到touch对象里
    touch.anchorIndex = anchorIndex
    scrollTo(anchorIndex)
  }

  function onShortcutTouchMove(e) {
    // 第二个纵坐标
    touch.y2 = e.touches[0].pageY
    // 手指滑动距离 /锚点高度 = 偏移索引
    const delta = (touch.y2 - touch.y1) / ANCHOR_HEIGHT | 0
    // 目标索引
    const anchorIndex = touch.anchorIndex + delta
    scrollTo(anchorIndex)
  }

  function onShortcutTouchEnd(e) {

  }

  // 函数封装
  function scrollTo(index) {
    // 在右侧黑色区域拖动报错处理
    if (isNaN(index)) {
      return
    }
    // 限制在0 ~ length-1
    index = Math.max(0, Math.min(shortcutList.value.length - 1, index))
    // 目标元素
    const targetEl = groupRef.value.children[index]
    const scroll = scrollRef.value.scroll
    scroll.scrollToElement(targetEl, 0)
  }
  return {
    shortcutList,
    onShortcutTouchStart,
    onShortcutTouchMove,
    onShortcutTouchEnd,
    scrollRef
  }
}

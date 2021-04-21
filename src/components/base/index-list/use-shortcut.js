import { computed, ref } from 'vue'

export default function useShortcut(props, groupRef) {
  const scrollRef = ref(null)

  const shortcutList = computed(() => {
    return props.data.map((group) => {
      return group.title
    })
  })

  // 滚动歌手列表右侧导航跟随滚动切换
  function onShortcutTouchStart(e) {
    // 通过绑定data-index属性获取当前滚动index
    const anchorIndex = parseInt(e.target.dataset.index)
    const targetEl = groupRef.value.children[anchorIndex]
    const scroll = scrollRef.value.scroll
    scroll.scrollToElement(targetEl)
  }

  function onShortcutTouchMove() {

  }

  function onShortcutTouchEnd() {

  }
  return {
    shortcutList,
    onShortcutTouchStart,
    onShortcutTouchMove,
    onShortcutTouchEnd,
    scrollRef
  }
}

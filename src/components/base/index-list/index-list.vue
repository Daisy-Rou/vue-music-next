<template>
  <m-scroll
    class="index-list"
    :probe-type="3"
    @scroll="onScroll"
    ref="scrollRef"
  >
    <ul class="group-container" ref="groupRef">
      <li
        v-for="group in data"
        :key="group.title"
        class="group"
      >
        <h2 class="title">{{group.title}}</h2>
        <ul>
          <li
            v-for="item in group.list"
            :key="item.id"
            class="item"
          >
            <img v-lazy="item.pic" alt="" class="avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="fixed">
      <div class="fixed-title">{{fixedTitle}}</div>
    </div>
  </m-scroll>
</template>

<script>
import MScroll from '../scroll/scroll'
import useFixed from './use-fixed'
export default {
  name: 'index-list',
  components: {
    MScroll
  },
  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    }
  },
  setup(props) {
    const { groupRef, onScroll, fixedTitle } = useFixed(props)
    return {
      fixedTitle,
      onScroll,
      groupRef
    }
  }
}
</script>

<style lang="scss" scoped>
.index-list {
  position: relative;
  width: 100%;
  height: 100%;
  // overflow: hidden;
  background: $color-background;
  .group-container {
    overflow: hidden;
  }
  .group {
    padding-bottom: 30px;
    .title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
    .item {
      display: flex;
      align-items: center;
      padding: 20px 0 0 30px;
      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
      .name {
        margin-left: 20px;
        color: $color-text-l;
        font-size: $font-size-medium;
      }
    }
  }
  .fixed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    .fixed-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
  }
}
</style>

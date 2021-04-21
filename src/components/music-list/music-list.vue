<template>
  <div class="music-list">
    <div class="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{title}}</h1>
    <div class="bg-image" :style="bgImageStyle">
      <div class="filter"></div>
    </div>
    <m-scroll class="list">
      <div class="song-list-wrapper">
        <song-list :songs="songs"></song-list>
      </div>
    </m-scroll>
  </div>
</template>

<script>
import SongList from '@/components/base/song-list/song-list'
import MScroll from '@/components/base/scroll/scroll'

export default {
  name: 'music-list',
  components: {
    SongList,
    MScroll
  },
  props: {
    songs: {
      type: Array,
      default() {
        return []
      }
    },
    title: String,
    pic: String
  },
  computed: {
    bgImageStyle() {
      return {
        backgroundImage: `url(${this.pic})`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.music-list {
  position: relative;
  height: 100%;
  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 20;
    transform: translateZ(2px);
    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }
  .title {
    position: absolute;
    top: 0;
    left: 10%;
    width: 80%;
    z-index: 20;
    transform: translateZ(2px);
    @include no-wrap();
    text-align: center;
    line-height: 40px;
    font-size: $font-size-large;
    color: $color-text;
  }
  .bg-image {
    position: relative;
    width: 100%;
    transform-origin: top;
    background-size: cover;
    padding-top: 70%;
    height: 0;
    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
  }
  .list {
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 0;
    .song-list-wrapper {
      padding: 20px 30px;
      background: $color-background;
    }
  }
}
</style>

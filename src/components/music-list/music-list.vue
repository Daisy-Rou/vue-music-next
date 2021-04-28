<template>
  <div class="music-list">
    <div class="back" @click="goBack">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{title}}</h1>
    <div
      ref="bgImage"
      class="bg-image"
      :style="bgImageStyle"
    >
      <div
        class="play-btn-wrapper"
        :style="playBtnStyle"
      >
        <div
          class="play-btn"
          v-show="songs.length > 0"
          @click="random"
        >
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" :style="filterStyle"></div>
    </div>
    <m-scroll
      v-loading="loading"
      v-no-result:[noResultText]="noResult"
      class="list"
      :style="scrollStyle"
      :probe-type="3"
      @scroll="onScroll"
    >
      <div class="song-list-wrapper">
        <song-list :songs="songs" @select="selectItem"></song-list>
      </div>
    </m-scroll>
  </div>
</template>

<script>
import SongList from '@/components/base/song-list/song-list'
// import MScroll from '@/components/base/scroll/scroll'
import MScroll from '@/components/wrap-scroll'
import { mapActions, mapState } from 'vuex'

// 顶部高度
const RESERVED_HEIGHT = 40

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
    pic: String,
    loading: Boolean,
    noResultText: {
      type: String,
      default: '抱歉，没有找到可播放的歌曲'
    }
  },
  computed: {
    noResult() {
      return !this.loading && !this.songs.length
    },

    playBtnStyle() {
      let display = ''
      if (this.scrollY >= this.maxTranslateY) {
        display = 'none'
      }
      return {
        display
      }
    },

    bgImageStyle() {
      // 临时遍历缓存
      const scrollY = this.scrollY
      let zIndex = 0
      let paddingTop = '70%'
      let height = 0
      let translateZ = 0

      if (scrollY > this.maxTranslateY) {
        zIndex = 10
        paddingTop = 0
        height = `${RESERVED_HEIGHT}px`
        translateZ = 1
      }
      // 图片缩放
      let scale = 1
      if (scrollY < 0) {
        scale = 1 + Math.abs(scrollY / this.imageHeight)
      }

      return {
        zIndex,
        paddingTop,
        height,
        backgroundImage: `url(${this.pic})`,
        transform: `scale(${scale})translateZ(${translateZ}px)`
      }
    },

    filterStyle() {
      let blur = 0
      // 临时遍历缓存
      const scrollY = this.scrollY
      const imageHeight = this.imageHeight
      if (scrollY >= 0) {
        blur = Math.min(this.maxTranslateY / imageHeight, scrollY / imageHeight) * 20
      }
      return {
        backdropFilter: `blur(${blur}px)`
      }
    },
    scrollStyle() {
      const bottom = this.playList.length ? '60px' : '0'
      return {
        top: `${this.imageHeight}px`,
        bottom
      }
    },
    ...mapState([
      'playList'
    ])
  },
  mounted() {
    // 拿到图片高度
    this.imageHeight = this.$refs.bgImage.clientHeight
    this.maxTranslateY = this.imageHeight - RESERVED_HEIGHT
  },
  data() {
    return {
      imageHeight: 0, // 图片高度
      scrollY: 0, // 距离顶部距离
      maxTranslateY: 0 // 最大可滚动距离
    }
  },
  methods: {
    goBack() {
      this.$router.back()
    },
    onScroll(pos) {
      this.scrollY = -pos.y
    },
    selectItem({ song, index }) {
      this.selectPlay({
        list: this.songs,
        index
      })
    },
    random() {
      this.randomPlay(this.songs)
    },
    // 派发事件
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ])
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
    // padding-top: 70%;
    // height: 0;
    .play-btn-wrapper {
      position: absolute;
      bottom: 20px;
      z-index: 10;
      width: 100%;
      .play-btn {
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid $color-theme;
        color: $color-theme;
        border-radius: 100px;
        font-size: 0;
      }
      .icon-play {
        display: inline-block;
        vertical-align: middle;
        margin-right: 6px;
        font-size: $font-size-medium-x;
      }
      .text {
        display: inline-block;
        vertical-align: middle;
        font-size: $font-size-small;
      }
    }
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
    // overflow: hidden;
    .song-list-wrapper {
      padding: 20px 30px;
      background: $color-background;
    }
  }
}
</style>

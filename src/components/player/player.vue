<template>
  <div class="player" v-show="playList.length > 0">
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <template v-if="currentSong">
          <div class="background">
            <img :src="currentSong.pic" alt="">
          </div>
          <div class="top">
            <div class="back" @click="goBack">
              <i class="icon-back"></i>
            </div>
            <h1 class="title">{{currentSong.name}}</h1>
            <h2 class="subtitle">{{currentSong.singer}}</h2>
          </div>
          <div
            class="middle"
            @touchstart.prevent="onMiddleTouchStart"
            @touchmove.prevent="onMiddleTouchMove"
            @touchend.prevent="onMiddleTouchEnd"
          >
            <div
              class="middle-l"
              :style="middleLStyle"
            >
              <div class="cd-wrapper" ref="cdWrapperRef">
                <div
                  class="cd"
                  ref="cdRef"
                >
                  <img
                    ref="cdImageRef"
                    :src="currentSong.pic"
                    alt="歌手图片"
                    class="image"
                    :class="cdCls"
                  >
                </div>
              </div>
              <!-- 当前正在播放歌词 -->
              <div class="playing-lyric-wrapper">
                <div class="playing-lyric">{{playingLyric}}</div>
              </div>
            </div>
            <m-scroll
              class="middle-r"
              ref="lyricScrollRef"
              :style="middleRStyle"
            >
              <div class="lyric-wrapper">
                <dir
                  ref="lyricListRef"
                  v-if="currentLyric"
                >
                  <p
                    class="text"
                    :class="{'current': currentLineNum === index}"
                    v-for="(line, index) in currentLyric.lines"
                    :key="line.nun"
                  >
                    {{line.txt}}
                  </p>
                </dir>
                <div
                  v-show="pureMusicLyric"
                  class="pure-music"
                >
                  <p>{{pureMusicLyric}}</p>
                </div>
              </div>
            </m-scroll>
          </div>
          <div class="bottom">
            <div class="dot-wrapper">
              <span class="dot" :class="{'active': currentShow === 'cd'}"></span>
              <span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
            </div>
            <div class="progress-wrapper">
              <span class="time time-l">{{formatTime(currentTime)}}</span>
              <div class="progress-bar-wrapper">
                <progress-bar
                  ref="barRef"
                  :progress="progress"
                  @progress-changing="onProgressChanging"
                  @progress-changed="onProgressChanged"
                >
                </progress-bar>
              </div>
              <span class="time time-r">{{formatTime(currentSong.duration)}}</span>
            </div>
            <div class="operators">
              <div class="icon i-left">
                <i @click="changeMode" :class="modeIcon"></i>
              </div>
              <div class="icon i-left" :class="disableCls">
                <i @click="prev" class="icon-prev"></i>
              </div>
              <div class="icon i-center" :class="disableCls">
                <i :class="playIcon" @click="togglePlay"></i>
              </div>
              <div class="icon i-right" :class="disableCls">
                <i @click="next" class="icon-next"></i>
              </div>
              <div class="icon i-right">
                <i :class="getFavoriteIcon(currentSong)" @click="toggleFavorite(currentSong)"></i>
              </div>
            </div>
          </div>
        </template>
      </div>
    </transition>
    <mini-player :progress="progress" :toggle-play="togglePlay"></mini-player>
    <audio
      ref="audioRef"
      @pause="pause"
      @canplay="canplay"
      @error="error"
      @timeupdate="updateTime"
      @ended="end"
    >
    </audio>
  </div>
</template>

<script>
import { computed, watch, ref, nextTick } from 'vue'
import useMode from './use-mode'
import useFavorite from './use-favorite'
import useCd from './use-cd'
import useLyric from './use-lyric'
import useMiddleInteractive from './use-middle-interactive'
import useAnimation from './use-animation'
import { useStore } from 'vuex'
import ProgressBar from './progres-bar'
import MiniPlayer from './mini-player'
import { formatTime } from '@/assets/js/util'
import { PLAY_MODE } from '@/assets/js/constant'
import MScroll from '@/components/base/scroll/scroll'

export default {
  name: 'player',
  components: {
    ProgressBar,
    MScroll,
    MiniPlayer
  },
  setup() {
    // ref
    const audioRef = ref(null)
    const songReady = ref(false)
    const currentTime = ref(0)
    const barRef = ref(null)
    let progressChanging = false

    // vuex computed
    const store = useStore()
    const fullScreen = computed(() => store.state.fullScreen)

    const currentSong = computed(() => store.getters.currentSong)

    // 播放状态
    const playing = computed(() => store.state.playing)

    // 根据播放状态展示不同图标
    const playIcon = computed(() => {
      return playing.value ? 'icon-pause' : 'icon-play'
    })

    // 获取当前播放歌曲的索引
    const currentIndex = computed(() => store.state.currentIndex)

    // 获取当前播放歌曲列表
    const playList = computed(() => store.state.playList)

    // 播放模式
    const playMode = computed(() => store.state.playMode)

    // 禁用样式
    const disableCls = computed(() => {
      return songReady.value ? '' : 'disable'
    })

    const progress = computed(() => {
      return currentTime.value / currentSong.value.duration
    })

    // hooks
    // 切换播放图标
    const { modeIcon, changeMode } = useMode()

    // 收藏列表
    const { getFavoriteIcon, toggleFavorite } = useFavorite()

    // cd
    const { cdCls, cdRef, cdImageRef } = useCd()

    // 歌词
    const { playingLyric, currentLyric, currentLineNum, playLyric, stopLyric, lyricScrollRef, lyricListRef, pureMusicLyric } = useLyric({ songReady, currentTime })

    // cd和歌词切换
    const { currentShow, onMiddleTouchStart, onMiddleTouchMove, onMiddleTouchEnd, middleLStyle, middleRStyle } = useMiddleInteractive()

    // 动画
    const { cdWrapperRef, enter, afterEnter, leave, afterLeave } = useAnimation()

    // watch
    // 当前播放歌曲
    watch(currentSong, (newSong) => {
      if (!newSong.id || !newSong.url) {
        return
      }
      songReady.value = false
      const audioEl = audioRef.value
      audioEl.src = newSong.url
      audioEl.play()
    })

    // 监听歌曲播放状态
    watch(playing, (newPlaying) => {
      if (!songReady.value) {
        return
      }
      const audioEl = audioRef.value
      if (newPlaying) {
        audioEl.play()
        playLyric()
      } else {
        audioEl.pause()
        stopLyric()
      }
      // newPlaying ? audioEl.play() : audioEl.pause()
    })

    watch(fullScreen, async (newFullScreen) => {
      if (newFullScreen) {
        await nextTick()
        barRef.value.setOffset(progress.value)
      }
    })

    // function
    function goBack() {
      store.commit('setFullScreen', false)
    }

    // 切换歌曲播放状态
    function togglePlay() {
      if (!songReady.value) {
        return
      }
      store.commit('setPlayingState', !playing.value)
    }

    // 电脑待机或电脑屏幕关闭 关闭音乐
    function pause() {
      store.commit('setPlayingState', false)
    }

    function canplay() {
      if (songReady.value) {
        return
      }
      songReady.value = true
      playLyric()
    }

    function error() {
      songReady.value = true
    }

    function updateTime(e) {
      if (progressChanging) {
        return
      }
      currentTime.value = e.target.currentTime
    }

    function end(e) {
      currentTime.value = 0
      if (playMode.value === PLAY_MODE.loop) {
        loop()
      } else {
        next()
      }
    }

    function onProgressChanging(progress) {
      progressChanging = true
      currentTime.value = currentSong.value.duration * progress
      playLyric()
      stopLyric()
    }

    function onProgressChanged(progress) {
      progressChanging = false
      audioRef.value.currentTime = currentTime.value = currentSong.value.duration * progress
      if (!playing.value) {
        store.commit('setPlayingState', true)
      }
      playLyric()
    }

    // 前一首
    function prev() {
      const list = playList.value
      if (!songReady.value || !list.length) {
        return
      }
      // 只有一首歌的情况下
      if (list.length === 1) {
        loop()
      } else {
        let index = currentIndex.value - 1
        if (index === -1) {
          index = list.length - 1
        }
        store.commit('setCurrentIndex', index)
        if (!playing.value) {
          store.commit('setPlayingState', true)
        }
      }
    }

    // 后一首
    function next() {
      const list = playList.value
      if (!songReady.value || !list.length) {
        return
      }
      if (list.length === 1) {
        loop()
      } else {
        let index = currentIndex.value + 1
        if (index === list.length) {
          index = 0
        }
        store.commit('setCurrentIndex', index)
        if (!playing.value) {
          store.commit('setPlayingState', true)
        }
      }
    }

    // 循环
    function loop() {
      const audioEl = audioRef.value
      audioEl.currentIndex = 0
      audioEl.play()
      store.commit('setPlayingState', true)
    }

    return {
      audioRef,
      barRef,
      fullScreen,
      currentSong,
      goBack,
      playIcon,
      togglePlay,
      pause,
      prev,
      next,
      canplay,
      disableCls,
      error,
      // 切换播放图标
      changeMode,
      modeIcon,
      // 收藏列表
      getFavoriteIcon,
      toggleFavorite,
      // cd
      cdCls,
      cdRef,
      cdImageRef,
      // 歌词
      playingLyric,
      currentLyric,
      currentLineNum,
      lyricScrollRef,
      lyricListRef,
      pureMusicLyric,
      // cd和歌词切换
      currentShow,
      onMiddleTouchStart,
      onMiddleTouchMove,
      onMiddleTouchEnd,
      middleLStyle,
      middleRStyle,
      // 动画切换
      cdWrapperRef,
      enter,
      afterEnter,
      leave,
      afterLeave,
      // 进度条
      currentTime,
      formatTime,
      progress,
      updateTime,
      onProgressChanging,
      onProgressChanged,
      end,
      playList
    }
  }
}
</script>

<style lang="scss" scoped>
.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;
    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);

      img {
        width: 100%;
        height: 100%;
      }
    }
    .top {
      position: relative;
      margin-bottom: 25px;
      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
      }
      .icon-back {
        display: block;
        padding: 9px;
        font-size: $font-size-large-x;
        color: $color-theme;
        transform: rotate(-90deg);
      }
      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        @include no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }
      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }
    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;
      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;
        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          box-sizing: border-box;
          height: 100%;
          .cd {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            img {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border-radius: 50%;
              border: 10px solid rgba(255, 255, 255, 0.1);
            }
            .playing {
              // 无限旋转
              animation: rotate 20s linear infinite;
            }
          }
        }
        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;
          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }
      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
            &.current {
              color: $color-text;
            }
          }
          .pure-music {
            padding-top: 50%;
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
          }
        }
      }
    }
    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .dot-wrapper {
        text-align: center;
        font-size: 0;
        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;
          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }
      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;
        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 40px;
          line-height: 30px;
          width: 40px;
          &.time-l {
            text-align: left;
          }
          &.time-r {
            text-align: right;
          }
        }
        .progress-bar-wrapper {
          flex: 1;
        }
      }
      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;
        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 40px;
          line-height: 30px;
          width: 40px;
          &.time-l {
            text-align: left;
          }
          &.time-r {
            text-align: right;
          }
        }
        .progress-bar-wrapper {
          flex: 1;
        }
      }
      .operators {
        display: flex;
        align-items: center;
        .icon {
          flex: 1;
          color: $color-theme;
          &.disable {
            color: $color-theme-d;
          }
          i {
            font-size: 30px;
          }
        }
        .i-left {
          text-align: right;
        }
        .i-center {
          padding: 0 20px;
          text-align: center;
          i {
            font-size: 40px;
          }
        }
        .i-right {
          text-align: left
        }
        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }
    &.normal-enter-active, &.normal-leave-active {
      transition: all .6s;
      .top, .bottom {
        transition: all .6s cubic-bezier(0.45, 0, 0.55, 1);
      }
    }
    &.normal-enter-from, &.normal-leave-to {
      opacity: 0;
      .top {
        transform: translate3d(0, -100px, 0);
      }
      .bottom {
        transform: translate3d(0, 100px, 0)
      }
    }
  }
}
</style>

<template>
  <div
    class="progress-bar"
    @click="onClick"
  >
    <div class="bar-inner">
      <div
        class="progress"
        :style="progressStyle"
        ref="progressRef"
      ></div>
      <div
        class="progress-btn-wrapper"
        :style="btnStyle"
        @touchstart.prevent="onTouchStart"
        @touchmove.prevent="onTouchMove"
        @touchend.prevent="onTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
const progressBtnWidth = 16

export default {
  name: 'progress-bar',
  emits: ['progress-changing', 'progress-changed'],
  props: {
    progress: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      offset: 0
    }
  },

  computed: {
    // 进度条样式
    progressStyle() {
      return `width:${this.offset}px`
    },
    btnStyle() {
      return `transform:translate3d(${this.offset}px,0,0)`
    }
  },

  watch: {
    progress(newProgress) {
      const barWidth = this.$el.clientWidth - progressBtnWidth
      this.offset = barWidth * newProgress
    }
  },
  created() {
    this.touch = {}
  },
  methods: {
    // 拖动滚动条
    onTouchStart(e) {
      this.touch.x1 = e.touches[0].pageX
      this.touch.beginWidth = this.$refs.progressRef.clientWidth
    },
    onTouchMove(e) {
      // 偏移值
      const delta = e.touches[0].pageX - this.touch.x1
      // 位移过后进度条宽度
      const tempWidth = this.touch.beginWidth + delta
      // 进度条总长度
      const barWidth = this.$el.clientWidth - progressBtnWidth
      // 限制在0-1之间 进度条移动百分比
      const progress = Math.min(1, Math.max(tempWidth / barWidth, 0))
      // 进度条样式移动宽度
      this.offset = barWidth * progress
      this.$emit('progress-changing', progress)
    },
    onTouchEnd() {
      // 进度条总长度
      const barWidth = this.$el.clientWidth - progressBtnWidth
      // 进度条移动百分比
      const progress = this.$refs.progressRef.clientWidth / barWidth
      this.$emit('progress-changed', progress)
    },
    // 点击滚动条
    onClick(e) {
      const rect = this.$el.getBoundingClientRect()
      const offsetWidth = e.pageX - rect.left
      const barWidth = this.$el.clientWidth - progressBtnWidth
      const progress = offsetWidth / barWidth
      this.$emit('progress-changed', progress)
    }
  }
}
</script>

<style lang="scss" scoped>
.progress-bar {
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);
    .progress {
      position: absolute;
      height: 100%;
      background: $color-theme;
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid $color-text;
        border-radius: 50%;
        background: $color-theme;
      }
    }
  }
}
</style>

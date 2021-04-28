<template>
  <m-header></m-header>
  <m-tap></m-tap>
  <!-- 路由视图渲染 -->
  <!-- <router-view v-slot="{ Component }">
    <transition name="slide">
      <component  :is="Component" />
    </transition>
  </router-view> -->
  <router-view
    :style="viewStyle"
  >
  </router-view>
  <player></player>
</template>
<script>
import MHeader from '@/components/header/header.vue'
import MTap from '@/components/tab/tab.vue'
import Player from '@/components/player/player.vue'
import { mapState } from 'vuex'

  export default {
    name: 'app',
    components: {
      MHeader,
      MTap,
      Player
    },
    computed: {
      viewStyle() {
        const bottom = this.playList.length ? '60px' : '0'
        return {
          bottom
        }
      },
      ...mapState([
        'playList'
      ])
    }
  }
</script>

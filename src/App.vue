<template>
  <m-header></m-header>
  <m-tap></m-tap>
  <!-- 路由视图渲染 -->
  <!-- <router-view v-slot="{ Component }">
    <transition name="slide">
      <component  :is="Component" />
    </transition>
  </router-view> -->
  <router-view />
  <player></player>
</template>
<script>
import MHeader from '@/components/header/header.vue'
import MTap from '@/components/tab/tab.vue'
import Player from '@/components/player/player.vue'
  export default {
    name: 'app',
    components: {
      MHeader,
      MTap,
      Player
    },
    data() {
      return {

      }
    }
  }
</script>

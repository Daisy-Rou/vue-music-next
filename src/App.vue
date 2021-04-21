<template>
  <m-header></m-header>
  <m-tap></m-tap>
  <!-- 路由视图渲染 -->
  <router-view/>
</template>
<script>
import MHeader from '@/components/header/header.vue'
import MTap from '@/components/tab/tab.vue'
  export default {
    name: 'app',
    components: {
      MHeader,
      MTap
    },
    data() {
      return {

      }
    }
  }
</script>

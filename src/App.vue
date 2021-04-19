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
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

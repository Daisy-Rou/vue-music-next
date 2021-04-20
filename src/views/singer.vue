<template>
  <div class="singer">
    singer
  </div>
</template>

<script>
import { getSingerList } from '@/service/singer'
export default {
  name: 'singer',
  async created() {
    const result = await getSingerList()
    console.log(result)
  }
}
</script>

<style lang="scss" scoped>

</style>

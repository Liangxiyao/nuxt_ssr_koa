<template>
  <div class="m-geo">
    <i class="el-icon-location"></i>{{$store.state.geo.position.city}}
    <nuxt-link class="changeCity" to="/changeCity">切换城市</nuxt-link>
    [北京]
  </div>
</template>

<script>
  export default {
    
  }
</script>

<style lang="scss">

</style>
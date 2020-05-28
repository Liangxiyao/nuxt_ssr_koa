<template>
  <div class="m-header">
    <el-row :gutter="0">
      <el-col :span="4">
        <geo></geo>
      </el-col>
      <el-col :span="6">
        <user></user>
      </el-col>
      <el-col :span="14">
        <navbar></navbar>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Geo from './geo.vue'
import User from './user.vue'
import Navbar from './nav.vue';
export default {
  components:{
    Geo,
    User,
    Navbar
  }
}
</script>

<style lang="scss">
  @import "@/assets/css/public/layout.scss";
</style>
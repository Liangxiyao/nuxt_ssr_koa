<template>
  <div class="m-menu">
     <dl class="nav"  @mouseleave="mouseleave">
       <dt>全部分类</dt>
       <dd v-for="(item,idx) in menu" :key="idx" 
            @mouseenter="enter">
         <i :class="item.type"></i>{{item.name}}<span class="arrow"></span>
       </dd>
     </dl>
     <div class="detail" v-if="kind" @mouseenter="hover" @mouseleave="out">
       <template v-for="(item,idx) in curdetail.child">
         <h4 :key="idx">{{item.title}}</h4>
         <span v-for="v in item.child" :key="v">{{v}}</span>
       </template>
     </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        kind:'',  //hover时候的类型
        menu: this.$store.state.home.menu
      }
    },
    computed: {
      curdetail() {
        return  this.menu.filter(item => item.type==this.kind)[0]
      }
    },
    methods: {
      mouseleave() {
        this.timer = setTimeout(()=>{
          this.kind = ''
        },500)
      },
      enter(e){   
        this.kind = e.target.querySelector('i').className
      },
      hover(){
        clearTimeout(this.timer)
      },
      out(){
        this.kind = ''
      }
    },
  }
</script>

<style lang="scss">

</style>
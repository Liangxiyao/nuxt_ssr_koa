<template>
  <div class="m-products-list">
    <dl>
      <dd
        v-for="item in nav"
        :key="item.name"
        :class="[item.name,item.name == active?'s-nav-active':'']"
        @click="navSelect(item)"
      >{{ item.txt }}</dd>
    </dl>
    <div>
      <Item
        v-for="(item,idx) in list"
        :key="idx"
        :meta="item"/>
    </div>
  </div>
</template>

<script>
import Item from './product.vue'
export default {
  components: {
    Item
  },
  props: {
    list: {
      type:Array,
      default(){
        return []
      }
    }
  },
  data() {
    return {
      nav: [
        {
          name: 's-default',
          txt: '智能排序',
        }, {
          name: 's-price',
          txt: '价格最低',
        }, {
          name: 's-visit',
          txt: '人气最高',
        }, {
          name: 's-comment',
          txt: '评价最高',
        }
      ],
      active:'s-default',
      newList:this.list
    }
  },
  async asyncData({app}) {
    let { data } = await app.$axios.get('searchList')
    return { items: data.list }
  },
  methods: {
    navSelect (item) {
      this.active = item.name
      switch(item.name){
        case 's-price':
          this.newList = this.list.sort((a,b)=>{
            return a.price - b.price
          });
          break;
        case 's-visit':
          this.newList = this.list.sort((a,b)=>{
            return b.rate - a.rate
          });
          break;
        case 's-comment':
          this.newList = this.list.sort((a,b)=>{
            return b.comment - a.comment
          });
          break;
        default:
          this.newList = this.list
      }
    }
  }
}
</script>

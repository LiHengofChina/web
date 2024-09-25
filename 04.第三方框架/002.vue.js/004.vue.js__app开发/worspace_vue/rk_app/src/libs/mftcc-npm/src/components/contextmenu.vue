<template>
    <ul v-show="visible"
        :style="{left:position.left+'px',top:position.top+'px'}" class="contextmenu el-dropdown-menu ">
        <li class="el-dropdown-menu__item" 
            v-for="(item, index) in (items||[])"
            :key="index"
            @click="Fn(item)">{{ item.text }}</li>
    </ul>
</template>
<script>

  export default {
    data() {
      return {
          visible: this.show
      }
    },
    props: ["show","position","items"],
    watch: {
        show (value) {
            this.visible = this.show;
            if (value) {
                document.body.addEventListener('click', this.closeMenu)
            } else {
                document.body.removeEventListener('click', this.closeMenu)
            }
        }
    },
    created(){
        
    },
    methods: {
        Fn(item) {
            this.$emit('callback', item);
            this.closeMenu();
        },
        closeMenu(){
            this.$emit('update:show', false);
            this.visible = false;
        }
    }
  }
</script>
<style scoped>
.contextmenu{
    position: absolute;
}
</style>
<template>
  <div class="mftcc-form-item">
    <template v-for="(group,index) in props.group">
      <el-col
        :key="index + 'field'"
        :span="Math.floor((24-((props.group.length-1)*2))/props.group.length)"
      >
      <template v-if="designer === true">
        <form-item
          v-model="group.value"
          v-bind="{props:group}"
          :class="{'is-helper':showHelper===group, 'is-select':editField===group}"
          :designer="designer"
          @mouseenter.native="handleMouseEnter(group)"
          @mouseleave.native="handleMouseLeave(group)"
          @click.native.stop="handleClick(group)"
        >
          <div slot="widgets-tools" class="group-tools">
            <i class="el-icon-circle-plus-outline" @click="addRow(index)"></i>
            <i class="el-icon-remove-outline" @click="delRow(index)"></i>
          </div>
        </form-item>
      </template>
      <template v-else>
        <form-item
          v-model="value"
          v-bind="{props:group}"
          :designer="designer"
        >
        </form-item>
      </template>  
      </el-col>
      <el-col
        v-if="index !== (props.group.length-1)"
        :key="index + 'line'"
        :span="2"
        style="text-align: center;"
      >{{ isEmpty(props.separator)?'-':props.separator }}</el-col>
    </template>
  </div>
</template>
<script>
import formUtil from "../../utils/formUtil";
export default {
  data() {
    return {
      showHelper: null,
      editField: null,
      isEmpty: formUtil.isEmpty,
      groupItem: {}
    };
  },
  model: {
    prop: "value", //值可以随意命名
    event: "returnBack" //方法也可以随意命名
  },
  props: {
    value:{},
    designer: {
      type: Boolean,
      default() {
        return false;
      }
    },
    props: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  methods: {
    handleMouseEnter(item) {
      if (this.$dragula.dragging) return;
      this.showHelper = item;
    },
    handleMouseLeave(item) {
      this.showHelper = null;
    },
    handleClick(item) {
      this.editField = item;
      this.$store.commit("set_editField", item);
    },
    addRow(index) {
      let groupItem = Object.assign({}, this.groupItem);
      this.props.group.splice(index + 1, 0, groupItem);
    },
    delRow(index) {
      this.props.group.splice(index, 1);
    }
  },
  created() {
    this.groupItem = Object.assign({}, this.props.group[0]);
  }
};
</script>
<style scoped>
.group-tools {
  position: absolute;
  right: 0px;
  top: 0px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.group-tools i {
  margin: 3px 0px;
}
</style>
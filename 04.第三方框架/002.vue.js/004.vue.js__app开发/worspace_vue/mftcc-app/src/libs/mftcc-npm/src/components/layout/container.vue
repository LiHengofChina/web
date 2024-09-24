<template>
  <el-card
    shadow="never"
    :class="{
      'mftcc-card': true,
      isAutoHeight: props.isAutoHeight === true,
      isDesigner: isDesigner,
    }"
    :style="
      'height:' +
      props.height +
      'px;min-height:' +
      props.minHeight +
      'px;max-height:' +
      props.maxHeight +
      'px;'
    "
  >
    <div
      class="layout-page-item container"
      :style="
        'padding:' +
        props.paddingTop +
        'px ' +
        props.paddingRight +
        'px ' +
        props.paddingBottom +
        'px ' +
        props.paddingLeft +
        'px'
      "
    >
      <template v-for="(cell, cellIndex) in props.content">
        <layout-item
          v-if="isDesigner"
          :key="cell.uuid"
          :props="cell"
          :isDesigner="true"
          :class="{
            'is-helper': showHelper === cell.uuid,
            'is-select': editField === cell.uuid,
          }"
          :style="'margin:0 0 ' + props.rowSpan + 'px 0'"
          @mouseenter.native="handleMouseEnter(cell)"
          @mouseleave.native="handleMouseLeave()"
          @click.native.stop="handleClick(cell)"
        >
          <div slot="widgets-tools" class="widgets-tools">
            <i
              v-if="showHelper === cell.uuid"
              class="el-icon-delete"
              @click.stop="delLayout(cellIndex)"
            ></i>
          </div>
        </layout-item>
        <layout-item
          v-else-if="layoutItemShow(cell)"
          :style="'margin:0 0 ' + props.rowSpan + 'px 0'"
          :key="cell.uuid"
          :props="cell"
          :isPreview="isPreview"
          :paramData="paramData"
          :parentVm="parentVm"
          :cells="props.content"
        ></layout-item>
      </template>
    </div>
  </el-card>
</template>
<script>
export default {
  data() {
    return {
      showHelper: null,
    };
  },
  props: {
    props: {
      type: Object,
      default() {
        return {};
      },
    },
    parentVm: {
      type: Object,
      required: true,
    },
    isPreview: Boolean,
    paramData: {
      type: Object,
      default: function () {
        return {};
      },
    },
    isDesigner: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    editField() {
      if (this.$store.getters.editField) {
        return this.$store.getters.editField.uuid;
      }
      return null;
    },
  },
  created() {
    for (let cell of this.props.content) {
      cell.preview = true;
    }
  },
  methods: {
    layoutItemShow(cell) {
      let btnFlag = this.$hasPerm(cell.perm || true);
      if (btnFlag && cell.showField) {
        if (this.paramData[cell.showField] === false) {
          btnFlag = false;
        }
      }
      return btnFlag;
    },
    handleMouseEnter(item) {
      if (this.$dragula.dragging) return;
      this.showHelper = item.uuid;
    },
    handleMouseLeave() {
      this.showHelper = null;
    },
    handleClick(item) {
      this.$store.commit("set_editField", item);
    },
    delLayout(index) {
      this.props.content.splice(index, 1);
    },
  },
};
</script>
<style>
.isAutoHeight {
  height: unset !important;
  min-height: unset !important;
  max-height: unset !important;
}
.mftcc-card.isDesigner {
  padding: 10px;
  background-image: -webkit-gradient(
    linear,
    0 0,
    100% 100%,
    color-stop(0.25, rgba(0, 0, 0, 0.08)),
    color-stop(0.25, transparent),
    color-stop(0.5, transparent),
    color-stop(0.5, rgba(0, 0, 0, 0.08)),
    color-stop(0.75, rgba(0, 0, 0, 0.08)),
    color-stop(0.75, transparent),
    to(transparent)
  );
  background-size: 20px 20px;
}
</style>

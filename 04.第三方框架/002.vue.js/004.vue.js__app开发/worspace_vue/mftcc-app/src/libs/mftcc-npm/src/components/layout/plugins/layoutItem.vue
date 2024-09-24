<template>
  <div class="mftcc-layout-item">
    <component
      :is="type"
      :props="props"
      :parentVm="parentVm"
      :isPreview="isPreview"
      :isDesigner="isDesigner"
      :paramData="paramData"
      :cells="cells"
    >
    </component>
    <slot name="widgets-tools"></slot>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  computed: {
    type() {
      let tt = this.$Component[this.props.type];
      return tt;
    },
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
    cells: {
      type: Object,
      default: [],
    },
  },
  created() {
    // debugger;
  },
  methods: {},
};
</script>

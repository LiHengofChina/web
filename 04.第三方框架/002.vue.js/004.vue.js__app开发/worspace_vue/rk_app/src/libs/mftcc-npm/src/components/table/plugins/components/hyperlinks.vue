<template>
  <a
    v-if="col.href.path"
    href="javascript:void(0)"
    @click="link(col.href, scope.row)"
    >{{ tableFormatter(scope.row[col.prop], col) }}</a
  >
  <a
    v-else-if="col.href.callbackType"
    href="javascript:void(0)"
    @click="Fn(col.href.callbackType, scope.$index, scope.row)"
    >{{ tableFormatter(scope.row[col.prop], col) }}</a
  >
  <span v-else>{{ tableFormatter(scope.row[col.prop], col) }}</span>
</template>

<script>
export default {
  data() {
    return {};
  },
  inject: ["tableFormatter", "Fn"],
  props: {
    col: {
      type: Object,
      required: true
    },
    scope: {
      type: Object,
      required: true
    }
  },
  methods: {
    link(href, row) {
      let path = href.path;
      let query = {};
      let queryArr = href.query.split(";");
      for (let queryStr of queryArr) {
        let arr = queryStr.split("-");
        let key = arr[0];
        let value = arr[1];
        if (value.startsWith("${")) {
          value = value.substring(2, value.length - 1);
        }
        query[key] = row[value];
      }
      this.$router.push({ path: path, query: query });
    }
  }
};
</script>

<style></style>

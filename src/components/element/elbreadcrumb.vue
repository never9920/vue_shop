<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item v-for="item in breadcrumb" :key="item.title">
      <router-link v-if="item.path" :to="{ path: item.path }"
        >{{ item.title }}
      </router-link>
      <span v-else>{{ item.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name: "elbreadcrumb",
  props: {
    breadcrumb: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
    };
  },
  components: {},

  computed: {},

  methods: {}
}

</script>
<style scoped>
</style>
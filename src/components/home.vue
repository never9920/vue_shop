<template>
  <div>
    <el-button @click="tui" type="info">退出</el-button>
  </div>
</template>

<script>
export default {
  name: "home",
  data () {
    return {
    };
  },

  components: {},

  computed: {},

  methods: {
    tui () {
      window.sessionStorage.clear();
      this.$router.push('/login')
    }
  }
}

</script>
<style scoped>
</style>
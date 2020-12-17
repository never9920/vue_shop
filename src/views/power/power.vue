<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="rights" border style="width: 100%" stripe>
        <el-table-column type="index" label="序号" width="80px">
        </el-table-column>
        <el-table-column label="权限名称" width="180px" prop="authName">
        </el-table-column>
        <el-table-column label="路径" width="180px" prop="path">
        </el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template v-slot="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'">
              二级
            </el-tag>
            <el-tag type="warning" v-else-if="scope.row.level === '2'">
              三级
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { listgget } from '../../network/power'
export default {
  name: "power",
  data () {
    return {
      rights: []
    };
  },
  created () {
    this.getpower()
  },
  components: {},

  computed: {},

  methods: {
    async getpower () {
      const res = await listgget()
      if (res.meta.status !== 200) {
        return this.$messagge.error('获取权限失败');
      }
      this.rights = res.data
    }
  }
}

</script>
<style scoped>
</style>
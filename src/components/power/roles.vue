<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="roles" border style="width: 100%" stripe>
        <el-table-column type="expand" width="80px" label="权限">
          <template v-slot="scope">
            <el-row
              v-for="(item1, id) in scope.row.children"
              :key="item1.id"
              :class="['bd', id === 0 ? 'bdtop' : '', 'vcenter']"
            >
              <el-col :span="6">
                <el-tag closable @close="remove3(scope.row, item1.id)">
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="18">
                <el-row
                  v-for="(item2, id2) in item1.children"
                  :key="item2.id"
                  :class="[id2 === 0 ? '' : 'bdtop', 'vcenter']"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="remove3(scope.row, item2.id)"
                    >
                      {{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="remove3(scope.row, item3.id)"
                      >{{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" width="80px">
        </el-table-column>
        <el-table-column label="角色名称" prop="roleName"> </el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"> </el-table-column>
        <el-table-column label="操作" width="300px">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">
              搜索
            </el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">
              删除
            </el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showrights(scope.row)"
            >
              分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      title="分配权限"
      :visible.sync="rightsvis"
      width="70%"
      @close="reset"
    >
      <el-tree
        :data="rights"
        show-checkbox
        node-key="id"
        :props="treeprop"
        default-expand-all
        :default-checked-keys="defselect"
        ref="tree"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rightsvis = false">取 消</el-button>
        <el-button type="primary" @click="addrights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "roles",
  data () {
    return {
      roles: [],
      rightsvis: false,
      rights: [],
      treeprop: {
        label: 'authName',
        children: 'children'
      },
      defselect: [],
      roleid: ''
    }
  },
  created () {
    this.getroles()
  },
  components: {},

  computed: {},

  methods: {
    async getroles () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$messagge.error('获取角色失败');
      }
      this.roles = res.data
      //console.log(this.roles)
    },
    async remove3 (role, id) {
      const confirmres = await this.$confirm('此操作将删除该用户权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmres !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      //console.log(role, id)
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${id}`)
      //console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败')
      }
      this.$message.success('删除权限成功')
      role.children = res.data
    },
    async showrights (role) {
      this.roleid = role.id
      //console.log(role)
      const { data: res } = await this.$http.get('rights/tree')
      //console.log(res)
      if (res.meta.status !== 200) {
        return this.$messagge.error('获取权限失败');
      }
      this.rights = res.data
      //console.log(this.rights)
      this.getrights(role, this.defselect)
      this.rightsvis = true
    },
    getrights (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getrights(item, arr)
      });
    },
    reset () {
      this.defselect = []
    },
    async addrights () {
      const keys = [
        ...this.$refs.tree.getCheckedKeys(),
        ...this.$refs.tree.getHalfCheckedKeys()
      ]
      //console.log(keys)
      const idstr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleid}/rights`, { rids: idstr })
      if (res.meta.status !== 200) {
        return this.$messagge.error('更改失败');
      }
      this.$message.success('更改成功')
      this.getroles()
      this.rightsvis = false
    }
  }
}

</script>
<style scoped>
.el-tag {
  margin: 15px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bd {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
.el-table {
  margin-top: 25px;
}
</style>
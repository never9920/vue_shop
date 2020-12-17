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
          <el-button type="primary" @click="addrolevis = true">
            添加角色
          </el-button>
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
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editroles(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteroles(scope.row)"
            >
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
    <el-dialog
      title="添加角色"
      :visible.sync="addrolevis"
      width="70%"
      @close="rolereset"
    >
      <el-form
        ref="roleref"
        label-width="80px"
        :model="rolesform"
        :rules="rolesrules"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="rolesform.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="rolesform.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addrolevis = false">取 消</el-button>
        <el-button type="primary" @click="checkroles">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改角色数据"
      :visible.sync="editrolevis"
      width="70%"
      @close="editrolereset"
    >
      <el-form
        ref="editrolesref"
        label-width="80px"
        :model="rolesdata"
        :rules="rolesrules"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="rolesdata.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="rolesdata.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editrolevis = false">取 消</el-button>
        <el-button type="primary" @click="editrolesfinish">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { rolesget, rolesdelete, treeget, rolespostid, rolespost, rolesgetid, rolesputid, rolesdeleteid } from '../../network/power'
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
      roleid: '',
      rolesform: {
        roleName: '',
        roleDesc: ''
      },
      addrolevis: false,
      rolesrules: {
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
      },
      rolesdata: {},
      editrolevis: false
    }
  },
  created () {
    this.getroles()
  },
  components: {},

  computed: {},

  methods: {
    async getroles () {
      const res = await rolesget()
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
      const res = await rolesdelete(role.id, id)
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
      const res = await treeget()
      //console.log(res)
      if (res.meta.status !== 200) {
        return this.$messagge.error('获取权限失败');
      }
      this.rights = res.data
      //console.log(this.rights)
      this.getrights(role, this.defselect)
      this.rightsvis = true
      //console.log(this.roleid)
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
      const res = await rolespostid(this.roleid, { rids: idstr })
      if (res.meta.status !== 200) {
        return this.$messagge.error('更改失败');
      }
      this.$message.success('更改成功')
      this.getroles()
      this.rightsvis = false
    },
    rolereset () {
      this.$refs.roleref.resetFields()
      this.rolesform.roleName = ''
      this.rolesform.roleDesc = ''
    },
    /*async checkroles () {
      const res = await this.$http.post(`roles`, this.rolesform)
      if (res.meta.status !== 201) {
        return this.$message.error('添加角色失败')
      }
      this.$message.success('添加角色成功')
      this.addrolevis = false
      this.getroles()
    }*/
    checkroles () {
      this.$refs.roleref.validate(async valid => {
        if (!valid) return
        const res = await rolespost(this.rolesform)
        if (res.meta.status !== 201) {
          this.$message.error('添加失败')
        }
        this.$message.success('添加用户成功')
        this.addrolevis = false
        this.getroles()
      })
    },
    async editroles (item) {
      //this.editrolevis = true
      this.roleid = item.id
      const res = await rolesgetid(this.roleid)
      //console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色失败');
      }
      this.rolesdata = res.data
      //console.log(this.rights)
      this.editrolevis = true
      //console.log(this.rolesdata, this.roleid)
    },
    editrolereset () {
      this.$refs.editrolesref.resetFields()
    },
    editrolesfinish () {
      this.$refs.editrolesref.validate(async valid => {
        if (!valid) return
        //console.log(this.rolesdata)
        const res = await rolesputid(this.rolesdata.roleId, {
          roleName: this.rolesdata.roleName,
          roleDesc: this.rolesdata.roleDesc
        })
        //console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('修改角色失败');
        }
        this.$message.success('修改角色成功')
        this.editrolevis = false
        this.getroles()
      })
    },
    async deleteroles (item) {
      //console.log(item)
      const confirmres = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmres !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const res = await rolesdeleteid(item.id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除角色失败');
      }
      this.$message.success('删除角色成功')
      this.getroles()
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
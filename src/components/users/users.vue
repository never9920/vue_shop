<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-input
            placeholder="搜索用户"
            v-model="userslist.query"
            clearable
            @clear="getusers"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getusers"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="dialogVisible = true">
            添加用户
          </el-button>
        </el-col>
      </el-row>
      <el-table :data="users" border style="width: 100%" stripe>
        <el-table-column type="index" label="序号" width="80px">
        </el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column label="状态">
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.mg_state"
              inactive-color="#ff4949"
              @change="userstatus(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showmes(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="openwarn(scope.row.id)"
            ></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-share"
                size="mini"
                @click="distrib(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="userslist.pagenum"
        :page-sizes="[2, 4, 6, 8]"
        :page-size="userslist.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="50%"
      @close="diaclose"
    >
      <el-form
        ref="addref"
        label-width="70px"
        :model="addform"
        :rules="addrules"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addform.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addform.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addform.mobile"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addform.password" type="password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="adduser"> 确 定 </el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改用户信息"
      :visible.sync="editvis"
      width="50%"
      @close="editclose"
    >
      <el-form
        ref="editref"
        label-width="70px"
        :model="editform"
        :rules="editrules"
      >
        <el-form-item label="用户名">
          <el-input v-model="editform.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editform.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editform.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editvis = false">取 消</el-button>
        <el-button type="primary" @click="edituser">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="分配角色"
      :visible.sync="rolesvis"
      width="50%"
      @close="setclose"
    >
      <div>
        <p>当前用户：{{ roles.username }}</p>
        <p>当前角色：{{ roles.role_name }}</p>
        <p>
          分配角色：
          <el-select v-model="selectroles" placeholder="请选择">
            <el-option
              v-for="item in rolelist"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rolesvis = false">取 消</el-button>
        <el-button type="primary" @click="changeroles">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "users",
  data () {
    /*var checkemail = (rule, value, cb) => {
      const regmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regmail.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法邮箱'))
    };
    var checkmobile = (rule, value, cb) => {
      const regmobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regmobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法号码'))
    }*/
    return {
      userslist: {
        query: '',
        pagenum: 1,
        pagesize: 4
      },
      users: [],
      total: 0,
      dialogVisible: false,
      addform: {
        username: '',
        email: '',
        mobile: '',
        password: '',
      },
      addrules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在3到10个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在6到16个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: this.checkemail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          { validator: this.checkmobile, trigger: 'blur' }
        ]
      },
      editvis: false,
      editform: {},
      editrules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: this.checkemail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          { validator: this.checkmobile, trigger: 'blur' }
        ]
      },
      rolesvis: false,
      roles: {},
      rolelist: [],
      selectroles: ''
    };
  },
  created () {
    this.getusers()
  },

  components: {},

  computed: {},

  methods: {
    async getusers () {
      const { data: res } = await this.$http.get('users', {
        params: this.userslist
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户失败！')
      }
      this.users = res.data.users
      this.total = res.data.total
      //console.log(res)
    },
    handleSizeChange (valsize) {
      this.userslist.pagesize = valsize
      this.getusers()
    },
    handleCurrentChange (valnum) {
      this.userslist.pagenum = valnum
      this.getusers()
    },
    async userstatus (value) {
      //console.log(value)
      const { data: res } = await this.$http.put(`users/${value.id}/state/${value.mg_state}`)
      if (res.meta.status !== 200) {
        value.mg_state = !value.mg_state
        return this.$message.error('更新失败')
      }
      this.$message.success('更改成功')
    },
    checkemail (rule, value, cb) {
      const regmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regmail.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法邮箱'))
    },
    checkmobile (rule, value, cb) {
      const regmobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regmobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法号码'))
    },
    diaclose () {
      this.$refs.addref.resetFields()
    },
    adduser () {
      this.$refs.addref.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('users', this.addform)
        if (res.meta.status !== 201) {
          this.$message.error('添加失败')
        }
        this.$message.success('添加用户成功')
        this.dialogVisible = false
        this.getusers()
      })
    },
    async showmes (id) {
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询失败')
      }
      //console.log(res.data)
      this.editform = res.data
      this.editvis = true
    },
    editclose () {
      this.$refs.editref.resetFields()
    },
    edituser () {
      this.$refs.editref.validate(async valid => {
        if (!valid) return this.$message.error('请填写需要修改的数据')
        const { data: res } = await this.$http.put('users/' + this.editform.id, {
          email: this.editform.email,
          mobile: this.editform.mobile
        })
        if (res.meta.status !== 200) {
          this.$message.error('修改失败')
        }
        this.editvis = false
        this.getusers()
        this.$message.success('修改信息成功成功')
      })
    },
    async openwarn (id) {
      const confirmres = await this.$confirm('此操作将永久删除该用户号, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmres !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除用户成功')
      this.getusers()
    },
    async distrib (roles) {
      this.roles = roles
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status != 200) {
        this.$message.error('获取角色列表失败')
      }
      this.rolelist = res.data
      this.rolesvis = true
      //console.log(this.rolelist)
    },
    async changeroles () {
      //console.log(this.selectroles)
      if (!this.selectroles) {
        return this.$message.error('请选择要改的角色')
      }
      const { data: res } = await this.$http.put(`users/${this.roles.id}/role`, { rid: this.selectroles })
      //console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('更新角色失败')
      }
      //console.log(res.data)
      this.$message.success('更新角色成功')
      this.getusers()
      this.rolesvis = false
    },
    setclose () {
      this.roles = {}
      this.selectroles = ''
    }
  }
}

</script>
<style scoped>
.el-table {
  margin-top: 25px;
  font-size: 15px;
  text-align: center;
}
</style>
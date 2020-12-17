<template>
  <div>
    <elbreadcrumb :breadcrumb="breadcrumb"></elbreadcrumb>
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
      <eltable :tabledata="users" :tabletopdata="tabletopdata"></eltable>
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
    <eldialog
      :title="stitle"
      :visible="dialogVisible"
      :models="addform"
      :formrules="addrules"
      :formitem="additem"
      ref="adddia"
      @postthing="adduser"
      @reset="diaclose"
    >
    </eldialog>
    <eldialog
      :title="title1"
      :visible="editvis"
      :models="editform"
      :formrules="addrules"
      :formitem="edititem"
      ref="editref"
      @postthing="edituser"
      @reset="editclose"
    >
    </eldialog>
    <eldialog
      :title="title2"
      :visible="rolesvis"
      ref="rolesref"
      @postthing="changeroles"
      @reset="rolesclose"
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
    </eldialog>
  </div>
</template>

<script>
import { usersget, usersputstate, userspost, usersgetid, usersputid, usersdelete, rolesget, usersrolesput } from '../../network/users'
import elbreadcrumb from '../../components/element/elbreadcrumb'
import eltable from '../../components/element/eltable'
import eldialog from '../../components/element/eldialog'
export default {
  name: "users",
  data () {
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
      rolesvis: false,
      roles: {},
      rolelist: [],
      selectroles: '',
      edititem: [
        { type: 'input', label: "用户名", prop: "username", disabled: true },
        { type: 'input', label: "邮箱", prop: "email" },
        { type: 'input', label: "电话", prop: "mobile" }
      ],
      breadcrumb: [
        { title: "首页", path: '/home' }, { title: "用户管理" },
        { title: "用户列表" }
      ],
      tabletopdata: [
        { type: 'index', label: "序号", width: "80px" },
        { label: "姓名", prop: "username" },
        { label: "邮箱", prop: "email" },
        { label: "电话", prop: "mobile" },
        { label: "角色", prop: "role_name" },
        { change: "switch", label: "状态", prop: "role_name", switch: (value) => this.userstatus(value) },
        {
          change: "button", label: "操作", width: "180px", child: [
            { btns: "primary", icon: "el-icon-edit", buttons: (value) => this.showmes(value) },
            { btns: "danger", icon: "el-icon-delete", buttons: (value) => this.openwarn(value) },
            { btns: "warning", icon: "el-icon-share", buttons: (value) => this.distrib(value) }]
        }
      ],
      additem: [
        { type: 'input', label: "用户名", prop: "username" },
        { type: 'input', label: "邮箱", prop: "email" },
        { type: 'input', label: "电话", prop: "mobile" },
        { type: 'input', label: "密码", prop: "password", inputtype: "password" }
      ],
      stitle: '添加用户',
      title1: '修改用户信息',
      title2: '分配角色',
    };
  },
  created () {
    this.getusers()
  },

  components: {
    elbreadcrumb,
    eltable,
    eldialog
  },

  computed: {},

  methods: {
    async getusers () {
      const res = await usersget(this.userslist)
      //console.log(res)
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
      const res = await usersputstate(value.id, value.mg_state)
      //console.log(res)
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
      this.$refs.adddia.$refs.formref.resetFields()
      this.dialogVisible = false
      //this.$refs.addref.resetFields()
    },
    async adduser () {
      let i = this.$refs.adddia.$refs.formref.validate()
      if (i) {
        const res = await userspost(this.addform)
        //console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error('添加失败')
        }
        this.$message.success('添加用户成功')
        this.dialogVisible = false
        this.getusers()
      }
    },
    async showmes (value) {
      //console.log(usersgetid(id))
      const res = await usersgetid(value.id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询失败')
      }
      //console.log(res.data)
      this.editform = res.data
      this.editvis = true
    },
    editclose () {
      this.editvis = false
      this.$refs.editref.$refs.formref.resetFields()
    },
    async edituser () {
      let flag = this.$refs.editref.$refs.formref.validate()
      if (flag) {
        const res = await usersputid(this.editform.id, this.editform)
        if (res.meta.status !== 200) {
          this.$message.error('修改失败')
        }
        this.editvis = false
        this.getusers()
        this.$message.success('修改信息成功成功')
      }
    },
    async openwarn (value) {
      const confirmres = await this.$confirm('此操作将永久删除该用户号, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmres !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const res = await usersdelete(value.id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除用户成功')
      this.getusers()
    },
    async distrib (roles) {
      this.roles = roles
      //console.log(this.roles)
      const res = await rolesget()
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
      const res = await usersrolesput(this.roles.id, { rid: this.selectroles })
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
    },
    rolesclose () {
      //this.$refs.rolesref.$refs.formref.resetFields()
      this.rolesvis = false
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
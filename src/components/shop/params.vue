<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        :closable="false"
        show-icon
      >
      </el-alert>
      <el-row class="row">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="selected"
            :options="paramslist"
            :props="paramsprop"
            @change="selectparams"
          ></el-cascader>
        </el-col>
      </el-row>
      <template>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="动态参数" name="many">
            <el-button type="primary" :disabled="isbtn" @click="showadd">
              添加参数
            </el-button>
            <el-table :data="showmanytag" border stripe>
              <el-table-column type="expand">
                <template v-slot="scope">
                  <el-tag
                    v-for="(item, i) in scope.row.attr_vals"
                    :key="i"
                    closable
                    @close="tagdelete(i, scope.row)"
                  >
                    {{ item }}
                  </el-tag>
                  <el-input
                    v-if="scope.row.tagvis"
                    v-model="scope.row.addtag"
                    ref="addtagref"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                    class="input-new-tag"
                    size="small"
                  >
                  </el-input>
                  <el-button
                    v-else
                    class="button-new-tag"
                    @click="showInput(scope.row)"
                    size="small"
                  >
                    + New Tag
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column
                type="index"
                label="序号"
                width="50px"
              ></el-table-column>
              <el-table-column
                label="参数名称"
                prop="attr_name"
              ></el-table-column>
              <el-table-column label="操作">
                <template v-slot="scope">
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    size="mini"
                    @click="showedit(scope.row.attr_id)"
                  >
                    编辑
                  </el-button>
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    @click="remove(scope.row.attr_id)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="静态属性" name="only">
            <el-button type="primary" :disabled="isbtn" @click="showadd">
              添加属性
            </el-button>
            <el-table :data="showonlytag" border stripe>
              <el-table-column type="expand">
                <template v-slot="scope">
                  <el-tag
                    v-for="(item, i) in scope.row.attr_vals"
                    :key="i"
                    closable
                    @close="tagdelete(i, scope.row)"
                  >
                    {{ item }}
                  </el-tag>
                  <el-input
                    v-if="scope.row.tagvis"
                    v-model="scope.row.addtag"
                    ref="addtagref"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                    class="input-new-tag"
                    size="small"
                  >
                  </el-input>
                  <el-button
                    v-else
                    class="button-new-tag"
                    @click="showInput(scope.row)"
                    size="small"
                  >
                    + New Tag
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column
                type="index"
                label="序号"
                width="50px"
              ></el-table-column>
              <el-table-column
                label="参数名称"
                prop="attr_name"
              ></el-table-column>
              <el-table-column label="操作">
                <template v-slot="scope">
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    size="mini"
                    @click="showedit(scope.row.attr_id)"
                  >
                    编辑
                  </el-button>
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    @click="remove(scope.row.attr_id)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </template>
    </el-card>
    <el-dialog
      :title="'添加' + titletext"
      :visible.sync="addvis"
      width="70%"
      @close="addclose"
    >
      <el-form
        :model="addform"
        :rules="addrules"
        ref="addref"
        label-width="100px"
      >
        <el-form-item :label="titletext" prop="attr_name">
          <el-input v-model="addform.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addvis = false">取 消</el-button>
        <el-button type="primary" @click="addparams">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="'修改' + titletext"
      :visible.sync="editvis"
      width="70%"
      @close="editclose"
    >
      <el-form
        :model="editform"
        :rules="editrules"
        ref="editref"
        label-width="100px"
      >
        <el-form-item :label="titletext" prop="attr_name">
          <el-input v-model="editform.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editvis = false">取 消</el-button>
        <el-button type="primary" @click="editparams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "params",
  data () {
    return {
      paramslist: [],
      paramsprop: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selected: [],
      activeName: "many",
      showmanytag: [],
      showonlytag: [],
      addvis: false,
      addform: {
        attr_name: ''
      },
      addrules: {
        attr_name: [{ required: true, triggle: 'blur', message: '请输入参数名称' }]
      },
      editvis: false,
      editform: {
        attr_name: ''
      },
      editrules: {
        attr_name: [{ required: true, triggle: 'blur', message: '请输入参数名称' }]
      },
    };
  },
  created () {
    this.getparams()
  },
  components: {},

  computed: {
    isbtn () {
      if (this.selected.length !== 3) {
        return true
      }
      return false
    },
    cateid () {
      if (this.selected.length === 3) {
        return this.selected[2]
      }
      return null
    },
    titletext () {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  },

  methods: {
    async getparams () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.paramslist = res.data
      //console.log(this.paramslist)
    },
    async selectparams () {
      //console.log(this.selected)
      //console.log(this.selected)
      //console.log(typeof (this.selected))
      this.getparamslist()
    },
    handleClick () {
      this.getparamslist()
    },
    async getparamslist () {
      if (this.selected.length !== 3) {
        this.selected = []
        this.showmanytag = []
        this.showonlytag = []
        return
      }
      const { data: res } = await this.$http.get(`categories/${this.cateid}/attributes`, { params: { sel: this.activeName } })
      if (res.meta.status !== 200) {
        return this.$message.error('加载数据失败')
      }
      //this.showtag = res.data
      //console.log(this.showtag)
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.tagvis = false
        item.addtag = ''
      });
      //console.log(res.data)
      if (this.activeName === "many") {
        this.showmanytag = res.data
      } else {
        this.showonlytag = res.data
      }
    },
    showadd () {
      this.addvis = true
    },
    addclose () {
      this.$refs.addref.resetFields()
    },
    addparams () {
      this.$refs.addref.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(`categories/${this.cateid}/attributes`, {
          attr_name: this.addform.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 201) {
          return this.$message.error('添加参数失败')
        }
        this.$message.success('添加参数成功')
        this.addvis = false
        this.getparamslist()
      })
    },
    editparams () {
      this.$refs.editref.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(`categories/${this.cateid}/attributes/${this.editform.attr_id}`, {
          attr_name: this.editform.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 200) {
          return this.$message.error('添加参数失败')
        }
        this.$message.success('添加参数成功')
        this.editvis = false
        this.getparamslist()
      })
    },
    editclose () {
      this.$refs.editref.resetFields()
    },
    async showedit (id) {
      const { data: res } = await this.$http.get(`categories/${this.cateid}/attributes/${id}`, { params: { id: this.activeName } })
      if (res.meta.status !== 200) {
        this.$message.error('添加参数失败')
      }
      this.editform = res.data
      this.editvis = true
    },
    async remove (id) {
      const confirmres = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err);
      if (confirmres !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete(`categories/${this.cateid}/attributes/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      this.getparamslist()
    },
    async handleInputConfirm (item) {
      if (item.addtag.trim().length === 0) {
        item.addtag = ''
        item.tagvis = false
        return
      }
      item.attr_vals.push(item.addtag.trim())
      item.addtag = ''
      item.tagvis = false
      this.edittag(item)
    },
    showInput (item) {
      item.tagvis = true
      //nextTick当页面上元素重新渲染后调用
      this.$nextTick(_ => {
        this.$refs.addtagref.$refs.input.focus();
      });
    },
    tagdelete (i, item) {
      item.attr_vals.splice(i, 1)
      this.edittag(item)
    },
    async edittag (item) {
      const { data: res } = await this.$http.put(`categories/${this.cateid}/attributes/${item.attr_id}`, {
        attr_name: item.attr_name,
        attr_sel: item.attr_sel,
        attr_vals: item.attr_vals.join(' ')
      })
      if (res.meta.status !== 200) {
        return this.$message.error('修改失败')
      }
      this.$message.success('修改成功')
    }
  }
}


</script>
<style scoped>
.row {
  margin: 15px 0px;
}
.el-table {
  margin-top: 15px;
}
.el-tag {
  margin: 5px;
}
.input-new-tag {
  width: 100px;
}
</style>
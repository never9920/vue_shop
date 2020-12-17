<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showcart">添加分类</el-button>
        </el-col>
      </el-row>
      <tree-table
        :data="cartlist"
        :columns="columns"
        border
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="序号"
        :show-row-hover="false"
        class="tree"
      >
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            size="mini"
            type="danger"
            v-else-if="scope.row.cat_level === 1"
            >二级
          </el-tag>
          <el-tag
            size="mini"
            type="warning"
            v-else-if="scope.row.cat_level === 2"
          >
            三级
          </el-tag>
        </template>
        <template slot="opt" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="editcate(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deletecate(scope.row)"
          >
            删除
          </el-button>
        </template>
      </tree-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryinfo.pagenum"
        :page-sizes="[3, 5, 10, 20]"
        :page-size="queryinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <el-dialog
      title="添加分类"
      :visible.sync="addcart"
      width="50%"
      @close="addclose"
    >
      <el-form
        ref="addcartref"
        :model="addcartform"
        label-width="100px"
        :rules="addcartrules"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addcartform.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <el-cascader
            v-model="addlist"
            :options="cart"
            :props="addprops"
            @change="cartchange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addcart = false">取 消</el-button>
        <el-button type="primary" @click="addcartlist">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="添加分类"
      :visible.sync="editcart"
      width="50%"
      @close="editclose"
    >
      <el-form
        ref="editcartref"
        :model="editcartform"
        label-width="100px"
        :rules="addcartrules"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="editcartform.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editcart = false">取 消</el-button>
        <el-button type="primary" @click="editcartlist">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { categoriesgetparams, categoriespost, categoriesget_id, categoriesputid, categoriesdelete } from '../../network/shop'
export default {
  name: "categories",
  data () {
    return {
      cartlist: [],
      queryinfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: "cat_name"
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      addcart: false,
      addcartform: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
        //默认一级分类
      },
      addcartrules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      cart: [],
      addlist: [],
      addprops: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: 'true'
      },
      editcart: false,
      editcartform: {}
    }
  },
  created () {
    this.getcategories()
  },
  components: {},

  computed: {},

  methods: {
    async getcategories () {
      const res = await categoriesgetparams(this.queryinfo)
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品数据失败')
      }
      this.cartlist = res.data.result
      this.total = res.data.total
      //console.log(this.cartlist, this.total)
    },
    handleSizeChange (newsize) {
      this.queryinfo.pagesize = newsize
      this.getcategories()
    },
    handleCurrentChange (newnum) {
      this.queryinfo.pagenum = newnum
      this.getcategories()
    },
    showcart () {
      this.getcartlist()
      this.addcart = true;
    },
    addcartlist () {
      //console.log(this.addcartform)
      //this.addcart = false
      this.$refs.addcartref.validate(async valid => {
        if (!valid) return
        const res = await categoriespost(this.addcartform)
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败')
        }
        this.$message.success('添加分类成功')
        this.addcart = false
        this.getcategories()
      })
    },
    addclose () {
      this.addcartform.cat_pid = 0
      this.addcartform.cat_level = 0
      this.$refs.addcartref.resetFields()
      this.addlist = []
    },
    async getcartlist () {
      const res = await categoriesgetparams({ type: 2 })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级数据失败')
      }
      this.cart = res.data
    },
    cartchange () {
      //console.log(this.addlist)
      if (this.addlist.length > 0) {
        this.addcartform.cat_pid = this.addlist[this.addlist.length - 1]
        this.addcartform.cat_level = this.addlist.length
        return
      } else {
        this.addcartform.cat_pid = 0
        this.addcartform.cat_level = 0
      }
    },
    editclose () {
      this.$refs.editcartref.resetFields()
    },
    async editcate (item) {
      //this.editcart = true
      //console.log(item)
      const res = await categoriesget_id(item.cat_id)
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类名称失败')
      }
      this.editcartform = res.data
      this.editcart = true
    },
    editcartlist () {
      this.$refs.editcartref.validate(async valid => {
        if (!valid) return
        const res = await categoriesputid(this.editcartform.cat_id, this.editcartform)
        if (res.meta.status !== 200) {
          return this.$message.error('修改分类名称失败')
        }
        this.$message.success('修改分类名称成功')
        this.editcart = false
        this.getcategories()
      })
    },
    async deletecate (item) {
      const confirmres = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmres !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const res = await categoriesdelete(item.cat_id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除分类失败');
      }
      this.$message.success('删除分类成功')
      this.getcategories()
    }
  }
}

</script>
<style scoped>
.tree {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
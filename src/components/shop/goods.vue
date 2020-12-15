<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="goodslist.query"
            clearable
            @clear="getgoods"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getgoods"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goadd">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="goods" border style="width: 100%" stripe>
        <el-table-column type="index" label="序号" width="50px">
        </el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格（元）"
          width="200px"
        >
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="200px">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="180px">
          <template v-slot="scope">
            {{ scope.row.add_time | dataform }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showmes(scope.row.goods_id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="openwarn(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="goodslist.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="goodslist.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
    <el-dialog
      title="修改商品信息"
      :visible.sync="editgoodsvis"
      width="50%"
      @close="editgoodsclose"
    >
      <el-form
        ref="editgoodsref"
        label-width="100px"
        :model="editform"
        :rules="editrules"
      >
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editform.goods_name"> </el-input>
        </el-form-item>
        <el-form-item label="价格" prop="goods_price">
          <el-input v-model.number="editform.goods_price"> </el-input>
        </el-form-item>
        <el-form-item label="数量" prop="goods_number">
          <el-input v-model.number="editform.goods_number"> </el-input>
        </el-form-item>
        <el-form-item label="重量" prop="goods_weight">
          <el-input v-model.number="editform.goods_weight"> </el-input>
        </el-form-item>
        <el-form-item label="介绍" prop="goods_introduce">
          <el-input v-model="editform.goods_introduce"> </el-input>
        </el-form-item>
        <el-form-item label="商品分类" prop="goods_cat">
          <el-cascader
            v-model="editform.goods_cat"
            :options="cartlist"
            :props="paramsprop"
            @change="selectparams"
          >
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editgoodsvis = false">取 消</el-button>
        <el-button type="primary" @click="finishedit"> 确 定 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name: "goods",
  data () {
    return {
      goodslist: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      goods: [],
      total: 0,
      editgoodsvis: false,
      editrules: {
        goods_name: [{ required: true, message: '请输入商品名称', triggerr: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', triggerr: 'blur', type: 'number' }],
        goods_weight: [{ required: true, message: '请输入商品重量', triggerr: 'blur', type: 'number' }],
        goods_number: [{ required: true, message: '请输入商品数量', triggerr: 'blur', type: 'number' }],
        goods_cat: [{ required: true, message: '请选择商品分类', triggerr: 'blur', type: 'array' }]
      },
      editform: {
        goods_cat: []
      },
      paramsprop: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      cartlist: [],
    };
  },
  created () {
    this.getgoods(),
      this.showcategories()
  },
  components: {},

  computed: {},

  methods: {
    async showcategories () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品数据失败')
      }
      this.cartlist = res.data
      //console.log(this.cartlist)
    },
    async getgoods () {
      const { data: res } = await this.$http.get(`goods`, { params: this.goodslist })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      this.goods = res.data.goods
      this.total = res.data.total
      //console.log(this.goods)
    },
    handleSizeChange (newsize) {
      this.goodslist.pagesize = newsize
      this.getgoods()
    },
    handleCurrentChange (newpage) {
      this.goodslist.pagenum = newpage
      this.getgoods()
    },
    async openwarn (id) {
      //console.log(id)
      const confirmres = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmres !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete(`goods/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除商品成功')
      this.getgoods()
    },
    async showmes (id) {
      const { data: res } = await this.$http.get(`goods/` + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询失败')
      }
      this.editform = res.data
      this.editform.goods_introduce = this.removeTAG(this.editform.goods_introduce)
      this.editgoodsvis = true
      this.editform.goods_cat = this.editform.goods_cat.split(",")
      this.editform.goods_cat = this.editform.goods_cat.map(function (item, index, array) {
        return item - 0;
      });
      //console.log(typeof (this.editform.goods_cat), this.editform.goods_cat)
      //console.log(this.editform)
    },
    goadd () {
      this.$router.push('/goods/add')
    },
    editgoodsclose () {
      this.$refs.editgoodsref.resetFields()
      this.editform.goods_cat = []
      //his.editform.goods_price = 0
    },
    selectparams () {
      if (this.editform.goods_cat.length !== 3) {
        this.editform.goods_cat = []
      }
      //this.addform.goods_cat = this.addform.goods_cat.join(",")
      //console.log(this.editform.goods_cat)
    },
    removeTAG (str) {
      str = str.replace(/<[^>]+>/g, "");
      str = str.replace(/&nbsp;/g, "")
      return str
    },
    finishedit () {
      //this.editgoodsvis = false
      this.$refs.editgoodsref.validate(async valid => {
        if (!valid) return this.$message.error('请填写需要修改的数据')
        const form = _.cloneDeep(this.editform)
        form.goods_cat = form.goods_cat.join(',')
        //console.log(form)
        const { data: res } = await this.$http.put(`goods/` + form.goods_id, form)
        if (res.meta.status !== 200) {
          return this.$message.error('修改商品信息失败')
        }
        this.$message.success('修改商品信息成功')
        this.editgoodsvis = false
        this.getgoods()
      })
    }
  }
}

</script>
<style scoped>
.el-table {
  margin: 15px 0;
}
</style>
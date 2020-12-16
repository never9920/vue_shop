<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        show-icon
        :closable="false"
        center
      >
      </el-alert>
      <el-steps :active="page - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form
        :model="addform"
        :rules="addrules"
        ref="addref"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          :tab-position="'left'"
          v-model="page"
          :before-leave="brforetabs"
          @tab-click="tabclick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addform.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input
                v-model.number="addform.goods_price"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input
                v-model.number="addform.goods_weight"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input
                v-model.number="addform.goods_number"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addform.goods_cat"
                :options="cartlist"
                :props="paramsprop"
                @change="selectparams"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              v-for="item in manytabs"
              :label="item.attr_name"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="item1"
                  v-for="(item1, i) in item.attr_vals"
                  :key="i"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="item in onlytabs"
              :label="item.attr_name"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!--action：图片上传的api地址-->
            <el-upload
              :action="uploadurl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerobj"
              :on-success="successful"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addform.goods_introduce"></quill-editor>
            <el-button type="primary" class="btns" @click="finish">
              添加商品
            </el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <el-dialog title="图片预览" :visible.sync="previewvis" width="50%">
      <img :src="previewpath" alt="" class="image" />
    </el-dialog>
  </div>
</template>

<script>
import { categoriesget, categoriesgetid, goodspost } from '../../network/shop'
import _ from 'lodash'
export default {
  name: "add",
  data () {
    return {
      page: '0',
      addform: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      addrules: {
        goods_name: [{ required: true, message: '请输入商品名称', triggerr: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', triggerr: 'blur', type: 'number' }],
        goods_weight: [{ required: true, message: '请输入商品重量', triggerr: 'blur', type: 'number' }],
        goods_number: [{ required: true, message: '请输入商品数量', triggerr: 'blur', type: 'number' }],
        goods_cat: [{ required: true, message: '请选择商品分类', triggerr: 'blur', type: 'array' }]
      },
      cartlist: [],
      paramsprop: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      manytabs: [],
      onlytabs: [],
      uploadurl: 'https://www.liulongbin.top:8888/api/private/v1/upload',
      headerobj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewpath: '',
      previewvis: false
    };
  },
  created () {
    this.showcategories()
  },
  components: {},

  computed: {
    cateid () {
      if (this.addform.goods_cat.length === 3) {
        return this.addform.goods_cat[2]
      }
      return null
    }
  },

  methods: {
    async showcategories () {
      const res = await categoriesget()
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品数据失败')
      }
      this.cartlist = res.data
      //console.log(this.cartlist)
    },
    selectparams () {
      if (this.addform.goods_cat.length !== 3) {
        this.addform.goods_cat = []
      }
      //this.addform.goods_cat = this.addform.goods_cat.join(",")
      //console.log(this.addform.goods_cat)
    },
    brforetabs (ActiveName, oldActiveName) {
      //console.log(typeof (this.addform.goods_cat))
      //this.goods_cat = (this.addform.goods_cat).split(",")
      //this.addform.goods_cat = this.addform.goods_cat.split(',')
      //console.log(typeof (this.addform.goods_cat))
      //console.log(ActiveName, oldActiveName)
      //console.log(typeof (this.addform.goods_cat))
      if (oldActiveName === "0" && this.addform.goods_cat.length !== 3) {
        this.$message.error('请选择商品分类')
        return false
      }
    },
    async tabclick () {
      //console.log(this.page)
      if (this.page === '1') {
        //console.log(aaa)
        const res = await categoriesgetid(this.cateid, { sel: 'many' })
        if (res.meta.status !== 200) {
          return this.$message.error('获取参数失败')
        }
        res.data.forEach(item => {
          //return item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
          //console.log(item.attr_vals, typeof (item.attr_vals))
        });
        this.manytabs = res.data
        //console.log(typeof (this.manytabs[0].attr_vals))
      } else if (this.page === '2') {
        //console.log(aaa)
        const res = await categoriesgetid(this.cateid, { sel: 'only' })
        if (res.meta.status !== 200) {
          return this.$message.error('获取参数失败')
        }
        this.onlytabs = res.data
        //console.log(typeof (this.manytabs[0].attr_vals))
      }
    },
    handlePreview (file) {
      this.previewpath = file.response.data.url
      this.previewvis = true
    },
    handleRemove (file) {
      const filepath = file.response.data.tmp_path
      const i = this.addform.pics.findIndex(x => {
        x.pic === filepath
      })
      this.addform.pics.splice(i, 1)
      //console.log(this.addform)
    },
    successful (response) {
      //console.log(response)
      const picinfo = { pic: response.data.tmp_path }
      this.addform.pics.push(picinfo)
      //console.log(this.addform)
    },
    finish () {
      this.$refs.addref.validate(async valid => {
        if (!valid) return this.$message.error('请填写必要的表单项')
        const form = _.cloneDeep(this.addform)
        form.goods_cat = form.goods_cat.join(',')
        this.manytabs.forEach(item => {
          const newmany = { attr_id: item.attr_id, attr_value: item.attr_vals.join(' ') }
          form.attrs.push(newmany)
        })
        this.onlytabs.forEach(item => {
          const newonly = { attr_id: item.attr_id, attr_value: item.attr_vals }
          form.attrs.push(newonly)
        })
        /*form.goods_introduce = form.goods_introduce.Substring(0, form.goods_introduce.Length - 4)*/
        console.log(form)
        const res = await goodspost(form)
        console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error('提交失败')
        }
        this.$message.success('提交成功')
        this.$router.push('/goods')
      })
    }
  }
}

</script>
<style scoped>
.el-steps {
  margin: 15px 0;
}
.el-checkbox {
  margin-right: 5px;
}
.image {
  width: 100%;
}
.btns {
  margin-top: 15px;
}
</style>
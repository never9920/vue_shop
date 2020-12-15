<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input
            placeholder="请输入订单编号"
            v-model="orders.query"
            clearable
            @clear="getorders"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getorders"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderlist" border style="width: 100%" stripe>
        <el-table-column type="index" label="序号" width="60px">
        </el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="350px">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格"> </el-table-column>
        <el-table-column prop="pay_status" label="是否付款">
          <template v-slot="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">
              已付款
            </el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"> </el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template v-slot="scope">
            {{ scope.row.create_time | dataform }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showedit(scope.row.order_id)"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              @click="showlocation(scope.row.order_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="orders.pagenum"
        :page-sizes="[10, 15, 20, 25]"
        :page-size="orders.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <el-dialog
      title="修改订单信息"
      :visible.sync="changevis"
      width="50%"
      @close="changeclose"
    >
      <el-form
        ref="editorref"
        :model="editorders"
        label-width="100px"
        :rules="editrules"
      >
        <el-form-item label="订单编号">
          <el-input v-model="editorders.order_number" disabled></el-input>
        </el-form-item>
        <el-form-item label="是否付款" prop="pay_status">
          <el-cascader
            :options="statuspay"
            v-model="editorders.pay_status"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="是否发货" prop="is_send">
          <el-cascader
            :options="sended"
            v-model="editorders.is_send"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <el-form
        ref="editorref"
        :model="changeform"
        label-width="100px"
        :rules="changerules"
      >
        <el-form-item label="省市区/县" prop="address">
          <el-cascader
            :options="citydata"
            v-model="changeform.address"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="ress">
          <el-input v-model="changeform.ress"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changevis = false">取 消</el-button>
        <el-button type="primary" @click="editfinish">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="查询物流位置"
      :visible.sync="locationvis"
      width="50%"
      @close="locationclose"
    >
      <el-form ref="locationref" label-width="100px">
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in locationlist"
            :key="index"
            :timestamp="activity.time"
          >
            {{ activity.context }}
          </el-timeline-item>
        </el-timeline>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import citydata from './citydata'
export default {
  name: "orders",
  data () {
    return {
      orders: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      orderlist: [],
      changevis: false,
      changeform: {
        address: [],
        ress: ''
      },
      changerules: {
        address: [{ required: true, message: '请选择地区', trigger: 'blur', type: "array" }],
        ress: [{ required: true, message: '请填写地址', trigger: 'blur' }]
      },
      citydata,
      locationvis: false,
      locationlist: [],
      editorders: {},
      editrules: {
        pay_status: [{ required: true, message: '请选择是否付款', trigger: 'blur', type: "array" }],
        is_send: [{ required: true, message: '请选择是否发货', trigger: 'blur', type: "array" }],
      },
      statuspay: [
        {
          value: '0',
          label: '未付款'
        }, {
          value: '1',
          label: '已付款',
        }
      ],
      sended: [
        {
          value: '否',
          label: '未发货'
        }, {
          value: '是',
          label: '已经发货',
        }
      ]
    };
  },
  created () {
    this.getorders()
  },
  components: {},

  computed: {},

  methods: {
    async getorders () {
      //console.log(this.orders)
      const { data: res } = await this.$http.get(`orders`, { params: this.orders })
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表失败');
      }
      this.orderlist = res.data.goods
      this.total = res.data.total
      //console.log(res.data)
    },
    handleSizeChange (newsize) {
      this.orders.pagesize = newsize
      this.getorders()
    },
    handleCurrentChange (newnum) {
      this.orders.pagenum = newnum
      this.getorders()
    },
    changeclose () {
      this.$refs.editorref.resetFields()
    },
    async showlocation (id) {
      this.locationvis = true
      const { data: res } = await this.$http.get(`/kuaidi/` + id)
      if (res.meta.status !== 200) {
        return this.$message.error('获取物流信息失败')
      }
      this.locationlist = res.data
      //console.log(res.data)
      //804909574412544580
    },
    locationclose () {
      //this.$refs.locationref.resetFields()
      this.locationlist = []
    },
    editfinish () {
      this.$refs.editorref.validate(async valid => {
        if (!valid) return this.$message.error('请填写必要信息')
        const form = _.cloneDeep(this.editorders)
        if (typeof (form.pay_status) === 'object') {
          form.pay_status = form.pay_status.join(),
            form.is_send = form.is_send.join()
        }
        const { data: res } = await this.$http.put(`orders/` + form.order_id, form)
        if (res.meta.status !== 201) {
          return this.$message.error('修改订单信息失败')
        }
        this.changevis = false
        this.$message.success('修改订单信息成功')
        //console.log(form.is_send, typeof (form.is_send))
        //console.log(form.pay_status, typeof (form.pay_status))
      })
    },
    async showedit (id) {
      //console.log(id)
      const { data: res } = await this.$http.get(`orders/` + id)
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单信息失败')
      }
      this.changevis = true
      this.editorders = res.data
      //console.log(this.editorders)
      //console.log(this.editorders.is_send, typeof (this.editorders.is_send))
      //console.log(this.editorders.pay_status, typeof (this.editorders.pay_status))
    }
  }
}

</script>
<style scoped>
.el-table {
  margin: 15px 0;
}
.el-cascader {
  width: 100%;
}
</style>
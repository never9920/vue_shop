<template>
  <div>
    <elbreadcrumb :breadcrumb="breadcrumb"></elbreadcrumb>
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
      <eltable :tabledata="orderlist" :tabletopdata="tabletopdata"></eltable>
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
import eltable from '../../components/element/eltable'
import elbreadcrumb from '../../components/element/elbreadcrumb'
import { orderget, kuaidiget, ordersput, ordersgetid } from '../../network/orders'
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
        address: [{ required: true, message: '请选择地区', type: "array" }],
        ress: [{ required: true, message: '请填写地址', trigger: 'blur' }],
        pay_status: [{ required: true, message: '请选择是否付款', trigger: 'blur', type: "array" }],
        is_send: [{ required: true, message: '请选择是否发货', trigger: 'blur', type: "array" }],
      },
      citydata,
      locationvis: false,
      locationlist: [],
      editorders: {},
      editrules: {

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
      ],
      breadcrumb: [
        { title: "首页", path: '/home' }, { title: "订单管理" },
        { title: "订单列表" }
      ],
      tabletopdata: [
        { type: 'index', label: "序号", width: "80px" },
        { label: "订单编号", prop: "order_number" },
        { label: "订单价格", prop: "order_price" },
        { label: "是否付款", prop: "pay_status", change: "tag" },
        { label: "是否发货", prop: "is_send" },
        { label: "下单时间", prop: "create_time", change: "time" },
        {
          change: "button", label: "操作", width: "180px", child: [
            { btns: "primary", icon: "el-icon-edit", buttons: (value) => this.showedit(value) },
            { btns: "success", icon: "el-icon-location", buttons: (value) => this.showlocation(value) }
          ]
        }
      ],
      title: '修改订单信息',
      edititem: [
        { type: 'input', label: "订单编号", prop: "order_number" },
        { type: 'input', label: "是否付款", prop: "pay_status" },
        { type: 'input', label: "是否发货", prop: "is_send" },
        { type: 'input', label: "省市区", prop: "address" },
        { type: 'input', label: "详细地址", prop: "ress" },
      ],
    };
  },
  created () {
    this.getorders()
  },
  components: {
    eltable,
    elbreadcrumb
  },

  computed: {},

  methods: {
    async getorders () {
      //console.log(this.orders)
      const res = await orderget(this.orders)
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
      this.changevis = false
    },
    async showlocation (value) {
      this.locationvis = true
      const res = await kuaidiget(value.id)
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
    async editfinish () {
      this.$refs.editorref.validate(async valid => {
        if (!valid) return this.$message.error('请修改订单信息')
        const form = _.cloneDeep(this.editorders)
        if (typeof (form.pay_status) === 'object') {
          form.pay_status = form.pay_status.join(),
            form.is_send = form.is_send.join()
        }
        const res = await ordersput(form.order_id, form)
        if (res.meta.status !== 201) {
          return this.$message.error('修改订单信息失败')
        }
        this.changevis = false
        this.$message.success('修改订单信息成功')
        //console.log(form.is_send, typeof (form.is_send))
        //console.log(form.pay_status, typeof (form.pay_status))
      })
    },
    async showedit (value) {
      //console.log(id)
      const res = await ordersgetid(value.order_id)
      //console.log(value, res)
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
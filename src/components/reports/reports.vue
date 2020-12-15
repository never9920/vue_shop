<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div id="main" style="width: 800px; height: 500px"></div>
    </el-card>
  </div>
</template>

<script>
//import echarts from 'echarts'
import _ from 'lodash'
export default {
  name: "reports",
  data () {
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    };
  },
  async mounted () {
    const { data: res } = await this.$http.get(`reports/type/1`)
    if (res.meta.status !== 200) {
      return this.$message.error('获取报表数据失败')
    }
    const result = _.merge(res.data, this.options)
    //5.0版本导入方法
    let echarts = require('echarts')
    var myChart = echarts.init(document.getElementById('main'));
    myChart.setOption(result);
  },
  components: {},

  computed: {},

  methods: {
    /*async getreport () {
      const { data: res } = await this.$http.get(`reports/type/1`)
      if (res.meta.status !== 200) {
        return this.$message.error('获取报表数据失败')
      }
      this.result = res.data
      console.log(this.result)
    }*/
  }
}

</script>
<style scoped>
</style>
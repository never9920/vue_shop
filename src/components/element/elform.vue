<template>
  <el-form label-width="70px" :model="models" ref="formref" :rules="formrules">
    <el-form-item
      v-for="item in formitem"
      :key="item.prop"
      :label="item.label"
      :prop="item.prop"
    >
      <el-input
        v-model="models[item.prop]"
        :placeholder="item.placeholder"
        :style="{ width: item.width }"
        :disabled="item.disabled"
        :type="item.inputtype"
      ></el-input>
      <el-select
        v-model="selection"
        placeholder="请选择"
        v-if="item.type === 'select'"
      >
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "elform",
  props: {
    formitem: {
      type: Array,
      default: () => []
    },
    models: {
      type: Object,
      default: () => { }
    },
    formrules: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
    };
  },
  components: {},

  computed: {},

  methods: {
    resetFields () {
      this.$refs.formref.resetFields()
    },
    validate () {
      let flag = null
      this.$refs.formref.validate(valid => {
        if (valid) {
          flag = valid
          //console.log(flag)
          return
        }
        else {
          flag = false,
            this.$message.error('请填写需要修改的数据')
          return
        }
        /*if (!valid) return this.$message.error('请填写需要修改的数据')
        else return true*/
      })
      return flag
    }
  }
}


</script>
<style scoped>
</style>
<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :width="width"
    :before-close="diaclose"
  >
    <slot></slot>
    <elform
      :models="models"
      ref="formref"
      :formrules="formrules"
      :formitem="formitem"
    ></elform>
    <span slot="footer" class="dialog-footer">
      <el-button @click="diaclose">取 消</el-button>
      <el-button type="primary" @click="postthing">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import elform from './elform';
export default {
  name: "eldialog",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
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
    },
    title: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '50%'
    }
  },
  data () {
    return {
    };
  },

  components: { elform },

  computed: {},

  methods: {
    diaclose () {
      //this.$refs.formref.resetFields()
      this.$emit('reset')
    },
    postthing () {
      this.$emit('postthing')
    }
  }
}

</script>
<style scoped>
</style>
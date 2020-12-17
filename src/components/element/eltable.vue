<template>
  <el-table :data="tabledata" border style="width: 100%" stripe>
    <el-table-column
      v-for="(item, index) in tabletopdata"
      :key="index"
      :type="item.type"
      :prop="item.prop"
      :label="item.label"
      :width="item.width"
      ><template v-slot="scope" v-if="item.change === 'switch'">
        <el-switch
          v-model="scope.row.mg_state"
          inactive-color="#ff4949"
          @change="item.switch(scope.row)"
        >
        </el-switch>
      </template>
      <template v-slot="scope" v-else-if="item.change === 'button'">
        <el-button
          v-for="(item1, i) in item.child"
          :key="i"
          :type="item1.btns"
          :icon="item1.icon"
          size="mini"
          @click="item1.buttons(scope.row)"
        ></el-button>
      </template>
      <template v-slot="scope" v-else-if="item.change === 'time'">
        {{ scope.row.create_time | dataform }}
      </template>
      <template v-slot="scope" v-else-if="item.change === 'tag'">
        <el-tag type="success" v-if="scope.row.pay_status === '1'">
          已付款
        </el-tag>
        <el-tag type="danger" v-else>未付款</el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: "eltable",
  props: {
    tabledata: {
      type: Array,
      default: () => []
    },
    tabletopdata: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
    };
  },

  components: {},

  computed: {},

  methods: {}
}

</script>
<style scoped>
</style>
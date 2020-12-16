<template>
  <el-container class="homed">
    <el-header>
      <div>
        <img src="../assets/header.png" alt="" />
      </div>
      <div>电商后台管理系统</div>
      <el-button @click="tui" type="info">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isclose ? '64px' : '200px'">
        <div class="asidebtn" @click="closemenu">|||</div>
        <!--:default-active="$route.path"-->
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#333744"
          text-color="#fff"
          active-text-color="skyblue"
          unique-opened
          :collapse="isclose"
          :collapse-transition="false"
          router
          :default-active="apath"
          @click="change('/' + subitem.path)"
        >
          <el-submenu
            :index="index + ''"
            v-for="(item, index) in menulist"
            :key="index"
          >
            <template slot="title">
              <i :class="icons[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              v-for="subitem in item.children"
              :key="subitem.id"
              :index="'/' + subitem.path"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subitem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { getmenus } from '../network/menus'
export default {
  name: 'home',
  data () {
    return {
      menulist: [],
      icons: {
        '125': 'el-icon-user-solid',
        '103': 'el-icon-s-grid',
        '101': 'el-icon-upload',
        '102': 'el-icon-s-order',
        '145': 'el-icon-picture',
      },
      isclose: false,
      apath: '',
    }
  },
  created () {
    this.getmenulist()
    this.apath = window.sessionStorage.getItem('apath')
  },

  components: {},

  computed: {},

  methods: {
    tui () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getmenulist () {
      const res = await getmenus()
      //console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
      //console.log(res)
    },
    closemenu () {
      this.isclose = !this.isclose
    },
    change (value) {
      window.sessionStorage.setItem('apath', value),
        this.apath = value
    }
  }
}


</script>
<style scoped>
.homed {
  height: 100%;
}
.el-header {
  background-color: #373d40;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: white;
  font-size: 25px;
}
.el-header img {
  width: 55px;
  height: 50px;
}
.el-aside {
  background-color: #333744;
}
.el-aside .el-menu {
  border-right: 0;
}
.el-main {
  background-color: #eaedf1;
}
.asidebtn {
  background-color: #4a5064;
  font-size: 16px;
  line-height: 24px;
  color: #eaedf1;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>

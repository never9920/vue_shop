<template>
  <div class="login">
    <div class="center">
      <div class="image">
        <img src="../assets/logo.png" alt="" />
      </div>
      <el-form class="elput" :model="loginfrom" :rules="rules" ref="elfrom">
        <el-form-item prop="username">
          <!--prefix-icon="icon icon-user"-->
          <el-input
            prefix-icon="el-icon-user"
            v-model="loginfrom.username"
          ></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-lock"
            v-model="loginfrom.password"
            type="password"
          ></el-input>
        </el-form-item>

        <el-form-item class="btns">
          <el-button type="primary" @click="signin">登录</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

export default {
  name: "login",
  data () {
    return {
      loginfrom: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 16, message: '长度在3到16个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在6到16个字符', trigger: 'blur' }
        ],
      }
    };
  },

  components: {},

  computed: {},

  methods: {
    reset () {
      this.$refs.elfrom.resetFields();
      //回到默认值
    },
    signin () {
      this.$refs.elfrom.validate(async valid => {
        if (!valid) return;
        else {
          const { data: res } = await this.$http.post("login", this.loginfrom);
          if (res.meta.status !== 200) {
            return this.$message({
              message: '登录失败',
              type: 'error',
              center: true,
              offset: 350,
              duration: 1500,
            })
          }
          this.$message.success({
            message: '登录成功',
            type: 'success',
            center: true,
            offset: 350,
            duration: 1500,
          });
          window.sessionStorage.setItem('token', res.data.token)
          this.$router.push('/home')
        }
      })
    }
  }
}

</script>
<style scoped>
.login {
  background-color: #2b4b6b;
  height: 100%;
}
.center {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 5px;
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.image {
  height: 120px;
  width: 120px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #eee;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 50%);
  top: -50%;
  background-color: #fff;
}
.image img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}
.elput {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
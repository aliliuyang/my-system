<template>
  <el-form :model="loginForm" status-icon :rules="rules" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
    <h3 class="title">系统登录</h3>
    <el-form-item label="账号" prop="username">
      <el-input type="text" v-model="loginForm.username" auto-complete="off"></el-input>
    </el-form-item>


    <el-form-item label="密码" prop="pwd">
      <el-input type="password" v-model="loginForm.pwd" auto-complete="off"></el-input>
    </el-form-item>
    <el-checkbox v-model="checked" checked class="remember">
        记住密码
    </el-checkbox>
    <el-form-item>
      <el-button style="width:100%;" type="primary" @click.native.prevent="Login" :loading="logining">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import {requestLogin} from '../api/api'

    export default {
        data (){
            return {
              logining: false,
              loginForm: {
                username: 'admin',
                pwd: '123456',
              },
              rules: {
                username: [
                  { required: true, message: '请输入账号',  trigger: 'blur' }
                ],

                pwd: [
                  {required: true, message: '请输入密码', trigger: 'blur' }
                ]
              },
              checked: true
            };
        },
        methods: {
          Login() {
            this.$refs.ruleForm2.validate((valid) => {
              if (valid) {
                this.logining = true;
                var loginParams = {
                  username: this.loginForm.username,
                  password: this.loginForm.pwd
                }
                requestLogin(loginParams).then(data => {
                  this.logining = false;
                  let {msg, code, user} = data;
                  if(code !== 200) {
                    this.$message({
                      message: msg,
                      type: 'error'
                    });
                  }else{
                    sessionStorage.setItem('access-user', JSON.stringify(user));
                    this.$router.push({path: '/'})
                  }
                })
              } else {
                console.log('error submit!!');
                return false;
              }
            });
          },
//          resetForm(loginForm) {
//            this.$refs.loginForm.resetFields();
//          }

        },
        components: {}
    }
</script>

<style lang="scss" scoped>
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 160px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;

    background: -ms-linear-gradient(top, #fff, #6495ed);        /* IE 10 */
    background:-moz-linear-gradient(top,#b8c4cb,#f6f6f8);/*火狐*/
    background:-webkit-gradient(linear, 0% 0%, 0% 100%,from(#b8c4cb), to(#f6f6f8));/*谷歌*/
    background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#fff), to(#6495ed));      /* Safari 4-5, Chrome 1-9*/
    background: -webkit-linear-gradient(top, #fff, #6495ed,#fff);   /*Safari5.1 Chrome 10+*/
    background: -o-linear-gradient(top, #fff, #6495ed);  /*Opera 11.10+*/

    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
</style>

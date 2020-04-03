<template>
  <v-content>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>欢迎登录</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form
                v-model="valid"
                @keyup.enter.native="login"
              >
                <v-text-field
                  v-model="identifier"
                  :rules="nameRules"
                  label="用户名/邮箱"
                  name="identifier"
                  prepend-icon="fa-user"
                  type="text"
                  required
                />
                <v-text-field
                  v-model="password"
                  :rules="pwdRules"
                  label="密码"
                  name="password"
                  prepend-icon="fa-lock"
                  type="password"
                  required
                />
                <v-btn block color="primary" :disabled="!valid" @click="login">
                  登录
                </v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      identifier: '',
      password: '',
      valid: false,
      nameRules: [
        v => !!v || '用户名/邮箱不能为空'
      ],
      pwdRules: [
        v => !!v || '密码不能为空'
      ]
    }
  },
  beforeCreate () {
    if (this.$store.state.token) {
      this.$axios.get('/users/me').then(() => {
        this.$router.push('/')
        this.$toast.info('您已登录')
      }).catch(() => {
        this.$$store.commit('changeToken', { token: '' })
      })
    }
  },
  methods: {
    login () {
      if (this.valid) {
        this.$axios.post('/auth/local', {
          identifier: this.identifier,
          password: this.password
        }).then((response) => {
          this.$store.commit('changeToken', { token: response.data.jwt, username: response.data.user.username, email: response.data.user.email })
          this.$router.push('/')
        }).catch((error) => {
          if (error.response.status === 400) {
            this.$toast.error('登录失败')
          } else {
            this.$toast.error(error.response.data.error)
          }
        })
      }
    }
  }
}
</script>

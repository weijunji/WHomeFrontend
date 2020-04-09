<template>
  <v-container>
    <LoginRequired />
    {{ msg }}
  </v-container>
</template>

<script>
import LoginRequired from '~/components/LoginRequired'

export default {
  name: 'BGMCallback',
  components: {
    LoginRequired
  },
  data () {
    return {
      msg: '正在获取权限，预计需要10s'
    }
  },
  mounted () {
    this.$axios.put('/bgm', {
      code: this.$router.currentRoute.query.code
    }).then(({ data }) => {
      console.log(data)
    }).catch((err) => {
      this.msg = '获取失败' + err.message
    })
  }
}
</script>

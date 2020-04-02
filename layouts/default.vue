<template>
  <v-app light>
    <v-app-bar dark fixed app color="blue darken-2">
      <v-toolbar-title color="white" v-text="title" />
      <v-btn to="/" class="font-weight-regular ml-3" text>主页</v-btn>
      <v-btn
        v-for="(item, index) in menu"
        :key="index"
        :disabled="item.admin && isLogin"
        :to="item.link"
        class="font-weight-regular"
        text
      >
        {{ item.name }}
      </v-btn>
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer :fixed="fixed" app>
      <span>赣ICP备17016171号-2 &copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      title: 'WHome',
      menu: [
        {
          name: '文章',
          link: '/blogs',
          admin: false
        },
        {
          name: '书架',
          link: '/books',
          admin: true
        },
        {
          name: '追剧',
          link: '/series',
          admin: true
        },
        {
          name: '电影',
          link: '/movies',
          admin: true
        }
      ]
    }
  },
  computed: {
    isLogin () {
      return this.$store.state.token !== ''
    }
  },
  beforeCreate () {
    this.$store.commit('init')
  },
  beforeUpdate () {
    if (this.$router.currentRoute.name !== 'Login' && this.$store.state.token === '') { this.$router.push('login') }
  }
}
</script>

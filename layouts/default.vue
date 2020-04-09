<template>
  <v-app light>
    <v-app-bar dark fixed app color="blue darken-2">
      <v-toolbar-title color="white" v-text="title" />
      <v-btn to="/" class="font-weight-regular ml-3" text>
        主页
      </v-btn>
      <v-btn
        v-for="(item, index) in menu"
        :key="index"
        :disabled="item.admin && !isLogin"
        :to="item.link"
        class="font-weight-regular"
        text
      >
        {{ item.name }}
      </v-btn>
      <v-spacer />
      <v-menu v-if="isLogin" open-on-hover bottom offset-y>
        <template v-slot:activator="{ on }">
          <v-avatar v-on="on">
            <img :src="avatar">
          </v-avatar>
        </template>
        <v-list>
          <v-subheader>{{ username }}</v-subheader>
          <v-list-item @click="logout">
            <v-list-item-icon>
              <v-icon>fa-sign-out-alt</v-icon>
            </v-list-item-icon>
            <v-list-item-content>退出</v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-btn v-else to="/login" class="font-weight-regular ml-3" text>
        登录
      </v-btn>
    </v-app-bar>
    <v-content>
      <nuxt />
    </v-content>
    <v-footer fixed app>
      <span>赣ICP备17016171号-2 &copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import md5 from 'md5'

export default {
  name: 'Default',
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
          link: '/bgm',
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
    },
    username () {
      return this.$store.state.username
    },
    avatar () {
      const email = this.$store.state.email.toLowerCase()
      return 'https://www.gravatar.com/avatar/' + md5(email)
    }
  },
  mounted () {
    document.addEventListener('drop', function (e) {
      e.preventDefault()
    }, false)
    document.addEventListener('dragover', function (e) {
      e.preventDefault()
    }, false)
  },
  beforeUpdate () {
    if (this.$router.currentRoute.name !== 'Login' && this.$store.state.token === '') { this.$router.push('login') }
  },
  methods: {
    logout () {
      this.$store.commit('changeToken', { token: '' })
    }
  }
}
</script>

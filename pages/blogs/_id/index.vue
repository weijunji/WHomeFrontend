<template>
  <div v-if="err">
    {{ err }}
  </div>
  <v-container v-else>
    <v-row justify="center">
      <v-card>
        <v-card-title class="display-1">
          {{ blog.title }}
        </v-card-title>
        <v-card-subtitle>
          <span class="d-none d-sm-inline">
            <v-icon :size="15">fa-plus</v-icon>
            创建于{{ createdTime }}&nbsp;&nbsp;
          </span>
          <span>
            <v-icon :size="15">fa-edit</v-icon>
            编辑于{{ updatedTime }}
          </span>
        </v-card-subtitle>
        <v-card-text>
          <span>
            <v-icon :size="15" :color="blog.category.color">{{ blog.category.icon }}</v-icon>
            {{ blog.category.name }}
          </span>
          <v-chip
            v-for="tag of blog.tags"
            :key="tag.name"
            small
            class="mx-1"
          >
            {{ tag.name }}
          </v-chip>
          <v-divider class="my-3" />
          <div id="content" />
        </v-card-text>
      </v-card>
      <v-btn
        v-if="isLogin"
        dark
        fab
        color="pink"
        style="bottom: 10vh; right: 20vw; position: fixed"
        :to="`/blogs/${blog.id}/edit`"
      >
        <v-icon>fa-edit</v-icon>
      </v-btn>
    </v-row>
  </v-container>
</template>

<script>
import VditorPreview from 'vditor/dist/method.min'

export default {
  name: 'BlogDetail',
  async asyncData (ctx) {
    try {
      const { data } = await ctx.$axios.get(`/blogs/${ctx.params.id}`)
      return { blog: data, err: '' }
    } catch (err) {
      if (err.response.status === 500) {
        return { err: '404 NOT FOUND' }
      } else {
        return { err: err.response.statusText }
      }
    }
  },
  computed: {
    createdTime () {
      return this.blog.createdAt.split('T')[0]
    },
    updatedTime () {
      return this.blog.updatedAt.split('.')[0].replace('T', ' ')
    },
    isLogin () {
      return this.$store.state.token !== ''
    }
  },
  mounted () {
    VditorPreview.preview(document.getElementById('content'), this.blog.content, {
      anchor: 1,
      hljs: {
        enable: true,
        style: 'monokailight',
        lineNumber: true
      }
    })
  }
}
</script>

<style lang="scss">
.v-application code:before {
  content: ""!important;
}
.v-application code:after {
  content: ""!important;
}
@media (min-width: 1904px){
  .container {
    max-width: 1185px;
  }
}
@media (min-width: 2300px){
  .container {
    max-width: 1785px;
  }
}
</style>

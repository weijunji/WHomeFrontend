<template>
  <div v-if="err">
    {{ err }}
  </div>
  <v-container v-else>
    <LoginRequired />
    <v-text-field
      v-model="$v.blog.title.$model"
      label="标题"
      placeholder="请输入标题"
      outlined
      :error-messages="titleError"
    />
    <Editor
      v-model="$v.blog.content.$model"
      :error-messages="contentError"
      edit
    />
    <v-row>
      <v-col :cols="12" :sm="4">
        <selector-with-new
          v-model="$v.blog.category.$model"
          label="分类"
          new-url="/blog-categories"
          items-query="query{blogCategories{id name}}"
          items-prop="blogCategories"
          :error-messages="categoryError"
        />
      </v-col>
      <v-col :cols="12" :sm="8">
        <ComboboxWithNew
          v-model="tags"
          label="标签"
          new-url="/blog-tags"
          items-query="query{blogTags{id name}}"
          items-prop="blogTags"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-switch v-model="blog.private" :label="blog.private ? '私有' : '公开'" color="error" class="px-4 mt-2" />
      <v-spacer />
      <v-btn class="ma-2" outlined color="primary" @click="submit">
        更新
      </v-btn>
    </v-row>
  </v-container>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

import ComboboxWithNew from '~/components/ComboboxWithNew'
import Editor from '~/components/Editor'
import LoginRequired from '~/components/LoginRequired'
import SelectorWithNew from '~/components/SelectorWithNew'

export default {
  name: 'BlogEdit',
  components: {
    ComboboxWithNew,
    Editor,
    LoginRequired,
    SelectorWithNew
  },
  mixins: [
    validationMixin
  ],
  validations: {
    blog: {
      title: { required },
      content: { required },
      category: { required }
    }
  },
  async asyncData (ctx) {
    try {
      const { data } = await ctx.$axios.get(`/blogs/${ctx.params.id}`)
      return {
        id: data.id,
        blog: {
          title: data.title,
          content: data.content,
          category: data.category.id,
          tags: [],
          private: data.private
        },
        tags: data.tags,
        err: ''
      }
    } catch (err) {
      if (err.response.status === 500) {
        return { err: '404 NOT FOUND' }
      } else {
        return { err: err.response.statusText }
      }
    }
  },
  computed: {
    titleError () {
      let error = ''
      if (this.$v.blog.title.$dirty && this.$v.blog.title.$error) {
        error = '标题不能为空'
      }
      return error
    },
    contentError () {
      let error = ''
      if (this.$v.blog.content.$dirty && this.$v.blog.content.$error) {
        error = '内容不能为空'
      }
      return error
    },
    categoryError () {
      let error = ''
      if (this.$v.blog.category.$dirty && this.$v.blog.category.$error) {
        error = '分类不能为空'
      }
      return error
    }
  },
  methods: {
    submit () {
      this.$v.$touch()
      if (this.$v.$invalid) { return }

      for (const tag of this.tags) {
        if (typeof tag === 'string') {
          this.blog.tags.push({ type: 'new', name: tag })
        } else {
          this.blog.tags.push({ type: 'exist', id: tag.id })
        }
      }

      this.$axios.put(`/blogs/${this.id}`, this.blog).then(({ data }) => {
        this.$toast.success('更新成功')
        this.$router.push(`/blogs/${this.id}`)
      }).catch((err) => {
        this.blog.tags = []
        this.$toast.error(err.response)
      })
    }
  }
}
</script>

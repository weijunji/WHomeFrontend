<template>
  <v-container>
    <LoginRequired />
    <v-text-field
      v-model="$v.data.title.$model"
      label="标题"
      placeholder="请输入标题"
      outlined
      :error-messages="titleError"
    />
    <Editor
      ref="editor"
      v-model="$v.data.content.$model"
      :error-messages="contentError"
    />
    <v-row>
      <v-col :cols="12" :sm="4">
        <selector-with-new
          v-model="$v.data.category.$model"
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
      <v-switch v-model="data.private" :label="data.private ? '私有' : '公开'" color="error" class="px-4 mt-2" />
      <v-spacer />
      <v-btn class="ma-2" outlined color="primary" @click="submit">
        新建
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
  name: 'NewBlog',
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
    data: {
      title: { required },
      content: { required },
      category: { required }
    }
  },
  data () {
    return {
      data: {
        title: '',
        content: '',
        category: '',
        tags: [],
        private: false
      },
      titleErrors: '',
      tags: []
    }
  },
  computed: {
    titleError () {
      let error = ''
      if (this.$v.data.title.$dirty && this.$v.data.title.$error) {
        error = '标题不能为空'
      }
      return error
    },
    contentError () {
      let error = ''
      if (this.$v.data.content.$dirty && this.$v.data.content.$error) {
        error = '内容不能为空'
      }
      return error
    },
    categoryError () {
      let error = ''
      if (this.$v.data.category.$dirty && this.$v.data.category.$error) {
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
          this.data.tags.push({ type: 'new', name: tag })
        } else {
          this.data.tags.push({ type: 'exist', id: tag.id })
        }
      }

      this.$axios.post('/blogs', this.data).then(({ data }) => {
        this.created = true
        this.$refs.editor.clear()
        this.$toast.success('新建成功')
        this.$router.push(`/blogs/${data.id}`)
      }).catch((err) => {
        this.data.tags = []
        if (err.response.status === 409) {
          this.$toast.error('项目已存在')
        }
      })
    }
  }
}
</script>

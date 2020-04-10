<template>
  <v-container>
    <v-form>
      <v-row>
        <v-col :cols="12" :sm="6" :md="4">
          <drop-zone ref="dropzone" v-model="file" title="上传封面" />
        </v-col>
        <v-col :cols="12" :sm="6" :md="8">
          <v-text-field
            v-model.trim="$v.data.title.$model"
            label="标题"
            placeholder="标题"
            outlined
            :error-messages="titleErrors"
          />
          <v-row>
            <v-col>
              <selector-with-new
                v-model="$v.data.author.$model"
                label="作者"
                avatar
                new-url="/book-authors"
                items-query="query{bookAuthors{id name avatar{url}}}"
                items-prop="bookAuthors"
                :error-messages="authorErrors"
                @blur="$v.data.author.$touch()"
              />
            </v-col>
            <v-col>
              <selector-with-new
                v-model="$v.data.category.$model"
                label="分类"
                new-url="/book-categories"
                items-query="query{bookCategories{id name}}"
                items-prop="bookCategories"
                :error-messages="categoryErrors"
                @blur="$v.data.category.$touch()"
              />
            </v-col>
          </v-row>
          <v-textarea
            v-model="$v.data.introduce.$model"
            filled
            required
            label="简介"
            placeholder="书籍简介"
            :error-messages="introErrors"
          />
          <v-textarea
            v-model="data.comment"
            filled
            label="评论"
            placeholder="书籍评论"
          />
          <v-text-field
            v-model="data.link"
            label="链接"
            placeholder="书籍来源链接"
          />
          <v-input
            label="评分"
          >
            <v-rating v-model="data.star" hover />
          </v-input>
          <v-radio-group
            v-model="data.read"
            label="状态"
            row
          >
            <v-radio label="未读" value="wait" color="error" />
            <v-radio label="在读" value="reading" color="warning" />
            <v-radio label="已读" value="finish" color="success" />
          </v-radio-group>
          <div style="text-align: end;">
            <v-btn class="ma-2" outlined color="primary" @click="submit">
              新建书籍
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

import ColorThief from '~/thirdparty/colorthief'
import DropZone from '~/components/DropZone'
import SelectorWithNew from '~/components/SelectorWithNew'

export default {
  name: 'NewBook',
  components: {
    DropZone,
    SelectorWithNew
  },
  mixins: [
    validationMixin
  ],
  validations: {
    data: {
      title: { required },
      author: { required },
      category: { required },
      introduce: { required }
    }
  },
  data () {
    return {
      data: {
        title: '',
        cover: '',
        color: '#ffffff',
        author: '',
        category: '',
        introduce: '',
        comment: '',
        star: 3,
        read: 'wait',
        link: ''
      },
      file: {
        id: '',
        url: ''
      },
      created: false
    }
  },
  computed: {
    titleErrors () {
      let error = ''
      if (this.$v.data.title.$dirty && this.$v.data.title.$error) {
        error = '标题不能为空'
      }
      return error
    },
    authorErrors () {
      let error = ''
      if (this.$v.data.author.$dirty && this.$v.data.author.$error) {
        error = '作者不能为空'
      }
      return error
    },
    categoryErrors () {
      let error = ''
      if (this.$v.data.category.$dirty && this.$v.data.category.$error) {
        error = '分类不能为空'
      }
      return error
    },
    introErrors () {
      let error = ''
      if (this.$v.data.introduce.$dirty && this.$v.data.introduce.$error) {
        error = '简介不能为空'
      }
      return error
    }
  },
  mounted () {
    if (this.$route.query.title) { this.data.title = decodeURIComponent(this.$route.query.title) }
    if (this.$route.query.introduce) { this.data.introduce = decodeURIComponent(this.$route.query.introduce) }
    if (this.$route.query.link) { this.data.link = decodeURIComponent(this.$route.query.link) }
    if (this.$route.query.author) {
      const input = document.createElement('input')
      input.setAttribute('readonly', 'readonly')
      input.setAttribute('value', decodeURIComponent(this.$route.query.author))
      document.body.appendChild(input)
      input.select()
      if (document.execCommand('copy')) {
        document.execCommand('copy')
      }
      document.body.removeChild(input)
    }
    if (this.$route.query.cover) {
      const cover = decodeURIComponent(this.$route.query.cover)
      this.$refs.dropzone.handleUrl(cover)
    }
  },
  destroyed () {
    if (!this.created && this.file.id) {
      this.$axios.delete(`/upload/files/${this.file.id}`)
    }
  },
  methods: {
    submit () {
      this.$v.$touch()
      if (this.$v.$invalid) { return }
      const colorThief = new ColorThief()
      const image = new Image()
      image.crossOrigin = 'Anonymous'
      image.src = this.file.url
      const c = colorThief.getColor(image, 0.5, 5)
      let color = '#'
      for (let i = 0; i < 3; i++) {
        const hex = c[i].toString(16)
        color += (hex.length === 1 ? '0' + hex : hex)
      }
      this.data.color = color
      this.data.cover = this.file.id

      this.$axios.post('/books', this.data).then(({ data }) => {
        this.created = true
        this.$toast.success('新建成功')
        this.$router.push('/books/' + data.id)
      }).catch((err) => {
        if (err.response.status === 409) {
          this.$toast.error('书籍已存在')
        }
      })
    }
  }
}
</script>

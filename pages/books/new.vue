<template>
  <v-container>
    <v-form>
      <v-row>
        <v-col :cols="12" :sm="6" :md="4">
          <drop-zone v-model="file" title="上传封面" />
        </v-col>
        <v-col :cols="12" :sm="6" :md="8">
          <v-text-field
            v-model="data.title"
            label="标题"
            placeholder="标题"
            outlined
          />
          <v-row>
            <v-col>
              <selector-with-new
                v-model="data.author"
                label="作者"
                avatar
                new-url="/book-authors"
                items-query="query{bookAuthors{id name avatar{url}}}"
                items-prop="bookAuthors"
              />
            </v-col>
            <v-col>
              <selector-with-new
                v-model="data.category"
                label="分类"
                new-url="/book-categories"
                items-query="query{bookCategories{id name}}"
                items-prop="bookCategories"
              />
            </v-col>
          </v-row>
          <v-textarea
            v-model="data.introduce"
            filled
            label="简介"
            placeholder="书籍简介"
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
import ColorThief from '~/thirdparty/colorthief'

import DropZone from '~/components/DropZone'
import SelectorWithNew from '~/components/SelectorWithNew'

export default {
  name: 'NewBook',
  components: {
    DropZone,
    SelectorWithNew
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
  destroyed () {
    if (!this.created && !this.file.id) {
      this.$axios.delete(`/upload/files/${this.file.id}`)
    }
  },
  methods: {
    submit () {
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
      })
    }
  }
}
</script>

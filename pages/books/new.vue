<template>
  <v-container>
    <v-form>
      <v-row>
        <v-col :cols="12" :sm="6" :md="4">
          <drop-zone v-model="file" title="上传封面"/>
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
              <v-overflow-btn
                v-model="data.author"
                :items="authors"
                label="作者"
                editable
                item-text="name"
                item-value="id"
                :search-input.sync="authorSearch"
              >
                <v-list-item slot="no-data" @click="createAuthor">
                  新建 {{ authorSearch }}
                </v-list-item>
              </v-overflow-btn>
            </v-col>
            <v-col>
              <v-overflow-btn
                v-model="data.category"
                :items="categorys"
                label="分类"
                editable
                item-text="name"
                item-value="id"
                :search-input.sync="categorySearch"
              >
                <v-list-item slot="no-data" @click="createCategory">
                  新建 {{ categorySearch }}
                </v-list-item>
              </v-overflow-btn>
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
            <v-radio label="未读" :value="0" color="error" />
            <v-radio label="在读" :value="1" color="warning" />
            <v-radio label="已读" :value="2" color="success" />
          </v-radio-group>
          <div style="text-align: end;">
            <v-btn class="ma-2" outlined color="primary" @click="submit">新建书籍</v-btn>
          </div>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import DropZone from '~/components/DropZone'

export default {
  name: 'NewBook',
  components: {
    DropZone
  },
  asyncData () {
    return {
      authors: [
        { id: 1, name: '雨天' },
        { id: 2, name: '夏天' }
      ],
      categorys: [
        { id: 1, name: 'haha' },
        { id: 2, name: 'fafa' }
      ]
    }
  },
  data () {
    return {
      data: {
        title: '',
        coverId: 0,
        coverLink: '',
        color: '',
        author: 0,
        category: 0,
        introduce: '',
        comment: '',
        star: 3,
        read: 0, // 0: wait, 1: reading, 2: finish
        link: ''
      },
      authorSearch: '',
      categorySearch: '',
      file: {
        id: 0,
        url: ''
      }
    }
  },
  methods: {
    createAuthor () {

    },
    createCategory () {

    },
    submit () {
      this.$axios.post('/graphql', {
        query: `mutation{
          createBook (input:{
            data: {
              title: "${this.data.title}"
              cover: ${this.data.cover}
              color: "${this.data.color}"
              author: ${this.data.author}
              category: ${this.data.category}
              introduce: "${this.data.introduce}"
              comment: "${this.data.comment}"
              star: ${this.data.star}
              read: ${this.data.read === 0 ? 'wait' : (this.data.read === 1 ? 'reading' : 'finish')}
              link: "${this.data.link}"
            }
          }) {
            book { id }
          }
        }`
      })
    }
  }
}
</script>

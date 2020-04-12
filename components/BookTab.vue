<template>
  <div>
    <v-row v-if="booksPage[page - 1] && booksPage[page - 1].length !== 0">
      <v-col
        v-for="book of booksPage[page - 1]"
        :key="book.id"
        class="book"
      >
        <BookCard
          :show-badge="read === 'all'"
          :id="book.id"
          :title="book.title"
          :author="book.author.name"
          :star="book.star"
          :cover="book.cover ? book.cover.url : ''"
          :color="book.color ? book.color : '#ffffff'"
          :avatar="book.author.avatar ? book.author.avatar.url : 'https://cdn.weijunji.top/files/unknown.png'"
          :read="book.read"
          :comment="book.comment"
        />
      </v-col>
    </v-row>
    <h2 v-else class="text-center">
      没有书籍存在
    </h2>
    <v-pagination
      v-if="pageCount"
      v-model="page"
      :length="pageCount"
    />
  </div>
</template>

<script>
import BookCard from '~/components/BookCard'

export default {
  name: 'BookTab',
  components: {
    BookCard
  },
  model: {
    prop: 'updating',
    event: 'change'
  },
  props: {
    updating: {
      type: Boolean,
      required: true
    },
    read: {
      type: String,
      required: true
    },
    current: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      booksPage: [[]],
      page: 1,
      pageCount: 0,
      created_: false
    }
  },
  watch: {
    updating () {
      if (this.created_ && this.updating && this.read === this.current) {
        this.update()
      }
    }
  },
  created () {
    this.$emit('change', true)
    if (this.read === 'all') {
      this.$axios.get('/books/count').then(({ data }) => {
        this.pageCount = Math.ceil(data / 12)
      })
    } else {
      this.$axios.get(`/books/count?read=${this.read}`).then(({ data }) => {
        this.pageCount = Math.ceil(data / 12)
      })
    }
    this.update(false)
  },
  updated () {
    this.created_ = true
  },
  methods: {
    update (showToast = true) {
      let url
      if (this.read === 'all') {
        url = `/books?_start=${(this.page - 1) * 16}&_limit=16`
      } else {
        url = `/books?read=${this.read}&_start=${(this.page - 1) * 16}&_limit=16`
      }
      this.$axios.get(url).then(({ data }) => {
        this.$set(this.booksPage, this.page - 1, data)
        this.$emit('change', false)
        if (showToast) { this.$toast.success('刷新成功') }
      })
    }
  }
}
</script>

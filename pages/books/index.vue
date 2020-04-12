<template>
  <div>
    <LoginRequired />
    <v-container>
      <v-toolbar floating>
        <v-select
          v-model="filter"
          :items="items"
          :disabled="!!search"
          style="width: 70px; margin-bottom: -16px"
        />
        <v-text-field
          v-model="search"
          class="ml-4"
          :color="searchType === 'title' ? 'primary' : 'success'"
          hide-details
          :placeholder="searchType === 'title' ? '搜索书名' : '搜索作者'"
          prepend-inner-icon="fa-search"
          clearable
          @input="debounce(handleSearch, 1000)"
        >
          <template slot="prepend">
            <v-btn v-if="searchType === 'title'" icon small @click="searchType = 'author.name'">
              <v-icon size="20" color="primary">fa-book</v-icon>
            </v-btn>
            <v-btn v-else icon small @click="searchType = 'title'">
              <v-icon size="20" color="success">fa-user</v-icon>
            </v-btn>
          </template>
        </v-text-field>
        <v-btn :loading="updating" :disabled="!!search" icon @click="updating = true">
          <v-icon>fa-redo</v-icon>
        </v-btn>
      </v-toolbar>
      <div v-show="!search">
        <div v-for="item of items" :key="item.value">
          <BookTab
            v-if="filter === item.value"
            v-model="updating"
            :read="item.value"
            :index="0"
            :current="filter"
          />
        </div>
      </div>
      <div v-show="search" class="text-center">
        <v-progress-circular
          v-if="searching && searchResult.length === 0"
          class="mt-8"
          color="primary"
          indeterminate
        />
        <v-row v-else-if="searchResult.length !== 0">
          <v-col
            v-for="book of searchResult"
            :key="book.id"
            class="book"
          >
            <BookCard
              :id="book.id"
              show-badge
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
      </div>
    </v-container>
    <v-btn
      dark
      fab
      large
      color="pink"
      style="bottom: 10vh; right: 20vw; position: fixed"
      to="/books/new"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </div>
</template>

<script>
import LoginRequired from '~/components/LoginRequired'
import BookCard from '~/components/BookCard'
import BookTab from '~/components/BookTab'

export default {
  name: 'Books',
  components: {
    LoginRequired,
    BookCard,
    BookTab
  },
  async asyncData (ctx) {
    const { data } = await ctx.$axios.get('/books')
    return { books: data }
  },
  data () {
    return {
      items: [
        {
          text: '全部',
          value: 'all'
        },
        {
          text: '在看',
          value: 'reading'
        },
        {
          text: '未看',
          value: 'wait'
        },
        {
          text: '看完',
          value: 'finish'
        }
      ],
      dialog: false,
      filter: 'all',
      updating: false,
      search: '',
      searchType: 'title',
      searching: true,
      searchResult: [],
      timeout: null
    }
  },
  watch: {
    searchType () {
      this.handleSearch()
    }
  },
  methods: {
    debounce (fn, wait) {
      if (this.search !== '' && this.searchResult.length === 0) { this.searching = true }
      if (this.search === '') { this.searching = false }
      if (this.timeout !== null) { clearTimeout(this.timeout) }
      this.timeout = setTimeout(fn, wait)
    },
    createBook () {
      this.dialog = true
    },
    handleSearch () {
      if (this.search !== '') {
        this.searching = true
        this.$axios.get(`/books?${this.searchType}_contains=${this.search}`).then(({ data }) => {
          this.searchResult = data
          this.searching = false
        })
      }
    }
  }
}
</script>

<style lang="scss">
.book{
  width: 100%;
  flex-grow: 0;
}
@media (min-width: 430px){
  .book{
    width: 50%;
  }
}
@media (min-width: 630px){
  .book{
    width: 33.333333333%;
  }
}
@media (min-width: 1000px){
  .book{
    width: 25%;
  }
}
@media (min-width: 1300px){
  .book{
    width: 20%;
  }
}
</style>

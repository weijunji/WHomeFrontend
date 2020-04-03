<template>
  <div>
    <LoginRequired />
    <v-container>
      <v-row>
        <v-col
          v-for="book of books"
          :key="book.id"
          class="book"
        >
          <BookCard
            :id="book.id"
            :title="book.title"
            :author="book.author.name"
            :star="book.star"
            :cover="book.cover.url"
            :color="book.color"
            :avatar="book.author.avatar.url"
          />
        </v-col>
      </v-row>
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

export default {
  name: 'Books',
  components: {
    LoginRequired,
    BookCard
  },
  async asyncData (ctx) {
    const { data } = await ctx.$axios.post('/graphql', {
      query: `query SimpleBooks{
          booksConnection{
            values{
            id
            title
            star
            color
            cover { url }
            author {
              name
              avatar { url }
            }
          }
          aggregate {
            totalCount
          }
        }
      }`
    })
    const books = data.data.booksConnection.values
    /* append data for debug
    for (const i of Array(50)) {
      books.push(data.data.booksConnection.values[0])
      console.log(i)
    }
    */
    return { books }
  },
  data () {
    return {
      dialog: false
    }
  },
  methods: {
    createBook () {
      this.dialog = true
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

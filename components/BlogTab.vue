<template>
  <div>
    <div v-if="blogPages[page - 1] && blogPages[page - 1].length !== 0">
      <BlogCard
        v-for="blog of blogPages[page - 1]"
        :id="blog.id"
        :key="blog.id"
        :title="blog.title"
        :created="blog.createdAt"
        :updated="blog.updatedAt"
        :category="blog.category"
        :tags="blog.tags"
      />
    </div>
    <v-progress-circular
      v-else-if="loading"
      class="mt-8 text-center"
      color="primary"
      indeterminate
    />
    <h2 v-else class="text-center">
      没有博客存在
    </h2>
  </div>
</template>

<script>
import BlogCard from '~/components/BlogCard'

export default {
  name: 'BlogTab',
  components: {
    BlogCard
  },
  props: {
    category: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      blogPages: [[]],
      loading: true,
      page: 1,
      pageCount: 0,
      itemPerPage: 10
    }
  },
  created () {
    let countUrl = '/blogs/count'
    if (this.category === '全部') {
      countUrl = '/blogs/count'
    }
    this.$axios.get(countUrl, { params: { 'category.name': this.category } }).then(({ data }) => {
      this.pageCount = Math.ceil(data / this.itemPerPage)
    })

    let url = `/blogs?category.name=${encodeURIComponent(this.category)}&_start=${(this.page - 1) * this.itemPerPage}&_limit=${this.itemPerPage}`
    if (this.category === '全部') {
      url = `/blogs?_start=${(this.page - 1) * this.itemPerPage}&_limit=${this.itemPerPage}`
    }
    this.$axios.get(url).then(({ data }) => {
      this.$set(this.blogPages, this.page - 1, data)
      this.loading = false
    })
  }
}
</script>

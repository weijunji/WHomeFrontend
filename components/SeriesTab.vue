<template>
  <div>
    <v-row v-if="pageSubjects[page - 1] && pageSubjects[page - 1].length !== 0">
      <v-col v-for="subject of pageSubjects[page - 1]" :key="subject.subject_id" :cols="12" :md="6" :lg="4">
        <SeriesCard
          :id="subject.id"
          :name-cn="subject.nameCn"
          :name="subject.name"
          :cover="subject.cover.url"
          :air-weekday="subject.update"
          :ep="subject.ep"
          :ep-count="subject.epCount"
          :link="subject.link"
          :introduce="subject.introduce"
          :status="subject.status"
          :comment="subject.comment"
          :star="subject.star"
          :type="subject.type"
          @update="update"
        />
      </v-col>
    </v-row>
    <div v-else class="text-center py-4">
      没有数据
    </div>
    <v-pagination
      v-if="pageCount"
      v-model="page"
      :length="pageCount"
    />
  </div>
</template>

<script>
import SeriesCard from '~/components/SeriesCard'

export default {
  name: 'SeriesTab',
  components: {
    SeriesCard
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
    status: {
      type: String,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    current: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      pageSubjects: [[]],
      page: 1,
      pageCount: 0,
      created_: false,
      itemPerPage: 12
    }
  },
  watch: {
    updating () {
      if (this.created_ && this.updating && this.index === this.current) {
        if (!this.pageSubjects[this.page]) {
          this.update(false)
        } else {
          this.update()
        }
      }
    },
    page () {
      if (!this.pageSubjects[this.page]) {
        this.$emit('change', true)
      }
    }
  },
  created () {
    this.$emit('change', true)
    this.$axios.get(`/srs/count?status=${this.status}`).then(({ data }) => {
      this.pageCount = Math.ceil(data / this.itemPerPage)
    })
    this.update(false)
  },
  updated () {
    this.created_ = true
  },
  methods: {
    update (showToast = true) {
      this.$axios.get(`/srs?status=${this.status}&_start=${(this.page - 1) * this.itemPerPage}&_limit=${this.itemPerPage}`).then(({ data }) => {
        this.$set(this.pageSubjects, this.page - 1, data)
        this.$emit('change', false)
        if (showToast) { this.$toast.success('刷新成功') }
      })
    }
  }
}
</script>

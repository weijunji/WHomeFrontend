<template>
  <v-container>
      <v-card>
    <v-card-title class="pa-0">
        <v-tabs>
      <v-tab>在看</v-tab>
      <v-tab>想看</v-tab>
      <v-tab>看过</v-tab>
      <v-tab class="d-none d-sm-flex">搁置</v-tab>
      <v-tab class="d-none d-sm-flex">抛弃</v-tab>
      <v-spacer />
      <div class="my-auto mr-4">
        <v-btn :loading="updating" icon @click="update"><v-icon>fa-redo</v-icon></v-btn>
      </div>
    </v-tabs>
    </v-card-title>
    <v-card-text>
        <v-row>
      <v-col v-for="subject of subjects" :key="subject.subject_id" :cols="12" :md="6" :lg="4">
        <BgmCard
          :id="subject.subject_id"
          :name-cn="subject.subject.name_cn"
          :name="subject.subject.name"
          :cover="subject.subject.images.large"
          :air-weekday="subject.subject.air_weekday"
          :ep="subject.ep_status"
          :ep-count="subject.subject.eps ? subject.subject.eps : 0"
          @update="update"
        />
      </v-col>
    </v-row>
    </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import BgmCard from '~/components/BgmCard'

export default {
  name: 'Bgm',
  components: {
    BgmCard
  },
  data () {
    return {
      subjects: [],
      updating: true
    }
  },
  created () {
    this.$axios.get('/bgm/user/355567/collection?cat=watching').then(({ data }) => {
      this.subjects = data
      this.updating = false
    })
  },
  methods: {
    update () {
      this.updating = true
      this.$axios.get('/bgm/user/355567/collection?cat=watching&refresh=true').then(({ data }) => {
        this.subjects = data
        this.$toast.success('刷新成功')
        this.updating = false
      }).catch(() => {
        this.$toast.error('刷新失败')
      })
    }
  }
}
</script>

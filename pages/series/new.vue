<template>
  <v-container>
    <LoginRequired />
    <v-form>
      <v-row>
        <v-col :cols="12" :sm="6" :md="4">
          <drop-zone ref="dropzone" v-model="file" title="上传封面" />
        </v-col>
        <v-col :cols="12" :sm="6" :md="8">
          <v-text-field
            v-model.trim="$v.data.nameCn.$model"
            label="标题"
            placeholder="中文标题"
            outlined
            :error-messages="nameError"
          />
          <v-row>
            <v-col :cols="12" :md="6">
              <v-text-field
                v-model.trim="data.name"
                label="原标题"
                placeholder="原标题"
              />
            </v-col>
            <v-col :cols="12" :md="6">
              <v-text-field
                v-model="data.link"
                label="链接"
                placeholder="来源链接"
              />
            </v-col>
          </v-row>
          <v-textarea
            v-model="$v.data.introduce.$model"
            filled
            required
            label="简介"
            placeholder="内容简介"
            :error-messages="introError"
          />
          <v-textarea
            v-model="data.comment"
            filled
            label="评论"
            placeholder="评论"
          />
          <v-input label="评分">
            <v-rating v-model="data.star" hover />
          </v-input>
          <v-row>
            <v-col :cols="12" :md="6" class="py-0">
              <v-input label="状态">
                <v-btn-toggle
                  v-model="data.status"
                  class="ml-1"
                  group
                >
                  <v-btn value="do" active-class="primary--text">
                    在看
                  </v-btn>
                  <v-btn value="wish" active-class="warning--text">
                    想看
                  </v-btn>
                  <v-btn value="finish" active-class="success--text">
                    完成
                  </v-btn>
                  <v-btn value="hold" active-class="error--text">
                    搁置
                  </v-btn>
                </v-btn-toggle>
              </v-input>
            </v-col>
            <v-col :cols="12" :md="6" class="py-0">
              <v-input label="类型">
                <v-btn-toggle
                  v-model="data.type"
                  class="ml-1"
                  color="primary"
                  group
                >
                  <v-btn value="anim">
                    动漫
                  </v-btn>
                  <v-btn value="series">
                    剧集
                  </v-btn>
                  <v-btn value="game">
                    游戏
                  </v-btn>
                  <v-btn value="movie">
                    电影
                  </v-btn>
                </v-btn-toggle>
              </v-input>
            </v-col>
          </v-row>
          <v-expand-transition>
            <v-row v-show="data.type === 'anim' || data.type === 'series'">
              <v-col :cols="4" :sm="6" :md="4">
                <v-text-field
                  v-model="$v.data.ep.$model"
                  label="已观看"
                  placeholder="已观看集数"
                  type="number"
                  :error-messages="epError"
                />
              </v-col>
              <v-col :cols="4" :sm="6" :md="4">
                <v-text-field
                  v-model="$v.data.epCount.$model"
                  label="总集数"
                  placeholder="总集数"
                  type="number"
                  :error-messages="epCountError"
                />
              </v-col>
              <v-col :cols="4" :sm="12" :md="4" class="pt-6">
                <v-select
                  v-model="data.update"
                  :items="items"
                  item-text="text"
                  item-value="value"
                  label="更新时间"
                  persistent-hint
                  single-line
                  class="pt-0"
                />
              </v-col>
            </v-row>
          </v-expand-transition>
          <div style="text-align: end;">
            <v-btn class="ma-2" outlined color="primary" @click="submit">
              新建
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, integer, maxValue, minValue } from 'vuelidate/lib/validators'

import DropZone from '~/components/DropZone'
import LoginRequired from '~/components/LoginRequired'

export default {
  name: 'NewSeries',
  components: {
    DropZone,
    LoginRequired
  },
  mixins: [
    validationMixin
  ],
  validations () {
    return {
      data: {
        nameCn: { required },
        introduce: { required },
        ep: { required, integer, maxValue: maxValue(this.data.epCount), minValue: minValue(0) },
        epCount: { required, integer, minValue: minValue(0) }
      }
    }
  },
  data () {
    return {
      data: {
        name: '',
        nameCn: '',
        cover: '',
        ep: 0,
        epCount: 1,
        introduce: '',
        comment: '',
        type: 'anim',
        status: 'do',
        update: -1,
        link: '',
        star: 3
      },
      file: {
        id: '',
        url: ''
      },
      items: [
        { value: 0, text: '无/未知' },
        { value: 1, text: '周一' },
        { value: 2, text: '周二' },
        { value: 3, text: '周三' },
        { value: 4, text: '周四' },
        { value: 5, text: '周五' },
        { value: 6, text: '周六' },
        { value: 7, text: '周日' }
      ],
      created: false
    }
  },
  computed: {
    nameError () {
      let error = ''
      if (this.$v.data.nameCn.$dirty && this.$v.data.nameCn.$error) {
        error = '标题不能为空'
      }
      return error
    },
    introError () {
      let error = ''
      if (this.$v.data.introduce.$dirty && this.$v.data.introduce.$error) {
        error = '简介不能为空'
      }
      return error
    },
    epError () {
      if (this.$v.data.ep.$dirty) {
        if (!this.$v.data.ep.required) { return '不能为空' }
        if (!this.$v.data.ep.integer) { return '必须为整数' }
        if (!this.$v.data.ep.maxValue) { return '不能大于总集数' }
        if (!this.$v.data.ep.minValue) { return '不能小于0' }
      }
      return ''
    },
    epCountError () {
      if (this.$v.data.nameCn.$dirty) {
        if (!this.$v.data.ep.required) { return '不能为空' }
        if (!this.$v.data.ep.integer) { return '必须为整数' }
        if (!this.$v.data.ep.minValue) { return '不能小于0' }
      }
      return ''
    }
  },
  mounted () {
    if (this.$route.query.name) { this.data.name = this.$route.query.name }
    if (this.$route.query.nameCn) { this.data.title = this.$route.query.nameCn }
    if (this.$route.query.ep) { this.data.ep = Number(this.$route.query.ep) }
    if (this.$route.query.epCount) { this.data.epCount = Number(this.$route.query.epCount) }
    if (this.$route.query.type) { this.data.type = this.$route.query.type }
    if (this.$route.query.update) { this.data.update = Number(this.$route.query.update) }
    if (this.$route.query.introduce) { this.data.introduce = this.$route.query.introduce }
    if (this.$route.query.link) { this.data.link = this.$route.query.link }
    if (this.$route.query.cover) {
      const cover = this.$route.query.cover
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
      this.data.cover = this.file.id
      this.data.ep = Number(this.data.ep)
      this.data.epCount = Number(this.data.epCount)
      if (this.data.update === -1) { this.data.update = 0 }
      if (this.data.type === 'game' || this.data.type === 'movie') {
        this.data.ep = 0
        this.data.epCount = 0
        this.data.update = 0
      }

      this.$axios.post('/srs', this.data).then(({ data }) => {
        this.created = true
        this.$toast.success('新建成功')
        this.$router.push('/series/' + data.id)
      }).catch((err) => {
        if (err.response.status === 409) {
          this.$toast.error('项目已存在')
        }
      })
    }
  }
}
</script>

<template>
  <v-card>
    <v-progress-linear v-if="showProgress" :value="epCount ? ep / epCount * 100 : 0" color="primary" />
    <div class="d-flex flex-row">
      <v-avatar
        class="ma-3 elevation-4"
        size="125"
        tile
      >
        <v-img :src="cover" />
      </v-avatar>
      <div class="flex-grow-1" style="overflow: hidden">
        <div>
          <v-card-title class="pt-3 text-truncate d-block" :title="nameCn ? nameCn : name">
            {{ nameCn ? nameCn : name }}
          </v-card-title>
          <v-card-subtitle class="pb-2 text-truncate d-block">
            {{ name }}
          </v-card-subtitle>
          <v-card-text class="pb-0">
            <v-chip v-if="airWeekday !== 0" color="primary" small>
              {{ week[airWeekday] }}
            </v-chip>
            <v-chip v-if="showProgress" color="primary" small>
              {{ ep }}/{{ epCount ? epCount : '??' }}
            </v-chip>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn icon @click="linkHandle">
              <v-icon>fa-link</v-icon>
            </v-btn>
            <v-dialog v-model="dialog" width="500" :persistent="editLoading">
              <template v-slot:activator="{ on }">
                <v-btn class="ml-2" icon v-on="on">
                  <v-icon>fa-edit</v-icon>
                </v-btn>
              </template>
              <v-card>
                <v-card-title
                  primary-title
                >
                  更新状态
                </v-card-title>
                <v-card-text>
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
                  <v-textarea
                    v-model="data.comment"
                    filled
                    label="评论"
                    placeholder="评论"
                  />
                  <v-input label="评分">
                    <v-rating v-model="data.star" hover />
                  </v-input>
                  <v-text-field
                    v-model="$v.data.epCount.$model"
                    label="总集数"
                  />
                  <v-slider
                    v-if="epCount"
                    v-model="$v.data.ep.$model"
                    label="已观看集数"
                    thumb-label="always"
                    class="mt-8"
                    :min="1"
                    :max="epCount"
                  />
                  <v-text-field
                    v-else
                    v-model="$v.data.ep.$model"
                    label="已观看集数"
                    type="number"
                    placeholder="请输入集数"
                  />
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn class="mr-4 mb-2" text color="primary" :disabled="editLoading" @click="dialog = false">
                    取消
                  </v-btn>
                  <v-btn class="mr-4 mb-2" text color="primary" :loading="editLoading" @click="editHandle">
                    确认
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-btn icon @click="showIntro = !showIntro">
              <v-icon>fa-chevron-down</v-icon>
            </v-btn>
          </v-card-actions>
        </div>
      </div>
    </div>
    <v-slide-y-transition>
      <div v-show="showIntro" class="pa-2">
        <pre style="white-space: pre-wrap; word-wrap: break-word;">{{ introduce }}</pre>
      </div>
    </v-slide-y-transition>
  </v-card>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, integer, maxValue, minValue } from 'vuelidate/lib/validators'

export default {
  name: 'SeriesCard',
  mixins: [
    validationMixin
  ],
  validations () {
    return {
      data: {
        ep: { required, integer, maxValue: maxValue(this.data.epCount), minValue: minValue(0) },
        epCount: { required, integer, minValue: minValue(0) }
      }
    }
  },
  props: {
    nameCn: {
      type: String,
      required: true
    },
    cover: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    airWeekday: {
      type: Number,
      required: true
    },
    ep: {
      type: Number,
      required: true
    },
    epCount: {
      type: Number,
      required: true
    },
    link: {
      type: String,
      required: true
    },
    introduce: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      required: true
    },
    comment: {
      type: String,
      default: ''
    },
    star: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      data: {
        ep: this.ep,
        epCount: this.epCount,
        status: this.status,
        star: this.star,
        comment: this.comment
      },
      dialog: false,
      editLoading: false,
      week: ['', '周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      showIntro: false
    }
  },
  computed: {
    showProgress () {
      return this.type === 'anim' || this.type === 'series'
    }
  },
  methods: {
    linkHandle () {
      window.open(this.link, '_blank')
    },
    editHandle () {
      this.editLoading = true
      this.$axios.put(`/srs/${this.id}`, this.data).then(({ data }) => {
        this.$toast.success('更新成功')
        this.$emit('update')
        this.dialog = false
        this.editLoading = false
      }).catch(() => {
        this.$toast.error('未知错误')
        this.editLoading = false
      })
    }
  }
}
</script>

<template>
  <v-card>
    <v-progress-linear :value="epCount ? ep / epCount * 100 : 0" color="primary" />
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
            <v-chip color="primary" small>
              {{ week[airWeekday] }}
            </v-chip>
            {{ ep }} / {{ epCount ? epCount : '??' }}
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn icon @click="linkHandle"><v-icon>fa-link</v-icon></v-btn>
            <v-dialog v-model="dialog" width="500" :persistent="watchLoading">
              <template v-slot:activator="{ on }">
                <v-btn class="ml-2" icon v-on="on"><v-icon>fa-eye</v-icon></v-btn>
              </template>
              <v-card>
                <v-card-title
                  primary-title
                >
                  更改已观看集数
                </v-card-title>
                <v-card-text>
                  <v-slider
                    v-if="epCount"
                    v-model="watch"
                    thumb-label="always"
                    class="mt-8"
                    :min="1"
                    :max="epCount"
                  />
                  <v-text-field
                    v-else
                    v-model="watch"
                    type="number"
                    min="1"
                    placeholder="请输入集数"
                  />
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn class="mr-4 mb-2" text color="primary" :disabled="watchLoading" @click="dialog = false">取消</v-btn>
                  <v-btn class="mr-4 mb-2" text color="primary" :loading="watchLoading" @click="watchHandle">确认</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-btn icon><v-icon>fa-chevron-down</v-icon></v-btn>
          </v-card-actions>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script>
export default {
  name: 'BgmCard',
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
      type: Number,
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
    }
  },
  data () {
    return {
      dialog: false,
      watch: this.ep,
      watchLoading: false,
      week: ['', '周一', '周二', '周三', '周四', '周五', '周六', '周日']
    }
  },
  methods: {
    linkHandle () {
      window.open('https://bgm.tv/subject/' + this.id, '_blank')
    },
    watchHandle () {
      this.watchLoading = true
      this.$axios.post(`/bgm/subject/${this.id}/update/watched_eps`, { watched_eps: this.watch }).then(({ data }) => {
        if (data.code === 202) {
          this.$toast.success('更新成功')
          this.$emit('update')
          this.dialog = false
        } else {
          this.$toast.error('更新失败' + data.code)
        }
        this.watchLoading = false
      }).catch(() => {
        this.$toast.error('未知错误')
        this.watchLoading = false
      })
    }
  }
}
</script>

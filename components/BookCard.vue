<template>
  <v-hover v-slot:default="{ hover }">
    <v-card
      class="mx-auto"
      :elevation="hover ? 13 : 5"
      :dark="colorType"
      max-width="300px"
      :color="color"
      @click="dialog = true"
    >
      <v-img
        class="align-end"
        :src="cover + '-bookCover'"
      >
        <v-avatar
          v-if="showBadge"
          bordered
          size="36"
          :color="read === 'reading' ? 'primary' : (read === 'finish' ? 'success' : 'warning')"
          class="read-icon"
        >
          <v-icon size="20" color="white">
            {{read === 'reading' ? 'fa-book-open' : (read === 'finish' ? 'fa-book' : 'fa-clock')}}
          </v-icon>
        </v-avatar>
        <v-card-title :class="'font-weight-bold grey--text ' + (colorType ? 'text--lighten-5' : 'text--darken-4')">
          {{ title }}
        </v-card-title>
      </v-img>
      <v-card-text class="text--primary py-0 pl-2">
        <v-row>
          <v-col :cols="4" class="py-2" style="max-width: 72px; min-width: 60px">
            <v-avatar>
              <img :src="avatar + '-avatar'">
            </v-avatar>
          </v-col>
          <v-col :cols="8" style="padding: 10px 0 0 0">
            <div :class="'text-truncate pl-1 grey--text ' + (colorType ? 'text--lighten-4' : 'text--darken-3')">
              {{ author }}
            </div>
            <v-rating
              :value="star"
              readonly
              :background-color="color"
              color="yellow darken-4"
              dense
              size="18"
            />
          </v-col>
        </v-row>
      </v-card-text>
      <v-dialog v-model="dialog" width="500" :persistent="editLoading">
        <v-card>
          <v-card-title
            primary-title
          >
            更新状态
          </v-card-title>
          <v-card-text>
            <v-radio-group
              v-model="data.read"
              label="状态"
              row
            >
              <v-radio label="未读" value="wait" color="error" />
              <v-radio label="在读" value="reading" color="warning" />
              <v-radio label="已读" value="finish" color="success" />
            </v-radio-group>
            <v-input label="评分">
              <v-rating v-model="data.star" hover />
            </v-input>
            <v-textarea
              v-model="data.comment"
              filled
              label="评论"
              placeholder="评论"
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
    </v-card>
  </v-hover>
</template>

<script>
export default {
  name: 'BookCard',
  props: {
    id: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    },
    star: {
      type: Number,
      required: true
    },
    cover: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
      required: true
    },
    read: {
      type: String,
      required: true
    },
    comment: {
      type: String,
      default: ''
    },
    showBadge: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dialog: false,
      editLoading: false,
      data: {
        read: this.read,
        star: this.star,
        comment: this.comment
      }
    }
  },
  computed: {
    colorType () {
      const r = parseInt(this.color.substr(1, 2), 16)
      const g = parseInt(this.color.substr(3, 2), 16)
      const b = parseInt(this.color.substr(5, 2), 16)
      const rgb = []
      rgb[0] = r / 255
      rgb[1] = g / 255
      rgb[2] = b / 255
      let min = rgb[0]
      let max = rgb[0]
      for (let i = 0; i < rgb.length - 1; i++) {
        if (rgb[i + 1] <= min) {
          min = rgb[i + 1]
        }
        if (rgb[i + 1] >= max) {
          max = rgb[i + 1]
        }
      }
      return (min + max) / 2 < 0.5
    }
  },
  methods: {
    editHandle () {
      this.editLoading = true
      this.$axios.put(`/books/${this.id}`, this.data).then(({ data }) => {
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

<style>
.read-icon {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>

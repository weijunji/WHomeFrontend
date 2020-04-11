<template>
  <div class="drop-zone pa-2 continuous-borders" style="width: 100%">
    <v-responsive :aspect-ratio="aspectRatio">
      <v-overlay absolute :value="uploading" :opacity="0.7">
        <v-progress-circular indeterminate size="32" />
      </v-overlay>
      <input ref="inputFile" type="file" accept="image/*" style="display: none" @change="inputChange">
      <div v-if="file.url" style="position: relative">
        <v-hover v-slot:default="{ hover }">
          <div>
            <img :src="file.url" style="width: 100%" crossorigin="Anonymous">
            <v-fade-transition>
              <v-btn
                v-if="hover"
                dark
                fab
                color="error"
                @click="remove"
              >
                <v-icon>fa-trash-alt</v-icon>
              </v-btn>
            </v-fade-transition>
          </div>
        </v-hover>
      </div>
      <div
        v-else
        style="width: 100%; height: 100%;"
        @drop="drop"
        @click="click"
      >
        <slot>
          <div class="text-center inner">
            <v-icon x-large color="primary">
              fa-cloud-upload-alt
            </v-icon>
            <h3>
              {{ title }}
            </h3>
            <div style="color: rgba(0, 0, 0, 0.6)">
              点击或拖动文件
            </div>
          </div>
        </slot>
      </div>
    </v-responsive>
  </div>
</template>

<script>
export default {
  name: 'DropZone',
  model: {
    prop: 'file',
    event: 'change'
  },
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
    file: {
      type: Object,
      required: true
    },
    aspectRatio: {
      type: Number,
      default: 1 / 1.414
    },
    title: {
      type: String,
      default: '上传图片'
    }
  },
  data () {
    return {
      uploading: false
    }
  },
  methods: {
    handleUrl (url) {
      const fd = new FormData()
      fd.append('url', url)
      this.upload(fd)
    },
    upload (fd) {
      this.uploading = true
      this.$axios.post('/upload', fd).then(({ data }) => {
        this.url = data[0].url
        this.$emit('change', { id: data[0].id, url: data[0].url })
        this.uploading = false
      })
    },
    remove () {
      this.$axios.delete(`/upload/files/${this.file.id}`)
      this.$emit('change', { id: 0, url: '' })
      this.$refs.inputFile.value = ''
    },
    drop (ev) {
      ev.preventDefault()
      this.dragover = false
      if (ev.dataTransfer.types[0] === 'Files') {
        if (ev.dataTransfer.files[0].type.includes('image')) {
          const fd = new FormData()
          fd.append('files', ev.dataTransfer.files[0])
          this.upload(fd)
        }
      } else if (ev.dataTransfer.getData('text/uri-list')) {
        const fd = new FormData()
        fd.append('url', ev.dataTransfer.getData('text/uri-list'))
        this.upload(fd)
      }
    },
    click () {
      this.$refs.inputFile.click()
    },
    inputChange ({ target }) {
      if (target.files[0]) {
        const fd = new FormData()
        fd.append('files', target.files[0])
        this.upload(fd)
      }
    }
  }
}
</script>

<style lang="scss">
@keyframes ants {
  to { background-position: 100%; }
}
.drop-zone {
  padding: 1em;
  border: 2px dashed transparent;
  background: linear-gradient(white, white) padding-box,
    repeating-linear-gradient(-45deg, #1976D2 0, #1976D2 25%, white 0, white 50%) 0 / 1em 1em;
  .inner {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  button {
    position: absolute;
    top: 5%;
    right: 5%;
  }
  &:hover {
    animation: ants 12s linear infinite;
  }
}
</style>

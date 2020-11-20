<template>
  <v-input :error-messages="errorMessages">
    <div id="editor" :style="{height}" style="background-color: #ffffff" />
  </v-input>
</template>

<script>
import Vditor from 'vditor'

export default {
  name: 'Editor',
  model: {
    prop: 'content',
    event: 'change'
  },
  props: {
    content: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: '500px'
    },
    errorMessages: {
      type: [String, Array],
      default: ''
    },
    edit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      editor: ''
    }
  },
  mounted () {
    this.editor = new Vditor('editor', {
      typewriterMode: true,
      tab: '    ',
      mode: 'ir',
      value: this.content,
      width: '100%',
      cache: {
        enable: !this.edit,
        id: 'blogEditor'
      },
      preview: {
        theme: {
          current: 'ant-design'
        },
        hljs: {
          enable: true,
          style: 'monokailight',
          lineNumber: true
        }
      },
      upload: {
        max: 100 * 1024 * 1024,
        handler: this.uploadFiles
      },
      input: this.input
    })
    if (!this.edit) {
      this.$emit('change', window.localStorage.blogEditor)
    }
  },
  methods: {
    input (val) {
      this.$emit('change', val)
    },
    clear () {
      this.editor.clearCache()
    },
    getElement (vditor) {
      switch (vditor.currentMode) {
        case 'ir':
          return vditor.ir.element
        case 'wysiwyg':
          return vditor.wysiwyg.element
        case 'sv':
          return vditor.sv.element
      }
    },
    getEditorRange (element) {
      let range
      if (getSelection().rangeCount > 0) {
        range = getSelection().getRangeAt(0)
        if (element.isEqualNode(range.startContainer) || element.contains(range.startContainer)) {
          return range
        }
      }
      range = element.ownerDocument.createRange()
      range.setStart(element, 0)
      range.collapse(true)
      return range
    },
    code160to32 (text) {
      return text.replace(/\u00A0/g, ' ')
    },
    formatRender (vditor, content, position) {
      const textList = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n')
      let html = ''
      const newLine = '<span><br><span style="display: none">\n</span></span>'
      let isEmpty = true
      textList.forEach((text, index) => {
        if (text !== '') {
          isEmpty = false
        }
        if (index === textList.length - 1 && text === '') {
          return
        }
        if (text) {
          html += `<span>${this.code160to32(text.replace(/&/g, '&amp;').replace(/</g, '&lt;'))}</span>${newLine}`
        } else {
          html += newLine
        }
      })
      if (textList.length <= 2 && isEmpty) {
        vditor.sv.element.innerHTML = ''
      } else {
        vditor.sv.element.innerHTML = html || newLine
      }
    },
    selectIsEditor (editor, range) {
      if (!range) {
        if (getSelection().rangeCount === 0) {
          return false
        } else {
          range = getSelection().getRangeAt(0)
        }
      }
      const container = range.commonAncestorContainer
      return editor.isEqualNode(container) || editor.contains(container)
    },
    getSelectPosition (editorElement, range) {
      const position = {
        end: 0,
        start: 0
      }
      if (!range) {
        if (getSelection().rangeCount === 0) {
          return position
        }
        range = window.getSelection().getRangeAt(0)
      }
      if (this.selectIsEditor(editorElement, range)) {
        const preSelectionRange = range.cloneRange()
        if (editorElement.childNodes[0] && editorElement.childNodes[0].childNodes[0]) {
          preSelectionRange.setStart(editorElement.childNodes[0].childNodes[0], 0)
        } else {
          preSelectionRange.selectNodeContents(editorElement)
        }
        preSelectionRange.setEnd(range.startContainer, range.startOffset)
        position.start = preSelectionRange.toString().length
        position.end = position.start + range.toString().length
      }
      return position
    },
    insertTextSV (vditor, prefix) {
      const range = this.getEditorRange(vditor.sv.element)
      const position = this.getSelectPosition(vditor.sv.element, range)
      const content = this.code160to32(`${vditor.sv.element.textContent}\n`.replace(/\n\n$/, '\n'))
      this.formatRender(vditor, content.substring(0, position.start) + prefix + content.substring(position.end),
        {
          end: position.start + prefix.length,
          start: position.start + prefix.length
        })
    },
    genUploadedLabel (data, vditor) {
      const editorElement = this.getElement(vditor)
      editorElement.focus()

      let fileText = ''
      for (const file of data) {
        const path = file.url
        const filename = file.name
        const fns = filename.split('.')
        const type = fns[fns.length - 1].toLowerCase()
        if (type === '.wav' || type === '.mp3' || type === '.ogg') {
          if (vditor.currentMode === 'wysiwyg') {
            fileText += `<div class="vditor-wysiwyg__block" data-type="html-block"
 data-block="0"><pre><code>&lt;audio controls="controls" src="${path}"&gt;&lt;/audio&gt;</code></pre>`
          } else {
            fileText += `<audio controls="controls" src="${path}"></audio>\n`
          }
        } else if (type === '.apng' || type === '.bmp' || type === '.gif' || type === '.ico' || type === '.cur' ||
            type === '.jpg' || type === '.jpeg' || type === '.jfif' || type === '.pjp' || type === '.pjpeg' ||
            type === '.png' || type === '.svg' || type === '.webp') {
          if (vditor.currentMode === 'wysiwyg') {
            fileText += `<img alt="${filename}" src="${path}">`
          } else {
            fileText += `![${filename}](${path})\n`
          }
        } else if (vditor.currentMode === 'wysiwyg') {
          fileText += `<a href="${path}">${filename}</a>`
        } else {
          fileText += `[${filename}](${path})\n`
        }
      }
      const selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(vditor.upload.range)
      if (vditor.currentMode !== 'sv') {
        document.execCommand('insertHTML', false, fileText)
      } else {
        this.insertTextSV(vditor, fileText)
      }
      vditor.upload.range = getSelection().getRangeAt(0).cloneRange()
    },
    uploadFiles (files) {
      const vditor = this.editor.vditor
      const editorElement = this.getElement(vditor)
      vditor.upload.range = this.getEditorRange(editorElement)
      vditor.upload.isUploading = true
      editorElement.setAttribute('contenteditable', 'false')
      const fd = new FormData()
      for (const file of files) {
        fd.append('files', file)
      }
      this.$axios.post('/upload', fd).then(({ data }) => {
        vditor.upload.isUploading = false
        const element = document.querySelector('#editor input')
        if (element) {
          element.value = ''
        }
        editorElement.setAttribute('contenteditable', 'true')
        editorElement.focus()
        this.genUploadedLabel(data, vditor)
        vditor.upload.element.style.display = 'none'
        vditor.tip('上传成功', 3)
      })
    }
  }
}
</script>

<style lang="scss">
.v-application code:before {
  content: ""!important;
}
.v-application code:after {
  content: ""!important;
}
</style>

<template>
  <v-container>
    <v-form>
      <v-text-field
        v-model="data.title"
        label="标题"
        placeholder="请输入标题"
        outlined
        :error-messages="titleErrors"
        @blur="$v.title.$touch()"
      />
      <Editor v-model="data.content" />
    </v-form>
  </v-container>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import Editor from '~/components/Editor'

export default {
  name: 'NewBlog',
  components: {
    Editor
  },
  mixins: [
    validationMixin
  ],
  validations: {
    title: { required }
  },
  data () {
    return {
      data: {
        title: '',
        content: ''
      },
      titleErrors: ''
    }
  }
}
</script>

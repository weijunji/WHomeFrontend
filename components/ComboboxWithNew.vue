<template>
  <v-combobox
    :label="label"
    :items="items"
    :item-text="itemText"
    :item-value="itemId"
    :search-input.sync="search"
    deletable-chips
    hide-selected
    multiple
    persistent-hint
    small-chips
    :error-messages="errorMessages"
    @change="change"
  >
    <template v-slot:no-data>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            No results matching "<strong>{{ search }}</strong>". Press <kbd>enter</kbd> to create a new one
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
  </v-combobox>
</template>

<script>
export default {
  name: 'ComboboxWithNew',
  model: {
    prop: 'selects',
    event: 'change'
  },
  props: {
    label: {
      type: String,
      default: ''
    },
    selects: {
      type: Array,
      required: true
    },
    newUrl: {
      type: String,
      required: true
    },
    newText: {
      type: String,
      default: 'name'
    },
    itemsQuery: {
      type: String,
      required: true
    },
    itemsProp: {
      type: String,
      default: 'items'
    },
    itemId: {
      type: String,
      default: 'id'
    },
    itemText: {
      type: String,
      default: 'name'
    },
    errorMessages: {
      type: [String, Array],
      default: ''
    }
  },
  data () {
    return {
      search: '',
      items: []
    }
  },
  created () {
    this.$axios.post('/graphql', { query: this.itemsQuery }).then(({ data }) => {
      this.items = data.data[this.itemsProp] || []
    }).catch((e) => {
      this.$toast.error('数据初始化失败: ' + e.message)
    })
  },
  methods: {
    newItem () {
      const data = {}
      data[this.newText] = this.search
      this.$axios.post(this.newUrl, data).then(({ data }) => {
        this.items.push(data)
        this.$emit('change', data.id)
        this.$toast.success('新建成功')
      }).catch((e) => {
        this.$toast.error('新建失败: ' + e.message)
      })
    },
    change (value) {
      this.$emit('change', value)
    }
  }
}
</script>

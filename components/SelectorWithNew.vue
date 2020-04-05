<template>
  <v-overflow-btn
    :items="items"
    :label="label"
    editable
    :item-text="itemText"
    :item-value="itemId"
    :search-input.sync="search"
    @change="change"
  >
    <template v-slot:item="{ item }">
      <v-list-item-avatar v-if="avatar">
        <img :src="item[itemAvatar] ? item[itemAvatar].url : unknownAvatar">
      </v-list-item-avatar>
      <v-list-item-title>
        {{ item[itemText] }}
      </v-list-item-title>
    </template>
    <v-list-item slot="no-data" @click="newItem">
      新建 "{{ search }}"
    </v-list-item>
  </v-overflow-btn>
</template>

<script>
export default {
  name: 'SelectorWithNew',
  model: {
    prop: 'selectId',
    event: 'change'
  },
  props: {
    label: {
      type: String,
      default: ''
    },
    selectId: {
      type: String,
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
    avatar: {
      type: Boolean,
      default: false
    },
    itemAvatar: {
      type: String,
      default: 'avatar'
    },
    unknownAvatar: {
      type: String,
      default: 'https://cdn.weijunji.top/files/unknown.png'
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
      console.log(value)
      this.$emit('change', value)
    }
  }
}
</script>

<template>
  <v-card class="mb-4" @click="$router.push(`/blogs/${id}`)">
    <v-card-title>
      {{ title }}
    </v-card-title>
    <v-card-subtitle>
      <span class="d-none d-sm-inline">
        <v-icon :size="15">fa-plus</v-icon>
        创建于{{ createdTime }}&nbsp;&nbsp;
      </span>
      <span>
        <v-icon :size="15">fa-edit</v-icon>
        编辑于{{ updatedTime }}
      </span>
    </v-card-subtitle>
    <v-card-text>
      <span>
        <v-icon :size="15" :color="category.color">{{ category.icon }}</v-icon>
        {{ category.name }}
      </span>
      <v-chip
        v-for="tag of tags"
        :key="tag.name"
        small
        class="mx-1"
      >
        {{ tag.name }}
      </v-chip>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'BlogCard',
  props: {
    id: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    created: {
      type: String,
      required: true
    },
    updated: {
      type: String,
      required: true
    },
    category: {
      type: Object,
      required: true
    },
    tags: {
      type: Array,
      required: true
    }
  },
  computed: {
    createdTime () {
      return this.created.split('T')[0]
    },
    updatedTime () {
      return this.updated.split('.')[0].replace('T', ' ')
    }
  }
}
</script>

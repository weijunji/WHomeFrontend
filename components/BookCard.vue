<template>
  <v-card
    class="mx-auto elevation-7"
    :dark="colorType"
    max-width="300px"
    :color="color"
  >
    <v-img
      class="align-end"
      :src="cover"
    >
      <v-card-title :class="'font-weight-bold grey--text ' + (colorType ? 'text--lighten-5' : 'text--darken-4')">
        {{ title }}
      </v-card-title>
    </v-img>
    <v-card-text class="text--primary py-0 pl-2">
      <v-row>
        <v-col :cols="4" class="py-2" style="max-width: 72px; min-width: 60px">
          <v-avatar>
            <img :src="avatar">
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
  </v-card>
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
  }
}
</script>

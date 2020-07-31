<template>
  <v-container>
    <v-row>
      <v-col
        v-for="tool in tools"
        :key="tool.name"
        xs="12"
        sm="6"
        md="3"
        lg="3"
        xl="2"
      >
        <v-hover v-slot:default="{ hover }">
          <v-card
            :elevation="hover ? 5 : 2"
            @click="$router.push(`/tools/${tool.link}`)"
          >
            <div class="d-flex flex-no-wrap justify-space-between">
              <div>
                <v-card-title
                  class="headline"
                  v-text="tool.name"
                />
                <v-card-subtitle class="pt-0 pb-2" v-text="tool.category" />
              </div>

              <v-avatar
                class="ma-3"
                size="64"
                tile
              >
                <v-img :src="`/statics/tools/${tool.icon}`" />
              </v-avatar>
            </div>
            <v-card-subtitle class="pt-0 pb-2 text-truncate" v-text="tool.description" />
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Tools',
  data () {
    return {
      tools: [
        {
          name: 'Bingo',
          icon: 'bingo.png',
          link: 'bingo',
          category: 'game',
          description: '可自定义 bingo 游戏'
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>

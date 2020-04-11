<template>
  <v-container>
    <LoginRequired />
    <v-card>
      <v-card-title class="py-0 pl-0">
        <div>
          <v-tabs
            v-model="tab"
          >
            <v-tab
              v-for="item in tabItems"
              :key="item.value"
              :disabled="updating"
            >
              {{ item.text }}
            </v-tab>
          </v-tabs>
        </div>
        <v-spacer />
        <div class="my-auto">
          <v-btn :loading="updating" icon @click="updating = true"><v-icon>fa-redo</v-icon></v-btn>
        </div>
      </v-card-title>
      <v-card-text>
        <v-tabs-items v-model="tab">
          <v-tab-item
            v-for="item of tabItems"
            :key="item.value"
          >
            <SeriesTab
              v-model="updating"
              :status="item.value"
              :index="item.index"
              :current="tab"
            />
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>
    </v-card>
    <v-btn
      dark
      fab
      large
      color="pink"
      style="bottom: 10vh; right: 20vw; position: fixed"
      to="/series/new"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </v-container>
</template>

<script>
import LoginRequired from '~/components/LoginRequired'
import SeriesTab from '~/components/SeriesTab'

export default {
  name: 'Bgm',
  components: {
    SeriesTab,
    LoginRequired
  },
  data () {
    return {
      updating: true,
      tab: 0,
      tabItems: [
        {
          index: 0,
          value: 'do',
          text: '在看'
        },
        {
          index: 1,
          value: 'wish',
          text: '未看'
        },
        {
          index: 2,
          value: 'finish',
          text: '已看'
        },
        {
          index: 3,
          value: 'hold',
          text: '搁置'
        }
      ]
    }
  }
}
</script>

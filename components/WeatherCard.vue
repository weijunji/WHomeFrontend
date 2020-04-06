<template>
  <v-card class="mx-auto" :class="weatherClass" max-width="400" color="yellow">
    <v-list-item two-line>
      <v-list-item-content>
        <v-list-item-title class="headline">
          {{ data.basic.location }}
          <span class="subtitle" style="font-size: 15px;">{{ data.basic.admin_area }}, {{ data.basic.cnty }}</span>
        </v-list-item-title>
        <v-list-item-subtitle>更新于 {{ data.update.loc }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-card-text>
      <v-row align="center">
        <v-col cols="6">
          <div class="display-3">
            {{ `${night ? data.daily_forecast[0].tmp_min : data.daily_forecast[0].tmp_max}` }}&deg;C
          </div>
          <div>湿度: <span class="display-1">{{ data.daily_forecast[0].hum }}%</span></div>
        </v-col>
        <v-col cols="6">
          <v-img :src="`/statics/weather/${getIcon(night ? data.daily_forecast[0].cond_code_n : data.daily_forecast[0].cond_code_d)}.svg`" />
        </v-col>
      </v-row>
      <v-divider />
      <v-row>
        <v-col v-for="item in data.daily_forecast" :key="item.date" cols="4">
          <v-img aspect-ratio="1" contain :src="`/statics/weather/${item.cond_code_d}.svg`" />
          <div class="text-center mt-1 title">
            {{ `${item.tmp_min}~${item.tmp_max}&deg;C` }}
          </div>
          <div class="text-center subtitle">
            {{ `${Number(item.date.split('-')[1])}/${Number(item.date.split('-')[2])}` }}
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'WeatherCard',
  data () {
    return {
      data: {
        basic: {
          location: 'Unknown'
        },
        update: {
          loc: '--'
        },
        daily_forecast: [
          {
            date: '2020-1-1',
            cond_code_d: '999',
            cond_code_n: '999',
            cond_txt_d: 'N/A',
            cond_txt_n: 'N/A',
            hum: 'N/A',
            tmp_max: 'N/A',
            tmp_min: 'N/A'
          },
          {
            date: '2020-1-2',
            cond_code_d: '999',
            cond_code_n: '999',
            cond_txt_d: 'N/A',
            cond_txt_n: 'N/A',
            hum: 'N/A',
            tmp_max: 'N/A',
            tmp_min: 'N/A'
          },
          {
            date: '2020-1-3',
            cond_code_d: '999',
            cond_code_n: '999',
            cond_txt_d: 'N/A',
            cond_txt_n: 'N/A',
            hum: 'N/A',
            tmp_max: 'N/A',
            tmp_min: 'N/A'
          }
        ]
      }
    }
  },
  computed: {
    night () {
      const date = new Date()
      const hours = date.getHours()
      return hours < 6 || hours > 18
    },
    weatherClass () {
      let code
      if (this.night) {
        code = this.data.daily_forecast[0].cond_code_n
      } else {
        code = this.data.daily_forecast[0].cond_code_d
      }
      if (code[0] === '1') {
        if (code[2] === '0' || code[2] === '4') {
          return 'sunny'
        } else {
          return 'cloudy'
        }
      } else if (code[0] === '2') {
        return 'wind'
      } else if (code[0] === '3') {
        return 'rain'
      } else if (code[0] === '4') {
        return 'snow'
      } else if (code[0] === '5') {
        return 'dustorm'
      } else {
        return 'sunny'
      }
    }
  },
  beforeCreate () {
    this.$axios.get('https://free-api.heweather.net/s6/weather/forecast?key=8ed81bcc72fd42e79c316665482704cd&location=auto_ip').then(
      ({ data }) => {
        this.data = data.HeWeather6[0]
        console.log(this.data)
      }
    )
  },
  methods: {
    getIcon (id) {
      if (id === '100' || id === '103' || id === '104' || id === '300' || id === '301' || id === '406' || id === '407') {
        if (this.night) {
          id += 'n'
        }
      }
      return id
    }
  }
}
</script>

<style>
.sunny {
  background: linear-gradient(150deg, rgb(87, 203, 252) 26%, rgb(119, 208, 252) 70%);
}
.cloudy {
  background: linear-gradient(150deg, rgb(243, 246, 242) 26%, rgb(250, 252, 254) 70%);
}
.snow {
  background: linear-gradient(150deg, rgb(228, 239, 254) 26%, rgb(234, 252, 253) 70%);
}
.rain {
  background: linear-gradient(150deg, rgb(193, 205, 215) 26%, rgb(206, 211, 221) 70%);
}
.dustorm {
  background: linear-gradient(150deg, rgb(252, 194, 110) 26%, rgb(254, 213, 121) 70%);
}
.wind {
  background: linear-gradient(150deg, rgb(88, 168, 219) 26%, rgb(168, 214, 238) 70%);
}
</style>

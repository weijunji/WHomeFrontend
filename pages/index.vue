<template>
  <v-container>
    <v-row>
      <v-col :cols="12" :sm="8">
        MAIN
      </v-col>
      <v-col :cols="4" class="d-none d-sm-flex">
        <weather-card />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import WeatherCard from '~/components/WeatherCard'
export default {
  name: 'Books',
  components: {
    WeatherCard
  },
  beforeMount () {
    this.$axios.get('/books')
  }
}
</script>

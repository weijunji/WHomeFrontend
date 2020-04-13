<template>
  <div id="page">
    <v-list id="drawer" class="pa-0" color="#F3F3F4">
      <div class="mb-2 mr-2">
        <v-btn v-if="isLogin" color="primary" depressed width="100%" to="/blogs/new">
          新建博客
        </v-btn>
      </div>
      <v-hover
        v-for="item in items"
        :key="item.name"
        v-slot:default="{ hover }"
      >
        <v-list-item
          :class="{'cate-active': category === item.name}"
          :ripple="false"
          @click="category = item.name"
        >
          <v-list-item-icon>
            <v-icon :color="(hover || category === item.name) ? item.color : ''">
              {{ item.icon }}
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-hover>
    </v-list>
    <v-card id="main" flat>
      <div v-for="item of items" :key="item.name">
        <keep-alive>
          <BlogTab
            v-if="category === item.name"
            :category="item.name"
          />
        </keep-alive>
      </div>
    </v-card>
    <div id="cards">
      <weather-card id="card" />
    </div>
    <v-btn
      v-if="isLogin"
      id="new-btn"
      dark
      fab
      large
      color="pink"
      to="/blogs/new"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </div>
</template>

<script>
import BlogTab from '~/components/BlogTab'
import WeatherCard from '~/components/WeatherCard'

export default {
  name: 'Home',
  components: {
    BlogTab,
    WeatherCard
  },
  data () {
    return {
      category: '全部',
      items: [
        { name: '全部', icon: 'fa-eye' }
      ]
    }
  },
  computed: {
    isLogin () {
      return this.$store.state.token !== ''
    }
  },
  created () {
    this.$axios.post('/graphql', {
      query: 'query{blogCategories{name icon color}}'
    }).then(({ data }) => {
      const items = data.data.blogCategories
      items.unshift({ name: '全部', icon: 'fa-eye', color: '#1976D2' })
      this.items = items
    })
  }
}
</script>

<style lang="scss" scoped>
.cate-active {
  box-shadow: 0 6px 10px 0 hsla(0,0%,91.8%,.8);
  opacity: 1;
  background: white;
  color: var(--active-color)!important;
  &>div{
    transform: translateX(-2px);
  }
}
.v-list-item {
  border-radius: 10px 0 0 10px;
  margin-bottom: 4px;
  &::before {
    content: "";
    position: absolute;
    border-radius: 10px 0 0 10px;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    box-shadow: 0 6px 10px 0 hsla(0,0%,91.8%,.8);
    opacity: 0;
    background: white;
  }
  &:hover:not(.cate-active) {
    background: white;
    &>div {
      transform: translateX(-2px);
    }
    &::before{
      opacity: 1;
    }
  }
}
#page {
  padding: 20px 20px 0 20px;
  float: left;
  width: 100%;
  background: #F3F3F4;
}
#drawer {
  display: none;
}
#main {
  padding: 20px;
  float: left;
  width: 100%;
  background: white;
  min-height: calc(100vh - 120px);
  border-radius: 0 4px 4px 0;
}
#cards {
  display: none;
}
#new-btn {
  display: flex;
  bottom: 10vh;
  right: 10vw;
  position: fixed
}
@media (min-width: 900px){
  #page {
    padding: 20px 20px 0 350px;
  }
  #drawer {
    display: block;
    position: fixed;
    top: 84px;
    left: 20px;
    width: 330px;
  }
  #new-btn {
    display: none;
  }
  #main {
    float: left;
    width: 100%;
  }
}
@media (min-width: 1200px){
  #page {
    padding: 20px 20px 0 350px;
  }
  #drawer {
    position: fixed;
    top: 84px;
    left: 20px;
    width: 330px;
  }
  #main {
    float: left;
    width: calc(100% - 350px);
    margin-right: 20px;
  }
  #cards {
    float: right;
    display: block;
    width: 330px;
  }
}
</style>

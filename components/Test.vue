<template>
  <div>{{ text }}</div>
</template>

<script>
export default {
  name: 'Test',
  props: {
    text: {
      type: String,
      default: 'test'
    }
  },
  beforeCreate () {
    // console.log('beforeCreate: ' + this.text)
  },
  created () {
    console.log('created: ' + this.text)
  },
  beforeMount () {
    console.log('beforeMount: ' + this.text)
  },
  mounted () {
    console.log('mounted: ' + this.text)
  },
  beforeUpdate () {
    console.log('beforeUpdate: ' + this.text)
  },
  updated () {
    console.log('updated: ' + this.text)
  },
  beforeDestroy () {
    console.log('beforeDestroy: ' + this.text)
  },
  destroyed () {
    console.log('destroyed: ' + this.text)
  }
}
</script>

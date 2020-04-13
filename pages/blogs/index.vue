<template>
  <div>Redirect to Home</div>
</template>

<script>
export default {
  name: 'Blogs',
  created () {
    this.$router.replace('/')
  }
}
</script>

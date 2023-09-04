<template>
  <div id="app">
    <ImageHotspot></ImageHotspot>
  </div>
</template>

<script>
import ImageHotspot from '../ImageHotspot.vue'

export default {
  name: 'App',
  components: {
    ImageHotspot
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

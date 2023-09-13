<template>
  <div id="app">
    <div style="margin: auto; width: 80%">
      <ImageHotspot @pointsUpdated="pointsUpdated" @imageUploaded="imageUploaded"></ImageHotspot>
    </div>
    <div v-if="points" style="width: 80%; margin: 20px auto auto;">
      <ImageHotspot read-only :prop-points="points" prop-image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAGbzrhpTi4Q0o5o0JSRVDSZ6zifJth2yxXYg26zgW&s"></ImageHotspot>
    </div>
  </div>
</template>

<script>
import ImageHotspot from '../ImageHotspot.vue'

export default {
  name: 'App',

  components: {
    ImageHotspot
  },

  data() {
    return {
      points: null,
      image: null
    }
  },

  methods: {
    pointsUpdated(points) {
      this.points = points
    },

    imageUploaded(image) {
      this.image = image
    },
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

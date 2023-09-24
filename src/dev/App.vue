<template>
  <div id="app">
<!--    <div style="margin: auto; width: 80%">-->
<!--      <ImageHotspot @pointsUpdated="pointsUpdated" @imageUploaded="imageUploaded"></ImageHotspot>-->
<!--    </div>-->
    <div v-if="points" style="width: 80%; margin: 20px auto auto;">
      <ImageHotspot read-only :prop-points="points" :prop-image="image"></ImageHotspot>
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
      points: [
        {
          x: 370,
          y: 90,
          title: 'Title',
          description: 'Some kind of a long description they may put in somewhere like here, Some kind of a long description they may put in somewhere like here, Some kind of a long description they may put in somewhere like here, Some kind of a long description they may put in somewhere like here, Some kind of a long description they may put in somewhere like here, Some kind of a long description they may put in somewhere like here, Some kind of a long description they may put in somewhere like here, Some kind of a long description they may put in somewhere like here, Some kind of a long description they may put in somewhere like here, Some kind of a long description they may put in somewhere like here, ',
          button_text: 'Google',
          button_link: 'https://google.com',
        },
        {
          x: 680,
          y: 160,
          title: 'Title',
          description: 'Some kind of a long description they may put in somewhere like here, Some kind of a long description they may put in somewhere like here, Some kind of a long description they may put in somewhere like here, Some kind of a long description they may put in somewhere like here, Some kind of a long description they may put in somewhere like here, Some kind of a long description they may put in somewhere like here, Some kind of a long description they may put in somewhere like here, Some kind of a long description they may put in somewhere like here, Some kind of a long description they may put in somewhere like here, Some kind of a long description they may put in somewhere like here, ',
          button_text: 'Google',
          button_link: 'https://google.com',
        },
      ],
      image: 'https://openmaptiles.org/img/home-banner-map.png'
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

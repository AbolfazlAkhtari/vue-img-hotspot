# Vue Image Hotspot

> This package provides functionality for putting hotspot points on an image

[//]: # (<p align="center">)

[//]: # (  <br>)

[//]: # (  <img src="https://www.dropbox.com/s/8hp8d8fczqnz6e7/emagif2.gif?raw=1" width="600" />)

[//]: # (  <br>)

[//]: # (</p>)

# Table of Contents
* [Installation](#installation)
* [Usage](#usage)
    * [Adding Points](#adding-points)
    * [Showing Points](#showing-points)
    * [Full Implementation](#full-implementation)

## Installation

``` bash
npm i vue-img-hotspot
```

Then by using it in `main.js` file, It's globally available in all components:
``` javascript 
import ImageHotspot from 'vue-img-hotspot';
...
Vue.use( ImageHotspot );
```

## Usage
### Adding Points
Template:
``` vue
<template>
  <ImageHotspot @pointsUpdated="pointsUpdated" @imageUploaded="imageUploaded"></ImageHotspot>
</template>
```
Script:
``` javascript
<script>
  data() {
    return {
      points: [],
      image: null",
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
</script>
```

### Showing Points
The `read-only` parameter prevents the package from opening a dialog on every click. 
<br>
Template:
``` vue
<template>
  <ImageHotspot read-only :prop-points="points" :prop-image="image"></ImageHotspot>
</template>
```
Script:
``` javascript
<script>
  data() {
    return {
      points: [
        {
          x: 370,
          y: 90,
          title: 'Lorem',
          description: 'Lorem ipsum',
          button_text: 'Google',
          button_link: 'https://google.com',
        },
        {
          x: 680,
          y: 160,
          title: 'Lorem',
          description: 'Lorem ipsum',
          button_text: null',
          button_link: null',
        },
      ],
      image: 'https://openmaptiles.org/img/home-banner-map.png'
    }
  }
</script>
```

### Full Implementation
Additionally, you can combine both of the above-mentioned props and events and use them in case of providing update functionality
<br>
<br>
Template:
``` vue
<template>
  <ImageHotspot 
    @pointsUpdated="pointsUpdated" @imageUploaded="imageUploaded"
    :prop-points="points" :prop-image="image">
  </ImageHotspot>
</template>
```
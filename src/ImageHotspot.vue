<template>
  <div class="image-wrapper" :style="{direction: direction}">
    <h4 v-if="!readOnly">{{ topPageText }}</h4>
    <input v-if="!image" id="file" name="file" class="file-input" type="file" accept="image/*" @change="saveImage">

    <div v-if="image">
      <img id="hotspot-image" width="100%" v-if="readOnly" :src="image">
      <img id="hotspot-image" width="100%" v-else @mousedown="addPoint" :src="image">

      <div v-for="(point, index) in points" :key="index" class="hotspot-circle"
           :ref="'hotspot-circle-' + index" @mouseenter="openPointCard" @mouseleave="closePointCard"
           @click="readOnly ? showPoint(point) : editPoint(point, index)">
        <div class="point-card">
          <h6 class="point-card-title">{{ point.title }}</h6>
        </div>
        <div class="hotspot-inner-circle"></div>
      </div>
    </div>

    <div class="edit-dialog" v-if="editDialog" @click.self="editDialog = false">
      <div class="edit-dialog-content">

        <label for="title">{{ editDialogTitle }}</label>
        <input v-model="title" id="title" name="title" class="text-input"
               @keyup.enter="savePoint">`
        <br>

        <label for="description">{{ editDialogDescription }}</label>
        <textarea v-model="description" id="description" name="description" class="text-input"
                  @keyup.enter="savePoint"></textarea>
        <br>

        <label for="button_link">{{ editDialogButtonLink }}</label>
        <input v-model="button_link" id="button_link" name="button_link" class="text-input"
               @keyup.enter="savePoint">
        <br>

        <label for="button_text">{{ editDialogButtonText }}</label>
        <input v-model="button_text" id="button_text" name="button_text" class="text-input"
               @keyup.enter="savePoint">

        <div class="flex-centered">
          <button :class="[!(title && description) ? 'save-btn-disabled' : 'save-btn']"
                  @click="savePoint" :disabled="!(title && description)">{{ editDialogSaveText }}
          </button>
          <button class="cancel-btn" @click="cancel">{{ editDialogCancelText }}</button>
        </div>

      </div>
    </div>

    <div class="detail-dialog" v-if="showDialog" @click.self="showDialog = false">
      <div :class="[
          'detail-dialog-content',
           showDialogPosition === 'right' ? 'detail-dialog-content-right' : 'detail-dialog-content-left'
      ]">
        <h3>{{ title }}</h3>

        <p>{{ description }}</p>

        <a v-if="button_text" target="_blank" class="detail-btn" :href="button_link">{{ button_text }}</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ImageHotspot",

  emits: ['pointsUpdated', 'imageUploaded'],

  props: {
    readOnly: {
      type: Boolean,
      default: false,
    },

    propPoints: {
      type: Array,
      default: function () {
        return [];
      }
    },
    propImage: {
      type: String,
      default: null
    },

    direction: {
      type: String,
      default: 'ltr',
      validator: function (value) {
        return ['ltr', 'rtl'].includes(value)
      }
    },

    beforeUploadText: {
      type: String,
      default: 'Click any point on image to make a hotspot'
    },
    afterUploadText: {
      type: String,
      default: 'Please Upload a file'
    },

    editDialogTitle: {
      type: String,
      default: 'Title'
    },

    editDialogDescription: {
      type: String,
      default: 'Description'
    },

    editDialogButtonLink: {
      type: String,
      default: 'Button Link'
    },

    editDialogButtonText: {
      type: String,
      default: 'Button Text'
    },

    editDialogSaveText: {
      type: String,
      default: 'Save'
    },

    editDialogCancelText: {
      type: String,
      default: 'Cancel'
    },
  },

  data() {
    return {
      image: null,
      selectedPoint: {x: null, y: null, index: null},
      editDialog: false,
      showDialog: false,
      showDialogPosition: "",
      title: null,
      description: null,
      button_text: null,
      button_link: null,
      points: []
    }
  },

  computed: {
    topPageText: function () {
      return this.image ? this.beforeUploadText : this.afterUploadText
    }
  },

  mounted() {
    this.points = this.propPoints ?? []
    this.image = this.propImage
    if (this.image) {
      this.$nextTick(() => {
        let self = this
        document.getElementById('hotspot-image').onload = () => {
          if (this.points) {
            self.points.forEach((point, index) => {
              self.putPointOnImage(index, point.x, point.y);
            });
          }
        }
      });
    }
  },

  methods: {
    addPoint(e) {
      let coordinates = this.getCoordinates(e);
      this.selectedPoint = {x: coordinates.x, y: coordinates.y}

      this.editDialog = true
      this.addEscapeListener()
    },

    savePoint() {
      if (this.selectedPoint.index != null) {
        let point = this.points[this.selectedPoint.index];
        this.points[this.selectedPoint.index] = {
          x: point.x,
          y: point.y,
          title: this.title,
          description: this.description,
          button_text: this.button_text,
          button_link: this.button_link,
        }
      } else {
        if (!(this.title && this.description)) {
          return
        }
        let index = this.points.length
        let x = this.selectedPoint.x
        let y = this.selectedPoint.y

        this.points.push({
          x: x,
          y: y,
          title: this.title,
          description: this.description,
          button_text: this.button_text,
          button_link: this.button_link,
        });

        this.$nextTick(() => {
          this.putPointOnImage(index, x, y)
        })
      }
      this.$emit("pointsUpdated", this.points)
      this.cancel()
    },

    cancel() {
      this.title = null
      this.description = null
      this.button_text = null
      this.button_link = null
      this.selectedPoint = {x: null, y: null, index: null}
      this.editDialog = false;
      this.showDialog = false;
      this.removeEscapeListener()
    },

    getCoordinates(e) {
      let PosX = 0;
      let PosY = 0;
      let ImgPos;
      ImgPos = this.findImagePosition();
      if (e.pageX || e.pageY) {
        PosX = e.pageX;
        PosY = e.pageY;
      } else if (e.clientX || e.clientY) {
        PosX = e.clientX + document.body.scrollLeft
            + document.documentElement.scrollLeft;
        PosY = e.clientY + document.body.scrollTop
            + document.documentElement.scrollTop;
      }

      return {
        x: PosX - ImgPos[0],
        y: PosY - ImgPos[1],
      }
    },

    findImagePosition() {
      let element = document.getElementById("hotspot-image")
      if (typeof (element.offsetParent) != "undefined") {
        for (var posX = 0, posY = 0; element; element = element.offsetParent) {
          posX += element.offsetLeft;
          posY += element.offsetTop;
        }
        return [posX, posY];
      } else {
        return [element.x, element.y];
      }
    },

    getPointCoordinationOnImage(point, axis) {
      let ImgPos = this.findImagePosition();
      return parseInt(point) + (axis === 'x' ? ImgPos[0] : ImgPos[1])
    },

    getHalfOfElementWidth(element) {
      return element.clientWidth / 2;
    },

    openPointCard(e) {
      e.srcElement.children[0].style.opacity = 1
    },

    closePointCard(e) {
      e.srcElement.children[0].style.opacity = 0
    },

    putCircleOnImage(x, y, element) {
      element.style.left = this.getPointCoordinationOnImage(x, 'x') - this.getHalfOfElementWidth(element) + 'px'
      element.style.top = this.getPointCoordinationOnImage(y, 'y') + 'px'
    },

    putCardOnCircle(element, circle) {
      element.style.left = -(this.getHalfOfElementWidth(element) - this.getHalfOfElementWidth(circle)) + 'px'
    },

    putPointOnImage(index, x, y) {
      let hotspotCircle = this.$refs["hotspot-circle-" + index][0]
      this.putCircleOnImage(x, y, hotspotCircle)
      this.$nextTick(() => {
        this.putCardOnCircle(hotspotCircle.children[0], hotspotCircle)
      })
    },

    editPoint(point, index) {
      this.selectedPoint.index = index
      this.title = point.title
      this.description = point.description
      this.button_text = point.button_text
      this.button_link = point.button_link
      this.editDialog = true;
      this.addEscapeListener()
    },

    escapeListener(event) {
      if (event.keyCode === 27) {
        this.cancel()
      }
    },

    addEscapeListener() {
      document.addEventListener('keyup', this.escapeListener)
    },

    removeEscapeListener() {
      document.removeEventListener('keyup', this.escapeListener)
    },

    saveImage(event) {
      this.image = URL.createObjectURL(event.target.files[0]);
      this.$emit("imageUploaded", event.target.files[0])
    },

    showPoint(point) {
      this.showDialog = true
      this.title = point.title
      this.description = point.description
      this.button_link = point.button_link
      this.button_text = point.button_text

      let element = document.getElementById("hotspot-image")
      if (point.x < element.width / 2) {
        this.showDialogPosition = 'right';
      } else {
        this.showDialogPosition = 'left';
      }

      this.addEscapeListener()
    }
  }
}
</script>

<style src="./index.css"></style>
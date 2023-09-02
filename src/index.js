import ImageHotspot from "./ImageHotspot.vue"
import './index.css'
export default {
    install(Vue, options) {
        Vue.component("image-hotspot", ImageHotspot);
    }
};
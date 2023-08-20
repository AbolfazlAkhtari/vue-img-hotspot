<template>
    <div class="image-wrapper" style="direction: ltr;"> <!--TODO: Make DIR dynamic-->
        <h4>Click any point on image to make a hotspot</h4> <!--TODO: Make all texts dynamic-->

        <div>
            <img width="100%" @mousedown="openDialog"
                 src="https://kinsta.com/wp-content/uploads/2021/03/javascript-libraries-1024x512.png"> <!--TODO: Make image source dynamic-->

            <div v-for="(point, index) in points" :key="index"
                 class="point-card" :ref="'point-card-' + index">
                <h6 class="point-card-title">{{ point.title }}</h6>
            </div>
        </div>

        <div class="details-modal" v-if="dialog">
            <div class="details-modal-content">

                <label for="title">Title</label>
                <input v-model="title" id="title" name="title" class="text-input">
                <br>

                <label for="description">Description</label>
                <textarea v-model="description" id="description" name="description" class="text-input"></textarea>
                <br>

                <label for="button_link">Button Link</label>
                <input v-model="button_link" id="button_link" name="button_link" class="text-input">
                <br>

                <label for="button_text">Button Text</label>
                <input v-model="button_text" id="button_text" name="button_text" class="text-input">

                <div class="flex-centered">
                    <button :class="[!(title && description) ? 'save-btn-disabled' : 'save-btn']"
                            @click="saveHotspot" :disabled="!(title && description)">Save</button>
                    <button class="cancel-btn"
                            @click="cancel">Cancel</button>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "ImageHotspot",

    data() {
        return {
            selectedPoint: {x: null, y: null},
            dialog: false,
            title: null,
            description: null,
            button_text: null,
            button_link: null,
            points: []
        }
    },

    methods: {
        openDialog(e) {
            this.selectedPoint = this.getCoordinates(e)

            this.dialog = true
        },

        saveHotspot() {
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

            let self = this
            this.$nextTick(() => {
                let pointCard = self.$refs["point-card-" + index][0]
                pointCard.style.left = self.getPointCoordinationOnImage(x, 'x') - self.getHalfOfElementWidth(pointCard) + 'px'
                pointCard.style.top = self.getPointCoordinationOnImage(y, 'y') + 'px'
            })

            this.cancel()
        },

        cancel() {
            this.title = null
            this.description = null
            this.button_text = null
            this.button_link = null
            this.selectedPoint = {x: null, y: null}
            this.dialog = false;
        },

        getCoordinates(e) {
            let PosX = 0;
            let PosY = 0;
            let ImgPos;
            ImgPos = this.findImagePosition();
            if (e.pageX || e.pageY)
            {
                PosX = e.pageX;
                PosY = e.pageY;
            }
            else if (e.clientX || e.clientY)
            {
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

        findImagePosition()
        {
            let element = document.getElementsByTagName("img")[0]
            if(typeof( element.offsetParent ) != "undefined")
            {
                for(var posX = 0, posY = 0; element; element = element.offsetParent)
                {
                    posX += element.offsetLeft;
                    posY += element.offsetTop;
                }
                return [ posX, posY ];
            }
            else
            {
                return [ element.x, element.y ];
            }
        },

        getPointCoordinationOnImage(point, axis) {
            let ImgPos = this.findImagePosition();
            return point + (axis === 'x' ? ImgPos[0] : ImgPos[1])
        },

        getHalfOfElementWidth(element) {
            return element.clientWidth / 2;
        }
    }
}
</script>

<style scoped>
.image-wrapper {
    width: 100%;
    padding: 10px;
    border: 3px solid black;
    border-radius: 20px;
}

.details-modal {
    width: 100%;
    height: 100%;
    position: fixed; /* Stay in place */
    z-index: 5; /* Sit on top */
    background-color: rgba(0,0,0, 0.5); /* Black w/ opacity */
    animation-name: animatetop;
    animation-duration: 0.5s;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    left: 0;
}

.details-modal-content {
    width: 60%;
    height: auto;
    max-height: 70%;
    background-color: #222831; /* Black w/ opacity */ /* TODO: Dynamic */
    left: 20%;
    top: 15%;
    border-radius: 25px;
    padding: 10px;
    overflow: auto; /* Enable scroll if needed */
}

/* Add Animation */
@keyframes animatetop {
    from {opacity: 0}
    to {opacity: 1}
}

.text-input {
    width: 100%;
    border: 1px solid #EEEEEE;
    border-radius: 10px;
    padding: 5px;
}

.save-btn {
    background-color: #00ADB5;
    color: #222831;
    border-radius: 10px;
    width: 80px;
    height: 35px;
    margin: 15px 5px 0;
}

.cancel-btn {
    background-color: #c21e37;
    color: #ffffff;
    border-radius: 10px;
    width: 80px;
    height: 35px;
    margin: 15px 5px 0;
}

.save-btn-disabled {
    background-color: #BBBBBB;
    color: #222831;
    border-radius: 10px;
    width: 80px;
    height: 35px;
    margin: 15px 5px 0;
}

.flex-centered {
    display: flex;
    justify-content: center;
}

.point-card {
    position: absolute;
    background-color: #DDDDDD;
    color: black !important;
    border-radius: 8px;
    width: fit-content;
    padding: 5px;
    text-align: center;
}

.point-card-title {
    background-color: #DDDDDD;
    color: black !important;
    border-radius: 15px;
    width: fit-content;
}
</style>
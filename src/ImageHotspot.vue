<template>
    <!--TODO: Submit on Enter-->
    <!--TODO: Cancel on Esc-->
    <div class="image-wrapper" style="direction: ltr;"> <!--TODO: Make DIR dynamic-->
        <h4>Click any point on image to make a hotspot</h4> <!--TODO: Make all texts dynamic-->

        <div>
            <img width="100%" @mousedown="addPoint"
                 src="https://kinsta.com/wp-content/uploads/2021/03/javascript-libraries-1024x512.png"> <!--TODO: Make image source dynamic-->

            <div v-for="(point, index) in points" :key="index" class="hotspot-circle"
                 :ref="'hotspot-circle-' + index" @mouseenter="openPointCard" @mouseleave="closePointCard" @click="editPoint(point, index)">
                <div class="point-card">
                    <h6 class="point-card-title">{{ point.title }}</h6>
                </div>
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
                            @click="savePoint" :disabled="!(title && description)">Save</button>
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
            selectedPoint: {x: null, y: null, index: null},
            dialog: false,
            title: null,
            description: null,
            button_text: null,
            button_link: null,
            points: [
                {
                    x: 25,
                    y: 100,
                    title: "Salam",
                    description: "Salam",
                    button_text: null,
                    button_link: null,
                },
                {
                    x: 250,
                    y: 250,
                    title: "Salam Salam",
                    description: "Salam Salam Salam Salam Salam Salam Salam Salam Salam Salam Salam Salam Salam Salam ",
                    button_text: "Google",
                    button_link: "https://google.com",
                },
                {
                    x: 340,
                    y: 420,
                    title: "Salame Mojaddad",
                    description: "Salam Salam Salam Salam Salam Salam Salam Salam Salam Salam Salam Salam Salam Salam ",
                    button_text: "Google",
                    button_link: "https://google.com",
                },
            ]
        }
    },

    mounted() {
        this.points.forEach((point, index) => {
            this.putPointOnImage(index, point.x, point.y)
        })
    },

    methods: {
        addPoint(e) {
            let coordinates = this.getCoordinates(e);
            this.selectedPoint = {x: coordinates.x, y: coordinates.y, index: 0}

            this.dialog = true
        },

        savePoint() {
            if (this.selectedPoint.index) {
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
            this.selectedPoint = {x: null, y: null, index:null}
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
            element.style.left = - (this.getHalfOfElementWidth(element) - this.getHalfOfElementWidth(circle)) + 'px'
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
            this.dialog = true;
            this.title = point.title
            this.description = point.description
            this.button_text = point.button_text
            this.button_link = point.button_link
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
    position: fixed;
    z-index: 5;
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
    margin-top: -30px;
    opacity: 0;
}

.point-card-title {
    background-color: #DDDDDD;
    color: black !important;
    border-radius: 15px;
    width: fit-content;
    text-wrap: nowrap;
}

.hotspot-circle {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background-color: #00ADB5;
    position: absolute;
}

@keyframes animatetop {
    from {opacity: 0}
    to {opacity: 1}
}

</style>
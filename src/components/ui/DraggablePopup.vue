<template>
  <div
    ref="draggableContainer"
    :id="containerId + '-draggable-container'"
    style="top: -30px; left: 63%"
    class="absolute z-50 w-2/6 p-2 overflow-y-auto shadow-xl cursor-move resize  card-filled card"
    draggable="true"
  >
    <div class="absolute w-full h-full" @mousedown="dragMouseDown"></div>
    <div class="flex w-full px-4 pt-3">
      <h1 class="">{{ title }}</h1>

      <Btn
        :tooltip="$t('misc.close')"
        :variant="'icon'"
        :outline="true"
        @click="$emit('close')"
        class="z-30 ml-auto"
      >
        <span class="material-icons-outlined">close</span>
      </Btn>
    </div>
    <div class="px-4 pb-4">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { texMixin } from "@/mixins";
import { v4 as uuid4 } from "uuid";
import { defineComponent } from "vue";
import Btn from "./Btn.vue";

export default defineComponent({
  name: "DraggablePopup",
  props: {
    title: {
      type: String,
      default: "",
    },
  },
  mounted() {
    // keep draggable area in sync with actual scroll width and height of the popup
    setInterval(() => {
      const container = document.getElementById(
        this.containerId + "-draggable-container"
      );
      console.log("container", container);
      if (container) {
        this.overlayHeight = container.scrollHeight - 10;
        this.overlayWidth = container.scrollWidth - 10;
      }
    }, 10000);
  },
  data() {
    return {
      overlayHeight: 0,
      overlayWidth: 0,
      positions: {
        clientX: undefined,
        clientY: undefined,
        movementX: 0,
        movementY: 0,
      },
      containerId: uuid4(),
    };
  },
  methods: {
    dragMouseDown: function (event) {
      event.preventDefault();
      // get the mouse cursor position at startup:
      this.positions.clientX = event.clientX;
      this.positions.clientY = event.clientY;
      document.onmousemove = this.elementDrag;
      document.onmouseup = this.closeDragElement;
    },
    elementDrag: function (event) {
      event.preventDefault();
      this.positions.movementX = this.positions.clientX - event.clientX;
      this.positions.movementY = this.positions.clientY - event.clientY;
      this.positions.clientX = event.clientX;
      this.positions.clientY = event.clientY;
      const maxX = window.innerWidth;
      const maxY = window.innerHeight;
      // prevent scrolling past the top or left of the parent element
      const resX = Math.max(
        this.$refs.draggableContainer.offsetLeft - this.positions.movementX,
        -100
      );
      const resY = Math.max(
        this.$refs.draggableContainer.offsetTop - this.positions.movementY,
        -200
      );
      const popup = document.getElementById(
        this.containerId + "-draggable-container"
      );
      const popupW = popup.offsetWidth;
      const popupH = popup.offsetHeight;
      // set the element's new position:
      // prevent scrolling out of page from the right or bottom
      this.$refs.draggableContainer.style.top =
        // (true || resY < maxY - popupH ? resY : maxY - popupH)
        resY + "px";
      this.$refs.draggableContainer.style.left =
        //(true || resX < maxX - popupW ? resX : maxX - popupW)
        resX + "px";
    },
    closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    },
    resize() {
      console.log("resizing");
    },
  },
  computed: {
    overlayStyle() {
      return `width: ${this.overlayWidth}px; height: ${this.overlayHeight}px;`;
    },
  },
  components: { Btn },
});
</script>

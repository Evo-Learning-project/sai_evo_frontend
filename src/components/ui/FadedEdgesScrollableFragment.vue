<template>
  <div
    class="relative overflow-x-hidden"
    :class="{
      'faded-left': !toBeginX,
      'faded-right': !toEndX,
    }"
  >
    <div class="flex overflow-x-auto" :id="elementId">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import { v4 as uuid4 } from "uuid";
export default defineComponent({
  name: "FadedEdgesScrollableFragment",
  props: {},
  mounted() {
    this.element = document.getElementById(this.elementId);

    this.element?.addEventListener("scroll", this.debounce(this.onScroll), {
      passive: true,
    });
    this.onScroll();
  },
  data() {
    return {
      toBeginX: true,
      toEndX: false,
      toBeginY: true,
      toEndY: false,
      elementId: uuid4(),
      element: null as null | HTMLElement,
    };
  },
  methods: {
    debounce(fn: any) {
      // This holds the requestAnimationFrame reference, so we can cancel it if we wish
      let frame: number;
      // The debounce function returns a new function that can receive a variable number of arguments
      return (...params: any[]) => {
        // If the frame variable has been defined, clear it now, and queue for next frame
        if (frame) {
          cancelAnimationFrame(frame);
        }
        // Queue our function call for the next frame
        frame = requestAnimationFrame(() => {
          // Call our function and pass any params we received
          fn(...params);
        });
      };
    },
    onScroll() {
      const el = this.element as HTMLElement;

      const isScrollable =
        el.scrollWidth > el.clientWidth &&
        ["scroll", "auto"].indexOf(getComputedStyle(el).overflowX) >= 0;

      this.toEndX =
        !isScrollable ||
        -(el.scrollLeft + el.clientWidth) + el.scrollWidth <= 1;
      this.toBeginX = el.scrollLeft === 0;
    },
  },
  computed: {},
});
</script>

<style>
.faded-right:after {
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0),
    rgba(255, 255, 255, 1) 90%
  );
  content: "";
  position: absolute;
  z-index: 11;
  top: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  width: 50px;
}

.faded-left:before {
  background: linear-gradient(
    to left,
    rgba(255, 255, 255, 0),
    rgba(255, 255, 255, 1) 90%
  );
  content: "";
  position: absolute;
  top: 0;
  z-index: 11;
  left: 0;
  bottom: 0;
  pointer-events: none;
  width: 50px;
}

.card-filled .faded-right:after {
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0),
    rgba(243, 244, 246, 1) 90%
  );
}
.card-filled .faded-left:before {
  background: linear-gradient(
    to left,
    rgba(255, 255, 255, 0),
    rgba(243, 244, 246, 1) 90%
  );
}
</style>

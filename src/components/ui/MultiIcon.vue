<template>
  <div
    v-if="icons?.length > 0"
    :class="[
      icons?.length == 1 ? '-mb-1.5' : 'my-auto',
      icons?.length == 2 ? 'flex flex-col -space-y-1.25px' : '',
      icons?.length > 2 ? 'flex flex-col -space-y-2' : '',
    ]"
  >
    <img
      class="transform scale-125 ml-1.5 my-0"
      v-if="isRawIcon"
      src="../../../public/c.svg"
    />
    <span
      v-else
      :style="
        icons?.length > 1
          ? 'font-size: 14px !important'
          : icons[index].slice(-3) === '-lg'
          ? 'font-size: 28px !important'
          : 'font-size: 20px !important'
      "
      :class="[
        icons[index].slice(0, -3) === 'javascript' ? '-ml-1 -mt-0.5' : '',
        'mt-0.5 mx-auto',
        useTwoTone ? 'material-icons-two-tone' : 'material-icons-outlined',
      ]"
      v-for="(icon, index) in parsedIcons"
      :key="id + '-icon-' + index"
    >
      {{ icon }}
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import { v4 as uuid4 } from "uuid";

export default defineComponent({
  name: "MultiIcon",
  props: {
    icons: {
      type: Array as PropType<string[]>,
    },
    useTwoTone: {
      type: Boolean,
      default: false,
    },
  },
  created() {
    this.id = uuid4();
  },
  data() {
    return {
      id: "",
    };
  },
  computed: {
    isRawIcon(): boolean {
      return this.icons?.[0].startsWith("raw-") ?? false;
    },
    parsedIcons() {
      return this.icons?.map((i) =>
        i.slice(-3) === "-lg" || i.slice(-3) === "-sm"
          ? i.slice(0, -3)
          : i.slice(0, 4) === "raw-"
          ? i.slice(4)
          : i
      );
    },
  },
});
</script>

<style></style>

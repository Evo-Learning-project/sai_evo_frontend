<template>
  <div
    :class="[
      icons?.length == 1 ? '-mb-1.5' : 'my-auto',
      icons?.length == 2 ? 'flex flex-col -space-y-1.25px' : '',
      icons?.length > 2 ? 'flex flex-col -space-y-2' : '',
    ]"
  >
    <span
      :class="[
        icons?.length > 1
          ? 'text-2xs'
          : icons[index].slice(-3) === '-sm'
          ? 'text-base mb-1.5 ml-1'
          : icons[index].slice(-3) === '-lg'
          ? ''
          : '',
        'mx-auto',
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
    parsedIcons() {
      return this.icons?.map((i) =>
        i.slice(-3) === "-lg" || i.slice(-3) === "-sm" ? i.slice(0, -3) : i
      );
    },
  },
});
</script>

<style></style>

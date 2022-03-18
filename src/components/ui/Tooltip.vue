<template>
  <div>
    <div class="tooltip w-max">
      <span
        :class="{
          'hover:bg-gray-200 hover:bg-opacity-80 rounded-md px-1.5 transition-colors duration-100': true,
        }"
        class="text-base cursor-default select-none  opacity-80 material-icons-outlined hover:text-primary-dark"
      >
        help_outline
      </span>
      <span class="z-50 max-w-xs md:max-w-max tooltip-text tooltip-right">{{
        helpText
      }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { getTranslatedString as _ } from "@/i18n";
import { defineComponent, PropType } from "@vue/runtime-core";
export default defineComponent({
  name: "Tooltip",
  props: {
    textCode: {
      type: String,
      required: true,
    },
  },
  methods: {},
  computed: {
    helpText(): string {
      return _("help_texts." + this.textCode);
    },
  },
});
</script>

<style></style>

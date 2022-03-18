<template>
  <div v-if="iconOnly" class="tooltip">
    <Btn
      v-clipboard:copy="value"
      v-clipboard:success="onCopy"
      :title="title || $t('misc.copy')"
      :outline="true"
      :variant="'icon'"
    >
      <span class="text-xl material-icons"> share </span>
    </Btn>
    <span
      v-if="showFeedback"
      class="tooltip-text tooltip-bottom"
      :class="{ 'tooltip-text-force': showFeedback }"
      >{{ confirmationMessage || $t("misc.copied") }}</span
    >
  </div>
  <div
    v-else
    class="flex items-center max-w-full px-2 py-1 border border-gray-300 rounded-md shadow-inner  w-max"
  >
    <div
      :title="$t('misc.copy')"
      class="
        cursor-pointer
        hover:bg-light
        px-1
        py-0.5
        rounded-sm
        overflow-x-auto
      "
      v-clipboard:copy="value"
      v-clipboard:success="onCopy"
    >
      {{ value }}
    </div>
    <div class="flex ml-2 border-l">
      <div class="tooltip">
        <Btn
          v-clipboard:copy="value"
          v-clipboard:success="onCopy"
          :title="$t('misc.copy')"
          class="h-full px-2 py-2 -mt-1 -mb-1 -mr-2 rounded-tr-md rounded-br-md"
          :variant="'transparent'"
        >
          <span class="text-base material-icons-outlined"> content_copy </span>
        </Btn>
        <span
          v-if="showFeedback"
          class="tooltip-text tooltip-bottom"
          :class="{ 'tooltip-text-force': showFeedback }"
          >{{ $t("misc.copied") }}</span
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import Btn from "./Btn.vue";

export default defineComponent({
  components: { Btn },
  name: "CopyToClipboard",
  props: {
    value: {
      type: String,
      required: true,
    },
    iconOnly: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    confirmationMessage: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      showFeedback: false,
    };
  },
  methods: {
    onCopy() {
      this.showFeedback = true;
      setTimeout(() => (this.showFeedback = false), 2000);
    },
  },
});
</script>

<style></style>

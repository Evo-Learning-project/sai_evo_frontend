<template>
  <div class="relative">
    <CopyToClipboard
      :icon-only="true"
      :value="value"
      class="absolute top-0 right-0 z-20 mt-0.5 mr-0.5"
    >
      <span class="text-base material-icons-outlined text-lightText">
        content_copy
      </span>
    </CopyToClipboard>
    <SshPre
      v-if="show"
      :language="'js'"
      :dark="true"
      :class="{ 'ssh-pre-small': small }"
      >{{ value }}</SshPre
    >
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import SshPre from "simple-syntax-highlighter";
import "simple-syntax-highlighter/dist/sshpre.css";
import CopyToClipboard from "./CopyToClipboard.vue";
export default defineComponent({
  name: "CodeFragment",
  components: {
    SshPre,
    CopyToClipboard,
  },
  props: {
    value: {
      type: String,
      required: true,
    },
    small: {
      type: Boolean,
      default: false,
    },
    language: {
      type: String as PropType<"javascript" | "typescript" | "c">,
      default: "typescript",
    },
  },
  watch: {
    value() {
      // tear down and re-build component as it doesn't update on its own...
      this.show = false;
      this.$nextTick(() => (this.show = true));
    },
  },
  data() {
    return {
      show: true,
    };
  },
  methods: {},
  computed: {},
});
</script>

<style></style>

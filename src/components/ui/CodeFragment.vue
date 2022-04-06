<template>
  <SshPre v-if="show" :language="'js'" :dark="true" :class="{ 'ssh-pre-small': small }">{{
    value
  }}</SshPre>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import SshPre from "simple-syntax-highlighter";
import "simple-syntax-highlighter/dist/sshpre.css";
export default defineComponent({
  name: "CodeFragment",
  components: {
    SshPre,
  },
  props: {
    value: {
      type: String,
    },
    small: {
      type: Boolean,
      default: false,
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

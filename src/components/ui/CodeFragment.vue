<template>
  <SshPre :language="'js'" :dark="true">{{ value }}</SshPre>
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
  },
  methods: {},
  computed: {},
});
</script>

<style></style>

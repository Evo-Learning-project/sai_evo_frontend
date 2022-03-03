<template>
  <SshPre :language="'js'" :dark="true" :class="{ 'ssh-pre-small': small }">{{
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
  methods: {},
  computed: {},
});
</script>

<style></style>

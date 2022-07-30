<template>
  <div
    class="flex w-8 h-8 rounded-full  bg-primary-light text-primary bg-opacity-30"
  >
    <p class="mx-auto my-auto font-semibold">
      {{ authorName[0].toLocaleUpperCase() }}
    </p>
  </div>
</template>

<script lang="ts">
import { User } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
export default defineComponent({
  name: "Avatar",
  props: {
    user: {
      type: Object as PropType<User>,
      default: () => ({}),
    },
  },
  methods: {},
  computed: {
    authorName(): string {
      return this.user?.full_name ?? "Autore";
    },
  },
});
</script>

<style></style>

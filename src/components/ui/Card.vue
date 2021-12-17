<template>
  <div
    tabindex="0"
    class="px-3 py-6 my-4 border border-gray-300 rounded-md shadow-sm md:px-6"
  >
    <slot name="header"></slot>
    <div v-if="$slots.body" class="mt-4">
      <slot name="body"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Card'
}
</script>

<style></style>

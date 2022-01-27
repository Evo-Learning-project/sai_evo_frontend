<template>
  <div
    class="relative z-10 px-2 py-1.5  bg-light border-b-2 rounded-t-sm focus-within:border-primary transition-border duration-300"
  >
    <input
      type="text"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      placeholder=" "
      class="z-10 block w-full bg-transparent appearance-none floating-label focus:outline-none"
    />
    <label class="absolute bottom-1.5 origin-0 -z-1"><slot></slot></label>
  </div>
</template>

<script>
export default {
  name: 'TextInput',
  props: ['modelValue']
}
</script>

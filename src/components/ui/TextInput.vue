<template>
  <div
    class="relative z-10 px-2 py-1.5 my-4 bg-gray-100 border-b-2 rounded-t-sm focus-within:border-primary"
  >
    <input
      type="text"
      name="username"
      placeholder=" "
      class="z-10 block w-full bg-transparent appearance-none floating-label focus:outline-none"
    />
    <label for="username" class="absolute bottom-1.5 origin-0 -z-1"
      >Username</label
    >
  </div>
</template>

<script>
export default {
  name: 'TextInput'
}
</script>

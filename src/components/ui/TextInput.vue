<template>
  <div
    class="relative z-10 my-4 bg-transparent border-b-2 focus-within:border-blue-500"
  >
    <input
      type="text"
      name="username"
      placeholder=" "
      class="z-10 block w-full bg-transparent appearance-none floating-label focus:outline-none"
    />
    <label for="username" class="absolute top-0 origin-0 -z-1">Username</label>
  </div>
</template>

<script>
export default {
  name: 'TextInput'
}
</script>

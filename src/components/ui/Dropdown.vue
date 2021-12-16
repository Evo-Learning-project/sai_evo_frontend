<template>
  <select
    class="col-span-5 md:col-span-4 p-0.5 bg-white text-dark border rounded-md"
    @change="$emit('update:modelValue', $event.target.value)"
    :value="modelValue"
  >
    <option class="text-muted" :value="NULL_VALUE" disabled>Seleziona</option>
    <option
      class="bg-white text-darkText"
      v-for="(option, index) in options"
      :key="'select-' + id + -'-option-' + index"
      :value="option"
    >
      {{ option }}
    </option>
  </select>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import { v4 as uuid4 } from 'uuid'

export default defineComponent({
  name: 'Dropdown',
  props: ['modelValue', 'options'],
  created () {
    this.id = uuid4()
  },
  data () {
    return {
      id: '',
      NULL_VALUE: ''
    }
  }
})
</script>

<style></style>

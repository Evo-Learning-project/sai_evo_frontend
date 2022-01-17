<template>
  <select
    class="col-span-5 md:col-span-4 p-0.5 bg-white text-dark border rounded-md"
    @change="$emit('update:modelValue', $event.target.value)"
    :value="modelValue"
  >
    <option
      v-if="!isThereDefault"
      class="text-muted"
      :value="NULL_VALUE"
      disabled
      >{{ $t('misc.select_empty_option') }}</option
    >
    <option
      class="bg-white text-darkText"
      v-for="(option, index) in processedOptions"
      :key="'select-' + id + -'-option-' + index"
      :value="option.value"
      :disabled="option.value == NULL_VALUE"
    >
      {{ option.name }}
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
  },
  computed: {
    processedOptions () {
      if (!this.options || this.options.length == 0) {
        return []
      }
      if (typeof this.options[0] == 'string') {
        return this.options.map((option: string) => ({
          name: option,
          value: option
        }))
      } else {
        return this.options
      }
    },
    isThereDefault () {
      return this.options?.some(
        (o: { value: string }) => o.value == this.NULL_VALUE
      )
    }
  }
})
</script>

<style></style>

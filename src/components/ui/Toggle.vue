<template>
  <div>
    <div
      class="relative inline-block h-4 mr-2 align-middle transition duration-200 ease-in bg-transparent rounded-full shadow-sm select-none w-11"
    >
      <input
        type="checkbox"
        name="toggle"
        :value="value"
        v-model="proxyModelValue"
        :id="id"
        class="absolute -left-0.5 block transition-all duration-100 bg-light rounded-full toggle-handle appearance-none cursor-pointer w-6 h-6 hover:ring-8  ring-blue-200 active:ring-opacity-60 ring-opacity-40 toggle-checkbox"
      />
      <label
        :for="id"
        class="block h-4 overflow-hidden bg-gray-300 rounded-full cursor-pointer toggle-label"
      ></label>
    </div>
    <label :for="id" v-if="$slots.default">
      <slot></slot>
    </label>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import { v4 as uuid4 } from 'uuid'
export default defineComponent({
  name: 'Toggle',
  props: {
    modelValue: [Boolean, Array],
    value: {
      default: null
    }
  },
  created () {
    this.id = uuid4()
  },
  data () {
    return {
      id: ''
    }
  },
  computed: {
    proxyModelValue: {
      get () {
        return this.modelValue
      },
      set (val: unknown) {
        this.$emit('update:modelValue', val)
      }
    }
  }
})
</script>

<style>
.toggle-handle {
  box-shadow: 0 2px 1px -1px rgb(0 0 0 / 20%), 0 1px 1px 0 rgb(0 0 0 / 14%),
    0 1px 3px 0 rgb(0 0 0 / 12%);
  top: -0.265rem;
}

.toggle-checkbox:checked {
  right: -0.125rem;
  left: 48%;
  border-color: rgba(72, 91, 202, 1);
}
.toggle-checkbox:checked + .toggle-label {
  background-color: rgba(72, 91, 202, 0.9);
}
.toggle-checkbox {
  right: 40%;
  left: auto;
  transition: all 0.25s ease-out;
}
</style>

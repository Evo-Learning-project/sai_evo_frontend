<template>
  <div class="flex items-center">
    <div
      :class="{ 'order-12 ml-2': labelOnLeft }"
      class="relative inline-block w-10 h-4 mr-2 align-middle transition duration-200 ease-in bg-transparent rounded-full shadow-sm select-none"
    >
      <input
        type="checkbox"
        name="toggle"
        :value="value"
        v-model="proxyModelValue"
        :id="id"
        :class="{
          'bg-white': !modelValue,
          'bg-primary-light': modelValue
        }"
        class="absolute -left-0.5 block transition-all duration-100 rounded-full toggle-handle appearance-none cursor-pointer hover:ring-8  ring-blue-400 active:ring-opacity-40 ring-opacity-20 toggle-checkbox"
      />
      <label
        :for="id"
        class="block overflow-hidden bg-gray-400 rounded-full cursor-pointer toggle-rail toggle-label"
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
    },
    labelOnLeft: {
      type: Boolean,
      default: false
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
  box-shadow: 0px 1px 3px 0px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%),
    0px 1px 3px 0px rgb(0 0 0 / 12%);
  top: -0.25em;
  width: 22px;
  height: 22px;
}

.toggle-rail {
  height: 14px;
}

.toggle-checkbox:checked {
  left: 50%;
  border-color: rgba(72, 91, 202, 1);
}
.toggle-checkbox:checked + .toggle-label {
  background-color: rgba(72, 91, 202, 0.68);
}
.toggle-checkbox {
  /* right: 49%; */
  /* left: auto; */
  transition: all 0.25s ease-out;
}
</style>

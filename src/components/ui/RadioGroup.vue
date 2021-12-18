<template>
  <div class="">
    <div
      :class="{
        'max-h-20': !expanded,
        'max-h-screen shadow-2xl': expanded
      }"
      class="overflow-y-hidden transition-all duration-300 ease-in-out border border-gray-300 rounded-md hover:shadow-md w-max"
    >
      <label
        :for="id + '-input-' + index"
        :class="{
          'bg-primary  text-lightText': option.value == modelValue && expanded,
          'rounded-md px-3 py-2': option.value == modelValue,
          'h-0 py-0 overflow-hidden opacity-0':
            modelValue != null && option.value != modelValue && !expanded,
          'px-3 py-2': modelValue == null || expanded
        }"
        class="flex items-center max-h-screen overflow-y-hidden cursor-pointer "
        @click="expandIfSelected(option.value)"
        v-for="(option, index) in options"
        :key="id + '-option-' + index"
      >
        <input
          class="w-0 h-0"
          type="radio"
          :id="id + '-input-' + index"
          :value="option.value"
          @change="onChange(option.value)"
          :checked="option.value == modelValue"
        />
        <div class="flex items-center space-x-2">
          <div class="flex flex-col -space-y-1.5 scale-90 origin-0 transform">
            <span class="text-xs material-icons"> check_box </span
            ><span class="text-xs material-icons"> check_box </span
            ><span class="text-xs material-icons">
              check_box_outline_blank
            </span>
          </div>
          <p v-html="option.content"></p>
        </div>
      </label>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import { v4 as uuid4 } from 'uuid'

export default defineComponent({
  name: 'RadioGroup',
  props: ['options', 'modelValue'],
  created () {
    this.id = uuid4()
  },
  data () {
    return {
      expanded: true,
      id: ''
    }
  },
  methods: {
    onChange (value: string) {
      if (this.modelValue != value) {
        this.expanded = false
      }
      this.$emit('update:modelValue', value)
    },
    expandIfSelected (value: string) {
      if (
        this.modelValue != null &&
        value == this.modelValue &&
        !this.expanded
      ) {
        this.expanded = true
      }
    }
  }
})
</script>

<style></style>

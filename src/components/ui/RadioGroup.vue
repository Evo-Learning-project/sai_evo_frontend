<template>
  <div class="">
    <div
      :class="{
        'max-h-20 hover:shadow-md': !expanded,
        'max-h-screen shadow-2xl': expanded
      }"
      class="overflow-y-hidden transition-all duration-300 ease-in-out border border-gray-300 rounded-md w-96"
    >
      <label
        :for="id + '-input-' + index"
        :class="{
          'transition-colors duration-200 ease-in-out': !expanded,
          'bg-primary  text-lightText':
            (option.value == modelValue && expanded) || showFeedback,
          'rounded-md px-3 py-2': option.value == modelValue,
          'h-0 py-0 overflow-hidden opacity-0':
            modelValue != null && option.value != modelValue && !expanded,
          'px-3 py-2': modelValue == null || expanded
        }"
        class="flex items-center max-h-screen overflow-y-hidden cursor-pointer"
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
        <div class="flex items-end space-x-2">
          <multi-icon class="w-6" :icons="option.icons"></multi-icon>
          <p v-html="option.content"></p>
        </div>
      </label>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import { v4 as uuid4 } from 'uuid'
import MultiIcon from '@/components/ui/MultiIcon.vue'

export default defineComponent({
  name: 'RadioGroup',
  props: ['options', 'modelValue'],
  components: {
    MultiIcon
  },
  created () {
    this.id = uuid4()
    if (this.modelValue != null) {
      this.expanded = false
    }
  },
  data () {
    return {
      expanded: true,
      showFeedback: false,
      id: ''
    }
  },
  methods: {
    onChange (value: string) {
      if (this.modelValue != value) {
        this.expanded = false
        this.showFeedback = true
        setTimeout(() => (this.showFeedback = false), 1000)
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

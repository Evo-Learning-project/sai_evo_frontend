<template>
  <div>
    <label
      class="flex space-x-1.5 items-top"
      v-for="(option, index) in options"
      :key="id + '-option-' + index"
      :for="id + '-option-' + index"
    >
      <input
        :disabled="disabled"
        :id="id + '-option-' + index"
        type="checkbox"
        v-model="proxyModelValue"
        :value="option.value"
        class="mt-1.5"
      />
      <div class="flex flex-col">
        <p v-html="option.content"></p>
        <p
          class="mb-2 text-sm text-muted"
          v-if="(option.description?.length ?? 0) > 0"
          v-html="option.description"
        ></p>
      </div>
    </label>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import { v4 as uuid4 } from 'uuid'

export default defineComponent({
  name: 'CheckboxGroup',
  props: ['options', 'modelValue', 'disabled'],
  created () {
    this.id = uuid4()
  },
  data () {
    return {
      id: ''
    }
  },
  //   methods: {
  //     onChange (value: unknown) {
  //       console.log(value)
  //       this.$emit('update:modelValue', value)
  //     }
  //   },
  computed: {
    proxyModelValue: {
      get () {
        return this.modelValue
      },
      set (val: Array<{ value: string; content: string }>) {
        // TODO make interface
        this.$emit('update:modelValue', val)
      }
    }
  }
})
</script>

<style></style>

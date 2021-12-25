<template
  ><div>
    <label
      class="flex items-center space-x-2"
      v-for="(option, index) in options"
      :key="id + '-option-' + index"
      :for="id + '-option-' + index"
    >
      <input
        :id="id + '-option-' + index"
        type="checkbox"
        v-model="proxyModelValue"
        :value="option.value"
      />
      <p v-html="option.content"></p>
    </label>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import { v4 as uuid4 } from 'uuid'

export default defineComponent({
  name: 'CheckboxGroup',
  props: ['options', 'modelValue'],
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

<template>
  <div>
    <!--eslint-disable vue/no-mutating-props-->
    <input type="checkbox" v-model="proxyModelValue" :id="id" :value="value" />
    <label :for="id" v-if="$slots.default">
      <slot></slot>
    </label>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import { v4 as uuid4 } from 'uuid'
export default defineComponent({
  name: 'Checkbox',
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

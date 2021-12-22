<template>
  <div class="flex flex-wrap p-1">
    <div
      class="chip"
      v-for="(option, index) in options"
      :key="'chipset-' + id + '-option-' + index"
      :class="{
        'ring-primary ring-2 text-primary font-semibold': modelValue.includes(
          option.value
        )
      }"
    >
      <input
        type="checkbox"
        class="w-0 h-0 opacity-0"
        v-model="proxyModelValue"
        :id="'chipset-' + id + '-option-' + index"
        :value="option.value"
      />
      <label
        class="flex items-center"
        :for="'chipset-' + id + '-option-' + index"
      >
        <multi-icon
          v-if="option.icons"
          class="w-6"
          :icons="option.icons"
        ></multi-icon>
        <p v-html="option.content"></p
      ></label>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import MultiIcon from '@/components/ui/MultiIcon.vue'

import { v4 as uuid4 } from 'uuid'
export default defineComponent({
  name: 'Chipset',
  props: {
    modelValue: Array,
    value: {
      default: null
    },
    options: Array
  },
  components: {
    MultiIcon
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

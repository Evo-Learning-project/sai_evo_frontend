<template>
  <div>
    RULE: {{ modelValue.amount }}
    <NumberInput
      :modelValue="modelValue.amount"
      @update:modelValue="
        $emit('ruleUpdate', { field: 'amount', value: $event })
      "
    ></NumberInput>
  </div>
</template>

<script lang="ts">
import { EventTemplateRule } from '@/models'
import { defineComponent } from '@vue/runtime-core'
import { PropType } from 'vue'
import NumberInput from '../ui/NumberInput.vue'

export default defineComponent({
  name: 'PracticeTemplateRuleEditor',
  props: {
    modelValue: {
      type: Object as PropType<EventTemplateRule>,
      required: true
    }
  },
  components: { NumberInput }
})
</script>

<style></style>

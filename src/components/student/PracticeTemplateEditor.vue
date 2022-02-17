<template>
  <div>PracticeTemplateEditor</div>
</template>

<script lang="ts">
import { EventTemplate } from '@/models'
import { defineComponent } from '@vue/runtime-core'
import { PropType } from 'vue'

export default defineComponent({
  name: 'PracticeTemplateEditor',
  props: {
    modelValue: {
      type: Object as PropType<EventTemplate>,
      required: true
    }
  }
})
</script>

<style></style>

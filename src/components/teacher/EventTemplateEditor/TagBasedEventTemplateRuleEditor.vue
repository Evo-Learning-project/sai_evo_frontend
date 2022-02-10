<template>
  <div>TagBasedEventTemplateRuleEditor</div>
</template>

<script lang="ts">
import { courseIdMixin, eventIdMixin, loadingMixin } from '@/mixins'
import { EventTemplateRuleClause } from '@/models'
import { defineComponent, PropType } from '@vue/runtime-core'

export default defineComponent({
  name: 'TagBasedEventTemplateRuleEditor',
  props: {
    modelValue: {
      type: Array as PropType<EventTemplateRuleClause[]>,
      required: true
    }
  },
  mixins: [courseIdMixin, eventIdMixin, loadingMixin]
})
</script>

<style></style>

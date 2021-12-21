<template>
  <card>
    <template v-slot:header>
      <div class="flex items-center space-x-4">
        <h3>{{ previewTitle }}</h3>
        <div class="flex space-x-1">
          <tag
            v-for="(tag, index) in exercise.tags"
            :key="elementId + '-tag-' + index"
            :tag="tag"
          ></tag>
        </div>
      </div>
    </template>

    <template v-slot:body>
      <div v-html="previewText"></div>
    </template>
  </card>
</template>

<script lang="ts">
import { getTranslatedString as _ } from '@/i18n'
import { v4 as uuid4 } from 'uuid'

import Card from '@/components/ui/Card.vue'
import { Exercise } from '@/models'
import { defineComponent, PropType } from '@vue/runtime-core'
import Tag from '@/components/ui/Tag.vue'
export default defineComponent({
  name: 'ExercisePreview',
  props: {
    exercise: {
      type: Object as PropType<Exercise>,
      required: true
    }
  },
  components: { Card, Tag },
  created () {
    this.elementId = uuid4()
  },
  data () {
    return {
      elementId: ''
    }
  },
  computed: {
    previewTitle (): string {
      return (this.exercise?.label ?? '').trim().length > 0
        ? (this.exercise.label as string)
        : _('exercise_preview.unnamed_exercise')
    },
    previewText (): string {
      return this.exercise.text
    }
  }
})
</script>

<style></style>

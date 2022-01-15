<template>
  <card :marginLess="true">
    <template v-slot:header>
      <div class="flex items-center ">
        <h3>{{ previewTitle }}</h3>
        <div class="flex ml-2 space-x-1">
          <tag
            v-for="(tag, index) in exercise.tags"
            :key="elementId + '-tag-' + index"
            :tag="tag"
          ></tag>
        </div>
        <div class="my-auto ml-4 chip">
          <div class="flex items-center">
            <multi-icon class="w-6" :icons="exerciseStateIcons"></multi-icon>
            <p v-html="$t('exercise_states.' + exercise.state)"></p>
          </div>
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
import { Exercise, ExerciseState } from '@/models'
import { defineComponent, PropType } from '@vue/runtime-core'
import Tag from '@/components/ui/Tag.vue'
import MultiIcon from '@/components/ui/MultiIcon.vue'
import { icons as exerciseStatesIcons } from '@/assets/exerciseStatesIcons'

export default defineComponent({
  name: 'ExercisePreview',
  props: {
    exercise: {
      type: Object as PropType<Exercise>,
      required: true
    }
  },
  components: {
    Card,
    Tag,
    MultiIcon
  },
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
    },
    exerciseStateIcons () {
      return exerciseStatesIcons[this.exercise.state as ExerciseState]
    }
  }
})
</script>

<style></style>

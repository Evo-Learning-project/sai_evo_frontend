<template>
  <!-- <btn :variant="'transparent'" class="text-left rounded-md"> -->
  <!-- <template v-slot:content>-->
  <Card
    :size="'sm'"
    :highlighted="highlighted"
    :class="{ 'border-success': highlighted }"
  >
    <template v-slot:header>
      <div class="relative">
        <div class="flex items-center">
          <h4>{{ previewTitle }}</h4>
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
      </div>
    </template>

    <template v-slot:body>
      <div class="relative h-9 overflow-y-auto">
        <div
          class="w-11/12 overflow-x-hidden overflow-ellipsis"
          v-html="previewText"
        ></div>
      </div>
    </template>

    <template v-slot:side>
      <div class="flex flex-col h-full">
        <btn :size="'sm'" :variant="'primary-borderless'"
          ><span class="material-icons-outlined">
            preview
          </span></btn
        >

        <btn
          v-if="selectable"
          :size="'sm'"
          :variant="'success-borderless'"
          class="mt-auto"
          :forceActive="highlighted"
          @btnClick="onSelection()"
          ><span class="material-icons-outlined">
            done
          </span></btn
        >
      </div>
    </template>
  </Card>
  <!--</template>-->
  <!--</btn>-->
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
import Btn from '@/components/ui/Btn.vue'

export default defineComponent({
  name: 'MinimalExercisePreview',
  props: {
    exercise: {
      type: Object as PropType<Exercise>,
      required: true
    },
    highlighted: {
      type: Boolean,
      default: false
    },
    selectable: {
      type: Boolean,
      default: true
    }
  },
  components: {
    Card,
    Tag,
    MultiIcon,
    Btn
  },
  created () {
    this.elementId = uuid4()
  },
  data () {
    return {
      elementId: ''
    }
  },
  methods: {
    onSelection () {
      this.$emit('selection')
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

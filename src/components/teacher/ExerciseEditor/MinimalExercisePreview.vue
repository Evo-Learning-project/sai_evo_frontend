<template
  ><div>
    <Card
      :size="'sm'"
      :highlighted="highlighted"
      :hoverable="false"
      :class="{
        'border-success': highlighted,
        'bg-gray-50 opacity-60': selectionDisabled
      }"
    >
      <template v-slot:header>
        <div class="relative">
          <div class="flex items-center">
            <h5>{{ previewTitle }}</h5>
            <div v-if="showTags" class="flex ml-2 space-x-1">
              <!-- hidden -->
              <Tag
                v-for="(tag, index) in tags"
                :key="elementId + '-tag-' + index"
                :tag="tag"
                :small="true"
              ></Tag>
            </div>
            <div
              :title="$t('exercise_states.' + exercise.state)"
              class="my-auto ml-4 cursor-default chip chip-sm"
            >
              <div class="flex items-center">
                <MultiIcon class="w-6" :icons="exerciseStateIcons"></MultiIcon>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template v-slot:body>
        <div class="relative h-12 overflow-y-hidden">
          <div
            style="
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow:hidden
            "
            class="w-11/12 overflow-x-hidden overflow-ellipsis text-muted"
            v-html="previewText"
          ></div>
        </div>
      </template>

      <template v-slot:side>
        <div class="flex flex-col items-end h-full space-y-5">
          <Btn
            class="flex-grow"
            :size="'xs'"
            v-if="previewable"
            :variant="'primary-borderless'"
            @click="showPreview = true"
            ><span class="text-base material-icons-outlined">
              open_in_full
            </span>
          </Btn>
          <div class="mt-auto" :title="selectButtonTitle">
            <Btn
              v-if="selectable"
              :size="'xs'"
              :variant="'success-borderless'"
              :forceActive="highlighted"
              :disabled="selectionDisabled"
              @click="onSelection()"
              ><span class="text-base material-icons-outlined">
                done
              </span></Btn
            >
          </div>
        </div>
      </template>
    </Card>
    <Dialog
      :showDialog="showPreview"
      @yes="showPreview = false"
      :confirmOnly="true"
      :large="true"
      :dismissible="true"
    >
      <template v-slot:title>{{ $t('misc.exercise_preview_title') }}</template>
      <template v-slot:body>
        <FullExercise :exercise="exercise"></FullExercise>
      </template>
    </Dialog>
  </div>
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
import Dialog from '@/components/ui/Dialog.vue'
import FullExercise from '@/components/shared/FullExercise.vue'

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
    },
    previewable: {
      type: Boolean,
      default: true
    },
    selectionDisabled: {
      type: Boolean,
      default: false
    },
    selectButtonTitle: {
      type: String,
      default: ''
    },
    showTags: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Card,
    Tag,
    MultiIcon,
    Btn,
    Dialog,
    FullExercise
  },
  created () {
    this.elementId = uuid4()
  },
  data () {
    return {
      elementId: '',
      showPreview: false
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
    },
    tags () {
      return [
        ...(this.exercise.public_tags ?? []),
        ...(this.exercise.private_tags ?? [])
      ]
    }
  }
})
</script>

<style></style>

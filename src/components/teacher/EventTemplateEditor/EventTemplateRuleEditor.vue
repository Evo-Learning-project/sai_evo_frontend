<template>
  <div>
    <div
      class="px-3 py-4"
      :class="[modelValue.target_slot_number % 2 ? 'bg-light' : 'bg-gray-50']"
    >
      <div class="flex items-center ">
        <h4>
          {{ $t('event_template_rule_editor.exercise_number') }}
          {{ modelValue.target_slot_number + 1 }}
        </h4>
        <div class="flex ml-auto space-x-2">
          <btn @btnClick="showRuleDialog()" :size="'sm'">
            {{ $t('event_template_rule_editor.choose_exercise') }}
          </btn>
          <!--@btnClick="deleteRule()"-->
          <btn :size="'xs'" :variant="'danger'" :outline="true"
            ><span style="font-size: 17px;" class="material-icons-outlined">
              delete
            </span>
          </btn>
        </div>
      </div>
      <div v-if="isSlotPopulated" class="mt-4">
        <p class="mb-2 text-muted">
          {{
            ruleExercises.length == 1
              ? $t(
                  'event_template_rule_editor.same_exercise_for_everyone_description'
                )
              : $t(
                  'event_template_rule_editor.one_exercise_from_set_description'
                )
          }}
        </p>
        <div>
          <div
            v-if="!loading"
            :class="[ruleExercises.length > 1 ? 'grid grid-cols-2 gap-2' : '']"
          >
            <MinimalExercisePreview
              v-for="exercise in ruleExercises"
              :key="'r-' + modelValue.id + '-e-' + exercise.id"
              :exercise="exercise"
              :selectable="false"
            ></MinimalExercisePreview>
          </div>
          <div v-else class="grid grid-cols-2 gap-2">
            <SkeletonCard :short="true"></SkeletonCard>
            <SkeletonCard :short="true"></SkeletonCard>
          </div>
        </div>
      </div>
    </div>
    <Dialog
      :showDialog="showDialog"
      :large="true"
      :footerBorder="true"
      :confirmOnly="true"
      @yes="() => (showDialog = false)"
    >
      <template v-if="modelValue.rule_type != null" v-slot:backButton>
        <btn
          :variant="'light'"
          :size="'sm'"
          class=""
          @btnClick="setRuleMode(null)"
        >
          <span class="material-icons-outlined">
            arrow_back
          </span>
        </btn>
      </template>
      <template v-slot:title>
        {{
          $t('event_template_rule_editor.populate_slot_title') +
            ' ' +
            (modelValue.target_slot_number + 1)
        }}
      </template>
      <template v-slot:body>
        <div v-if="modelValue.rule_type == null">
          <p>{{ $t('event_template_rule_editor.mode_selection_text') }}</p>
          <div class="grid grid-cols-3 mt-6">
            <btn
              @btnClick="setRuleMode(idBasedRuleType, true)"
              :variant="'transparent'"
              class="py-5 pl-4 border-r"
            >
              <template v-slot:content>
                <h4 class="text-dark">
                  {{ $t('event_template_rule_editor.pick_single_exercise') }}
                </h4>
                <p>
                  {{
                    $t(
                      'event_template_rule_editor.pick_single_exercise_help_text'
                    )
                  }}
                </p></template
              >
            </btn>
            <btn
              @btnClick="setRuleMode(idBasedRuleType, false)"
              :variant="'transparent'"
              class="pl-4 pr-3 border-r"
            >
              <template v-slot:content>
                <h4 class="text-dark">
                  {{ $t('event_template_rule_editor.pick_exercise_from_pool') }}
                </h4>
                <p>
                  {{
                    $t(
                      'event_template_rule_editor.pick_exercise_from_pool_help_text'
                    )
                  }}
                </p></template
              >
            </btn>
            <btn
              @btnClick="setRuleMode(tagBasedRuleType)"
              :variant="'transparent'"
              class="pl-8"
            >
              <template v-slot:content>
                <h4 class="text-dark">
                  {{ $t('event_template_rule_editor.pick_exercise_tag_based') }}
                </h4>
                <p>
                  {{
                    $t(
                      'event_template_rule_editor.pick_exercise_tag_based_help_text'
                    )
                  }}
                </p>
              </template>
            </btn>
          </div>
        </div>
        <div v-else-if="modelValue.rule_type == idBasedRuleType">
          <h3 class="text-dark">
            {{
              pickOneExerciseOnly
                ? $t('event_template_rule_editor.pick_single_exercise')
                : $t('event_template_rule_editor.pick_exercise_from_pool')
            }}
          </h3>
          <p>
            {{
              pickOneExerciseOnly
                ? $t(
                    'event_template_rule_editor.pick_single_exercise_help_text'
                  )
                : $t(
                    'event_template_rule_editor.pick_exercise_from_pool_help_text'
                  )
            }}
          </p>
          <div class="mt-4 max-h-96">
            <ExercisePicker
              :modelValue="modelValue.exercises"
              @addExercise="onAddExercise($event)"
              @removeExercise="onRemoveExercise($event)"
            ></ExercisePicker>
          </div>
        </div>
        <div v-else-if="modelValue.rule_type == tagBasedRuleType"></div>
      </template>
    </Dialog>
  </div>
</template>

<script lang="ts">
import Dialog from '@/components/ui/Dialog.vue'
import { EventTemplateRule, EventTemplateRuleType, Exercise } from '@/models'
import { defineComponent, PropType } from '@vue/runtime-core'
import Btn from '@/components/ui/Btn.vue'
import { getTranslatedString as _ } from '@/i18n'
import ExercisePicker from '@/components/teacher/ExercisePicker.vue'
import MinimalExercisePreview from '../ExerciseEditor/MinimalExercisePreview.vue'
import { getExercisesById } from '@/api/exercises'
import SkeletonCard from '@/components/ui/SkeletonCard.vue'
import { courseIdMixin } from '@/mixins'
export default defineComponent({
  components: {
    Dialog,
    Btn,
    ExercisePicker,
    MinimalExercisePreview,
    SkeletonCard
  },
  name: 'EventTemplateRuleEditor',
  props: {
    modelValue: {
      type: Object as PropType<EventTemplateRule>,
      required: true
    }
  },
  mixins: [courseIdMixin],
  async created () {
    this.loading = true
    if (
      this.modelValue.rule_type == this.idBasedRuleType &&
      (this.modelValue.exercises?.length ?? 0) > 0
    ) {
      const previews = await getExercisesById(
        this.courseId,
        this.modelValue.exercises as string[]
      )
      this.previewExercises.push(...previews)
    }
    this.loading = false
  },
  data () {
    return {
      showDialog: false,
      pickOneExerciseOnly: null as boolean | null,
      previewExercises: [] as Exercise[],
      loading: false
    }
  },
  methods: {
    emitUpdate (key: keyof EventTemplateRule, value: unknown) {
      this.$emit('update:modelValue', {
        ...this.modelValue,
        [key]: value
      })
    },
    async onAddExercise (exercise: Exercise) {
      if (this.pickOneExerciseOnly) {
        this.emitUpdate('exercises', [exercise.id])
      } else {
        this.emitUpdate('exercises', [
          exercise.id,
          ...(this.modelValue?.exercises as string[])
        ])
      }

      // fetch exercise from server and add to local array for preview
      this.loading = true
      const preview = await getExercisesById(this.courseId, [exercise.id])
      this.previewExercises.push(...preview)
      this.loading = false
    },
    onRemoveExercise (exercise: Exercise) {
      // emit modelValue update of new exercise list without removed one
      this.emitUpdate(
        'exercises',
        this.modelValue?.exercises?.filter(e => e != exercise.id)
      )

      // remove exercise from local array of exercises for preview
      this.previewExercises = this.previewExercises.filter(
        e => e.id != exercise.id
      )
    },
    showRuleDialog () {
      this.showDialog = true
    },
    setRuleMode (ruleType: EventTemplateRuleType, pickOne = false) {
      console.log(ruleType, pickOne)
      this.emitUpdate('rule_type', ruleType)
      this.pickOneExerciseOnly = pickOne
    }
  },
  computed: {
    ruleExercises (): Exercise[] {
      if (this.modelValue.rule_type != this.idBasedRuleType) {
        return []
      }
      return this.previewExercises
    },
    isSlotPopulated () {
      if (this.modelValue.rule_type == this.idBasedRuleType) {
        return (this.modelValue.exercises?.length ?? 0) > 0
      }
      return false
    },
    idBasedRuleType (): EventTemplateRuleType {
      return EventTemplateRuleType.ID_BASED
    },
    tagBasedRuleType (): EventTemplateRuleType {
      return EventTemplateRuleType.TAG_BASED
    }
  }
})
</script>

<style></style>

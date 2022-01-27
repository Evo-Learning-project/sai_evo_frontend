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
            {{
              /*isExerciseChosen
                ? $t('event_template_rule_editor.change_exercise')
                : */
              $t('event_template_rule_editor.choose_exercise')
            }}
          </btn>
          <btn
            @btnClick="deleteRule()"
            :size="'sm'"
            :variant="'danger'"
            :outline="true"
            ><span class="text-base material-icons-outlined">
              delete
            </span>
          </btn>
        </div>
      </div>
      <div v-if="isSlotPopulated" class="mt-4">
        <p class="text-muted mb-2">
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
        <div
          :class="[ruleExercises.length > 1 ? 'grid grid-cols-2 gap-2' : '']"
        >
          <MinimalExercisePreview
            v-for="exercise in ruleExercises"
            :key="'r-' + modelValue.id + '-e-' + exercise"
            :exercise="exercise"
            :selectable="false"
          ></MinimalExercisePreview>
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
          @click="setRuleMode(null)"
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
import { getExercise } from '@/api/exercises'
export default defineComponent({
  components: {
    Dialog,
    Btn,
    ExercisePicker,
    MinimalExercisePreview
  },
  name: 'EventTemplateRuleEditor',
  props: {
    modelValue: {
      type: Object as PropType<EventTemplateRule>,
      required: true
    }
  },
  async created () {
    if (this.modelValue.rule_type == this.idBasedRuleType) {
      await this.onRuleExercisesChange()
    }
  },
  data () {
    return {
      showDialog: false,
      pickOneExerciseOnly: null as boolean | null,
      previewExercises: [] as Exercise[]
    }
  },
  methods: {
    emitUpdate (key: keyof EventTemplateRule, value: unknown) {
      this.$emit('update:modelValue', {
        ...this.modelValue,
        [key]: value
      })
    },
    async onRuleExercisesChange () {
      // get exercises that aren't stored in local data yet
      const previewIds = this.previewExercises.map(e => e.id)
      const toRetrieve = this.modelValue.exercises?.filter(
        (e: string) => !previewIds.includes(e)
      ) as string[]
      const previews = (await getExercise(
        this.courseId,
        toRetrieve
      )) as Exercise[]
      this.previewExercises.push(...previews)
    },
    onAddExercise (exercise: Exercise) {
      // TODO move to a temporary array and not to rule
      if (this.pickOneExerciseOnly) {
        this.emitUpdate('exercises', [exercise.id])
      } else {
        this.emitUpdate('exercises', [
          exercise.id,
          ...(this.modelValue?.exercises as string[])
        ])
      }
    },
    onRemoveExercise (exercise: Exercise) {
      const index = (this.modelValue?.exercises as string[]).findIndex(
        e => e === exercise.id
      )
      const newValue = [...(this.modelValue?.exercises as string[])]
      newValue.splice(index, 1)
      this.emitUpdate('exercises', newValue)
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
    courseId (): string {
      return this.$route.params.courseId as string
    },
    ruleExercises (): Exercise[] {
      if (this.modelValue.rule_type != this.idBasedRuleType) {
        return []
      }
      return this.previewExercises
      // return this.modelValue.exercises?.map(e =>
      //   this.$store.getters.exercise(e)
      // ) as Exercise[]
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
    },
    dialogData () {
      const noText = _('dialog.default_cancel_text')
      const yesText = _('dialog.default_confirm_text')
      let confirmDisabled = false
      const noCallback = () => (this.showDialog = false)
      let yesCallback = () => null as unknown

      if (this.modelValue?.rule_type == EventTemplateRuleType.ID_BASED) {
        if (this.modelValue?.exercises?.length == 0) {
          confirmDisabled = true
        } else {
          yesCallback = () => (this.showDialog = false)
        }
      } else {
        // TODO check for tags
      }

      return {
        yesText,
        noText,
        confirmDisabled,
        noCallback,
        yesCallback
      }
    }
  }
})
</script>

<style></style>

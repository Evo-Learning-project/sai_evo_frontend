<template>
  <div>
    <div
      class="px-3 py-4"
      :class="[modelValue._ordering % 2 ? 'bg-light' : 'bg-gray-50']"
    >
      <div class="flex items-center ">
        <span
          class="my-auto mr-2 text-lg cursor-move drag-handle material-icons-outlined opacity-70"
        >
          drag_indicator
        </span>
        <h4>
          {{ $t('event_template_rule_editor.exercise_number') }}
          {{ modelValue._ordering + 1 }}
        </h4>
        <div class="flex items-center ml-auto space-x-2">
          <Btn @click="showRuleDialog()" :size="'sm'">
            {{ $t('event_template_rule_editor.choose_exercise') }}
          </Btn>
          <!--@click="deleteRule()"-->
          <Btn :size="'sm'" :variant="'icon'" :outline="true"
            ><span style="font-size: 17px;" class="material-icons-outlined text-danger-dark">
              close
            </span>
          </Btn>
        </div>
      </div>
      <div
        v-if="
          isSlotPopulated &&
            modelValue.rule_type == EventTemplateRuleType.ID_BASED
        "
        class="mt-4"
      >
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
      <div
        v-else-if="
          isSlotPopulated &&
            modelValue.rule_type == EventTemplateRuleType.TAG_BASED
        "
        class="mt-4"
      >
        <p class="mb-2 text-muted">
          {{ $t('event_template_rule_editor.tag_based_description') }}
        </p>
        <div class="flex space-x-3">
          <div
            v-for="(clause, index) in modelValue.clauses"
            :key="'clause-preview-' + clause.id"
            class="flex items-center mb-2"
          >
            <p class="mr-2" v-if="clause.tags.length > 1">
              {{ $t('event_template_rule_editor.tag_based_at_least_one') }}
              {{ $t('misc.among') }} <span class="text-xl text-muted">(</span>
            </p>
            <Tag
              class="mx-0.5"
              :class="{ '-ml-1.5': index === 0 }"
              v-for="(tag, index) in clause.tags"
              :key="'clause-' + clause.id + '-tag-' + tag.id"
              :tag="tag"
            ></Tag
            ><span v-if="clause.tags.length > 1" class="text-xl text-muted"
              >)</span
            >
            <p v-if="index !== modelValue.clauses.length - 1">,</p>
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
            (modelValue._ordering + 1)
        }}
      </template>
      <template v-slot:body>
        <div v-if="modelValue.rule_type == null">
          <p>{{ $t('event_template_rule_editor.mode_selection_text') }}</p>
          <div class="grid grid-cols-3 mt-6">
            <Btn
              @click="setRuleMode(EventTemplateRuleType.ID_BASED, true)"
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
            </Btn>
            <Btn
              @click="setRuleMode(EventTemplateRuleType.ID_BASED, false)"
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
            </Btn>
            <Btn
              @click="setRuleMode(EventTemplateRuleType.TAG_BASED)"
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
            </Btn>
          </div>
        </div>
        <div v-else-if="modelValue.rule_type == EventTemplateRuleType.ID_BASED">
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
              :alreadySelected="globallySelectedExercises"
              @addExercise="onAddExercise($event)"
              @removeExercise="onRemoveExercise($event)"
            ></ExercisePicker>
          </div>
        </div>
        <div
          v-else-if="modelValue.rule_type == EventTemplateRuleType.TAG_BASED"
        >
          <TagBasedEventTemplateRuleEditor
            :modelValue="modelValue.clauses"
            :satisfying="modelValue.satisfying"
            @addClause="$emit('addClause')"
            @removeClause="$emit('removeClause', $event)"
            @updateClause="$emit('updateClause', $event)"
          ></TagBasedEventTemplateRuleEditor>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script lang="ts">
import Dialog from '@/components/ui/Dialog.vue'
import {
  EventTemplateRule,
  EventTemplateRuleType,
  Exercise
  //Tag as ITag
} from '@/models'
import { defineComponent, PropType } from '@vue/runtime-core'
import Btn from '@/components/ui/Btn.vue'
import ExercisePicker from '@/components/teacher/ExercisePicker.vue'
import MinimalExercisePreview from '../ExerciseEditor/MinimalExercisePreview.vue'
import { getExercisesById } from '@/api/exercises'
import SkeletonCard from '@/components/ui/SkeletonCard.vue'
import { courseIdMixin } from '@/mixins'
import TagBasedEventTemplateRuleEditor from './TagBasedEventTemplateRuleEditor.vue'
import Tag from '@/components/ui/Tag.vue'
export default defineComponent({
  components: {
    Dialog,
    Btn,
    ExercisePicker,
    MinimalExercisePreview,
    SkeletonCard,
    TagBasedEventTemplateRuleEditor,
    Tag
  },
  name: 'EventTemplateRuleEditor',
  props: {
    modelValue: {
      type: Object as PropType<EventTemplateRule>,
      required: true
    },
    globallySelectedExercises: {
      type: Object as PropType<string[]>,
      required: true
    }
  },
  mixins: [courseIdMixin],
  async created () {
    this.loading = true
    if (
      this.modelValue.rule_type == EventTemplateRuleType.ID_BASED &&
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
      loading: false,
      EventTemplateRuleType
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
      if (this.modelValue.rule_type != EventTemplateRuleType.ID_BASED) {
        return []
      }
      return this.previewExercises
    },
    isSlotPopulated () {
      if (this.modelValue.rule_type == EventTemplateRuleType.ID_BASED) {
        return (this.modelValue.exercises?.length ?? 0) > 0
      }
      if (this.modelValue.rule_type == EventTemplateRuleType.TAG_BASED) {
        return (this.modelValue.clauses?.length ?? 0) > 0
      }
      return false
    }
  }
})
</script>

<style></style>

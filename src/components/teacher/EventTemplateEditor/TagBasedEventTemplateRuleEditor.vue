<template
  ><div>
    <p class="mb-6 text-muted" v-if="showTeacherIntroductionText">
      {{ $t('event_template_rule_editor.tag_based_introduction') }}
    </p>
    <div class="flex">
      <div class="flex flex-col w-full">
        <div
          v-for="(clause, index) in modelValue"
          :key="'clause-' + clause.id"
          class="my-2"
        >
          <p v-if="index === 0" class="mb-2">
            {{ $t('event_template_rule_editor.tag_based_select_exercises') }}
            <strong>{{
              $t('event_template_rule_editor.tag_based_at_least_one')
            }}</strong>
            {{ $t('event_template_rule_editor.tag_based_among') }}
          </p>
          <p v-else>
            {{ $t('event_template_rule_editor.tag_based_and') }}
            <strong>{{
              $t('event_template_rule_editor.tag_based_at_least_one')
            }}</strong>
            {{ $t('event_template_rule_editor.tag_based_among') }}
          </p>
          <TagInput
            :placeholder="$t('misc.tags')"
            :modelValue="clause.tags"
            @addTag="onAddTag(clause, $event)"
            @removeTag="onRemoveTag(clause, $event)"
            :choices="tags"
            :existingOnly="true"
          ></TagInput>
        </div>
        <div
          v-if="allowCreateMoreClauses"
          @click="onAddClause"
          class="mt-2 transition-opacity duration-75 opacity-50 cursor-pointer hover:opacity-100"
        >
          <p>
            {{ $t('event_template_rule_editor.tag_based_and') }}
            <strong>{{
              $t('event_template_rule_editor.tag_based_at_least_one')
            }}</strong>
            {{ $t('event_template_rule_editor.tag_based_among') }}
          </p>
          <TagInput
            :disabled="true"
            class="cursor-pointer"
            :placeholder="$t('exercise_editor.exercise_tags')"
            :modelValue="[]"
          ></TagInput>
        </div>
      </div>
      <div
        v-if="showPreview"
        class="relative flex w-9/12 px-5 py-5 ml-16 border border-gray-200 rounded-md max-h-60 bg-gray-50"
      >
        <SkeletonCard
          v-if="false && localLoading"
          :borderLess="true"
          class="w-full"
        ></SkeletonCard>
        <Spinner
          :size="'xl'"
          :fast="true"
          class="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
          v-if="localLoading"
        ></Spinner>
        <div
          class="flex flex-col justify-between flex-grow"
          :class="{ 'opacity-50 pointer-events-none': localLoading }"
        >
          <p class="mb-8 text-muted">
            {{ $t('event_template_rule_editor.eligible_exercises') }}
            <strong>{{ satisfying.count }}</strong>
          </p>
          <h4 v-if="!!satisfying.example">{{ $t('misc.example') }}</h4>
          <MinimalExercisePreview
            :selectable="false"
            :previewable="false"
            :showTags="true"
            v-if="!!satisfying.example"
            :exercise="satisfying.example"
          ></MinimalExercisePreview>
          <div v-else class="flex flex-col items-center my-auto opacity-60">
            <span class="material-icons-outlined">error_outline</span>
            <p>
              Non ci sono esercizi con i tag richiesti: modifica le condizioni
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { tagNamesToTags } from '@/api/utils'
import TagInput from '@/components/ui/TagInput.vue'
import { courseIdMixin, eventIdMixin, loadingMixin } from '@/mixins'
import { EventTemplateRuleClause, Exercise, Tag } from '@/models'
import { defineComponent, PropType } from '@vue/runtime-core'

import { createNamespacedHelpers } from 'vuex'
import MinimalExercisePreview from '../ExerciseEditor/MinimalExercisePreview.vue'
import SkeletonCard from '@/components/ui/SkeletonCard.vue'
import Spinner from '@/components/ui/Spinner.vue'
const { mapState } = createNamespacedHelpers('shared')

export default defineComponent({
  components: { TagInput, MinimalExercisePreview, SkeletonCard, Spinner },
  name: 'TagBasedEventTemplateRuleEditor',
  async created () {
    if (this.modelValue.length === 0) {
      this.onAddClause()
    }
  },
  props: {
    modelValue: {
      type: Array as PropType<EventTemplateRuleClause[]>,
      required: true
    },
    satisfying: {
      type: Object as PropType<{ count: number; example?: Exercise }>,
      default: () => ({
        count: 0
      })
    },
    showTeacherIntroductionText: {
      type: Boolean,
      default: true
    },
    allowCreateMoreClauses: {
      type: Boolean,
      default: true
    },
    showPreview: {
      type: Boolean,
      default: true
    }
  },
  mixins: [courseIdMixin, eventIdMixin, loadingMixin],
  methods: {
    onAddClause () {
      this.$emit('addClause')
    },
    onAddTag (clause: EventTemplateRuleClause, newTagName: string) {
      const newTag = tagNamesToTags([newTagName])[0]

      this.$emit('updateClause', {
        ...clause,
        tags: [...clause.tags, newTag]
      } as EventTemplateRuleClause)
    },
    onRemoveTag (clause: EventTemplateRuleClause, removedTagName: string) {
      const removedTag = tagNamesToTags([removedTagName])[0]

      this.$emit('updateClause', {
        ...clause,
        tags: clause.tags.filter(t => t.id != removedTag.id)
      } as EventTemplateRuleClause)
    }
  },
  computed: {
    ...mapState(['tags'])
  }
})
</script>

<style></style>

<template>
  <div class="flex flex-col">
    <p class="mb-2 text-muted">
      {{ $t('event_template_rule_editor.tag_based_introduction') }}
    </p>
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
        {{ $t('event_template_rule_editor.tag_based_between') }}
      </p>
      <p v-else>
        {{ $t('event_template_rule_editor.tag_based_and') }}
        <strong>{{
          $t('event_template_rule_editor.tag_based_at_least_one')
        }}</strong>
        {{ $t('event_template_rule_editor.tag_based_between') }}
      </p>
      <TagInput
        :placeholder="$t('exercise_editor.exercise_tags')"
        :modelValue="clause.tags"
        @addTag="onAddTag(clause, $event)"
        @removeTag="onRemoveTag(clause, $event)"
        :choices="tags"
        :existingOnly="true"
      ></TagInput>
    </div>
    <div
      @click="onAddClause"
      class="mt-2 transition-opacity duration-75 opacity-50 cursor-pointer hover:opacity-100"
    >
      <p>
        {{ $t('event_template_rule_editor.tag_based_and') }}
        <strong>{{
          $t('event_template_rule_editor.tag_based_at_least_one')
        }}</strong>
        {{ $t('event_template_rule_editor.tag_based_between') }}
      </p>
      <TagInput
        :disabled="true"
        class="cursor-pointer"
        :placeholder="$t('exercise_editor.exercise_tags')"
        :modelValue="[]"
      ></TagInput>
    </div>
    <Btn class="hidden mt-8 w-max" @click="onAddClause" :loading="loading">
      <span class="mr-1 text-base material-icons-outlined">
        add_circle_outline </span
      >{{ $t('event_template_rule_editor.tag_based_add_condition') }}</Btn
    >
  </div>
</template>

<script lang="ts">
import { tagNamesToTags } from '@/api/utils'
import Btn from '@/components/ui/Btn.vue'
import TagInput from '@/components/ui/TagInput.vue'
import { courseIdMixin, eventIdMixin, loadingMixin } from '@/mixins'
import { EventTemplateRuleClause, Tag } from '@/models'
import { defineComponent, PropType } from '@vue/runtime-core'
import { mapState } from 'vuex'

export default defineComponent({
  components: { TagInput, Btn },
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
    loading: {
      type: Boolean,
      default: false
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

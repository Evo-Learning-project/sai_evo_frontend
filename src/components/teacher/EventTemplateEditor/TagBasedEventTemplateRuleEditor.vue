<template>
  <div>
    <div v-for="clause in modelValue" :key="'clause-' + clause.id">
      <TagInput
        :placeholder="$t('exercise_editor.exercise_tags')"
        :modelValue="clause.tags"
        @addTag="onAddTag(clause, $event)"
        @removeTag="onRemoveTag(clause, $event)"
        :choices="tags"
      ></TagInput>
    </div>
  </div>
</template>

<script lang="ts">
import { tagNamesToTags } from '@/api/utils'
import TagInput from '@/components/ui/TagInput.vue'
import { courseIdMixin, eventIdMixin, loadingMixin } from '@/mixins'
import { EventTemplateRuleClause, Tag } from '@/models'
import { defineComponent, PropType } from '@vue/runtime-core'
import { mapState } from 'vuex'

export default defineComponent({
  components: { TagInput },
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
    onRemoveTag (clause: { id: string; tags: Tag[] }, removedTag: string) {
      this.$emit('removeTag', removedTag)
    }
    // tagsToIds (tags: string[]): string[] {
    //   // converts list of tags used by the component to list of their id's, as per
    //   // the format used by the backend
    //   console.log('CALLING TAGS TO IDS', this.tags, 'passed', tags)
    //   return tags.map(t => this.$store.getters.tagByName(t).id)
    // }
  },
  computed: {
    ...mapState(['tags'])
    // processedModelValue () {
    //   // converts between the format used by the backend to represent clauses (i.e. a list
    //   // of tag ids) to a list of tags usable by the tag-input component
    //   return this.modelValue.map((c: EventTemplateRuleClause) => ({
    //     ...c,
    //     tags: c.tags.map(t => this.$store.getters.tagById(t) as Tag)
    //   }))
    // }
  }
})
</script>

<style></style>

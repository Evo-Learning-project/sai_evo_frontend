<template>
  <div>
    <PracticeTemplateRuleEditor
      v-for="rule in modelValue.rules"
      :key="'practice-rule-' + rule.id"
      :modelValue="rule"
      @ruleUpdate="autoSaveInstances[rule.id].onChange($event)"
    ></PracticeTemplateRuleEditor>
    <Btn @click="onAddRule">Aggiungi regola</Btn>
  </div>
</template>

<script lang="ts">
import { courseIdMixin } from '@/mixins'
import {
  EventTemplate,
  EventTemplateRule,
  getBlankEventTemplateRule
} from '@/models'
import { defineComponent } from '@vue/runtime-core'
import { PropType } from 'vue'

import { createNamespacedHelpers } from 'vuex'
import PracticeTemplateRuleEditor from './PracticeTemplateRuleEditor.vue'
import Btn from '../ui/Btn.vue'
import { AutoSave } from '@/autoSave'
const { mapState, mapActions, mapMutations } = createNamespacedHelpers(
  'student'
)

export default defineComponent({
  name: 'PracticeTemplateEditor',
  mixins: [courseIdMixin],
  props: {
    modelValue: {
      type: Object as PropType<EventTemplate>,
      required: true
    }
  },
  created () {
    this.modelValue.rules.forEach(r => this.instantiateRuleAutoSave(r.id))
  },
  data () {
    return {
      autoSaveInstances: {} as Record<string, AutoSave<EventTemplateRule>>
    }
  },
  methods: {
    ...mapActions([
      'addEventTemplateRule',
      'partialUpdateEventTemplateRule',
      'addEventTemplateRuleClause',
      'updateEventTemplateRuleClause'
    ]),
    ...mapMutations([
      'setEditingEventTemplate',
      'patchEditingEventTemplateRule',
      'setEditingEventTemplateRule',
      'setEditingEventTemplateRuleClause'
    ]),
    async onAddRule () {
      const newRule = await this.addEventTemplateRule({
        courseId: this.courseId,
        templateId: this.modelValue.id,
        rule: getBlankEventTemplateRule()
      })

      this.instantiateRuleAutoSave(newRule.id)
    },
    instantiateRuleAutoSave (ruleId: string) {
      this.autoSaveInstances[ruleId] = new AutoSave<EventTemplateRule>(
        async changes =>
          await this.partialUpdateEventTemplateRule({
            changes,
            ruleId,
            templateId: this.modelValue.id,
            courseId: this.courseId
          }),
        changes =>
          this.patchEditingEventTemplateRule({
            changes,
            ruleId
          }),
        [],
        0
      )
    }
  },
  computed: {
    ...mapState(['editingEventTemplate'])
  },
  components: { PracticeTemplateRuleEditor, Btn }
})
</script>

<style></style>

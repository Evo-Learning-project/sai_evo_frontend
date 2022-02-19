<template>
  <div>
    <PracticeTemplateRuleEditor
      class="px-8 py-4 my-2 -mx-8"
      :class="{ 'bg-gray-50': false && index % 2 === 0 }"
      v-for="(rule, index) in modelValue.rules"
      :key="'practice-rule-' + rule.id"
      :modelValue="rule"
      @partialUpdate="rulesAutoSaveInstances[rule.id].onChange($event)"
      @addClause="onRuleAddClause(rule)"
      @updateClause="onRuleUpdateClause($event)"
    ></PracticeTemplateRuleEditor>
    <Btn @click="onAddRule">Aggiungi regola</Btn>
  </div>
</template>

<script lang="ts">
import { courseIdMixin, loadingMixin } from '@/mixins'
import {
  EventTemplate,
  EventTemplateRule,
  EventTemplateRuleClause,
  EventTemplateRuleType,
  getBlankEventTemplateRule,
  getBlankTagBasedEventTemplateRuleClause
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
  mixins: [courseIdMixin, loadingMixin],
  props: {
    modelValue: {
      type: Object as PropType<EventTemplate>,
      required: true
    }
  },
  async created () {
    if (this.modelValue.rules.length === 0) {
      await this.onAddRule()
    }
    this.modelValue.rules.forEach(r => {
      this.instantiateRuleAutoSave(r.id)
      r.clauses?.forEach(c => this.instantiateRuleClauseAutoSave(r.id, c.id))
    })
  },
  data () {
    return {
      rulesAutoSaveInstances: {} as Record<string, AutoSave<EventTemplateRule>>,
      ruleClausesAutoSaveInstances: {} as Record<
        string,
        AutoSave<EventTemplateRuleClause>
      >
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
    async onRuleAddClause (rule: EventTemplateRule) {
      await this.withLoading(async () => {
        const newClause = await this.addEventTemplateRuleClause({
          courseId: this.courseId,
          templateId: this.modelValue.id,
          ruleId: rule.id,
          clause: getBlankTagBasedEventTemplateRuleClause()
        })
        this.instantiateRuleClauseAutoSave(rule.id, newClause.id)
      })
    },
    async onRuleUpdateClause (clause: EventTemplateRuleClause) {
      console.log('clause update template', clause)
      await this.ruleClausesAutoSaveInstances[clause.id].onChange({
        field: 'tags',
        value: clause.tags
      })
    },
    async onAddRule () {
      const newRule = await this.addEventTemplateRule({
        courseId: this.courseId,
        templateId: this.modelValue.id,
        rule: getBlankEventTemplateRule(EventTemplateRuleType.FULLY_RANDOM)
      })

      this.instantiateRuleAutoSave(newRule.id)
    },
    instantiateRuleAutoSave (ruleId: string) {
      this.rulesAutoSaveInstances[ruleId] = new AutoSave<EventTemplateRule>(
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
    },
    instantiateRuleClauseAutoSave (ruleId: string, clauseId: string) {
      this.ruleClausesAutoSaveInstances[clauseId] = new AutoSave<
        EventTemplateRuleClause
      >(
        async changes =>
          await this.updateEventTemplateRuleClause({
            courseId: this.courseId,
            templateId: this.modelValue.id,
            ruleId,
            clause: { id: clauseId, ...changes }
          }),
        changes =>
          this.setEditingEventTemplateRuleClause({
            ruleId,
            payload: { id: clauseId, ...changes }
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

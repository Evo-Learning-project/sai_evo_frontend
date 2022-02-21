<template>
  <div class="flex flex-col">
    <div class="flex-grow">
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
    </div>

    <Btn class="mt-2 mr-auto" @click="onAddRule">
      <span class="mr-1 text-base material-icons-outlined">
        add_circle_outline </span
      >{{ $t('practice_template_editor.add_rule') }}</Btn
    >
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
      this.instantiateRuleAutoSave(r)
      r.clauses?.forEach(c => this.instantiateRuleClauseAutoSave(r.id, c))
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
        this.instantiateRuleClauseAutoSave(rule.id, newClause)
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

      this.instantiateRuleAutoSave(newRule)
    },
    instantiateRuleAutoSave (rule: EventTemplateRule) {
      this.rulesAutoSaveInstances[rule.id] = new AutoSave<EventTemplateRule>(
        rule,
        async changes =>
          await this.partialUpdateEventTemplateRule({
            changes,
            ruleId: rule.id,
            templateId: this.modelValue.id,
            courseId: this.courseId
          }),
        changes =>
          this.patchEditingEventTemplateRule({
            changes,
            ruleId: rule.id
          }),
        [],
        0
      )
    },
    instantiateRuleClauseAutoSave (
      ruleId: string,
      clause: EventTemplateRuleClause
    ) {
      this.ruleClausesAutoSaveInstances[clause.id] = new AutoSave<
        EventTemplateRuleClause
      >(
        clause,
        async changes =>
          await this.updateEventTemplateRuleClause({
            courseId: this.courseId,
            templateId: this.modelValue.id,
            ruleId,
            clause: { ...clause, ...changes }
          }),
        changes =>
          this.setEditingEventTemplateRuleClause({
            ruleId,
            payload: { ...clause, ...changes }
          }),
        [],
        0,
        undefined,
        this.setErrorNotification,
        true
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

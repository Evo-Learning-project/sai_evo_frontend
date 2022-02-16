<template>
  <div class="">
    <h3 class="mb-3.5">{{ $t('event_template_editor.editor_title') }}</h3>
    <div class="mb-6">
      <p class="mb-6 text-muted">
        {{ $t('event_template_editor.introduction_text') }}
      </p>
      <draggable
        ghost-class="drag-ghost"
        item-key="id"
        :modelValue="modelValue.rules"
        @end="onRuleDragEnd($event)"
      >
        <template #item="{element}">
          <EventTemplateRuleEditor
            :globallySelectedExercises="selectedExercises"
            :modelValue="element"
            @update:modelValue="onRuleUpdate($event)"
            @addClause="onRuleAddClause(element)"
            @updateClause="onRuleUpdateClause(element, $event)"
            :parentLoading="loading"
          >
          </EventTemplateRuleEditor>
        </template>
      </draggable>
      <!-- BEFORE DRAGGABLE
      <EventTemplateRuleEditor
        :globallySelectedExercises="selectedExercises"
        v-for="(rule, index) in modelValue.rules"
        :key="'template-' + elementId + '-rule-' + index"
        :modelValue="modelValue.rules[index]"
        @update:modelValue="onRuleUpdate(index, $event)"
        @addClause="onRuleAddClause(rule)"
        @updateClause="onRuleUpdateClause(rule, $event)"
        :parentLoading="loading"
      ></EventTemplateRuleEditor>-->
    </div>

    <div class="flex items-center mt-auto">
      <Btn @click="onAddRule()" :loading="loading"
        ><span class="mr-1 text-base material-icons-outlined">
          add_circle_outline </span
        >{{ $t('event_template_editor.add_rule') }}</Btn
      >
    </div>
  </div>
  <!-- </template>
  </card> -->
</template>

<script lang="ts">
import { v4 as uuid4 } from 'uuid'
import Btn from '@/components/ui/Btn.vue'
import { defineComponent, PropType } from '@vue/runtime-core'
import EventTemplateRuleEditor from './EventTemplateRuleEditor.vue'
import {
  EventTemplate,
  EventTemplateRule,
  EventTemplateRuleClause,
  EventTemplateRuleType,
  getBlankEventTemplateRule,
  getBlankTagBasedEventTemplateRuleClause
} from '@/models'
import { courseIdMixin, loadingMixin } from '@/mixins'

import draggable from 'vuedraggable'

import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('teacher')

export default defineComponent({
  components: {
    Btn,
    EventTemplateRuleEditor,
    draggable
  },
  mixins: [courseIdMixin, loadingMixin],
  name: 'EventTemplateEditor',
  props: {
    modelValue: {
      type: Object as PropType<EventTemplate>,
      required: true
    }
  },
  created () {
    this.elementId = uuid4()
  },
  watch: {},
  data () {
    return {
      elementId: '',
      loading: false
    }
  },
  methods: {
    ...mapActions([
      'addEventTemplateRule',
      'updateEventTemplateRule',
      'addEventTemplateRuleClause',
      'updateEventTemplateRuleClause'
    ]),
    async onRuleDragEnd (event: { oldIndex: number; newIndex: number }) {
      console.log('DRAG END', event)
      const draggedRule = this.modelValue.rules[event.oldIndex]

      if (event.oldIndex !== event.newIndex) {
        await this.onRuleUpdate(
          {
            ...draggedRule,
            _ordering: event.newIndex
          },
          true
        )
      }
    },
    async onAddRule () {
      this.loading = true
      await this.addEventTemplateRule({
        courseId: this.courseId,
        templateId: this.modelValue.id,
        rule: getBlankEventTemplateRule()
      })
      this.loading = false
    },
    async onRuleUpdate (newVal: EventTemplateRule, reFetch = false) {
      this.$emit('saving', true)

      // TODO refactor this
      const index = this.modelValue.rules.findIndex(r => r.id === newVal.id)
        // update in-memory object
        // eslint-disable-next-line @typescript-eslint/no-extra-semi
      ;(this.modelValue.rules as EventTemplateRule[])[index] = newVal // TODO use a mutation

      // dispatch update to store
      await this.updateEventTemplateRule({
        courseId: this.courseId,
        templateId: this.modelValue.id,
        rule: newVal,
        reFetch
      })
      this.$emit('saving', false)
    },
    async onRuleAddClause (rule: EventTemplateRule) {
      //this.loading = true
      await this.withLoading(
        async () =>
          await this.addEventTemplateRuleClause({
            courseId: this.courseId,
            eventId: this.eventId,
            templateId: this.modelValue.id,
            ruleId: rule.id,
            clause: getBlankTagBasedEventTemplateRuleClause()
          })
      )
      //this.loading = false
    },
    async onRuleUpdateClause (
      rule: EventTemplateRule,
      clause: EventTemplateRuleClause
    ) {
      await this.withLoading(
        async () =>
          await this.updateEventTemplateRuleClause({
            courseId: this.courseId,
            eventId: this.eventId,
            templateId: this.modelValue.id,
            ruleId: rule.id,
            clause
          })
      )
    }
  },
  computed: {
    selectedExercises (): string[] {
      return this.modelValue.rules
        .filter(r => r.rule_type == EventTemplateRuleType.ID_BASED)
        .map(r => r.exercises as string[])
        .flat()
    }
  }
})
</script>

<style></style>

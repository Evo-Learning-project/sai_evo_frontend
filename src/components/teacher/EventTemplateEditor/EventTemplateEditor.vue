<template>
  <div class="">
    <h3 class="mb-3.5">{{ $t('event_template_editor.editor_title') }}</h3>
    <div class="mb-6">
      <p class="mb-6 text-muted">
        {{ $t('event_template_editor.introduction_text') }}
      </p>
      <EventTemplateRuleEditor
        :globallySelectedExercises="selectedExercises"
        v-for="(rule, index) in modelValue.rules"
        :key="'template-' + elementId + '-rule-' + index"
        :modelValue="modelValue.rules[index]"
        @update:modelValue="onRuleUpdate(index, $event)"
      ></EventTemplateRuleEditor>
    </div>

    <div class="flex items-center mt-auto">
      <btn @btnClick="onAddRule()"
        ><span class="mr-1 text-base material-icons-outlined">
          add_circle_outline </span
        >{{ $t('event_template_editor.add_rule') }}</btn
      >
    </div>
  </div>
  <!-- </template>
  </card> -->
</template>

<script lang="ts">
import { v4 as uuid4 } from 'uuid'
//import Card from '@/components/ui/Card.vue'
import Btn from '@/components/ui/Btn.vue'
import { defineComponent, PropType } from '@vue/runtime-core'
import EventTemplateRuleEditor from './EventTemplateRuleEditor.vue'
import {
  EventTemplate,
  EventTemplateRule,
  EventTemplateRuleType,
  Exercise,
  getBlankEventTemplateRule
} from '@/models'
import { courseIdMixin } from '@/mixins'
//import Toggle from '@/components/ui/Toggle.vue'
export default defineComponent({
  components: {
    //Card,
    Btn,
    EventTemplateRuleEditor
    //Toggle
  },
  mixins: [courseIdMixin],
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
      elementId: ''
    }
  },
  methods: {
    async onAddRule () {
      await this.$store.dispatch('addEventTemplateRule', {
        courseId: this.courseId,
        templateId: this.modelValue.id,
        rule: getBlankEventTemplateRule()
      })
    },
    async onRuleUpdate (index: number, newVal: EventTemplateRule) {
      this.$emit('saving', true)

      // update in-memory object
      // eslint-disable-next-line @typescript-eslint/no-extra-semi
      ;(this.modelValue.rules as EventTemplateRule[])[index] = newVal // TODO use a mutation

      // dispatch update to store
      await this.$store.dispatch('updateEventTemplateRule', {
        courseId: this.courseId,
        templateId: this.modelValue.id,
        rule: newVal
      })
      this.$emit('saving', false)
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

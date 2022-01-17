<template>
  <div class="">
    <h3 class="mb-3.5">{{ $t('event_template_editor.editor_title') }}</h3>
    <div class="mb-6">
      <p class="mb-6 text-muted">
        {{ $t('event_template_editor.introduction_text') }}
      </p>
      <event-template-rule-editor
        v-for="(rule, index) in template.rules"
        :key="'template-' + elementId + '-rule-' + index"
        v-model="template.rules[index]"
      ></event-template-rule-editor>
    </div>

    <div class="flex items-center mt-auto">
      <btn @btnClick="addRule()"
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
import { defineComponent } from '@vue/runtime-core'
import EventTemplateRuleEditor from './EventTemplateRuleEditor.vue'
import {
  EventTemplate,
  getBlankEventTemplate,
  getBlankEventTemplateRule
} from '@/models'
//import Toggle from '@/components/ui/Toggle.vue'
export default defineComponent({
  components: {
    //Card,
    Btn,
    EventTemplateRuleEditor
    //Toggle
  },
  name: 'EventTemplateEditor',
  created () {
    this.elementId = uuid4()
    this.template = getBlankEventTemplate()
    this.addRule() // ! remove
  },
  watch: {
    criterion (_newVal, oldVal) {
      if (!oldVal) {
        this.addRule()
      }
    }
  },
  data () {
    return {
      elementId: '',
      // criterion: 'same_exercises_for_everyone' as  // ! put it back to null
      //   | 'same_exercises_for_everyone'
      //   | 'use_randomization'
      //   | null,
      template: {} as EventTemplate
    }
  },
  methods: {
    // setCriterion (value: 'same_exercises_for_everyone' | 'use_randomization') {
    //   this.criterion = value
    // },
    addRule () {
      this.template.rules.push(
        getBlankEventTemplateRule(this.template.rules.length)
      )
      // this.template.rules.push(
      //   (this.criterion == 'same_exercises_for_everyone'
      //     ? getBlankIdBasedEventTemplateRule
      //     : getBlankTagBasedEventTemplateRule)(this.template.rules.length)
      // )
    }
  },
  computed: {}
})
</script>

<style></style>

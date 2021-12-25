<template>
  <!-- <card>
    <template v-slot:header> -->
  <div class="flex flex-col h-full">
    <h3>{{ $t('event_template_editor.editor_title') }}</h3>
    <!--</template>
    <template v-slot:body>-->
    <div v-if="criterion == null">
      <p>
        {{
          $t('event_template_editor.same_exercises_for_everyone_or_randomize')
        }}
      </p>
      <div class="flex flex-col items-center my-6 space-y-2">
        <btn
          :outline="true"
          :size="'lg'"
          @click="setCriterion('same_exercises_for_everyone')"
          >{{ $t('event_template_editor.same_exercises_for_everyone') }}</btn
        >
        <btn
          :outline="true"
          :size="'lg'"
          @click="setCriterion('use_randomization')"
          >{{ $t('event_template_editor.use_randomization') }}</btn
        >
      </div>
    </div>
    <div class="mb-6" v-else-if="criterion == 'same_exercises_for_everyone'">
      <p class="mb-8">
        {{
          $t(
            'event_template_editor.same_exercises_for_everyone_choose_exercises'
          )
        }}
      </p>
      <exact-rule-event-template-editor
        v-for="(rule, index) in template.rules"
        :key="'template-' + elementId + '-rule-' + index"
        :rule="rule"
      ></exact-rule-event-template-editor>
    </div>
    <div v-else-if="criterion == 'use_randomization'"></div>

    <div class="flex items-center mt-auto" v-if="criterion">
      <btn @click="addRule()">{{ $t('event_template_editor.add_rule') }}</btn>
      <div
        v-if="criterion == 'same_exercises_for_everyone'"
        class="flex flex-col ml-auto"
      >
        <toggle class="ml-auto">{{
          $t(
            'event_template_editor.same_exercises_for_everyone_randomize_order'
          )
        }}</toggle>
        <p class="mt-1 text-xs text-muted">
          {{
            $t(
              'event_template_editor.same_exercises_for_everyone_randomize_order_help_text'
            )
          }}
        </p>
      </div>
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
import ExactRuleEventTemplateEditor from './ExactRuleEventTemplateEditor.vue'
import {
  EventTemplate,
  getBlankEventTemplate,
  getBlankIdBasedEventTemplateRule,
  getBlankTagBasedEventTemplateRule
} from '@/models'
import Toggle from '@/components/ui/Toggle.vue'
export default defineComponent({
  components: {
    //Card,
    Btn,
    ExactRuleEventTemplateEditor,
    Toggle
  },
  name: 'EventTemplateEditor',
  created () {
    this.elementId = uuid4()
    this.template = getBlankEventTemplate()
    this.addRule() // ! remove
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
      criterion: 'same_exercises_for_everyone' as  // ! put it back to null
        | 'same_exercises_for_everyone'
        | 'use_randomization'
        | null,
      template: {} as EventTemplate
    }
  },
  methods: {
    setCriterion (value: 'same_exercises_for_everyone' | 'use_randomization') {
      this.criterion = value
    },
    addRule () {
      this.template.rules.push(
        (this.criterion == 'same_exercises_for_everyone'
          ? getBlankIdBasedEventTemplateRule
          : getBlankTagBasedEventTemplateRule)(this.template.rules.length)
      )
    }
  },
  computed: {}
})
</script>

<style></style>

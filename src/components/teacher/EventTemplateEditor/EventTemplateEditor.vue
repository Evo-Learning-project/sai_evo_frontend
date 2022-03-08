<template>
  <div class="">
    <h3 class="mb-3.5">{{ $t("event_template_editor.editor_title") }}</h3>
    <div class="mb-6">
      <p class="mb-6 text-muted">
        {{ $t("event_template_editor.introduction_text") }}
      </p>
      <draggable
        ghost-class="drag-ghost"
        handle=".drag-handle"
        item-key="id"
        :modelValue="modelValue.rules"
        @end="onRuleDragEnd($event)"
      >
        <template #item="{ element, index }">
          <EventTemplateRuleEditor
            :globallySelectedExercises="selectedExercises"
            :modelValue="element"
            @updateRule="onRuleUpdate(element, $event.field, $event.value)"
            @addClause="onRuleAddClause(element)"
            @updateClause="onRuleUpdateClause(element, $event)"
            @deleteRule="onRuleDelete(element)"
            @ruleDialogClose="v$.$touch()"
          >
            <template v-slot:error>
              <p
                class="font-light text-muted text-danger-dark"
                v-if="v$.$errors[0]?.$response?.$errors[index].rule_type.length > 0"
              >
                {{ $t("validation_errors.eventTemplateRule.no_rule_type") }}
              </p>
              <p
                class="font-light text-muted text-danger-dark"
                v-if="v$.$errors[0]?.$response?.$errors[index].exercises.length > 0"
              >
                {{ $t("validation_errors.eventTemplateRule.no_exercises") }}
              </p>
              <p
                class="font-light text-muted text-danger-dark"
                v-if="v$.$errors[0]?.$response?.$errors[index].clauses.length > 0"
              >
                {{ $t("validation_errors.eventTemplateRule.no_valid_clauses") }}
              </p>
            </template>
          </EventTemplateRuleEditor>
        </template>
      </draggable>
    </div>

    <div class="flex items-center mt-auto">
      <Btn @click="onAddRule()" :loading="loading"
        ><span class="mr-1 text-base material-icons-outlined"> add_circle_outline </span
        >{{ $t("event_template_editor.add_rule") }}</Btn
      >
    </div>
  </div>
</template>

<script lang="ts">
import { v4 as uuid4 } from "uuid";
import Btn from "@/components/ui/Btn.vue";
import { defineComponent, PropType } from "@vue/runtime-core";
import EventTemplateRuleEditor from "./EventTemplateRuleEditor.vue";
import {
  EventTemplate,
  EventTemplateRule,
  EventTemplateRuleClause,
  EventTemplateRuleType,
  getBlankEventTemplateRule,
  getBlankTagBasedEventTemplateRuleClause,
} from "@/models";
import { courseIdMixin, loadingMixin } from "@/mixins";

import draggable from "vuedraggable";

import { createNamespacedHelpers } from "vuex";
import { AutoSaveManager } from "@/autoSave";
const { mapActions, mapMutations } = createNamespacedHelpers("teacher");

import { eventTemplateValidation } from "@/validation/models";
import useVuelidate from "@vuelidate/core";
export default defineComponent({
  setup() {
    return { v$: useVuelidate() };
  },
  validations() {
    return {
      modelValue: eventTemplateValidation,
    };
  },
  components: {
    Btn,
    EventTemplateRuleEditor,
    draggable,
  },
  mixins: [courseIdMixin, loadingMixin],
  name: "EventTemplateEditor",
  props: {
    modelValue: {
      type: Object as PropType<EventTemplate>,
      required: true,
    },
  },
  created() {
    this.modelValue.rules.forEach((r) => {
      this.instantiateRuleAutoSaveManager(r);
      r.clauses?.forEach((c) => this.instantiateRuleClauseAutoSaveManager(r.id, c));
    });
  },
  data() {
    return {
      elementId: uuid4(),
      rulesAutoSaveInstances: {} as Record<string, AutoSaveManager<EventTemplateRule>>,
      ruleClausesAutoSaveInstances: {} as Record<
        string,
        AutoSaveManager<EventTemplateRuleClause>
      >,
    };
  },
  methods: {
    ...mapActions([
      "addEventTemplateRule",
      "getEventTemplateRule",
      "partialUpdateEventTemplateRule",
      "addEventTemplateRuleClause",
      "updateEventTemplateRuleClause",
    ]),
    ...mapMutations(["patchEventTemplateRule", "patchEventTemplateRuleClause"]),
    instantiateRuleAutoSaveManager(rule: EventTemplateRule) {
      this.rulesAutoSaveInstances[rule.id] = new AutoSaveManager<EventTemplateRule>(
        rule,
        async (changes) =>
          await this.partialUpdateEventTemplateRule({
            changes,
            ruleId: rule.id,
            templateId: this.modelValue.id,
            courseId: this.courseId,
            // re-fetch rules if ordering changed
            reFetch: typeof changes._ordering !== "undefined",
          }),
        (changes) =>
          this.patchEventTemplateRule({
            payload: changes,
            ruleId: rule.id,
            templateId: this.modelValue.id,
          }),
        [],
        0
      );
    },
    instantiateRuleClauseAutoSaveManager(
      ruleId: string,
      clause: EventTemplateRuleClause
    ) {
      this.ruleClausesAutoSaveInstances[
        clause.id
      ] = new AutoSaveManager<EventTemplateRuleClause>(
        clause,
        async (changes) =>
          await this.updateEventTemplateRuleClause({
            courseId: this.courseId,
            templateId: this.modelValue.id,
            ruleId,
            clause: { ...clause, ...changes },
          }),
        (changes) =>
          this.patchEventTemplateRuleClause({
            ruleId,
            templateId: this.modelValue.id,
            clauseId: clause.id,
            payload: changes,
          }),
        [],
        0,
        undefined,
        this.setErrorNotification,
        undefined,
        true,
        false
      );
    },

    async onRuleDragEnd(event: { oldIndex: number; newIndex: number }) {
      if (event.oldIndex !== event.newIndex) {
        const draggedRule = this.modelValue.rules[event.oldIndex];
        await this.onRuleUpdate(draggedRule, "_ordering", event.newIndex);
      }
    },
    async onAddRule() {
      await this.withLoading(async () => {
        const newRule = await this.addEventTemplateRule({
          courseId: this.courseId,
          templateId: this.modelValue.id,
          rule: getBlankEventTemplateRule(),
        });
        this.instantiateRuleAutoSaveManager(newRule);
      });
    },
    async onRuleUpdate(
      rule: EventTemplateRule,
      field: keyof EventTemplateRule,
      value: unknown,
      reFetch = false
    ) {
      await this.rulesAutoSaveInstances[rule.id].onChange({ field, value });
    },
    async onRuleAddClause(rule: EventTemplateRule) {
      await this.withLocalLoading(async () => {
        const newClause = (await this.addEventTemplateRuleClause({
          courseId: this.courseId,
          eventId: this.eventId,
          templateId: this.modelValue.id,
          ruleId: rule.id,
          clause: getBlankTagBasedEventTemplateRuleClause(),
        })) as EventTemplateRuleClause;
        this.instantiateRuleClauseAutoSaveManager(rule.id, newClause);

        // reload rule to change "satisfying" preview
        await this.withLocalLoading(
          async () =>
            await this.getEventTemplateRule({
              courseId: this.courseId,
              templateId: this.modelValue.id,
              ruleId: rule.id,
            })
        );
      });
    },
    async onRuleDelete(rule: EventTemplateRule) {
      alert("Questa funzionalità non è ancora disponibile");
    },
    async onRuleUpdateClause(rule: EventTemplateRule, clause: EventTemplateRuleClause) {
      await this.ruleClausesAutoSaveInstances[clause.id].onChange({
        field: "tags",
        value: clause.tags,
      });

      // reload rule to change "satisfying" preview
      await this.withLocalLoading(
        async () =>
          await this.getEventTemplateRule({
            courseId: this.courseId,
            templateId: this.modelValue.id,
            ruleId: rule.id,
          })
      );
    },
  },
  computed: {
    selectedExercises(): string[] {
      return this.modelValue.rules
        .filter((r) => r.rule_type == EventTemplateRuleType.ID_BASED)
        .map((r) => r.exercises as string[])
        .flat();
    },
  },
});
</script>

<style></style>

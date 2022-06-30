<template>
  <div class="">
    <div class="flex items-center mb-2">
      <h4>{{ $t("event_template_editor.editor_title") }}</h4>
      <SegmentedControls
        :small="true"
        class="hidden ml-auto md:block"
        :options="viewModesAsOptions"
        v-model="viewMode"
      ></SegmentedControls>
    </div>
    <div class="mb-6">
      <p class="mb-8 text-muted" v-if="!showEditWarning">
        {{ $t("event_template_editor.introduction_text") }}
        <ArticleHandle :articleId="'whats_exam_template'"></ArticleHandle>.
      </p>
      <div v-else class="banner banner-danger">
        <span class="material-icons-outlined"> error_outline </span>
        <div>
          <h4 class="">{{ $t("misc.warning") }}</h4>
          <p class="">
            {{ $t("event_editor.edit_template_in_progress_warning") }}
          </p>
        </div>
      </div>
      <draggable
        :class="{
          'grid grid-cols-2 2xl:grid-cols-3 gap-4 mb-10': viewMode === 'grid',
        }"
        ghost-class="drag-ghost"
        drag-class="dragging-element"
        handle=".drag-handle"
        item-key="id"
        :modelValue="modelValue.rules"
        @end="onRuleDragEnd($event)"
      >
        <template #item="{ element, index }">
          <EventTemplateRuleEditor
            :class="[
              viewMode === 'list' && index % 2 ? 'card-filled' : 'bg-white',
            ]"
            :randomOrder="randomRuleOrder"
            :globallySelectedExercises="selectedExercises"
            :modelValue="element"
            :lockRuleType="element.amount > 1"
            :ordering="getActualSlotOrdering(index)"
            :reduced="viewMode === 'grid' || viewMode === 'compact_list'"
            @updateRule="
              onRuleUpdate(element, $event.field, $event.value);
              $emit('templateChanged');
            "
            @addClause="
              onRuleAddClause(element);
              $emit('templateChanged');
            "
            @updateClause="
              onRuleUpdateClause(element, $event);
              $emit('templateChanged');
            "
            @deleteClause="
              onRuleDeleteClause(element, $event);
              $emit('templateChanged');
            "
            @deleteRule="
              onRuleDelete(element);
              $emit('templateChanged');
            "
          >
          </EventTemplateRuleEditor>
        </template>
      </draggable>
    </div>

    <div class="flex items-center mt-auto">
      <Btn
        class="w-full md:w-max"
        @click="
          onAddRule();
          $emit('templateChanged');
        "
        :loading="localLoading"
        ><span class="mr-1 text-base material-icons-outlined"> add </span
        >{{ $t("event_template_editor.add_rule") }}</Btn
      >
      <DropdownMenu
        :expanded="addMultipleRulesExpanded"
        @toggleExpanded="addMultipleRulesExpanded = !addMultipleRulesExpanded"
        class="ml-0.5"
        :placement="mediaQueryMdMatches ? 'left' : 'right'"
        :tooltip="$t('event_template_editor.add_more_rules')"
      >
        <div class="w-max">
          <div
            class="flex flex-col w-full space-y-2  md:space-y-0 md:items-center md:flex-row"
          >
            <div class="flex items-center">
              <p>{{ $t("misc.add") }}</p>
              <NumberInput
                v-model="addRuleAmount"
                class="w-16 mx-2"
                :min="2"
              ></NumberInput>
              <p>{{ $t("misc.slots") }}</p>
            </div>
            <Btn
              :size="'sm'"
              class="md:ml-12"
              @click="onAddRule(addRuleAmount)"
              >{{ $t("misc.add") }}</Btn
            >
          </div>
          <!-- <p class="mt-2 text-sm text-muted">
            Tutti gli slot aggiunti avranno le stesse impostazioni.
          </p> -->
        </div>
      </DropdownMenu>
    </div>
  </div>
</template>

<script lang="ts">
import { v4 as uuid4 } from "uuid";
import Btn from "@/components/ui/Btn.vue";
import { defineComponent, inject, PropType } from "@vue/runtime-core";
import EventTemplateRuleEditor from "./EventTemplateRuleEditor.vue";
import {
  EventTemplate,
  EventTemplateRule,
  EventTemplateRuleClause,
  EventTemplateRuleType,
  getBlankEventTemplateRule,
  getBlankTagBasedEventTemplateRuleClause,
} from "@/models";
import { courseIdMixin, loadingMixin, mediaQueryMixin } from "@/mixins";

import draggable from "vuedraggable";

import { createNamespacedHelpers } from "vuex";
import { AutoSaveManager } from "@/autoSave";
const { mapActions, mapMutations } = createNamespacedHelpers("teacher");

import { eventTemplateValidation } from "@/validation/models";
import useVuelidate from "@vuelidate/core";
//import Card from "@/components/ui/Card.vue";
import { getTranslatedString as _ } from "@/i18n";
import DropdownMenu from "@/components/ui/DropdownMenu.vue";
import NumberInput from "@/components/ui/NumberInput.vue";
import ArticleHandle from "@/components/shared/HelpCenter/ArticleHandle.vue";
import SegmentedControls from "@/components/ui/SegmentedControls.vue";
import { SelectableOption } from "@/interfaces";
export default defineComponent({
  setup() {
    return {
      v$: inject("v$"),
      //  v$: useVuelidate()
    };
  },
  // validations() {
  //   return {
  //     modelValue: eventTemplateValidation,
  //   };
  // },
  components: {
    Btn,
    EventTemplateRuleEditor,
    draggable,
    DropdownMenu,
    NumberInput,
    ArticleHandle,
    SegmentedControls,
  },
  mixins: [courseIdMixin, loadingMixin, mediaQueryMixin],
  name: "EventTemplateEditor",
  props: {
    modelValue: {
      type: Object as PropType<EventTemplate>,
      required: true,
    },
    showEditWarning: {
      type: Boolean,
      default: false,
    },
    randomRuleOrder: {
      type: Boolean,
      required: true,
    },
  },
  created() {
    this.modelValue.rules.forEach((r) => {
      this.instantiateRuleAutoSaveManager(r);
      r.clauses?.forEach((c) =>
        this.instantiateRuleClauseAutoSaveManager(r.id, c)
      );
    });
  },
  data() {
    return {
      elementId: uuid4(),
      rulesAutoSaveInstances: {} as Record<
        string,
        AutoSaveManager<EventTemplateRule>
      >,
      ruleClausesAutoSaveInstances: {} as Record<
        string,
        AutoSaveManager<EventTemplateRuleClause>
      >,
      addRuleAmount: 2,
      addMultipleRulesExpanded: false,
      viewMode: "list" as "grid" | "list" | "compact_list",
    };
  },
  methods: {
    ...mapActions([
      "addEventTemplateRule",
      "getEventTemplateRule",
      "partialUpdateEventTemplateRule",
      "addEventTemplateRuleClause",
      "updateEventTemplateRuleClause",
      "deleteEventTemplateRule",
      "deleteEventTemplateRuleClause",
    ]),
    ...mapMutations(["patchEventTemplateRule", "patchEventTemplateRuleClause"]),
    instantiateRuleAutoSaveManager(rule: EventTemplateRule) {
      this.rulesAutoSaveInstances[rule.id] =
        new AutoSaveManager<EventTemplateRule>(
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
    getActualSlotOrdering(index: number) {
      // returns the amount of exercises that precede the first one
      // targeted by the rule at given index, i.e. the sum of all the values
      // of `amount` of the rules that come before the one at given index
      return this.modelValue.rules
        .filter((_, i) => i < index)
        .map((r) => r.amount)
        .reduce((a, b) => a + b, 0);
      //return this.modelValue.rules[index]._ordering ?? 0;
    },
    instantiateRuleClauseAutoSaveManager(
      ruleId: string,
      clause: EventTemplateRuleClause
    ) {
      this.ruleClausesAutoSaveInstances[clause.id] =
        new AutoSaveManager<EventTemplateRuleClause>(
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
    async onAddRule(amount = 1) {
      await this.withLocalLoading(async () => {
        const newRule = await this.addEventTemplateRule({
          courseId: this.courseId,
          templateId: this.modelValue.id,
          rule: getBlankEventTemplateRule(
            amount === 1 ? undefined : EventTemplateRuleType.TAG_BASED,
            amount
          ),
        });
        this.instantiateRuleAutoSaveManager(newRule);
      });
      if (amount > 1) {
        // multiple slots were added through the dropdown menu
        // restore data to defaults
        this.addMultipleRulesExpanded = false;
        this.addRuleAmount = 2;
      }
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
      if (confirm(_("event_template_editor.confirm_delete_rule"))) {
        await this.withLoading(async () =>
          this.deleteEventTemplateRule({
            courseId: this.courseId,
            templateId: this.modelValue.id,
            ruleId: rule.id,
          })
        );
      }
    },
    async onRuleUpdateClause(
      rule: EventTemplateRule,
      clause: EventTemplateRuleClause
    ) {
      await this.ruleClausesAutoSaveInstances[clause.id].onChange({
        field: "tags",
        value: clause.tags,
      });

      // reload rule to update "satisfying" preview
      await this.withLocalLoading(
        async () =>
          await this.getEventTemplateRule({
            courseId: this.courseId,
            templateId: this.modelValue.id,
            ruleId: rule.id,
          })
      );
    },
    async onRuleDeleteClause(rule: EventTemplateRule, clauseId: string) {
      if (confirm(_("event_template_editor.confirm_delete_rule_clause"))) {
        await this.deleteEventTemplateRuleClause({
          courseId: this.courseId,
          templateId: this.modelValue.id,
          ruleId: rule.id,
          clauseId,
        });

        // reload rule to update "satisfying" preview
        await this.withLocalLoading(
          async () =>
            await this.getEventTemplateRule({
              courseId: this.courseId,
              templateId: this.modelValue.id,
              ruleId: rule.id,
            })
        );
      }
    },
  },
  computed: {
    selectedExercises(): string[] {
      return this.modelValue.rules
        .filter((r) => r.rule_type == EventTemplateRuleType.ID_BASED)
        .map((r) => r.exercises as string[])
        .flat();
    },
    viewModesAsOptions(): SelectableOption[] {
      return [
        {
          value: "list",
          icons: ["view_list"],
          content: "",
        },
        {
          value: "grid",
          icons: ["view_module"],
          content: "",
        },
      ];
    },
  },
});
</script>

<style></style>

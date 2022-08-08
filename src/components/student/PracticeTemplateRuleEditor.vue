<template>
	<div class="">
		<div class="flex items-center w-full">
			<span class="material-icons-outlined"> arrow_right </span>
			<p class="mr-2">Scegli</p>
			<NumberInput
				class="w-16"
				:modelValue="modelValue.amount"
				@update:modelValue="$emit('partialUpdate', { field: 'amount', value: $event })"
			></NumberInput>
			<p class="mx-2">esercizi</p>
			<SegmentedControls
				:modelValue="modelValue.rule_type"
				:options="ruleTypeOptions"
				@update:modelValue="$emit('partialUpdate', { field: 'rule_type', value: $event })"
			></SegmentedControls>
			<span class="ml-auto text-base material-icons-outlined text-danger-dark"> close </span>
		</div>

		<TagBasedEventTemplateRuleEditor
			v-if="modelValue.rule_type === EventTemplateRuleType.TAG_BASED"
			:modelValue="modelValue.clauses"
			:showTeacherIntroductionText="false"
			:showPreview="false"
			:allowCreateMoreClauses="false"
			@addClause="$emit('addClause')"
			@removeClause="$emit('removeClause', $event)"
			@updateClause="$emit('updateClause', $event)"
		></TagBasedEventTemplateRuleEditor>
	</div>
</template>

<script lang="ts">
import { SelectableOption } from "@/interfaces";
import { EventTemplateRule, EventTemplateRuleType } from "@/models";
import { defineComponent } from "@vue/runtime-core";
import { PropType } from "vue";
import TagBasedEventTemplateRuleEditor from "../teacher/EventTemplateEditor/TagBasedEventTemplateRuleEditor.vue";
import NumberInput from "../ui/NumberInput.vue";
import { getTranslatedString as _ } from "@/i18n";
import SegmentedControls from "../ui/SegmentedControls.vue";

export default defineComponent({
	name: "PracticeTemplateRuleEditor",
	props: {
		modelValue: {
			type: Object as PropType<EventTemplateRule>,
			required: true,
		},
	},
	data() {
		return {
			EventTemplateRuleType,
		};
	},
	components: {
		NumberInput,
		TagBasedEventTemplateRuleEditor,
		SegmentedControls,
	},
	computed: {
		ruleTypeOptions(): SelectableOption[] {
			return [
				{
					value: EventTemplateRuleType.TAG_BASED,
					content: _("event_template_rule_type." + EventTemplateRuleType.TAG_BASED),
				},
				{
					value: EventTemplateRuleType.FULLY_RANDOM,
					content: _("event_template_rule_type." + EventTemplateRuleType.FULLY_RANDOM),
				},
			];
		},
	},
});
</script>

<style></style>

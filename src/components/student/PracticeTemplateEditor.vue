<template>
	<div>
		<div class="">
			<div class="relative">
				<div
					v-show="editingRule"
					class="absolute z-50 w-full h-full opacity-0 -top-1"
				></div>
				<div
					v-if="tagsAsSelectableOptions.length === 0"
					v-show="modelValue.rules.length !== 0"
				>
					<NumberInput
						:min="0"
						class="w-full mt-12"
						:modelValue="firstRule?.amount ?? 0"
						@update:modelValue="
							rulesAutoSaveInstances[firstRule?.id ?? '']?.onChange({
								amount: $event,
							})
						"
					>
						{{ $t("practice_template_editor.exercise_amount") }}
						<template v-slot:rightHint>
							/{{ currentCourse?.public_exercises_count ?? "" }}</template
						>
					</NumberInput>
				</div>

				<Chipset
					:options="tagsAsSelectableOptions"
					v-else
					v-model="proxyModelValue"
					:allowMultiple="true"
					v-slot="{ optionValue }"
					:class="{ 'opacity-20': editingRule }"
				>
					<div
						v-if="tagsToRules[optionValue] && selectedTags.includes(String(optionValue))"
					>
						<span
							v-if="parseInt(tagsToRules[optionValue]?.amount ?? 0) > 0"
							class="
								px-2
								ml-2
								font-semibold
								rounded-full
								bg-primary bg-opacity-20
								text-primary
							"
							>{{ tagsToRules[optionValue].amount }}</span
						>
					</div>
				</Chipset>
			</div>
			<div
				v-if="editingRuleTagSeenExercises > 0"
				:class="[editingRule ? 'visible' : 'invisible', 'mt-8']"
			>
				<p>
					{{ $t("practice_template_editor.seen_exercises_wont_be_selected") + " " }}
					<strong>{{ editingRuleTagSeenExercises }}</strong>
					{{ " " + $t("practice_template_editor.exercises_with_this_tag") }}
				</p>
			</div>
			<div
				class="
					flex flex-col flex-wrap
					mt-4
					md:items-center md:flex-row md:static
					fixed
					top-1/2
					md:transform-none md:w-max
					w-10/12
					transform
					-translate-y-1/2
					p-3
					md:p-0
					left-1/2
					-translate-x-1/2
					rounded
					md:rounded-none
					bg-light
					shadow-popup
					md:shadow-none md:bg-transparent
					z-50
				"
				:class="[editingRule ? 'visible' : 'invisible']"
			>
				<div
					class="
						flex flex-col
						md:items-start
						items-center
						md:flex-row md:space-y-0 md:mr-4
						space-y-2
					"
				>
					<p class="">{{ $t("practice_template_editor.rule_amount_1") }}</p>
					<Tag class="md:mx-2" v-if="editingRuleTag" :tag="editingRuleTag"></Tag>
					<p class="">{{ $t("practice_template_editor.rule_amount_2") }}</p>
				</div>
				<div
					class="
						flex
						md:mt-4
						lg:mt-0
						w-full
						lg:w-max
						md:flex-row
						flex-col
						md:space-y-0
						space-y-2
						md:space-x-2
						items-center
					"
				>
					<NumberInput
						v-model="editingRuleDirtyAmount"
						class="mt-2 md:w-32 w-full md:mt-0"
						:min="0"
						:max="editingRuleTag?.public_exercises_not_seen ?? 100000000"
					>
						<template v-slot:rightHint>
							/{{ editingRuleTag?.public_exercises_not_seen ?? "" }}</template
						></NumberInput
					>
					<div class="flex items-center w-full md:w-max space-x-2">
						<Btn
							class="my-auto md:w-max w-full"
							:disabled="editingRuleDirtyAmount < 1"
							@click="saveRule"
							>{{ $t("dialog.default_ok_text") }}</Btn
						>
						<Btn class="my-auto md:w-max w-full" :outline="true" @click="discardRule">{{
							$t("dialog.default_cancel_text")
						}}</Btn>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { courseIdMixin, loadingMixin } from "@/mixins";
import {
	EventTemplate,
	EventTemplateRule,
	EventTemplateRuleClause,
	EventTemplateRuleType,
	getBlankEventTemplateRule,
	getBlankTagBasedEventTemplateRuleClause,
	Tag as ITag,
} from "@/models";
import { defineComponent } from "@vue/runtime-core";
import { PropType } from "vue";

import Btn from "../ui/Btn.vue";
import { AutoSaveManager } from "@/autoSave";
import Chipset from "../ui/Chipset.vue";
import { SelectableOption } from "@/interfaces";
import NumberInput from "../ui/NumberInput.vue";
import Tag from "../ui/Tag.vue";
import { getTranslatedString as _ } from "@/i18n";
import { mapStores } from "pinia";
import { useMainStore } from "@/stores/mainStore";

export default defineComponent({
	name: "PracticeTemplateEditor",
	mixins: [courseIdMixin, loadingMixin],
	components: {
		Btn,
		Chipset,
		NumberInput,
		Tag,
	},
	props: {
		modelValue: {
			type: Object as PropType<EventTemplate>,
			required: true,
		},
	},
	async created() {
		if (this.mainStore.tags.length === 0 && this.modelValue.rules.length === 0) {
			// if there are no tags, create a rule with type FULLY_RANDOM to allow user
			// to at least get a selection of random public exercises
			await this.mainStore.createEventTemplateRule({
				courseId: this.courseId,
				templateId: this.modelValue.id,
				rule: getBlankEventTemplateRule(EventTemplateRuleType.FULLY_RANDOM),
			});
		}
		this.modelValue.rules.forEach(r => {
			this.instantiateRuleAutoSaveManager(r);
		});
		this.selectedTags = this.modelValue.rules.map(r =>
			String(r.clauses?.[0]?.tags?.[0]?.id),
		);
	},
	watch: {
		editingRule(newVal) {
			this.$emit("isEditingRule", newVal != null);
		},
	},
	data() {
		return {
			selectedTags: [] as string[],
			pendingSelectedTags: null as string[] | null,
			editingRuleDirtyAmount: 1,
			editingRule: null as string | null,
			rulesAutoSaveInstances: {} as Record<string, AutoSaveManager<EventTemplateRule>>,
			ruleClausesAutoSaveInstances: {} as Record<
				string,
				AutoSaveManager<EventTemplateRuleClause>
			>,
		};
	},
	methods: {
		async saveRule() {
			await this.rulesAutoSaveInstances[this.editingRule as string].onChange({
				amount: this.editingRuleDirtyAmount,
			});
			this.editingRule = null;
			if (this.pendingSelectedTags) {
				this.selectedTags = this.pendingSelectedTags;
				this.pendingSelectedTags = null;
			}
			this.$forceUpdate();
		},
		async discardRule() {
			if (this.pendingSelectedTags != null) {
				await this.rulesAutoSaveInstances[this.editingRule as string].onChange({
					amount: 0,
				});
				this.pendingSelectedTags = null;
			}
			this.editingRule = null;
		},
		async onRuleUpdateClause(clause: EventTemplateRuleClause) {
			await this.ruleClausesAutoSaveInstances[clause.id].onChange({
				tags: clause.tags,
			});
		},
		async onRuleAddClause(rule: EventTemplateRule, tagId: string) {
			await this.mainStore.createEventTemplateRuleClause({
				courseId: this.courseId,
				templateId: this.modelValue.id,
				ruleId: rule.id,
				clause: getBlankTagBasedEventTemplateRuleClause(
					this.mainStore.tags.find(t => t.id == tagId),
				),
			});
		},
		async onAddRule(tagId: string): Promise<EventTemplateRule> {
			return (await this.withLoading(async () => {
				const newRule = await this.mainStore.createEventTemplateRule({
					courseId: this.courseId,
					templateId: this.modelValue.id,
					rule: getBlankEventTemplateRule(EventTemplateRuleType.TAG_BASED),
				});

				this.instantiateRuleAutoSaveManager(newRule);
				// await new Promise((r) => setTimeout(r, 200));

				await this.onRuleAddClause(newRule, tagId);
				return newRule;
			})) as EventTemplateRule;
		},
		instantiateRuleAutoSaveManager(rule: EventTemplateRule) {
			this.rulesAutoSaveInstances[rule.id] = new AutoSaveManager<EventTemplateRule>(
				rule,
				// TODO investigate https://sentry.io/organizations/samuele/issues/3431902052/?project=6265941&query=is%3Aunresolved
				async changes =>
					await this.mainStore.partialUpdateEventTemplateRule({
						changes,
						ruleId: rule.id,
						templateId: this.modelValue.id,
						courseId: this.courseId,
						reFetch: false,
					}),
				changes =>
					this.mainStore.patchEditingEventTemplateRule({
						changes,
						ruleId: rule.id,
					}),
				[],
				0,
			);
		},
	},
	computed: {
		...mapStores(useMainStore),
		tagsAsSelectableOptions(): SelectableOption[] {
			return [...this.mainStore.tags]
				.sort((a, b) => (b.public_exercises ?? 0) - (a.public_exercises ?? 0))
				.map(t => ({
					value: String(t.id),
					content: t.name,
					description:
						(t.public_exercises_not_seen ?? 0) === 0
							? _("practice_template_editor.all_exercises_seen_with_this_tag")
							: String(t.public_exercises ?? 0) +
							  " " +
							  _("student_course_dashboard.available_exercises_tooltip"),
					disabled: (t.public_exercises_not_seen ?? 0) === 0,
				}));
		},
		proxyModelValue: {
			get() {
				return this.selectedTags;
			},
			async set(val: string[]) {
				if (val.length > this.selectedTags.length) {
					await this.withLoading(async () => {
						const newlyAdded = val[val.length - 1];
						// get rule containing this tag or create it if it doesn't exist
						const tagRule =
							this.tagsToRules[newlyAdded] ?? (await this.onAddRule(newlyAdded));

						this.editingRule = tagRule.id;
						this.editingRuleDirtyAmount = tagRule.amount || 1;
						// defer updating the selected tags array
						this.pendingSelectedTags = val;
					});
				} else {
					// TODO get rule for removed tag and set its amount to 0
					const removedTag = this.selectedTags.filter(t => !val.includes(t))[0];
					await this.rulesAutoSaveInstances[this.tagsToRules[removedTag].id].onChange({
						amount: 0,
					});
					this.selectedTags = val;
				}
			},
		},
		tagsToRules(): Record<string, EventTemplateRule> {
			const ret = {} as Record<string, EventTemplateRule>;

			this.modelValue.rules.forEach(r => {
				const tag = r?.clauses?.[0]?.tags[0];

				ret[String(typeof tag === "object" ? tag?.id ?? "" : tag)] = r;
			});
			return ret;
		},
		editingRuleTag(): ITag | undefined {
			return this.mainStore.tags.find(
				t =>
					t.id ==
					this.modelValue.rules.find(r => r.id == this.editingRule)?.clauses?.[0]
						?.tags?.[0]?.id,
			);
		},
		editingRuleTagSeenExercises(): number {
			if (!this.editingRuleTag) {
				return 0;
			}
			return (
				(this.editingRuleTag.public_exercises ?? 0) -
				(this.editingRuleTag.public_exercises_not_seen ?? 0)
			);
		},
		firstRule(): EventTemplateRule | undefined {
			return this.modelValue.rules?.[0];
		},
	},
});
</script>

<style></style>

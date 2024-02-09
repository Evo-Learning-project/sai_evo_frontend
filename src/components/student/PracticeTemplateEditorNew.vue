<template>
	<div>
		<!-- fallback when there are no public tags-->
		<div class="" v-if="tagsAsSelectableOptions.length === 0"></div>
		<!-- tag list -->
		<Chipset
			:options="tagsAsSelectableOptions"
			v-else
			v-model="proxyModelValue"
			:allowMultiple="true"
			v-slot="{ optionValue }"
			:class="{ 'opacity-30 select-none pointer-events-none': editingTagId }"
			:disabled="!!editingTagId"
		>
			<!-- display number of exercises with this tag selected-->
			<!-- TODO fix -->
			<div v-if="tagsToRules[optionValue]">
				<span
					v-if="(tagsToRules[optionValue]?.amount ?? 0) > 0"
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
		<div
			v-if="editingTagId"
			class="
				md:static
				absolute
				top-1/2
				left-1/2
				md:translate-x-0 md:translate-y-0
				transform
				-translate-x-1/2 -translate-y-1/2
				md:shadow-none
				shadow-lg
				bg-light
				md:bg-transparent
				flex
				md:flex-row
				flex-col
				mt-2
				w-full
				items-center
				md:space-x-2
				space-y-2
				md:space-y-0 md:py-0
				py-2
				md:px-0
				px-2
			"
		>
			<div class="flex space-x-2 items-center">
				<p>{{ $t("practice_template_editor.add_tag_1") }}</p>
				<NumberInput
					:min="1"
					:max="editingTag?.public_exercises_not_seen ?? 100000000"
					class="lg:w-28 w-32"
					:label="$t('practice_template_editor.amount')"
					v-model="editingTagDirtyAmount"
				>
					<!-- {{ $t("practice_template_editor.exercise_amount") }} -->
					<template v-slot:rightHint>
						<div v-if="editingTag?.public_exercises_not_seen" class="mb-0">
							/{{ editingTag?.public_exercises_not_seen ?? "" }}
						</div>
					</template>
				</NumberInput>
				<p>
					{{ $tc("practice_template_editor.add_tag_2", editingTagDirtyAmount ?? 1) }}
				</p>
			</div>

			<Tag :tag="editingTag" class="" />
			<p class="lg:block block md:hidden">
				{{ $t("practice_template_editor.add_tag_3") }}
			</p>

			<div class="flex items-center w-full md:w-max space-x-2">
				<Btn
					:size="'sm'"
					class="my-auto md:w-max w-full"
					:disabled="editingTagDirtyAmount < 1"
					@click="resolveTagSelectPromise(true)"
					>{{ $t("dialog.default_ok_text") }}</Btn
				>
				<Btn
					:size="'sm'"
					class="my-auto md:w-max w-full"
					:outline="true"
					@click="resolveTagSelectPromise(false)"
					>{{ $t("dialog.default_cancel_text") }}</Btn
				>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { SelectableOption } from "@/interfaces";
import {
	EventTemplate,
	EventTemplateRule,
	EventTemplateRuleType,
	Tag as ITag,
} from "@/models";
import { useMainStore } from "@/stores/mainStore";
import { defineComponent, PropType } from "@vue/runtime-core";
import { mapStores } from "pinia";
import { getTranslatedString as _ } from "@/i18n";
import Chipset from "@/components/ui/Chipset.vue";
import NumberInput from "../ui/NumberInput.vue";
import Btn from "../ui/Btn.vue";
import Tag from "../ui/Tag.vue";
export default defineComponent({
	name: "PracticeTemplateEditor",
	props: {
		modelValue: {
			type: Object as PropType<EventTemplate>,
			required: true,
		},
	},
	watch: {
		editingTagId(newVal) {
			this.$emit("isEditing", !!newVal);
		},
	},
	data() {
		return {
			editingTagId: null as string | null,
			editingTagDirtyAmount: null as number | null,
			resolveTagSelectPromise: null as ((v: boolean) => void) | null,
			rejectTagSelectPromise: null as (() => void) | null,
		};
	},
	methods: {
		async onTagSelect(tagId: string) {
			this.editingTagId = tagId;
			this.editingTagDirtyAmount = 1;
			try {
				const confirmed = await new Promise((resolve, reject) => {
					this.resolveTagSelectPromise = resolve;
					this.rejectTagSelectPromise = reject;
				});
				if (confirmed) {
					this.onAddRuleByTagId(tagId, this.editingTagDirtyAmount as number);
				}
			} finally {
				this.editingTagId = null;
				this.editingTagDirtyAmount = null;
				this.resolveTagSelectPromise = null;
				this.rejectTagSelectPromise = null;
			}
		},
		onAddRuleByTagId(tagId: string, amount: number) {
			this.$emit("update:modelValue", {
				...this.modelValue,
				rules: [
					...this.modelValue.rules,
					{
						rule_type: EventTemplateRuleType.TAG_BASED,
						weight: 1,
						amount,
						clauses: [
							{
								tags: [this.mainStore.tags.find(t => t.id == tagId) as ITag],
							},
						],
					},
				],
			} as EventTemplate);
		},
		onRemoveRuleByTagId(tagId: string) {
			this.$emit("update:modelValue", {
				...this.modelValue,
				rules: this.modelValue.rules.filter(r => r.clauses?.[0]?.tags[0]?.id != tagId),
			} as EventTemplate);
		},
	},
	computed: {
		...mapStores(useMainStore),
		proxyModelValue: {
			get() {
				return this.selectedTagIds;
			},
			set(val: string[]) {
				if (val.length > this.proxyModelValue.length) {
					// adding a new tag
					const newTagId = val.find(
						t => !this.proxyModelValue.includes(String(t)),
					) as string;
					this.onTagSelect(newTagId);
				} else {
					// removing a tag
					const removedTagId = this.proxyModelValue.find(
						t => !val.includes(String(t)),
					) as string;
					this.onRemoveRuleByTagId(removedTagId);
				}
			},
		},
		editingTag() {
			return this.mainStore.tags.find(t => t.id == this.editingTagId);
		},
		selectedTags() {
			return this.modelValue.rules.flatMap(r => (r.clauses ?? []).flatMap(c => c.tags));
		},
		selectedTagIds() {
			return this.selectedTags.map(t => String(t.id));
		},
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
		// Maps tag ids to rules that contain that tag
		tagsToRules(): Record<string, EventTemplateRule> {
			const ret = {} as Record<string, EventTemplateRule>;
			this.modelValue.rules.forEach(r => {
				// take first tag of first clause
				const tag = r?.clauses?.[0]?.tags[0];
				ret[
					// TODO review if this is needed
					String(typeof tag === "object" ? tag?.id ?? "" : tag)
				] = r;
			});
			return ret;
		},
	},
	components: { Chipset, NumberInput, Btn, Tag },
});
</script>

<style></style>

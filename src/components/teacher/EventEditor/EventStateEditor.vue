<template>
	<div class="">
		<h4 class="mb-3">{{ $t("event_editor.state_editor_title") }}</h4>
		<div class="my-4 banner banner-light" v-if="isDraft">
			<span class="ml-px text-yellow-900 material-icons-outlined"> error_outline </span>
			<p class="">{{ currentEventStateDescription }}</p>
		</div>
		<div class="my-4 banner banner-success" v-if="isPlanned">
			<span class="ml-px text-success material-icons-outlined">
				check_circle_outline
			</span>
			<p class="">{{ currentEventStateDescription }}</p>
		</div>
		<div class="">
			<div
				:class="{ shake: shakeErrorBanner }"
				v-if="relevantErrors.length > 0"
				@animationend="shakeErrorBanner = false"
				class="mb-12 banner banner-danger"
			>
				<div>
					<p class="font-semibold">
						{{ $t("event_editor.correct_errors_to_publish") }}
					</p>
					<ul class="mt-2 list-disc list-inside">
						<li
							class="text-muted text-danger-dark"
							v-for="(error, index) in relevantErrors"
							:key="'err-' + index"
						>
							{{ $t("validation_errors.event." + error.$uid) }}
						</li>
					</ul>
				</div>
			</div>
			<div
				class="
					flex flex-col
					mt-2
					space-y-2
					md:items-center md:flex-row md:space-y-0 md:space-x-4
				"
			>
				<h5 class="">
					{{
						isDraft || isPlanned
							? $t("event_editor.current_state_is")
							: $t("event_editor.state_is")
					}}
					<strong>{{ currentEventStateName }}</strong
					>.
				</h5>
				<Btn
					class=""
					v-if="isDraft || isPlanned"
					:variant="'primary'"
					:loading="localLoading"
					:disabled="false && isDraft && v$.$invalid && v$.$dirty"
					@click="
						isDraft ? (v$.$invalid ? onInvalidSubmission() : publish()) : revertToDraft()
					"
				>
					{{ isDraft ? $t("event_editor.publish") : $t("event_editor.revert_to_draft") }}
				</Btn>
			</div>
			<p v-if="isPlanned" class="mt-10 text-muted">
				{{ $t("event_editor.event_planned_help_text") }}
				<!-- <strong>{{ formattedTimestamp }}</strong> -->
				<strong>&nbsp;<Timestamp :value="modelValue.begin_timestamp"></Timestamp></strong
				>.
			</p>
			<div class="flex flex-col items-stretch mt-2 space-y-2" v-if="isPlanned || isOpen">
				<p class="text-muted">
					{{ $t("event_editor.this_is_the_link_to_the_event") }}
				</p>
				<CopyToClipboard :value="permalink"></CopyToClipboard>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Event, EventState } from "@/models";
import { defineComponent, inject, PropType } from "@vue/runtime-core";
import { icons as eventStateIcons } from "@/assets/eventStateIcons";
import { getTranslatedString as _ } from "@/i18n";
//import Card from "@/components/ui/Card.vue";
import Btn from "@/components/ui/Btn.vue";
import { getExamPermalink, getFormattedTimestamp } from "@/utils";
import Timestamp from "@/components/ui/Timestamp.vue";
import CopyToClipboard from "@/components/ui/CopyToClipboard.vue";
import { loadingMixin } from "@/mixins";

export default defineComponent({
	components: {
		Btn,
		Timestamp,
		CopyToClipboard,
	},
	mixins: [loadingMixin],
	props: {
		modelValue: {
			type: Object as PropType<Event>,
			required: true,
		},
	},
	setup() {
		return {
			v$: inject("v$"),
		};
	},
	name: "EventStateEditor",
	data() {
		return {
			shakeErrorBanner: false,
		};
	},
	methods: {
		emitUpdate(value: EventState) {
			this.$emit("update:modelValue", value);
		},
		onInvalidSubmission() {
			(this.v$ as any).$touch();
			window.scrollTo(
				0,
				document.body.scrollHeight || document.documentElement.scrollHeight,
			);
			// scroll to bottom of page to account for error messages appearing
			// in order to keep error banner in view
			this.$nextTick(() =>
				window.scrollTo(
					0,
					document.body.scrollHeight || document.documentElement.scrollHeight,
				),
			);
			this.shakeErrorBanner = true;
		},
		publish() {
			this.emitUpdate(EventState.PLANNED);
		},
		revertToDraft() {
			this.emitUpdate(EventState.DRAFT);
		},
	},
	computed: {
		eventStateOptions() {
			return (Object.keys(EventState) as unknown[] as EventState[])
				.filter((key: string | number) => parseInt(key as string) == key) //(ExerciseType[key] as unknown) == 'number')
				.map(key => ({
					icons: eventStateIcons[key],
					value: key,
					content: _("event_states." + key),
					description: _("event_states_descriptions." + key),
				}));
		},
		isDraft() {
			return this.modelValue.state == EventState.DRAFT;
		},
		isPlanned() {
			return this.modelValue.state == EventState.PLANNED;
		},
		isOpen() {
			return this.modelValue.state == EventState.OPEN;
		},
		currentEventStateName() {
			return this.eventStateOptions[this.modelValue?.state]?.content?.toLowerCase();
		},
		currentEventStateDescription() {
			return this.eventStateOptions[this.modelValue?.state]?.description;
		},
		formattedTimestamp() {
			return getFormattedTimestamp(this.modelValue.begin_timestamp ?? "");
		},
		permalink(): string {
			return getExamPermalink(this.modelValue);
		},
		relevantErrors() {
			// remove the errors that are relative to event template rules as those
			// are displayed in the rule editor component
			return (
				(this.v$ as any).$errors
					// TODO find a less hacky way
					.filter(
						(e: { $uid: string }) =>
							![
								"rule_type-ruleTypeSet",
								"exercises-idBasedRulePopulated",
								"clauses-tagBasedRulePopulated",
								"satisfying-tagBasedRuleSatisfied",
							].includes(e.$uid.slice("modelValue".length + 1)),
					)
			);
		},
	},
});
</script>

<style></style>

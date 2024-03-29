<template>
	<div class="">
		<h4 class="mb-3">{{ $t("event_editor.state_editor_title") }}</h4>
		<!-- state banners-->
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
			<!-- errors -->
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
					md:mt-10
					space-y-2
					md:items-center md:flex-row md:space-y-0 md:space-x-4
				"
			>
				<!-- text showing exam state-->
				<h5 v-if="isDraft" class="text-lg">
					{{ $t("event_editor.current_state_is_draft") }}.
				</h5>

				<h5 v-else-if="isPlanned" class="text-lg">
					{{ $t("event_editor.current_state_is_planned") }}.
				</h5>

				<h5 v-else>
					{{ $t("event_editor.state_is") }}
					<strong>{{ currentEventStateName }} </strong>.
				</h5>
				<div
					class="flex md:space-x-12 md:flex-row flex-col md:space-y-0 space-y-4"
					v-if="isDraft || isPlanned"
				>
					<!-- publish/unpublish button-->
					<Btn
						class=""
						:variant="'primary'"
						:loading="loading"
						:disabled="false && isDraft && v$.$invalid && v$.$dirty"
						@click="
							isDraft
								? v$.$invalid
									? onInvalidSubmission()
									: publish()
								: revertToDraft()
						"
					>
						{{
							isDraft ? $t("event_editor.publish") : $t("event_editor.revert_to_draft")
						}}
					</Btn>
					<IntegrationSwitch
						class="md:ml-auto bg-light pl-3 pr-2 rounded md:py-0 py-2"
						v-if="isDraft && showClassroomIntegrationSwitch && !hasGoogleClassroomTwin"
						v-model="publishToClassroom"
					/>
				</div>
				<PublishedOnClassroom
					:remote-object-url="
						googleClassroomCourseWorkTwin.data.alternateLink ||
						(googleClassroomCourseTwin
							? googleClassroomCourseTwin.data.alternateLink
							: '')
					"
					class="banner-success pl-3 pr-2 rounded md:py-0"
					v-if="hasGoogleClassroomTwin"
				/>
			</div>
			<!-- helper text for planned exam-->
			<p v-if="isPlanned" class="mt-10 text-muted">
				{{ $t("event_editor.event_planned_help_text") }}
				<strong><Timestamp :value="modelValue.begin_timestamp" /></strong>.
			</p>
			<!-- text with link to the exam -->
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
import { courseIdMixin, eventIdMixin, loadingMixin } from "@/mixins";
import IntegrationSwitch from "@/integrations/classroom/components/IntegrationSwitch.vue";
import { mapStores } from "pinia";
import { useGoogleIntegrationsStore } from "@/integrations/stores/googleIntegrationsStore";
import PublishedOnClassroom from "@/integrations/classroom/components/PublishedOnClassroom.vue";
import { GoogleClassroomCourseWorkTwin } from "@/integrations/classroom/interfaces";

export default defineComponent({
	components: {
		Btn,
		Timestamp,
		CopyToClipboard,
		IntegrationSwitch,
		PublishedOnClassroom,
	},
	props: {
		modelValue: {
			type: Object as PropType<Event>,
			required: true,
		},
		loading: {
			type: Boolean,
			default: false,
		},
	},
	mixins: [courseIdMixin, eventIdMixin],
	setup() {
		return {
			v$: inject("v$"),
		};
	},
	name: "EventStateEditor",
	async created() {
		this.showClassroomIntegrationSwitch =
			await this.googleIntegrationStore.isGoogleClassroomIntegrationActive(this.courseId);
		await this.checkForCourseworkTwin();
	},
	data() {
		return {
			shakeErrorBanner: false,
			publishToClassroom: true,
			showClassroomIntegrationSwitch: false,
			googleClassroomCourseWorkTwin: null as null | GoogleClassroomCourseWorkTwin,
		};
	},
	methods: {
		async checkForCourseworkTwin() {
			this.googleClassroomCourseWorkTwin =
				await this.googleIntegrationStore.getGoogleClassroomCourseWorkTwin(this.eventId);
		},
		emitUpdate(value: EventState) {
			this.$emit("update:modelValue", {
				value,
				fireIntegrationEvent: this.publishToClassroom,
			});
			// if we're changing the exam to PLANNED and there's an active integration
			// with Classroom, check whether the twin coursework was created successfully
			if (
				this.publishToClassroom &&
				this.showClassroomIntegrationSwitch &&
				value === EventState.PLANNED
			) {
				const handle = setInterval(async () => {
					await this.checkForCourseworkTwin();
					if (this.hasGoogleClassroomTwin) {
						clearInterval(handle);
					}
				}, 1000);
			}
		},
		onInvalidSubmission() {
			// make errors visible
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
		...mapStores(useGoogleIntegrationsStore),
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
		hasGoogleClassroomTwin() {
			return this.googleClassroomCourseWorkTwin !== null;
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
		googleClassroomCourseTwin() {
			return this.googleIntegrationStore.courseTwins[this.courseId];
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

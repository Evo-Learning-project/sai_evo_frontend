<template>
	<div>
		<div
			class="
				h-full
				py-6
				my-3
				transition-shadow
				duration-75
				ease-in-out
				card
				shadow-elevation
				hover-shadow-elevation-2
			"
		>
			<div class="flex flex-col w-full md:items-center md:flex-row">
				<div class="flex md:w-1/3 md:mr-auto">
					<!-- drag handle -->
					<span
						v-if="!randomOrder"
						class="
							my-auto
							mr-2
							text-lg
							cursor-move
							drag-handle
							material-icons-outlined
							opacity-70
						"
					>
						drag_indicator
					</span>
					<!-- heading -->
					<h4 :class="{ 'text-danger-dark': v$.$errors.length > 0 }" class="">
						{{ $t("event_template_rule_editor.exercise_number") }}
						{{ displayedOrdering }}
						<span v-if="modelValue.amount > 1" class="ml-2 text-muted"
							>({{ modelValue.amount + " " + $t("misc.slots") }})</span
						>
					</h4>
					<!-- delete button mobile -->
					<Btn
						:tooltip="$t('misc.delete')"
						:variant="'icon'"
						:outline="true"
						@click="$emit('deleteRule')"
						class="
							ml-auto
							-mt-2
							-mr-3
							transition-opacity
							duration-100
							opacity-50
							md:hidden
							hover:opacity-100
						"
						><span style="font-size: 17px" class="material-icons"> delete </span>
					</Btn>
				</div>

				<div
					class="
						flex flex-col
						w-full
						my-auto
						md:space-x-2 md:items-center md:flex-row md:ml-auto
					"
				>
					<NumberInput
						:min="0"
						class="my-4 md:ml-auto md:my-0"
						:class="{ 'md:w-1/4': !reduced, 'md:w-1/3': reduced }"
						:modelValue="modelValue.weight ?? 0"
						@update:modelValue="emitUpdate('weight', $event)"
					>
						<div class="flex space-x-1">
							<p>
								{{ $t("event_template_rule_editor.weight") }}
							</p>
							<Tooltip
								:placement="'top'"
								class="transform scale-125"
								:text-code="'event_template_rule_editor.weight'"
							></Tooltip>
						</div>
					</NumberInput>
					<div class="flex items-center space-x-2">
						<!-- settings button -->
						<Btn
							:variant="'secondary'"
							@click="showRuleDialog()"
							:size="'sm'"
							class="w-full"
						>
							<div class="flex items-center">
								<span class="material-icons mr-1.5"> settings </span
								>{{ $t("event_template_rule_editor.choose_exercise") }}
							</div>
						</Btn>
						<!-- delete button -->
						<Btn
							:tooltip="$t('misc.delete')"
							:variant="'icon'"
							:outline="true"
							@click="$emit('deleteRule')"
							class="
								hidden
								transition-opacity
								duration-100
								opacity-50
								md:block
								hover:opacity-100
							"
							><span style="font-size: 17px" class="material-icons"> delete </span>
						</Btn>
					</div>
				</div>
			</div>
			<!-- exercises preview -->
			<div
				v-if="isSlotPopulated && modelValue.rule_type == EventTemplateRuleType.ID_BASED"
				class="mt-4"
			>
				<p class="mb-2 text-muted">
					{{
						ruleExercises.length == 1
							? $t("event_template_rule_editor.same_exercise_for_everyone_description")
							: $t("event_template_rule_editor.one_exercise_from_set_description")
					}}
				</p>
				<div>
					<!-- previews -->
					<div
						v-if="!loadingPreview"
						:class="[
							ruleExercises.length > 1
								? reduced
									? 'flex flex-wrap'
									: 'grid md:grid-cols-2 gap-2'
								: '',
							'overflow-x-auto md:overflow-visible',
						]"
					>
						<div
							v-for="exercise in ruleExercises"
							:key="'r-' + modelValue.id + '-e-' + exercise.id"
						>
							<MinimalExercisePreview
								:reduced="reduced"
								:exercise="exercise"
								:selectable="false"
								:showEdit="false"
								:class="{ 'mr-6': reduced }"
								@edit="
									$router.push({
										name: 'CourseExercises',
										hash: '#editor-' + exercise.id,
									})
								"
							></MinimalExercisePreview>
						</div>
					</div>
					<div
						v-else
						:class="[
							ruleExercises.length > 1 ? 'grid md:grid-cols-2 gap-2' : '',
							'overflow-x-auto md:overflow-visible',
						]"
					>
						<SkeletonCard :short="true"></SkeletonCard>
						<SkeletonCard v-if="ruleExercises.length > 1" :short="true"></SkeletonCard>
					</div>
				</div>
			</div>
			<!-- tags preview -->
			<div
				v-else-if="
					isSlotPopulated && modelValue.rule_type == EventTemplateRuleType.TAG_BASED
				"
				class="mt-4"
				:class="{ 'opacity-40': v$.$errors.length > 0 }"
			>
				<p class="mb-2 text-muted" v-if="modelValue.amount === 1">
					{{ $t("event_template_rule_editor.tag_based_description") }}
				</p>
				<p class="mb-2 text-muted" v-else>
					{{ $t("event_template_rule_editor.tag_based_description_multiple_1") + " "
					}}<strong>{{ modelValue.amount }}</strong>

					{{ " " + $t("event_template_rule_editor.tag_based_description_multiple_2") }}
				</p>
				<div class="flex xl:flex-row flex-col xl:space-x-3">
					<div
						v-for="(clause, index) in modelValue.clauses"
						:key="'clause-preview-' + clause.id"
						class="flex items-center mb-2 flex-wrap"
					>
						<p class="mr-2" v-if="clause.tags.length > 1">
							{{ $t("event_template_rule_editor.tag_based_at_least_one") }}
							{{ $t("misc.among") }} <span class="text-xl text-muted">(</span>
						</p>
						<Tag
							class="mx-0.5"
							:class="{ '-ml-1.5': index === 0 }"
							v-for="(tag, index) in clause.tags"
							:key="'clause-' + clause.id + '-tag-' + tag.id"
							:tag="tag"
						></Tag
						><span v-if="clause.tags.length > 1" class="text-xl text-muted">)</span>
						<p v-if="index !== modelValue.clauses.length - 1">,</p>
					</div>
				</div>
			</div>
			<p
				class="text-danger-dark"
				v-for="error in v$.$errors"
				:key="modelValue.id + '-' + error.$uid"
			>
				{{ $t("validation_errors.eventTemplateRule." + error.$uid) }}
			</p>
		</div>
		<Dialog
			:showDialog="showDialog"
			:large="true"
			:fullHeight="modelValue.rule_type === EventTemplateRuleType.ID_BASED"
			:headerBorder="modelValue.rule_type === EventTemplateRuleType.ID_BASED"
			:stickyHeader="modelValue.rule_type === EventTemplateRuleType.ID_BASED"
			:footerBorder="true"
			:confirmOnly="true"
			@yes="onCloseDialog()"
		>
			<template v-if="modelValue.rule_type != null && !lockRuleType" v-slot:backButton>
				<Btn
					:variant="'icon'"
					:outline="true"
					:size="'lg'"
					:tooltip="$t('event_template_rule_editor.reset_slot_settings')"
					class="-ml-3.5 mt-1.25px"
					@click="setRuleMode(null)"
				>
					<span class="material-icons-outlined"> restart_alt </span>
				</Btn>
			</template>
			<template v-slot:title>
				{{
					(modelValue.amount === 1
						? $t("event_template_rule_editor.populate_slot_singular_title")
						: $t("event_template_rule_editor.populate_slot_plural_title")) +
					" " +
					displayedOrdering
				}}
			</template>
			<template v-slot:body>
				<div v-if="modelValue.rule_type == null">
					<p>{{ $t("event_template_rule_editor.mode_selection_text") }}</p>
					<div class="grid grid-cols-1 mt-6 md:grid-cols-3">
						<Btn
							@click="setRuleMode(EventTemplateRuleType.ID_BASED, true)"
							:variant="'transparent'"
							class="
								pb-4
								border-b
								md:py-5 md:pl-4 md:border-r md:border-b-0
								hoverable-with-two-tone-primary
							"
						>
							<template v-slot:content>
								<div class="flex items-center justify-center space-x-3">
									<span class="opacity-50 material-icons-two-tone two-tone-light">
										topic
									</span>
									<h4 class="">
										{{ $t("event_template_rule_editor.pick_single_exercise") }}
									</h4>
								</div>
								<p style="letter-spacing: 0.25px" class="font-normal">
									{{ $t("event_template_rule_editor.pick_single_exercise_help_text") }}
								</p></template
							>
						</Btn>
						<Btn
							@click="setRuleMode(EventTemplateRuleType.ID_BASED, false)"
							:variant="'transparent'"
							class="
								py-4
								border-b
								md:pl-4 md:pr-3 md:py-0 md:border-r md:border-b-0
								hoverable-with-two-tone-primary
							"
						>
							<template v-slot:content>
								<div class="flex items-center justify-center space-x-3">
									<span class="opacity-50 material-icons-outlined"> shuffle </span>
									<h4 class="">
										{{ $t("event_template_rule_editor.pick_exercise_from_pool") }}
									</h4>
								</div>
								<p style="letter-spacing: 0.25px" class="font-normal">
									{{ $t("event_template_rule_editor.pick_exercise_from_pool_help_text") }}
								</p></template
							>
						</Btn>
						<Btn
							@click="setRuleMode(EventTemplateRuleType.TAG_BASED)"
							:variant="'transparent'"
							class="pt-4 md:pl-8 md:pt-0 hoverable-with-two-tone-primary md:pr-6"
						>
							<template v-slot:content>
								<div class="flex items-center justify-center space-x-3">
									<span class="opacity-50 material-icons-two-tone two-tone-light">
										label
									</span>
									<h4 class="">
										{{ $t("event_template_rule_editor.pick_exercise_tag_based") }}
									</h4>
								</div>
								<p style="letter-spacing: 0.25px" class="font-normal">
									{{ $t("event_template_rule_editor.pick_exercise_tag_based_help_text") }}
								</p>
							</template>
						</Btn>
					</div>
				</div>
				<div v-else-if="modelValue.rule_type == EventTemplateRuleType.ID_BASED">
					<h3 class="text-dark">
						{{
							pickOneExerciseOnly
								? $t("event_template_rule_editor.pick_single_exercise")
								: $t("event_template_rule_editor.pick_exercise_from_pool")
						}}
					</h3>
					<p>
						{{
							pickOneExerciseOnly
								? $t("event_template_rule_editor.pick_single_exercise_help_text")
								: $t("event_template_rule_editor.pick_exercise_from_pool_help_text")
						}}
					</p>
					<div class="mt-4" style="height: calc(100vh - 224px)">
						<ExercisePicker
							:modelValue="modelValue.exercises"
							:alreadySelected="globallySelectedExercises"
							@addExercise="onAddExercise($event)"
							@removeExercise="onRemoveExercise($event)"
						></ExercisePicker>
					</div>
				</div>
				<div v-else-if="modelValue.rule_type == EventTemplateRuleType.TAG_BASED">
					<TagBasedEventTemplateRuleEditor
						:modelValue="modelValue.clauses"
						:satisfying="modelValue.satisfying"
						@addClause="$emit('addClause')"
						@deleteClause="$emit('deleteClause', $event)"
						@updateClause="$emit('updateClause', $event)"
					></TagBasedEventTemplateRuleEditor>
				</div>
			</template>
		</Dialog>
	</div>
</template>

<script lang="ts">
import Dialog from "@/components/ui/Dialog.vue";
import { EventTemplateRule, EventTemplateRuleType, Exercise } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import Btn from "@/components/ui/Btn.vue";
import ExercisePicker from "@/components/teacher/ExercisePicker.vue";
import MinimalExercisePreview from "../ExerciseEditor/MinimalExercisePreview.vue";
import { getExercisesById } from "@/api/exercises";
import SkeletonCard from "@/components/ui/SkeletonCard.vue";
import { courseIdMixin, loadingMixin } from "@/mixins";
import TagBasedEventTemplateRuleEditor from "./TagBasedEventTemplateRuleEditor.vue";
import Tag from "@/components/ui/Tag.vue";
import { getTranslatedString as _ } from "@/i18n";
import useVuelidate from "@vuelidate/core";
import { eventTemplateRuleValidation } from "@/validation/models";
import NumberInput from "@/components/ui/NumberInput.vue";
import Tooltip from "@/components/ui/Tooltip.vue";

export default defineComponent({
	components: {
		Dialog,
		Btn,
		ExercisePicker,
		MinimalExercisePreview,
		SkeletonCard,
		TagBasedEventTemplateRuleEditor,
		Tag,
		NumberInput,
		Tooltip,
	},
	name: "EventTemplateRuleEditor",
	setup() {
		return {
			v$: useVuelidate(),
		};
	},
	validations() {
		return { modelValue: eventTemplateRuleValidation };
	},
	watch: {
		"modelValue.exercises": {
			deep: true,
			async handler(newVal: string[]) {
				console.log("Changed", newVal);
				// keep local exercises synced with rule's exercises
				const strNewVal = newVal.map(i => String(i));
				const localExercisesIds = this.previewExercises.map(e => String(e.id));

				const toFetch = strNewVal.filter(i => !localExercisesIds.includes(i));
				const toRemove = localExercisesIds.filter(i => !strNewVal.includes(i));

				try {
					this.loadingPreview = true;
					if (toFetch.length > 0) {
						const fetched = await getExercisesById(this.courseId, toFetch);
						this.previewExercises.push(...fetched);
					}
					this.loadingPreview = false;
				} catch (e) {
					this.setErrorNotification(e);
				}

				this.previewExercises = this.previewExercises.filter(
					e => !toRemove.includes(String(e.id)),
				);
			},
		},
	},
	props: {
		modelValue: {
			type: Object as PropType<EventTemplateRule>,
			required: true,
		},
		globallySelectedExercises: {
			type: Object as PropType<string[]>,
			required: true,
		},
		randomOrder: {
			type: Boolean,
			required: true,
		},
		ordering: {
			type: Number,
			required: true,
		},
		lockRuleType: {
			type: Boolean,
			default: false,
		},
		expanded: {
			type: Boolean,
			default: true,
		},
		reduced: {
			type: Boolean,
			default: false,
		},
	},
	mixins: [courseIdMixin, loadingMixin],
	// async created() {
	// 	// fetch exercises related to this rule
	// 	if (
	// 		this.modelValue.rule_type == EventTemplateRuleType.ID_BASED &&
	// 		(this.modelValue.exercises?.length ?? 0) > 0
	// 	) {
	// 		this.loadingPreview = true;
	// 		try {
	// 			this.previewExercises = await getExercisesById(
	// 				this.courseId,
	// 				this.modelValue.exercises as string[],
	// 			);
	// 		} catch (e) {
	// 			this.setErrorNotification(e);
	// 		} finally {
	// 			this.loadingPreview = false;
	// 		}
	// 	}
	// },
	data() {
		return {
			showDialog: false,
			// rule is ID-based and only one exercise is allowed (same for everyone)
			pickOneExerciseOnly: null as boolean | null,
			previewExercises: [] as Exercise[],
			EventTemplateRuleType,
			loadingPreview: false,
		};
	},
	methods: {
		onCloseDialog() {
			this.showDialog = false;
			this.$emit("ruleDialogClose");
			this.v$.$touch();
		},
		emitUpdate(key: keyof EventTemplateRule, value: unknown) {
			this.$emit("updateRule", {
				field: key,
				value,
			});
		},
		async onAddExercise(exercise: Exercise) {
			if (this.pickOneExerciseOnly) {
				this.emitUpdate("exercises", [exercise.id]);
			} else {
				this.emitUpdate("exercises", [
					exercise.id,
					...(this.modelValue.exercises as string[]),
				]);
			}
			// fetch exercise from server and add to local array for preview
			// const preview = await getExercisesById(this.courseId, [exercise.id]);
			// this.previewExercises.push(...preview);
		},
		onRemoveExercise(exercise: Exercise) {
			// emit modelValue update of new exercise list without removed one
			this.emitUpdate(
				"exercises",
				this.modelValue?.exercises?.filter(e => e != exercise.id),
			);
			// remove exercise from local array of exercises for preview
			//this.previewExercises = this.previewExercises.filter(e => e.id != exercise.id);
		},
		showRuleDialog() {
			this.showDialog = true;
		},
		setRuleMode(ruleType: EventTemplateRuleType, pickOne = false) {
			if (
				ruleType === null &&
				!confirm(_("event_template_rule_editor.unset_rule_type_confirmation"))
			) {
				return;
			}
			// TODO if ruleType === null reset slot (clear exercises and clauses)
			this.emitUpdate("rule_type", ruleType);
			this.pickOneExerciseOnly = pickOne;
		},
	},
	computed: {
		displayedOrdering(): String {
			/**
			 * Returns the appropriate slot order text for the rule: if all
			 * rules have amount === 1, it's simply the target slot number,
			 * otherwise it takes into account the actual amount of exercises
			 * that precede this rule (sum of amounts of preceding rules) and
			 * the amount of this rule
			 */
			const baseOrdering = this.ordering + 1;
			if (this.modelValue.amount === 1) {
				return String(baseOrdering);
			}
			return (
				_("misc.from") +
				" " +
				baseOrdering +
				" " +
				_("misc.to") +
				" " +
				// make sure we're dealing with numbers
				(parseInt(String(baseOrdering)) + parseInt(String(this.modelValue.amount)) - 1)
			);
		},
		ruleExercises(): Exercise[] {
			if (this.modelValue.rule_type != EventTemplateRuleType.ID_BASED) {
				return [];
			}
			return this.previewExercises;
		},
		isSlotPopulated() {
			if (this.modelValue.rule_type == EventTemplateRuleType.ID_BASED) {
				return (this.modelValue.exercises?.length ?? 0) > 0;
			}
			if (this.modelValue.rule_type == EventTemplateRuleType.TAG_BASED) {
				// there's at least a non-empty clause
				return (
					(this.modelValue.clauses?.length ?? 0) > 0 &&
					this.modelValue.clauses?.some(c => c.tags.length > 0)
				);
			}
			return false;
		},
	},
});
</script>

<style></style>

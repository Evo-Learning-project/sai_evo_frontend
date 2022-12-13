<template>
	<div class="relative">
		<transition name="fade-delay">
			<div
				style="z-index: 59"
				v-show="exerciseLocked"
				class="absolute top-0 left-0 items-center w-full h-full"
			>
				<div
					style="width: 100% !important; height: 100% !important"
					class="
						absolute
						z-10
						flex
						w-full
						h-full
						transition-none
						bg-gray-900
						rounded
						opacity-40
					"
				></div>
				<div
					class="
						sticky
						z-50
						mx-auto
						mt-40
						mb-40
						text-center
						rounded
						-translate-y-3/4
						md:top-1/4 md:w-max
					"
				>
					<p
						style="font-size: 10rem"
						class="opacity-50 material-icons-outlined text-lightText"
					>
						{{ exerciseLocked ? "lock" : "lock_open" }}
					</p>
					<h3
						:class="[!exerciseLocked ? 'opacity-0' : 'opacity-100']"
						class="pt-1 mx-auto rounded-t md:bg-transparent text-lightText"
						style="text-shadow: 0.5px 0.5px 4px rgb(0 0 0 / 50%)"
					>
						{{ $t("exercise_editor.currently_locked_by") }}
						{{ modelValue?.locked_by?.full_name }}
					</h3>
					<p
						:class="[!exerciseLocked ? 'opacity-0' : 'opacity-100']"
						class="pb-1 rounded-b md:bg-transparent text-lightText md:mx-2 md:px-2"
						style="text-shadow: 0.5px 0.5px 4px rgb(0 0 0 / 50%)"
					>
						{{ $t("event_editor.lock_stand_by") }}
					</p>
				</div>
			</div>
		</transition>
		<div
			@click="onFocusNonDraft"
			style="z-index: 20"
			class="absolute top-0 left-0 w-full h-full bg-gray-500 bg-opacity-0 cursor-pointer"
			v-if="false && modelValue.state !== ExerciseState.DRAFT && preventEdit"
		></div>
		<!-- FIXME review shadow -->
		<Card
			:loading="fetchingExercise"
			:focusable="!subExercise"
			:hoverable="false"
			:borderLess="subExercise"
			:filled="subExercise"
			:class="{
				'bg-gray-50': modelValue.state === ExerciseState.DRAFT,
				'mb-6': subExercise,
				'transition-shadow duration-100 focus-within-shadow-elevation-2': !subExercise,
			}"
		>
			<template v-slot:header>
				<div style="padding-top: 1px" class="flex items-center mb-8" v-if="!subExercise">
					<h3 class="pt-2">
						{{ $t("exercise_editor.exercise_editor_title") }}
						<span v-if="modelValue.state === ExerciseState.DRAFT" class="text-muted"
							>({{ $t("exercise_editor.draft_notice") }})</span
						>
					</h3>
					<CloudSaveStatus
						class="mt-1 ml-auto mr-1"
						:saving="saving"
						:hadError="savingError"
					></CloudSaveStatus>
					<Btn
						:size="'lg'"
						:variant="'icon'"
						:tooltip="$t('misc.close')"
						@click="$emit('close')"
						><span
							class="
								transition-transform
								duration-200
								ease-out
								transform
								material-icons-outlined
							"
							:class="{ 'rotate-180': false && showEditor }"
						>
							close
						</span></Btn
					>
				</div>
				<div v-else class="flex">
					<div class="w-1/5 mt-3" :class="{ 'mb-8': cloze }">
						<NumberInput
							:max="100"
							:min="0"
							:modelValue="modelValue.child_weight"
							@update:modelValue="onBaseExerciseChange('child_weight', $event)"
							class="w-full"
						>
							<div class="flex space-x-1">
								<p>{{ $t("exercise_editor.sub_exercise_weight") }}</p>
								<Tooltip
									class="transform scale-125"
									:text-code="'exercise_editor.sub_exercise_weight'"
								></Tooltip>
							</div>
							<template #errors v-if="invalidChildWeight"> &nbsp; </template>
						</NumberInput>
					</div>
					<Btn
						v-if="!cloze"
						:outline="true"
						:variant="'icon'"
						:tooltip="$t('exercise_editor.delete_sub_exercise')"
						@click="$emit('delete')"
						class="
							ml-auto
							-mt-1
							-mr-2.5
							transition-opacity
							duration-100
							opacity-50
							hover:opacity-100
						"
						><span class="text-base material-icons"> delete </span></Btn
					>
				</div>
			</template>
			<template v-slot:body>
				<transition v-if="false" name="fade">
					<div
						v-if="showStickyStateDropdown"
						style="box-shadow: 0px 15px 15px -15px rgb(0 0 0 / 20%)"
						class="
							-mx-5
							sticky
							top-14
							z-50
							h-20
							py-4
							bg-white
							flex
							items-start
							align-center
							space-x-2
						"
					>
						<div class="flex mx-auto space-x-2">
							<p class="mt-3 text-muted">{{ $t("exercise_editor.exercise_state") }}</p>
							<div class="w-96 ml-auto">
								<Dropdown
									:id="stateDropdownId + '-sticky'"
									:options="exerciseStateOptions"
									:modelValue="modelValue.state"
									@update:modelValue="onExerciseStateChange($event)"
								>
									<!--onBaseExerciseChange('state', $event)-->
								</Dropdown>
							</div>
						</div>
					</div>
				</transition>
				<div v-if="!subExercise || !cloze" class="flex flex-col">
					<!-- top row -->
					<div
						v-if="!subExercise || !cloze"
						class="
							flex flex-col
							items-start
							my-4
							space-y-6
							lg:space-x-8 lg:space-y-0 lg:flex-row
						"
					>
						<!-- label input -->
						<div v-if="!subExercise" class="w-full mt-0.5 mr-auto lg:w-4/12">
							<TextInput
								:modelValue="modelValue.label"
								:fixedLabel="true"
								:placeholder="$t('exercise_preview.unnamed_exercise')"
								@blur="onBlur()"
								@update:modelValue="onBaseExerciseChange('label', $event)"
							>
								<div class="flex space-x-1">
									<p>{{ $t("exercise_editor.exercise_label") }}</p>
									<Tooltip
										class="transform scale-125"
										:text-code="'exercise_editor.label'"
									></Tooltip>
								</div>
							</TextInput>
						</div>
						<!-- state dropdown -->
						<div v-if="!subExercise" class="self-start w-full mr-auto lg:w-3/12">
							<Dropdown
								:id="stateDropdownId"
								:options="exerciseStateOptions"
								:modelValue="modelValue.state"
								@update:modelValue="onExerciseStateChange($event)"
							>
								<!--onBaseExerciseChange('state', $event)-->
								{{ $t("exercise_editor.exercise_state") }}
							</Dropdown>
						</div>
						<!-- exercise_type dropdown -->
						<div
							v-if="!cloze"
							:class="{ 'md:ml-auto': !subExercise }"
							class="flex flex-col w-full md:flex-row lg:w-5/12"
						>
							<Dropdown
								class="w-full"
								:id="'exercise_type_' + elementId"
								:options="exerciseTypeOptions"
								:modelValue="modelValue.exercise_type"
								@update:modelValue="onExerciseTypeChange($event)"
							>
								{{ $t("exercise_editor.exercise_type") }}
							</Dropdown>
							<!--              :modelValue="modelValue.exercise_type"
              @update:modelValue="onExerciseTypeChange($event)"-->
						</div>
					</div>

					<!-- exercise text -->
					<div class="my-6">
						<TextEditor
							v-if="!cloze"
							:modelValue="modelValue.text"
							@ready="textEditorInstance = $event"
							@selectionChange="onTextSelectionChange($event)"
							@blur="onBlur()"
							@update:modelValue="onBaseExerciseChange('text', $event)"
							>{{ $t("exercise_editor.exercise_text") }}
							<template v-if="v$.modelValue.text.$errors.length > 0" v-slot:errors>
								<div
									class="input-errors"
									v-for="error of v$.modelValue.text.$errors"
									:key="error.$uid"
								>
									<div class="error-msg">
										{{ $t("validation_errors.exercise." + error.$uid) }}
									</div>
								</div>
							</template>
						</TextEditor>
					</div>

					<!-- cloze controls -->
					<div
						class="flex items-start w-full space-y-1 md:space-y-0"
						v-if="modelValue.exercise_type === ExerciseType.COMPLETION"
					>
						<Btn @click="onAddCloze()" :variant="'secondary'" class="w-1/2 2xl:w-1/3"
							><span class="mr-1.5 text-base material-icons-outlined"> add </span
							>{{ $t("exercise_editor.new_cloze") }}</Btn
						>
						<Btn
							:outline="true"
							:disabled="editableClozePosition === null"
							class="w-1/2 ml-2 mr-auto 2xl:w-1/3"
							@click="editingClozePosition = editableClozePosition"
							><span class="mr-1.5 text-base material-icons-outlined"> edit </span
							>{{ $t("exercise_editor.edit_cloze") }}</Btn
						>
						<!-- <Tooltip
              :placement="'top'"
              :text-code="'exercise_editor.clozes'"
            ></Tooltip> -->
						<div class="flex items-start ml-4">
							<span class="mt-1.25px material-icons-outlined inline-icon text-muted"
								>info</span
							>
							<p class="ml-1.5 text-sm text-muted">
								{{ $t("help_texts.exercise_editor.clozes") }}
							</p>
						</div>
					</div>

					<!-- solutions -->
					<div v-if="!cloze" class="mb-12">
						<h3 class="mb-4">{{ $t("exercise_editor.solutions_title") }}</h3>
						<div v-if="!loadingSolutions">
							<div
								v-for="solution in solutions"
								:key="'e-' + modelValue.id + '-sol-' + solution.id"
								class="my-2 flex space-x-2"
							>
								<!-- plain text solution -->
								<TextEditor
									class="w-full"
									v-if="!cloze && !isProgrammingExercise"
									:modelValue="solution.content"
									@blur="onBlurSolution(solution.id)"
									@update:modelValue="onUpdateSolution(solution.id, 'content', $event)"
								>
									<!-- {{ $t("exercise_editor.exercise_solution") }} -->
								</TextEditor>
								<!-- code solution -->
								<div v-else-if="!cloze" class="relative w-full">
									<CodeEditor
										:modelValue="solution.content"
										@update:modelValue="onUpdateSolution(solution.id, 'content', $event)"
										:size="'lg'"
										:showRunButton="true"
										:language="languageCode"
										@blur="onBlurSolution(solution.id)"
										@run="onTestSolution(solution.id)"
										:running="testingSolutions[solution.id] ?? false"
									>
										<template v-slot:runButton
											><span class="ml-1 mr-1 text-base material-icons-outlined">
												science </span
											>{{
												testingSolutions[solution.id]
													? $t("exercise_editor.testing_solution")
													: $t("exercise_editor.test_solution")
											}}</template
										>
										<template v-slot:sidePaneTitle
											><div
												class="
													flex
													items-center
													p-3
													pl-4
													space-x-2
													rounded-tr-sm
													bg-light
												"
											>
												<span class="my-auto material-icons-outlined icon-light">
													code
												</span>
												<h3>
													{{ $t("programming_exercise.execution_results") }}
												</h3>
											</div>
										</template>
										<template v-slot:sidePane>
											<CodeExecutionResults
												v-if="solutionTestSlots[solution.id]?.execution_results"
												:executionResults="
													solutionTestSlots[solution.id].execution_results
												"
												:testCases="modelValue.testcases"
											></CodeExecutionResults>
											<div class="flex flex-col" v-else>
												<span
													class="
														mx-auto
														mt-24
														opacity-30
														text-8xl
														material-icons-outlined
													"
												>
													code
												</span>
												<p class="px-4 mx-auto text-muted">
													{{ $t("exercise_editor.code_execution_will_appear_here") }}
												</p>
											</div>
										</template>
									</CodeEditor>
								</div>
								<!-- solution delete button -->
								<Btn
									:outline="true"
									:variant="'icon'"
									class="transition-opacity duration-100 opacity-50 hover:opacity-100"
									@click="onDeleteSolution(solution.id)"
									><span class="material-icons">delete</span></Btn
								>
							</div>
						</div>
						<SlotSkeleton v-else />

						<Btn
							class="mt-2"
							:variant="'secondary'"
							:size="'sm'"
							@click="onAddSolution()"
						>
							<span class="mr-1 text-base material-icons-outlined"> add </span
							>{{ $t("exercise_editor.new_solution") }}</Btn
						>
					</div>
					<div v-if="modelValue.exercise_type === ExerciseType.JS" class="pb-4 mb-6">
						<Toggle
							class=""
							:modelValue="modelValue.requires_typescript"
							@update:modelValue="onBaseExerciseChange('requires_typescript', $event)"
							>{{ $t("exercise_editor.requires_typescript") }}
							<svg
								class="mb-1 ml-1 text-primary-light"
								style="width: 24px; height: 24px"
								viewBox="0 0 24 24"
							>
								<path
									fill="currentColor"
									d="M3,3H21V21H3V3M13.71,17.86C14.21,18.84 15.22,19.59 16.8,19.59C18.4,19.59 19.6,18.76 19.6,17.23C19.6,15.82 18.79,15.19 17.35,14.57L16.93,14.39C16.2,14.08 15.89,13.87 15.89,13.37C15.89,12.96 16.2,12.64 16.7,12.64C17.18,12.64 17.5,12.85 17.79,13.37L19.1,12.5C18.55,11.54 17.77,11.17 16.7,11.17C15.19,11.17 14.22,12.13 14.22,13.4C14.22,14.78 15.03,15.43 16.25,15.95L16.67,16.13C17.45,16.47 17.91,16.68 17.91,17.26C17.91,17.74 17.46,18.09 16.76,18.09C15.93,18.09 15.45,17.66 15.09,17.06L13.71,17.86M13,11.25H8V12.75H9.5V20H11.25V12.75H13V11.25Z"
								/>
							</svg>
						</Toggle>
					</div>

					<!-- tags -->
					<div v-if="!subExercise" class="mb-6">
						<TagInput
							:choices="tags"
							:modelValue="modelValue.public_tags ?? []"
							:allow-edit-tags="false"
							:placeholder="$t('exercise_editor.exercise_public_tags')"
							@addTag="onAddTag($event, true)"
							@removeTag="onRemoveTag($event, true)"
							><div class="flex space-x-1">
								<p>{{ $t("exercise_editor.exercise_public_tags") }}</p>
								<Tooltip
									class="transform scale-125"
									:text-code="'exercise_editor.public_tags'"
								></Tooltip></div
						></TagInput>
					</div>

					<div v-if="!subExercise">
						<TagInput
							:choices="tags"
							:modelValue="modelValue.private_tags ?? []"
							:allow-edit-tags="false"
							:placeholder="$t('exercise_editor.exercise_private_tags')"
							@addTag="onAddTag($event, false)"
							@removeTag="onRemoveTag($event, false)"
						>
							<div class="flex space-x-1">
								<p>{{ $t("exercise_editor.exercise_private_tags") }}</p>
								<Tooltip
									class="transform scale-125"
									:text-code="'exercise_editor.private_tags'"
								></Tooltip></div
						></TagInput>
					</div>
				</div>
				<div
					class="mt-6"
					v-if="
						modelValue.exercise_type === ExerciseType.MULTIPLE_CHOICE_MULTIPLE_POSSIBLE
					"
				>
					<Toggle
						:modelValue="modelValue.all_or_nothing"
						@update:modelValue="onBaseExerciseChange('all_or_nothing', $event)"
					>
						<div class="flex space-x-1 mt-1">
							<p>{{ $t("exercise_editor.all_or_nothing") }}</p>
							<Tooltip
								class="transform scale-125"
								:text-code="'exercise_editor.all_or_nothing'"
							></Tooltip>
						</div>
					</Toggle>
				</div>
				<!-- Multiple-choice exercise types settings -->
				<div :class="[cloze ? '-mt-6' : 'mt-8']" v-if="isMultipleChoice">
					<h3 class="mb-6">{{ $t("exercise_editor.choices_title") }}</h3>
					<div class="mb-4 -mt-4" v-if="v$.modelValue.choices.$errors.length > 0">
						<div
							class="input-errors"
							v-for="error of v$.modelValue.choices.$errors"
							:key="error.$uid"
						>
							<div class="error-msg">
								{{ $t("validation_errors.exercise." + error.$uid) }}
							</div>
						</div>
					</div>
					<div v-if="showNoChoicePenaltyWarning" class="mb-8 -mt-4 banner banner-danger">
						<span class="material-icons-outlined">warning</span>
						<p>
							{{ $t("exercise_editor.no_choice_penalty_warning") }}
							<ArticleHandle :articleId="'multiple_choice_eval_logic'"></ArticleHandle>.
						</p>
					</div>
					<draggable
						handle=".drag-handle"
						:modelValue="modelValue.choices"
						@end="onChoiceDragEnd($event)"
						ghost-class="drag-ghost"
						item-key="id"
					>
						<template #item="{ element }">
							<ChoiceEditor
								:correctnessIsBoolean="
									modelValue.exercise_type ===
										ExerciseType.MULTIPLE_CHOICE_MULTIPLE_POSSIBLE &&
									modelValue.all_or_nothing
								"
								:singleLine="cloze"
								:invalidCorrectness="!!choicesCorrectnessError"
								:modelValue="element"
								@delete="onDeleteChoice(element.id)"
								@blur="onBlurChoice(element.id)"
								@choiceUpdate="onUpdateChoice(element.id, $event.field, $event.value)"
								:icon-type="
									cloze
										? 'dropdown'
										: modelValue.exercise_type ===
										  ExerciseType.MULTIPLE_CHOICE_SINGLE_POSSIBLE
										? 'radio'
										: 'checkbox'
								"
							></ChoiceEditor>
						</template>
					</draggable>
					<Btn @click="onAddChoice()" :size="'sm'" :variant="'secondary'"
						><span class="mr-1 text-base material-icons-outlined"> add </span>
						{{ $t("exercise_editor.new_choice") }}</Btn
					>
				</div>

				<!-- Aggregated exercise settings -->
				<div class="mt-8" v-if="modelValue.exercise_type === ExerciseType.AGGREGATED">
					<h3 class="mb-8">{{ $t("exercise_editor.sub_exercises_title") }}</h3>
					<div class="mb-4 -mt-4" v-if="v$.modelValue.sub_exercises.$errors.length > 0">
						<div
							class="input-errors"
							v-for="error of v$.modelValue.sub_exercises.$errors"
							:key="error.$uid"
						>
							<div class="error-msg">
								{{ $t("validation_errors.exercise." + error.$uid) }}
							</div>
						</div>
					</div>
					<draggable
						handle=".drag-handle"
						:modelValue="modelValue.sub_exercises"
						@end="onChoiceDragEnd($event)"
						ghost-class="drag-ghost"
						item-key="id"
					>
						<template #item="{ element }">
							<ExerciseEditor
								:invalidChildWeight="!!childWeightError"
								@delete="onDeleteSubExercise(element.id)"
								:subExercise="true"
								:modelValue="element"
							></ExerciseEditor>
						</template>
					</draggable>
					<Btn @click="onAddSubExercise()" :size="'sm'" :variant="'secondary'"
						><span class="mr-1 text-base material-icons-outlined"> add </span>
						{{ $t("exercise_editor.new_sub_exercise") }}</Btn
					>
				</div>

				<!-- Programming exercise settings -->
				<div class="mt-8" v-if="isProgrammingExercise">
					<h3 class="mb-8">{{ $t("exercise_editor.testcases_title") }}</h3>

					<div v-if="modelValue.exercise_type === ExerciseType.JS">
						<p class="text-muted mb-2">
							{{ $t("exercise_editor.use_assert_lib") }}
							<a class="link" href="https://nodejs.org/api/assert.html" target="_blank">
								<pre class="inline text-sm">assert</pre>
								<span class="material-icons-outlined ml-0.5 inline-icon">
									open_in_new
								</span> </a
							>.
						</p>
					</div>
					<draggable
						:modelValue="modelValue.testcases"
						ghost-class="drag-ghost"
						handle=".drag-handle"
						item-key="id"
					>
						<template #item="{ element }">
							<TestCaseEditor
								:attachments="exerciseTestCaseAttachmentsByTestCaseId[element.id] ?? []"
								:executingSolution="
									testCaseAutoSaveManagers[element.id]?.isPending() ?? false
								"
								:testCaseType="modelValue.exercise_type"
								@blur="onBlurTestCase(element.id)"
								@delete="onDeleteTestCase(element.id)"
								@createAttachment="onTestCaseCreateAttachment(element.id, $event)"
								@downloadAttachment="onTestCaseDownloadAttachment(element.id, $event)"
								@deleteAttachment="onTestCaseDeleteAttachment(element.id, $event)"
								:modelValue="element"
								:executionResultsSlots="Object.values(solutionTestSlots)"
								@testCaseUpdate="onUpdateTestCase(element.id, $event.field, $event.value)"
							></TestCaseEditor>
						</template>
					</draggable>
					<Btn @click="onAddTestCase()" :size="'sm'" :variant="'secondary'"
						><span class="mr-1 text-base material-icons-outlined"> add </span>
						{{ $t("exercise_editor.new_testcase") }}</Btn
					>
				</div>

				<Dialog
					:large="true"
					:confirmOnly="true"
					@yes="editingClozePosition = null"
					v-if="modelValue.exercise_type === ExerciseType.COMPLETION"
					:showDialog="!!editingCloze"
				>
					<template v-slot:title>
						{{ $t("exercise_editor.editing_cloze") }}
						{{ editingClozePosition + 1 }}
					</template>
					<template v-slot:body v-if="!!editingCloze">
						<ExerciseEditor
							:modelValue="editingCloze"
							:subExercise="true"
							:cloze="true"
							:invalidChildWeight="!!childWeightError"
						></ExerciseEditor
					></template>
				</Dialog>
				<Dialog
					:showDialog="showDialog"
					@yes="dialogData.onYes()"
					@no="dialogData.onNo()"
					:yesText="dialogData.yesText"
					:noText="dialogData.noText"
					:error="dialogData.error"
					:confirmOnly="dialogData.confirmOnly"
				>
					<template v-slot:title>{{ dialogData.title }}</template>
					<template v-slot:body
						>{{ dialogData.text }}
						<div class="mt-2" v-if="v$.modelValue.$errors">
							<ul class="list-disc list-inside">
								<li
									class="text-muted text-danger-dark"
									v-for="(error, index) in v$.$errors"
									:key="'err-' + index"
								>
									{{ $t("validation_errors.exercise." + error.$uid) }}
								</li>
							</ul>
						</div>
					</template>
				</Dialog>

				<!-- bottom bar -->
				<div class="flex w-full mt-10">
					<div v-if="maxScore !== null" class="flex items-center">
						<h4>{{ $t("exercise_editor.max_score") }}</h4>
						<div class="ml-2">
							<span class="text-lg text-muted">{{ maxScore }}</span>
						</div>
						<!-- TODO add tooltip explaining this is not the actual grade in the exam -->
					</div>
					<Btn
						v-if="!subExercise"
						style="margin-top: 1px"
						class="ml-auto"
						:outline="true"
						:size="'lg'"
						:variant="'icon'"
						@click="$emit('cloneExercise')"
						:tooltip="$t('exercise_editor.clone')"
						><span class="text-2xl icon-light material-icons-outlined">
							copy_all
						</span></Btn
					>
					<Btn
						v-if="!subExercise"
						class="ml-5"
						:outline="true"
						:size="'lg'"
						:variant="'icon'"
						:tooltip="$t('exercise_editor.delete')"
						@click="$emit('delete')"
						><span class="text-2xl text-danger-dark material-icons-outlined">
							delete
						</span></Btn
					>
				</div>
			</template>
		</Card>
		<!-- <Spinner
			style="top: 10%"
			:variant="'dark'"
			fast
			class="absolute transform z-50 left-1/2 -translate-x-1/2"
			:size="'xl'"
			v-if="fetchingExercise"
		/> -->
	</div>
</template>

<script lang="ts">
import { getTranslatedString as _ } from "@/i18n";
import { v4 as uuid4 } from "uuid";
import Dropdown from "@/components/ui/Dropdown.vue";
import Dialog from "@/components/ui/Dialog.vue";
import draggable from "vuedraggable";

import {
	getBlankChoice,
	Exercise,
	ExerciseState,
	ExerciseChoice,
	ExerciseType,
	ExerciseTestCase,
	getBlankTestCase,
	getBlankExercise,
	EventParticipationSlot,
	getFakeEventParticipationSlot,
	ExerciseSolution,
	getBlankExerciseSolution,
	ExerciseSolutionState,
	programmingExerciseTypeToLanguageId,
	ProgrammingExerciseType,
	ExerciseTestCaseAttachment,
} from "@/models";
import Card from "@/components/ui/Card.vue";
import { defineComponent, PropType } from "@vue/runtime-core";
import useVuelidate from "@vuelidate/core";

import TextEditor from "@/components/ui/TextEditor.vue";
import TextInput from "@/components/ui/TextInput.vue";
import Btn from "@/components/ui/Btn.vue";
import Spinner from "@/components/ui/Spinner.vue";
import TagInput from "@/components/ui/TagInput.vue";

import ChoiceEditor from "@/components/teacher/ExerciseEditor/ChoiceEditor.vue";
import CloudSaveStatus from "@/components/ui/CloudSaveStatus.vue";
import { courseIdMixin, loadingMixin, savingMixin } from "@/mixins";
import { DialogData } from "@/interfaces";

import { createNamespacedHelpers, mapActions, mapMutations } from "vuex";
import { AutoSaveManager } from "@/autoSave";
import {
	exerciseStateOptions,
	exerciseTypeOptions,
	EXERCISE_AUTO_SAVE_DEBOUNCED_FIELDS,
	EXERCISE_AUTO_SAVE_DEBOUNCE_TIME_MS,
	EXERCISE_CHOICE_AUTO_SAVE_DEBOUNCED_FIELDS,
	EXERCISE_CHOICE_AUTO_SAVE_DEBOUNCE_TIME_MS,
	TEST_CASE_AUTO_SAVE_DEBOUNCED_FIELDS,
	TEST_CASE_AUTO_SAVE_DEBOUNCE_TIME_MS,
	CLOZE_SEPARATOR,
	EXERCISE_SOLUTION_AUTO_SAVE_DEBOUNCE_FIELDS,
	EXERCISE_SOLUTION_AUTO_SAVE_DEBOUNCE_TIME_MS,
} from "@/const";
import CodeEditor from "@/components/ui/CodeEditor.vue";
import TestCaseEditor from "./TestCaseEditor.vue";
import Tooltip from "@/components/ui/Tooltip.vue";
import Toggle from "@/components/ui/Toggle.vue";
import {
	downloadExerciseTestCaseAttachment,
	heartbeatExercise,
	testProgrammingExerciseSolution,
	unlockExercise,
} from "@/api/exercises";
import CodeExecutionResults from "@/components/shared/CodeExecutionResults.vue";
import NumberInput from "@/components/ui/NumberInput.vue";
import { exerciseValidation } from "@/validation/models";
import ArticleHandle from "@/components/shared/HelpCenter/ArticleHandle.vue";
import {
	getMaxScore,
	isMultipleChoiceExercise,
	isProgrammingExercise,
} from "@/components/shared/Exercise/utils";
import { ExerciseSolutionSearchFilter } from "@/api/interfaces";
import SlotSkeleton from "@/components/ui/skeletons/SlotSkeleton.vue";
import { forceFileDownload, getCurrentUserId } from "@/utils";
const { mapState } = createNamespacedHelpers("shared");

export default defineComponent({
	name: "ExerciseEditor",
	components: {
		Card,
		TextEditor,
		TextInput,
		Dropdown,
		ChoiceEditor,
		Btn,
		TagInput,
		CloudSaveStatus,
		Dialog,
		draggable,
		CodeEditor,
		TestCaseEditor,
		Tooltip,
		Toggle,
		CodeExecutionResults,
		NumberInput,
		ArticleHandle,
		SlotSkeleton,
		//Spinner,
	},
	props: {
		modelValue: {
			type: Object as PropType<Exercise>,
			required: true,
		},
		subExercise: {
			// hides certain fields depending on whether the exercise
			// is a base- or sub-exercise
			type: Boolean,
			default: false,
		},
		cloze: {
			// hides certain fields depending on whether the exercise is a cloze
			type: Boolean,
			default: false,
		},
		invalidChildWeight: {
			type: Boolean,
			default: false,
		},
	},
	mixins: [courseIdMixin, savingMixin, loadingMixin],
	validations() {
		return {
			modelValue: exerciseValidation,
		};
	},
	setup() {
		const v = useVuelidate();
		//provide("v$", v);
		return { v$: v };
	},
	beforeUnmount() {
		this.unlockEditingObject();
	},
	async created() {
		// fetch exercise to make sure to have the most up to date version
		await this.$nextTick(
			// nextTick required to prevent render issues with vue-draggable
			async () => {
				this.fetchingExercise = true;
				// TODO overwriting the whole exercise isn't necessary, what we really want is locked_by
				try {
					await this.getExercise({
						courseId: this.courseId,
						exerciseId: this.modelValue.id,
					});
				} catch (e) {
					this.setErrorNotification(e);
				} finally {
					this.fetchingExercise = false;
				}
			},
		);

		await this.lockEditingObject();

		this.autoSaveManager = new AutoSaveManager<Exercise>(
			this.modelValue,
			async changes =>
				await this.updateExercise({
					courseId: this.courseId,
					exercise: { ...this.modelValue, ...changes },
				}),
			changes => {
				this.saving = true;
				this.savingError = false;
				this.setExercise({ ...this.modelValue, ...changes });
			},
			EXERCISE_AUTO_SAVE_DEBOUNCED_FIELDS,
			EXERCISE_AUTO_SAVE_DEBOUNCE_TIME_MS,
			undefined,
			() => (this.savingError = true),
			() => (this.saving = false),
		);

		// instantiate managers for children
		this.modelValue.choices?.forEach(c =>
			// TODO extract auto-save manager instantiation to module
			this.instantiateChoiceAutoSaveManager(c),
		);

		// for test cases, also fetch attachments
		this.modelValue.testcases?.forEach(t => {
			this.instantiateTestCaseAutoSaveManager(t);
			this.getExerciseTestCaseAttachments({
				courseId: this.courseId,
				exerciseId: this.modelValue.id,
				testcaseId: t.id,
			});
		});

		this.loadingSolutions = true;
		try {
			await this.getSolutionsByExercise({
				courseId: this.courseId,
				exerciseId: this.modelValue.id,
				filter: {
					states: [ExerciseSolutionState.APPROVED],
				} as ExerciseSolutionSearchFilter,
			});
			this.solutions.forEach(s => this.instantiateSolutionAutoSaveManager(s));
		} catch (e) {
			this.setErrorNotification(e);
		} finally {
			this.loadingSolutions = false;
		}
	},
	mounted() {
		if (this.cloze) {
			(this.v$ as any).$touch();
		}
	},
	data() {
		return {
			loadingSolutions: false,
			autoSaveManager: null as AutoSaveManager<Exercise> | null,
			choiceAutoSaveManagers: {} as Record<string, AutoSaveManager<ExerciseChoice>>,
			testCaseAutoSaveManagers: {} as Record<string, AutoSaveManager<ExerciseTestCase>>,
			solutionAutoSaveManagers: {} as Record<string, AutoSaveManager<ExerciseSolution>>,
			elementId: uuid4(),
			showSaved: false,
			saving: false,
			savingError: false,
			showDialog: false,
			showValidationErrors: false,
			preventEdit: true,
			dialogData: {
				title: "",
				text: "",
				onNo: null as null | (() => void),
				onYes: null as null | (() => void),
				error: false,
				confirmOnly: false,
			} as DialogData,
			exerciseStateOptions,
			ExerciseState,
			ExerciseType,
			textEditorInstance: null as any,
			editingClozePosition: null as number | null,
			editableClozePosition: null as number | null,
			solutionTestSlots: {} as Record<string, EventParticipationSlot>,
			testingSolutions: {} as Record<string, boolean>,
			showStickyStateDropdown: false,
			lockPollingHandle: null as null | number,
			heartbeatHandle: null as null | number,
			fetchingExercise: false,
		};
	},
	methods: {
		...mapActions("teacher", [
			"addExerciseChild",
			"updateExercise",
			"addExerciseTag",
			"removeExerciseTag",
			"deleteExerciseChild",
			"lockExercise",
			"getExercise",
		]),
		...mapActions("student", ["addExerciseSolution", "deleteExerciseSolution"]),
		...mapActions("shared", [
			"getTags",
			"updateExerciseChild",
			"getSolutionsByExercise",
			"getExerciseTestCaseAttachments",
			"createExerciseTestCaseAttachment",
			"deleteExerciseTestCaseAttachment",
		]),
		...mapMutations("teacher", ["setExercise", "setExerciseChild"]),
		...mapMutations("shared", ["setExerciseSolution"]),
		async onChoiceDragEnd(event: { oldIndex: number; newIndex: number }) {
			const draggedChoice = (this.modelValue.choices as ExerciseChoice[])[event.oldIndex];

			if (event.oldIndex !== event.newIndex) {
				await this.onUpdateChoice(draggedChoice.id, "_ordering", event.newIndex);
			}
		},
		async onBlur() {
			await this.autoSaveManager?.flush();
		},
		async onBaseExerciseChange<K extends keyof Exercise>(key: K, value: Exercise[K]) {
			await this.autoSaveManager?.onChange({ field: key, value });
		},
		async lockEditingObject() {
			const LOCK_POLLING_INTERVAL = 5000;
			const LOCK_HEARTBEAT_INTERVAL = 10000;

			const setUpHeartbeatPollingFn = () =>
				(this.heartbeatHandle = setInterval(
					// TODO defensively handle failures, i.e. lock might've been passed onto someone else
					async () => await heartbeatExercise(this.courseId, this.modelValue.id),
					LOCK_HEARTBEAT_INTERVAL,
				));

			try {
				await this.lockExercise({
					courseId: this.courseId,
					exerciseId: this.modelValue.id,
				});
				setUpHeartbeatPollingFn();
			} catch (e: any) {
				if (e.response?.status === 403) {
					// if lock can't be acquired at the moment, periodically
					// poll to see if the object is still locked, stopping
					// once the lock has been acquired by the requesting user
					this.lockPollingHandle = setInterval(async () => {
						await this.getExercise({
							courseId: this.courseId,
							exerciseId: this.modelValue.id,
						});
						// user has finally acquired the lock; stop polling
						if (this.modelValue.locked_by?.id === getCurrentUserId()) {
							clearInterval(this.lockPollingHandle as number);
							setUpHeartbeatPollingFn();
							this.lockPollingHandle = null;
						}
					}, LOCK_POLLING_INTERVAL);
				} else {
					this.setErrorNotification(e);
				}
			}
		},
		async unlockEditingObject() {
			if (typeof this.heartbeatHandle === "number") {
				clearInterval(this.heartbeatHandle);
			}
			if (typeof this.lockPollingHandle === "number") {
				clearInterval(this.lockPollingHandle);
			}
			await unlockExercise(this.courseId, this.modelValue.id);
		},
		onFocusNonDraft() {
			this.showDialog = true;
			this.dialogData = {
				title: _("exercise_editor.edit_non_draft_title"),
				text: _("exercise_editor.edit_non_draft_body"),
				yesText: _("misc.edit"),
				noText: _("dialog.default_cancel_text"),
				onNo: () => (this.showDialog = false),
				onYes: () => {
					this.preventEdit = false;
					this.showDialog = false;
				},
			};
		},
		async onTestSolution(solutionId?: string) {
			try {
				if (solutionId) {
					this.testingSolutions[solutionId] = true;
					await this.solutionAutoSaveManagers[solutionId]?.flush();
				}

				const executionResults = await testProgrammingExerciseSolution(
					this.courseId,
					this.modelValue.id,
				);

				Object.keys(executionResults).forEach(sId => {
					if (!solutionId || sId == solutionId) {
						const fakeSlot = (this.solutionTestSlots[sId] ??=
							getFakeEventParticipationSlot(this.modelValue));
						fakeSlot.execution_results = executionResults[sId];
					}
				});
				//this.solutionTestSlots[solutionId] = fakeSlot;
			} catch (e) {
				this.setErrorNotification(e);
			} finally {
				if (solutionId) {
					this.testingSolutions[solutionId] = false;
				}
			}
		},
		onTextSelectionChange(event: {
			fullText: string;
			text: string;
			range: { index: number; length: number };
		}) {
			if (this.modelValue.exercise_type !== ExerciseType.COMPLETION) {
				return;
			}
			const clozeSeparatorPositions = [...event.fullText.matchAll(/\[\[\?\]\]/g)].map(
				m => m.index as number,
			);
			if (event.range.length === 0 && event.text.includes(CLOZE_SEPARATOR)) {
				let i = 0;
				for (const p of clozeSeparatorPositions) {
					if (
						event.range.index >= p &&
						event.range.index + event.range.length <= p + CLOZE_SEPARATOR.length
					) {
						this.editableClozePosition = i;
						return;
					}
					i++;
				}
			}
			this.editableClozePosition = null;
		},
		onExerciseTypeChange(newVal: ExerciseType) {
			this.onBaseExerciseChange("exercise_type", newVal);
		},
		/* CRUD on related objects */
		async onAddSolution() {
			const newSolution: ExerciseSolution = await this.addExerciseSolution({
				courseId: this.courseId,
				exerciseId: this.modelValue.id,
				solution: getBlankExerciseSolution(ExerciseSolutionState.APPROVED),
			});
			this.instantiateSolutionAutoSaveManager(newSolution);
		},
		async onUpdateSolution<K extends keyof ExerciseSolution>(
			solutionId: string,
			key: K,
			value: ExerciseSolution[K],
		) {
			await this.solutionAutoSaveManagers[solutionId].onChange({
				field: key,
				value,
			});
		},
		async onBlurSolution(solutionId: string) {
			await this.solutionAutoSaveManagers[solutionId].flush();
		},
		async onAddChoice() {
			const newChoice: ExerciseChoice = await this.addExerciseChild({
				courseId: this.courseId,
				exerciseId: this.modelValue.id,
				childType: "choice",
				payload: getBlankChoice(),
			});
			this.instantiateChoiceAutoSaveManager(newChoice);
		},
		async onUpdateChoice<K extends keyof ExerciseChoice>(
			choiceId: string,
			key: K,
			value: ExerciseChoice[K],
		) {
			await this.choiceAutoSaveManagers[choiceId].onChange({
				field: key,
				value,
			});
		},
		async onBlurChoice(choiceId: string) {
			await this.choiceAutoSaveManagers[choiceId].flush();
		},
		async onDeleteChoice(choiceId: string) {
			if (confirm(_("exercise_editor.confirm_delete_choice"))) {
				await this.withLoading(
					async () =>
						await this.deleteExerciseChild({
							courseId: this.courseId,
							exerciseId: this.modelValue.id,
							childType: "choice",
							childId: choiceId,
						}),
					this.setErrorNotification,
				);
			}
		},
		async onDeleteSolution(solutionId: string) {
			if (confirm(_("exercise_editor.confirm_delete_solution"))) {
				await this.withLoading(
					async () =>
						await this.deleteExerciseSolution({
							courseId: this.courseId,
							exerciseId: this.modelValue.id,
							solutionId,
						}),
					this.setErrorNotification,
				);
			}
		},
		async onAddSubExercise() {
			const newSubExercise: Exercise = await this.addExerciseChild({
				courseId: this.courseId,
				exerciseId: this.modelValue.id,
				childType: "sub_exercise",
				payload: getBlankExercise(),
			});
			return newSubExercise;
		},
		async onDeleteSubExercise(exerciseId: string) {
			if (confirm(_("exercise_editor.confirm_delete_sub_exercise"))) {
				await this.withLoading(
					async () =>
						await this.deleteExerciseChild({
							courseId: this.courseId,
							exerciseId: this.modelValue.id,
							childType: "sub_exercise",
							childId: exerciseId,
						}),
					this.setErrorNotification,
				);
			}
		},
		async onAddTestCase() {
			const newTestcase: ExerciseTestCase = await this.addExerciseChild({
				courseId: this.courseId,
				exerciseId: this.modelValue.id,
				childType: "testcase",
				payload: getBlankTestCase(),
			});
			this.instantiateTestCaseAutoSaveManager(newTestcase);
		},
		async onUpdateTestCase<K extends keyof ExerciseTestCase>(
			testCaseId: string,
			key: K,
			value: ExerciseTestCase[K],
		) {
			await this.testCaseAutoSaveManagers[testCaseId].onChange({
				field: key,
				value,
			});
		},
		async onBlurTestCase(testcaseId: string) {
			await this.testCaseAutoSaveManagers[testcaseId].flush();
		},
		async onDeleteTestCase(testcaseId: string) {
			if (confirm(_("exercise_editor.confirm_delete_testcase"))) {
				await this.withLoading(
					async () =>
						await this.deleteExerciseChild({
							courseId: this.courseId,
							exerciseId: this.modelValue.id,
							childType: "testcase",
							childId: testcaseId,
						}),
					this.setErrorNotification,
				);
			}
		},
		async onTestCaseCreateAttachment(testcaseId: string, attachment: Blob) {
			await this.createExerciseTestCaseAttachment({
				courseId: this.courseId,
				exerciseId: this.modelValue.id,
				testcaseId,
				attachment,
			});
		},
		async onTestCaseDeleteAttachment(
			testcaseId: string,
			attachment: ExerciseTestCaseAttachment,
		) {
			if (
				!confirm(
					_("exercise_editor.confirm_delete_testcase_attachment") +
						" " +
						(attachment.attachment as { name: string }).name +
						"?",
				)
			) {
				return;
			}
			await this.deleteExerciseTestCaseAttachment({
				courseId: this.courseId,
				exerciseId: this.modelValue.id,
				testcaseId,
				attachmentId: attachment.id,
			});
		},
		async onTestCaseDownloadAttachment(
			testcaseId: string,
			attachment: ExerciseTestCaseAttachment,
		) {
			forceFileDownload(
				{
					data: await downloadExerciseTestCaseAttachment(
						this.courseId,
						this.modelValue.id,
						testcaseId,
						attachment.id,
					),
				},
				(attachment.attachment as { name: string }).name,
			);
		},
		async onAddTag(tag: string, isPublic: boolean) {
			await this.addExerciseTag({
				courseId: this.courseId,
				exerciseId: this.modelValue.id,
				tag,
				isPublic,
			});
			await this.getTags({ courseId: this.courseId });
		},
		async onRemoveTag(tag: string, isPublic: boolean) {
			await this.removeExerciseTag({
				courseId: this.courseId,
				exerciseId: this.modelValue.id,
				tag,
				isPublic,
			});
		},
		async onAddCloze() {
			const selection = this.textEditorInstance.getSelection();

			const insertionIndex = selection.index + selection.length;
			this.textEditorInstance.insertText(insertionIndex, CLOZE_SEPARATOR);
			await this.onAddSubExercise();
			// focus on most recently added cloze
			this.editingClozePosition =
				(this.modelValue.sub_exercises as Exercise[]).length - 1;
		},
		/* end CRUD on related objects */
		onExerciseStateChange(newState: ExerciseState) {
			this.v$.$touch();
			// TODO don't show errors in sub-exercises, or show them separately
			// TODO highlight in red the number-input of child weights and and correctness score (for "missing correct choice" error)
			// validation errors dialog
			if (newState != ExerciseState.DRAFT && this.v$.$errors.length > 0) {
				this.showDialog = true;
				this.showValidationErrors = true;
				this.dialogData = {
					title: _("exercise_editor.cannot_publish"),
					text: _("exercise_editor.cannot_publish_body"),
					onYes: () => {
						this.showDialog = false;
						this.showValidationErrors = false;
					},
					error: true,
					confirmOnly: true,
				};
				return;
			}

			// publish exercise confirmation
			if (newState === ExerciseState.PUBLIC) {
				this.showDialog = true;
				this.dialogData = {
					title: _("exercise_editor.make_public_confirmation_title"),
					text: _("exercise_editor.make_public_confirmation_body"),
					onYes: () => {
						this.onBaseExerciseChange("state", newState);
						this.showDialog = false;
					},
					onNo: () => (this.showDialog = false),
					error: false,
					confirmOnly: false,
				};
			} else {
				this.onBaseExerciseChange("state", newState);
			}
		},
		instantiateChoiceAutoSaveManager(choice: ExerciseChoice) {
			this.choiceAutoSaveManagers[choice.id] = new AutoSaveManager<ExerciseChoice>(
				choice,
				async changes => {
					// if choices are re-ordered, re-fetch them from server
					const reFetch = Object.keys(changes).includes("_ordering");
					await this.updateExerciseChild({
						childType: "choice",
						courseId: this.courseId,
						exerciseId: this.modelValue.id,
						payload: { ...choice, ...changes },
						reFetch,
					});
				},
				changes => {
					this.saving = true;
					this.savingError = false;
					this.setExerciseChild({
						childType: "choice",
						exerciseId: this.modelValue.id,
						payload: { ...choice, ...changes },
					});
				},
				EXERCISE_CHOICE_AUTO_SAVE_DEBOUNCED_FIELDS,
				EXERCISE_CHOICE_AUTO_SAVE_DEBOUNCE_TIME_MS,
				undefined,
				() => (this.savingError = true),
				() => (this.saving = false),
			);
		},
		instantiateSolutionAutoSaveManager(solution: ExerciseSolution) {
			this.solutionAutoSaveManagers[solution.id] = new AutoSaveManager<ExerciseSolution>(
				solution,
				async changes =>
					await this.updateExerciseChild({
						childType: "solution",
						courseId: this.courseId,
						exerciseId: this.modelValue.id,
						payload: { ...solution, ...changes },
						reFetch: false,
					}),
				changes => {
					this.saving = true;
					this.savingError = false;
					this.setExerciseSolution({
						exerciseId: this.modelValue.id,
						payload: { ...solution, ...changes },
					});
				},
				EXERCISE_SOLUTION_AUTO_SAVE_DEBOUNCE_FIELDS,
				EXERCISE_SOLUTION_AUTO_SAVE_DEBOUNCE_TIME_MS,
				undefined,
				() => (this.savingError = true),
				() => (this.saving = false),
			);
		},
		instantiateTestCaseAutoSaveManager(testcase: ExerciseTestCase) {
			this.testCaseAutoSaveManagers[testcase.id] = new AutoSaveManager<ExerciseTestCase>(
				testcase,
				async changes => {
					// if choices are re-ordered, re-fetch them from server
					const reFetch = Object.keys(changes).includes("_ordering");
					await this.updateExerciseChild({
						childType: "testcase",
						courseId: this.courseId,
						exerciseId: this.modelValue.id,
						payload: { ...testcase, ...changes },
						reFetch,
					});
					await this.onTestSolution();
				},
				changes => {
					this.saving = true;
					this.savingError = false;
					this.setExerciseChild({
						childType: "testcase",
						exerciseId: this.modelValue.id,
						payload: { ...testcase, ...changes },
					});
				},
				TEST_CASE_AUTO_SAVE_DEBOUNCED_FIELDS,
				TEST_CASE_AUTO_SAVE_DEBOUNCE_TIME_MS,
				undefined,
				() => (this.savingError = true),
				() => (this.saving = false),
			);
		},
	},
	computed: {
		...mapState([
			"tags",
			"user",
			"paginatedSolutionsByExerciseId",
			"exerciseTestCaseAttachmentsByTestCaseId",
		]),
		solutions(): ExerciseSolution[] {
			return this.paginatedSolutionsByExerciseId[this.modelValue.id]?.data ?? [];
		},
		showNoChoicePenaltyWarning(): boolean {
			return (
				this.modelValue.exercise_type ===
					ExerciseType.MULTIPLE_CHOICE_MULTIPLE_POSSIBLE &&
				!this.modelValue.all_or_nothing &&
				!this.v$.$invalid &&
				!(this.modelValue.choices ?? []).some(c => (c.correctness ?? 0) < 0)
			);
		},
		isMultipleChoice(): boolean {
			return isMultipleChoiceExercise(this.modelValue);
		},
		isProgrammingExercise(): boolean {
			return isProgrammingExercise(this.modelValue);
		},
		maxScore(): number | null {
			return getMaxScore(this.modelValue);
		},
		exerciseTypeOptions() {
			return exerciseTypeOptions.filter(
				o => !this.subExercise || o.value !== ExerciseType.AGGREGATED,
			);
		},
		exerciseLocked(): boolean {
			return !!this.modelValue.locked_by && this.modelValue.locked_by.id != this.user.id;
		},
		editingCloze(): Exercise | null {
			if (this.editingClozePosition === null) {
				return null;
			}
			return (this.modelValue.sub_exercises as Exercise[])[this.editingClozePosition];
		},
		childWeightError() {
			return (this.v$ as any).modelValue.$errors.find((e: any) =>
				["modelValue.sub_exercises-subExerciseWeightAddsUp"].includes(e.$uid),
			);
		},
		choicesCorrectnessError() {
			return (this.v$ as any).modelValue.$errors.find((e: any) =>
				["modelValue.choices-atLeastOneCorrectChoice"].includes(e.$uid),
			);
		},
		languageCode() {
			return programmingExerciseTypeToLanguageId[
				this.modelValue.exercise_type as ProgrammingExerciseType
			];
		},
		stateDropdownId() {
			return "exercise_state_" + this.elementId;
		},
	},
});
</script>

<style></style>

<template>
	<div>
		<div class="relative flex w-full rounded-sm card-border">
			<div
				v-if="showTeacherControls && solution.state === ExerciseSolutionState.REJECTED"
				class="flex absolute h-full w-full bg-opacity-0 bg-dark z-10"
			>
				<div class="m-auto flex flex-col items-center space-y-2">
					<h5>{{ $t("exercise_solution.you_rejected_this_solution") }}</h5>
					<Btn @click="onUpdateState(ExerciseSolutionState.SUBMITTED)">{{
						$t("misc.undo")
					}}</Btn>
				</div>
			</div>
			<div
				class="flex flex-col w-full"
				:class="{
					'opacity-50 hover:opacity-70 ease-in-out transition-opacity duration-200':
						solution.state === ExerciseSolutionState.REJECTED,
				}"
			>
				<!-- main -->
				<div class="flex md:flex-row flex-col h-full">
					<!-- voting -->
					<div class="h-full pt-2 pb-2 md:pb-0 px-4 md:pt-4 rounded-tl-sm bg-gray-50">
						<div
							class="
								sticky
								flex
								md:flex-col
								flex-row
								place-content-evenly
								items-center
								md:pb-4 md:space-y-4 md:space-x-0
								top-18
							"
						>
							<div class="relative">
								<Btn
									:disabled="isOwnSolution"
									:variant="'icon'"
									:size="'lg'"
									:outline="true"
									class="relative z-10"
									@click="onVote(VoteType.UP_VOTE)"
								>
									<span
										:class="[
											solution.has_upvote ? 'material-icons' : 'material-icons-outlined',
										]"
										:style="
											mediaQueryMdMatches
												? 'font-size: 35px !important'
												: 'font-size: 28px !important'
										"
									>
										thumb_up_alt</span
									>
								</Btn>
								<ConfettiExplosion
									v-if="false && showAnimation"
									class="absolute -top-2 left-4"
									:particleCount="50"
									:force="1"
									:stageHeight="1000"
									:stageWidth="400"
									:particleSize="8"
									:duration="2500"
								/>
							</div>

							<p class="text-3xl md:text-4xl text-muted">{{ solution.score }}</p>
							<Btn
								:disabled="isOwnSolution"
								:variant="'icon'"
								:size="'lg'"
								@click="onVote(VoteType.DOWN_VOTE)"
								:outline="true"
								class=""
								><span
									:class="[
										solution.has_downvote ? 'material-icons' : 'material-icons-outlined',
									]"
									:style="
										mediaQueryMdMatches
											? 'font-size: 35px !important'
											: 'font-size: 28px !important'
									"
								>
									thumb_down_alt</span
								></Btn
							>
						</div>
					</div>
					<!-- right-side pane -->
					<div class="flex flex-col w-full h-full bg-black bg-opacity-0 relative">
						<Tooltip
							:textValue="$t('exercise_solution.verified')"
							:placement="'bottom'"
							class="mr-3 mt-3 absolute right-0 top-0 z-10"
							v-if="solution.state === ExerciseSolutionState.APPROVED"
						>
							<span class="text-4xl material-icons text-success">verified</span>
						</Tooltip>
						<div
							class="banner banner-light mx-2"
							v-if="
								showTeacherControls && solution.state === ExerciseSolutionState.SUBMITTED
							"
						>
							<span class="material-icons text-muted"> shield </span>
							<p class="">
								{{ $t("exercise_solution.teacher_is_this_solution_correct") }}
							</p>
							<Btn
								:disabled="publishing"
								:size="'sm'"
								class="ml-4 mr-2"
								@click="onUpdateState(ExerciseSolutionState.APPROVED)"
							>
								{{ $t("exercise_solution.approve") }}</Btn
							>
							<Btn
								:disabled="publishing"
								:size="'sm'"
								:outline="true"
								@click="onUpdateState(ExerciseSolutionState.REJECTED)"
								>{{ $t("exercise_solution.reject") }}</Btn
							>
						</div>
						<!-- content -->
						<div
							class="relative w-full pt-4 mb-auto whitespace-pre"
							:class="{
								'h-full': !collapsed && !calculatingHeight,
								'overflow-hidden': collapsed || calculatingHeight,
							}"
							:style="
								collapsed || calculatingHeight
									? 'max-height: ' + MAX_CONTENT_HEIGHT_PX + 'px'
									: ''
							"
						>
							<div ref="content">
								<ProcessedTextFragment
									v-if="solutionType === 'text'"
									style="white-space: break-spaces"
									class="w-full px-4 py-2 rounded"
									:value="solution.content"
								/>
								<CodeFragment
									v-else
									:language="solutionType"
									:value="solution.content"
									class="-mt-4 rounded-tr rounded-none"
								/>
								<div
									v-if="collapsed"
									class="absolute bottom-0 left-0 flex w-full h-40 hidden-content"
								>
									<Btn
										@click="collapsed = false"
										:variant="'primary-borderless'"
										class="z-20 mx-auto mt-auto mb-2"
										>{{ $t("exercise_solution.reveal_solution") }}</Btn
									>
								</div>
							</div>
							<!-- {{ ExerciseSolutionState[solution.state] }} -->
						</div>

						<div class="flex w-full mt-2 pb-0.5">
							<!-- actions -->
							<div class="flex md:ml-2">
								<Btn
									v-if="canEdit"
									:variant="'icon'"
									:outline="true"
									:tooltip="$t('exercise_solution.edit')"
									@click="$emit('editSolution')"
									><span class="material-icons">edit</span></Btn
								>
								<CopyToClipboard
									:icon-only="true"
									:tooltip="$t('exercise_solution.share')"
									:value="permalink"
								/>
								<Btn
									:variant="'icon'"
									:outline="true"
									:tooltip="
										solution.is_bookmarked
											? $t('exercise_solution.remove_bookmark')
											: $t('exercise_solution.add_bookmark')
									"
									><span
										class="material-icons"
										:class="{ 'text-primary': solution.is_bookmarked }"
										:loading="bookmarking"
										@click="onToggleBookmark()"
										>{{ solution.is_bookmarked ? "bookmark" : "bookmark_outline" }}</span
									>
								</Btn>
							</div>

							<!-- author -->
							<div class="flex items-center ml-auto">
								<Avatar class="ml-auto md:mr-2 mr-1" :user="solution.user" />
								<p class="md:mr-5 mr-2 text-sm md:text-base text-muted">
									{{ authorName }}
								</p>
							</div>
						</div>
					</div>
				</div>

				<!-- comments -->
				<div class="w-full border-t px-4 py-4 border-gray-50">
					<h5 class="mb-2">{{ $t("exercise_solution.comments") }}</h5>
					<div>
						<div
							v-for="comment in solution.comments"
							:key="'comment-' + comment.id"
							class="my-1.5"
						>
							<ExerciseSolutionComment :comment="comment" />
						</div>
					</div>

					<!-- add comment -->
					<div class="flex items-center w-full mt-4 space-x-2">
						<Avatar class="px-3 my-auto" :user="user" />
						<TextInput
							class="w-full"
							v-model="draftComment"
							:placeholder="$t('exercise_solution.add_comment')"
						/>
						<Btn
							:loading="postingComment"
							:variant="'secondary'"
							:disabled="draftComment.trim().length === 0"
							@click="onAddComment()"
						>
							<span class="material-icons">send</span>
						</Btn>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
const MAX_CONTENT_HEIGHT_PX = 300;
import {
	Exercise,
	ExerciseSolution,
	ExerciseSolutionState,
	ExerciseType,
	getComment,
	getVote,
	ProgrammingExerciseType,
	programmingExerciseTypeToLanguageId,
	VoteType,
} from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import Btn from "@/components/ui/Btn.vue";
import TextInput from "@/components/ui/TextInput.vue";
import Avatar from "@/components/ui/Avatar.vue";
import { mapActions, mapState } from "vuex";
import ExerciseSolutionComment from "./ExerciseSolutionComment.vue";
import ProcessedTextFragment from "@/components/ui/ProcessedTextFragment.vue";
import { courseIdMixin, coursePrivilegeMixin, mediaQueryMixin } from "@/mixins";
import { setErrorNotification } from "@/utils";
import CopyToClipboard from "@/components/ui/CopyToClipboard.vue";
import { getExerciseSolutionThreadRoute } from "./utils";
import { getTranslatedString as _ } from "@/i18n";
import CodeFragment from "@/components/ui/CodeFragment.vue";
import ConfettiExplosion from "vue-confetti-explosion";
import Tooltip from "@/components/ui/Tooltip.vue";

//import { v4 as uuid4 } from "uuid";
export default defineComponent({
	name: "ExerciseSolution",
	mixins: [courseIdMixin, coursePrivilegeMixin, mediaQueryMixin],
	props: {
		exercise: {
			type: Object as PropType<Exercise>,
			required: true,
		},
		solution: {
			type: Object as PropType<ExerciseSolution>,
			required: true,
		},
		canVote: {
			type: Boolean,
			default: true,
		},
		canChangeState: {
			type: Boolean,
			default: false,
		},
		canComment: {
			type: Boolean,
			default: true,
		},
		forceExpanded: {
			type: Boolean,
			default: false,
		},
		showTeacherControls: {
			type: Boolean,
			default: false,
		},
		publishing: {
			type: Boolean,
			default: false,
		},
	},
	mounted() {
		setTimeout(() => {
			const contentElement = this.$refs.content as HTMLElement;
			if (
				contentElement.clientHeight > this.MAX_CONTENT_HEIGHT_PX &&
				!this.forceExpanded
			) {
				this.collapsed = true;
			}
			this.calculatingHeight = false;
		}, 50);
	},
	data() {
		return {
			voting: false,
			postingComment: false,
			bookmarking: false,
			draftComment: "",
			VoteType,
			ExerciseSolutionState,
			MAX_CONTENT_HEIGHT_PX,
			collapsed: false,
			showAnimation: false,
			calculatingHeight: true,
			//solutionId: uuid4(),
		};
	},
	methods: {
		...mapActions("student", [
			"addExerciseSolutionComment",
			"addExerciseSolutionVote",
			"setExerciseSolutionBookmark",
		]),
		async onVote(voteType: VoteType) {
			if (this.voting) {
				return;
			}
			this.voting = true;
			try {
				const vote =
					(this.solution.has_upvote && voteType === VoteType.UP_VOTE) ||
					(this.solution.has_downvote && voteType === VoteType.DOWN_VOTE)
						? undefined // removing vote
						: getVote(voteType); // adding/updating vote

				await this.addExerciseSolutionVote({
					courseId: this.courseId,
					exerciseId: this.exercise.id,
					solutionId: this.solution.id,
					vote,
				});
				if (typeof vote !== "undefined") {
					// TODO refactor animation
					this.showAnimation = true;
				}
				// TODO fix this with an action
				// eslint-disable-next-line vue/no-mutating-props
				// this.solution.votes.push(getVote(voteType));
			} catch (e) {
				setErrorNotification(e);
			} finally {
				this.voting = false;
			}
		},
		async onAddComment() {
			this.postingComment = true;
			try {
				await this.addExerciseSolutionComment({
					courseId: this.courseId,
					exerciseId: this.exercise.id,
					solutionId: this.solution.id,
					comment: getComment(this.draftComment),
				});
				this.draftComment = "";
			} catch (e) {
				setErrorNotification(e);
			} finally {
				this.postingComment = false;
			}
		},
		async onToggleBookmark() {
			this.bookmarking = true;
			try {
				await this.setExerciseSolutionBookmark({
					courseId: this.courseId,
					exerciseId: this.exercise.id,
					solutionId: this.solution.id,
					bookmarked: !this.solution.is_bookmarked,
				});
			} catch (e) {
				setErrorNotification(e);
			} finally {
				this.bookmarking = false;
			}
		},
		onUpdateState(newState: ExerciseSolutionState) {
			this.$emit("updateState", newState);
		},
	},
	computed: {
		...mapState("shared", ["user"]),
		// TODO extract to utils
		solutionType() {
			const code =
				programmingExerciseTypeToLanguageId[
					this.exercise.exercise_type as ProgrammingExerciseType
				];
			return code ?? "text";
		},
		authorName(): string {
			return this.solution.user?.full_name ?? _("exercise_solution.default_author");
		},
		isOwnSolution(): boolean {
			return (this.solution.user?.id ?? "") == this.user.id;
		},
		canEdit(): boolean {
			return this.isOwnSolution || this.hasAnyPrivileges();
		},
		permalink(): string {
			return (
				window.location.origin +
				this.$router.resolve(
					getExerciseSolutionThreadRoute(
						this.courseId,
						this.exercise.id,
						this.solution.id,
					),
				).fullPath
			);
		},
	},
	components: {
		Btn,
		TextInput,
		Avatar,
		ExerciseSolutionComment,
		ProcessedTextFragment,
		CopyToClipboard,
		CodeFragment,
		ConfettiExplosion,
		Tooltip,
	},
});
</script>

<style></style>

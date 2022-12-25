<template>
	<div>
		<div class="flex items-center space-x-2">
			<span
				v-if="comments.length > 0"
				class="material-icons-outlined text-muted"
				style="margin-bottom: -1px; font-size: 22px !important"
				>question_answer</span
			>
			<h4 v-if="comments.length > 0">
				{{ comments.length }}
				{{
					comments.length === 1
						? $t("course_tree.node_comment_title")
						: $t("course_tree.node_comments_title")
				}}
			</h4>
			<Btn
				style="margin-bottom: -1px"
				@click="expanded = !expanded"
				:size="'xs'"
				:variant="'primary-borderless'"
				v-if="shownComments.length < comments.length || expanded"
			>
				<span class="text-base">{{
					expanded ? $t("misc.show_recent") : $t("misc.show_all")
				}}</span>
			</Btn>
		</div>

		<!-- comments-->
		<div class="w-full">
			<!-- TODO extract to separate component for re-use-->
			<div
				v-for="comment in shownComments"
				:key="comment.id"
				class="flex items-center w-full my-3 space-x-2"
			>
				<Avatar class="my-auto" :user="comment.user" />
				<div class="w-full">
					<div class="flex items-center space-x-1">
						<p class="mr-2 font-medium text-primary capitalize">
							{{ comment.user.full_name ?? "" }}
						</p>
						<Timestamp
							:value="comment.created"
							:reduced="true"
							class="text-muted text-xs opacity-90"
						/>
					</div>
					<div class="flex w-full items-center">
						<p class="break-normal">{{ comment.comment }}</p>
					</div>
				</div>
				<Btn
					:variant="'icon'"
					:outline="true"
					@click="onDelete(comment.id)"
					v-if="canDelete(comment)"
					class="
						ml-auto
						opacity-30
						hover:opacity-100
						transition-opacity
						duration-75
						ease-in-out
					"
				>
					<span class="material-icons text-muted">delete</span>
				</Btn>
			</div>
		</div>

		<!-- comment editor -->
		<div>
			<div class="flex items-center w-full mt-4 space-x-2">
				<Avatar class="px-3 my-auto" :user="metaStore.user" />
				<TextInput
					@keyup.enter="onAddComment()"
					:maxLength="500"
					class="w-full"
					v-model="draftComment"
					:disabled="loadingComments"
					:loading="loadingComments"
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
</template>

<script lang="ts">
import { getTranslatedString as _ } from "@/i18n";
import { courseIdMixin, coursePrivilegeMixin, loadingMixin } from "@/mixins";
import { CoursePrivilege, getBlankCourseTreeNodeComment, NodeComment } from "@/models";
import { useMainStore } from "@/stores/mainStore";
import { useMetaStore } from "@/stores/metaStore";
import { getCurrentUserId, setErrorNotification } from "@/utils";
import { defineComponent, PropType } from "@vue/runtime-core";
import { mapStores } from "pinia";
import Avatar from "../ui/Avatar.vue";
import Btn from "../ui/Btn.vue";
import TextInput from "../ui/TextInput.vue";
import Timestamp from "../ui/Timestamp.vue";
export default defineComponent({
	name: "CourseTreeNodeCommentSection",
	mixins: [courseIdMixin, loadingMixin, coursePrivilegeMixin],
	props: {
		nodeId: {
			type: String,
			required: true,
		},
		loadingComments: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			draftComment: "",
			postingComment: false,
			expanded: false,
		};
	},
	methods: {
		async onAddComment() {
			if (this.draftComment.trim().length === 0) {
				return;
			}
			this.postingComment = true;
			try {
				await this.mainStore.createCourseTreeNodeComment({
					courseId: this.courseId,
					nodeId: this.nodeId,
					comment: getBlankCourseTreeNodeComment(this.draftComment),
				});
				this.draftComment = "";
			} catch (e) {
				setErrorNotification(e);
			} finally {
				this.postingComment = false;
			}
		},
		async onDelete(commentId: string) {
			if (!confirm(_("course_tree.confirm_delete_comment"))) {
				return;
			}
			try {
				await this.mainStore.deleteCourseNodeComment({
					courseId: this.courseId,
					nodeId: this.nodeId,
					commentId,
				});
			} catch (e) {
				setErrorNotification(e);
			}
		},
		canDelete(comment: NodeComment) {
			return (
				this.hasPrivileges([CoursePrivilege.MANAGE_MATERIAL]) ||
				comment.user.id == getCurrentUserId()
			);
		},
	},
	computed: {
		...mapStores(useMainStore, useMetaStore),
		comments() {
			return this.mainStore.getCommentsByNodeId(this.nodeId);
		},
		shownComments() {
			return this.comments.length <= 2 || this.expanded
				? this.comments
				: this.comments.slice(-2);
		},
	},
	components: { Avatar, TextInput, Btn, Timestamp },
});
</script>

<style></style>

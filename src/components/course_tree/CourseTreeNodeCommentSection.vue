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
			<Message
				v-for="comment in shownComments"
				:key="comment.id"
				:user="comment.user"
				:canDelete="canDelete(comment)"
				:message="comment.comment"
				:class="comment.created"
				@deleteMessage="onDelete(comment.id)"
			></Message>
		</div>

		<!-- comment editor -->
		<MessageEditor
			:posting="postingComment"
			@sendMessage="onAddComment($event.message, $event.resolveFn, $event.rejectFn)"
		/>
	</div>
</template>

<script lang="ts">
import { getTranslatedString as _ } from "@/i18n";
import { courseIdMixin, coursePrivilegeMixin, loadingMixin } from "@/mixins";
import { CoursePrivilege, getBlankCourseTreeNodeComment, NodeComment } from "@/models";
import { useMainStore } from "@/stores/mainStore";
import { useMetaStore } from "@/stores/metaStore";
import { getCurrentUserId, setErrorNotification } from "@/utils";
import { defineComponent } from "@vue/runtime-core";
import { mapStores } from "pinia";
import Message from "../messaging/Message.vue";
import MessageEditor from "../messaging/MessageEditor.vue";
import Btn from "../ui/Btn.vue";
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
			postingComment: false,
			expanded: false,
		};
	},
	methods: {
		async onAddComment(message: string, resolveFn: () => void, rejectFn: () => void) {
			this.postingComment = true;
			try {
				await this.mainStore.createCourseTreeNodeComment({
					courseId: this.courseId,
					nodeId: this.nodeId,
					comment: getBlankCourseTreeNodeComment(message),
				});
				resolveFn();
			} catch (e) {
				setErrorNotification(e);
				rejectFn();
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
	components: { Btn, MessageEditor, Message },
});
</script>

<style></style>

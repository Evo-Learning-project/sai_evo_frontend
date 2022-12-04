<template>
	<div>
		<h4>
			{{ comments.length }}
			{{
				comments.length === 1
					? $t("course_tree.node_comment_title")
					: $t("course_tree.node_comments_title")
			}}
		</h4>
		<!-- comments-->
		<div>
			<div
				v-for="comment in comments"
				:key="comment.id"
				class="flex items-center my-3 space-x-2"
			>
				<Avatar :user="comment.user" />
				<div>
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
					<p class="break-normal">{{ comment.comment }}</p>
				</div>
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
import { courseIdMixin, loadingMixin } from "@/mixins";
import { getBlankCourseTreeNodeComment } from "@/models";
import { useMainStore } from "@/stores/mainStore";
import { useMetaStore } from "@/stores/metaStore";
import { setErrorNotification } from "@/utils";
import { defineComponent, PropType } from "@vue/runtime-core";
import { mapStores } from "pinia";
import Avatar from "../ui/Avatar.vue";
import Btn from "../ui/Btn.vue";
import TextInput from "../ui/TextInput.vue";
import Timestamp from "../ui/Timestamp.vue";
export default defineComponent({
	name: "CourseTreeNodeCommentSection",
	mixins: [courseIdMixin, loadingMixin],
	props: {
		nodeId: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			draftComment: "",
			postingComment: false,
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
	},
	computed: {
		...mapStores(useMainStore, useMetaStore),
		comments() {
			return this.mainStore.getCommentsByNodeId(this.nodeId);
		},
	},
	components: { Avatar, TextInput, Btn, Timestamp },
});
</script>

<style></style>

<template>
	<div
		class="
			flex flex-col
			px-6
			py-6
			overflow-x-hidden
			md:min-h-13rem
			lg:overflow-x-visible
			card card-border card-hoverable
			hover-shadow-elevation hover:border-transparent
			relative
		"
	>
		<div
			class="
				text-darkText
				course-header
				bg-light bg-opacity-0
				flex
				items-start
				py-4
				-mt-4
				rounded-t
			"
		>
			<div>
				<div class="flex items-start space-x-2">
					<div
						style="
							min-height: 2.8rem;
							min-width: 2.8rem;
							max-height: 2.8rem;
							max-width: 2.8rem;
						"
						class="w-8 h-8 flex mb-full rounded-full bg-primary bg-opacity-15"
					>
						<span
							style="font-size: 2.05rem"
							class="m-auto text-primary material-icons-outlined icon-light"
						>
							book
						</span>
					</div>
					<div class="mb-auto mt-0.5">
						<h3
							style="line-height: 25px; font-size: 20px"
							class="hidden lg:block mb-1.5 pr-4.5 font-normal"
						>
							{{ course.name }}
						</h3>
						<h4 style="line-height: 22px" class="lg:hidden mb-1.5 pr-4.5 font-normal">
							{{ course.name }}
						</h4>
						<p style="font-weight: 400" class="-mb-0.5 text-xs text-muted uppercase">
							{{ course.creator?.full_name }}
						</p>
					</div>
				</div>
			</div>
			<Tooltip
				v-if="course.hidden"
				:textCode="'hidden_course'"
				:placement="'bottom'"
				:noArrow="true"
				class="mt-1 ml-1"
			>
				<span
					class="mr-4 text-lg opacity-50 inline-icon icon-light material-icons-outlined"
				>
					visibility_off
				</span>
			</Tooltip>
		</div>
		<div class="my-1">
			<p
				style="line-height: 1.2rem; font-weight: 400; opacity: 0.8"
				class="my-3 text-sm"
				v-if="formattedDescription"
				:title="course.description"
			>
				{{ formattedDescription }}
			</p>
		</div>
		<div class="mt-auto flex w-full">
			<div class="flex flex-col mt-auto space-y-1.5">
				<Btn
					@click="$emit('enroll')"
					:size="'sm'"
					v-if="!canAccessCoursePanel && !course.enrolled"
					:variant="'primary'"
					:outline="true"
				>
					<span class="material-icons mr-2">person_add</span>
					{{ $t("enrollment.enroll") }}
				</Btn>
				<router-link
					v-else
					class="w-full"
					:to="{
						name: 'StudentCourseDashboard',
						params: { courseId: course.id },
					}"
				>
					<Btn
						:size="'xs'"
						:variant="'primary-borderless'"
						:outline="true"
						class="whitespace-nowrap font-medium"
					>
						<span class="text-base 2xl:text-lg">{{
							metaStore.user.is_teacher || canAccessCoursePanel
								? $t("courses.access_as_student")
								: $t("courses.go_to_course")
						}}</span>
					</Btn>
				</router-link>
				<router-link
					v-if="canAccessCoursePanel"
					class=""
					:to="{
						name: 'TeacherCourseDashboard',
						params: { courseId: course.id },
					}"
					><Btn
						:size="'xs'"
						:outline="true"
						:variant="'primary-borderless'"
						class="font-medium"
					>
						<span class="text-base 2xl:text-lg">{{ $t("courses.course_panel") }}</span>
						<!-- <span class="ml-1 text-lg material-icons-outlined"> shield </span> -->
					</Btn>
				</router-link>
			</div>
			<div class="ml-auto flex items-center mt-auto">
				<Btn :variant="'icon'" @click="$emit('toggleFavorite')" :outline="true"
					><span class="material-icons">{{
						course.bookmarked ? "bookmark" : "bookmark_outline"
					}}</span>
				</Btn>
				<Btn
					v-if="course.enrolled"
					:variant="'icon'"
					@click="$emit('unenroll')"
					:outline="true"
					:tooltip="$t('enrollment.unenroll')"
					><span class="material-icons">person_remove</span>
				</Btn>
				<CopyToClipboard
					:iconOnly="true"
					:tooltip="$t('misc.share')"
					:confirmationMessage="$t('event_preview.copied_link')"
					:value="permalink"
				/>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
//import Card from "@/components/ui/Card.vue";
import Btn from "@/components/ui/Btn.vue";
import { Course } from "@/models";
import { useMetaStore } from "@/stores/metaStore";
import { defineComponent, PropType } from "@vue/runtime-core";
import { mapStores } from "pinia";
import CopyToClipboard from "../ui/CopyToClipboard.vue";
import Tooltip from "../ui/Tooltip.vue";
export default defineComponent({
	name: "CourseListItem",
	props: {
		course: {
			type: Object as PropType<Course>,
			required: true,
		},
	},
	data() {
		return {};
	},
	components: {
		//Card,
		Btn,
		Tooltip,
		CopyToClipboard,
	},
	computed: {
		...mapStores(useMetaStore),
		permalink() {
			return (
				window.location.origin +
				this.$router.resolve({
					name: "CourseDispatcher",
					params: { courseId: this.course.id },
				}).fullPath
			);
		},
		canAccessCoursePanel(): boolean {
			return (
				this.course.creator?.id === this.metaStore.user.id ||
				(this.course.privileges?.length ?? 0) > 0
			);
		},
		formattedDescription() {
			const MAX_DESC_LENGTH = 150;
			const description = this.course.description ?? "";
			return (
				description.slice(0, MAX_DESC_LENGTH) +
				(description.length > MAX_DESC_LENGTH ? "..." : "")
			);
		},
		// bookmarkColor() {
		// 	return getColorFromString(this.course.name);
		// 	// return [
		// 	// 	"#000066",
		// 	// 	"#310987",
		// 	// 	"#4f24a1",
		// 	// 	"#6b3cbc",
		// 	// 	"#8654d7",
		// 	// 	"#a26df3",
		// 	// 	"#c189fe",
		// 	// 	"#e1a7ff",
		// 	// 	"#ffc5ff",
		// 	// ][this.course.name.length % 9];
		// },
	},
	// methods: {
	// 	getColorFromString,
	// },
});
</script>

<style>
.course-header {
	/* background-image: url("../../../public/course-bg.png");
	background-size: cover;
	background-repeat: no-repeat; */
}
</style>

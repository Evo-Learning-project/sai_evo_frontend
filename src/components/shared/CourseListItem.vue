<template>
	<div
		class="
			flex flex-col
			px-6
			py-6
			overflow-x-hidden
			md:min-h-21rem
			lg:overflow-x-visible
			card card-border card-hoverable
			hover-shadow-elevation hover:border-transparent
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
						style="min-height: 2rem; min-width: 2rem"
						class="w-8 h-8 flex mb-full rounded-full bg-primary bg-opacity-15"
					>
						<span
							style="font-size: 1.4rem"
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

				<!-- <div class="flex items-center space-x-1 mt-2"> -->
				<!-- <span class="my-auto material-icons text-muted text-xl">person</span> -->
				<!-- <p style="font-weight: 400" class="-mb-0.5 text-xs text-muted uppercase">
						{{ course.creator?.full_name }}
					</p> -->
				<!-- </div> -->
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
		<div class="mt-2">
			<!-- <div class="flex items-center px-0.5 mb-1 space-x-1 text-sm"> -->
			<!-- <div class="flex items-center space-x-0.5 text-muted">
					<span class="my-auto text-xl material-icons-outlined">person</span>
					<span class="">{{ $t("misc.teacher") }}:</span>
				</div> -->
			<!-- <p class="text-muted text-sm uppercase">{{ course.creator?.full_name }}</p> -->
			<!-- </div> -->
			<!-- v-html="formattedDescription" -->
			<p
				style="line-height: 1.2rem; font-weight: 400; opacity: 0.8"
				class="my-3 text-sm"
				v-if="formattedDescription"
			>
				{{ formattedDescription }}
			</p>
		</div>
		<div class="flex flex-col items-center mt-auto mb-2.5 space-y-2">
			<router-link
				class="w-full"
				:to="{
					name: 'StudentCourseDashboard',
					params: { courseId: course.id },
				}"
			>
				<Btn :variant="'primary'" :outline="true" class="w-full whitespace-nowrap">
					<span class="mr-0.5 mt-0.5 text-lg material-icons-outlined">
						chevron_right
					</span>
					<span class="text-base md:text-xs xl:text-base 2xl:text-lg">{{
						user.is_teacher ? $t("courses.access_as_student") : $t("courses.go_to_course")
					}}</span>
				</Btn></router-link
			>
			<router-link
				v-if="canAccessCoursePanel"
				class="w-full"
				:to="{
					name: 'TeacherCourseDashboard',
					params: { courseId: course.id },
				}"
				><Btn :outline="true" class="w-full">
					<span class="mr-1 text-lg material-icons"> shield </span>
					<span class="text-base md:text-xs xl:text-base 2xl:text-lg">{{
						$t("courses.course_panel")
					}}</span>
				</Btn></router-link
			>
		</div>
	</div>
</template>

<script lang="ts">
//import Card from "@/components/ui/Card.vue";
import Btn from "@/components/ui/Btn.vue";
import { Course } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import { mapState } from "vuex";
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
	},
	computed: {
		...mapState("shared", ["user"]),
		canAccessCoursePanel(): boolean {
			return (
				this.course.creator?.id === this.$store.state.shared.user?.id ||
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
	},
});
</script>

<style>
.course-header {
	/* background-image: url("../../../public/course-bg.png");
	background-size: cover;
	background-repeat: no-repeat; */
}
</style>

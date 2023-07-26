<template>
	<div
		class="
			flex flex-col
			rounded-lg
			overflow-x-hidden
			md:min-h-13rem
			lg:overflow-x-visible
			card-border card-hoverable
			hover-shadow-elevation hover:border-transparent
			relative
		"
	>
		<!-- head -->
		<!--bg-gradient grad-bg-->
		<div class="px-8 h-24 flex items-start py-4 rounded-t-lg wave-bg">
			<div>
				<div class="flex items-start space-x-2">
					<div class="mb-auto mt-0.5">
						<h3
							style="line-height: 28px; font-size: 23px"
							class="text-purple-200 mb-1.5 pr-4.5 font-normal"
						>
							{{ course.name }}
						</h3>
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
		<!-- description-->
		<div class="mt-8 mb-4 px-8 relative">
			<div
				style="
					min-height: 4.5rem;
					min-width: 4.5rem;
					max-height: 4.5rem;
					max-width: 4.5rem;
				"
				class="
					z-10
					border-2 border-white
					flex
					rounded-full
					bg-primary-light bg-opacity-100
					absolute
					-mt-4
					-top-1/2
					right-0
					mr-8
				"
			>
				<span
					style="font-size: 3.05rem"
					class="m-auto text-primary material-icons-outlined icon-light"
				>
					book
				</span>
			</div>
			<p>
				Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vel sapiente ad
				reprehenderit cum natus in nostrum recusandae illo? Maiores perferendis labore
				illo repellat, animi accusamus minima mollitia vel alias! Illum.
			</p>
			<p
				style="line-height: 1.2rem; font-weight: 400; opacity: 0.8"
				class="my-3 text-sm"
				v-if="false && formattedDescription"
				:title="course.description"
			>
				{{ formattedDescription }}
			</p>
		</div>
		<!-- actions -->
		<div class="mt-auto flex w-full px-8 pt-2 pb-6">
			<div class="flex flex-col mt-auto space-y-1.5">
				<router-link
					class="w-full"
					:to="{
						name: 'StudentCourseDashboard',
						params: { courseId: course.id },
					}"
				>
					<Btn
						:variant="'primary-borderless'"
						:outline="true"
						class="whitespace-nowrap font-medium"
					>
						<!-- <span class="mr-0.5 mt-0.5 text-lg material-icons-outlined">
						chevron_right
					</span> -->
						<span class="text-base 2xl:text-lg uppercase">
							Entra
							<!-- {{
							metaStore.user.is_teacher
								? $t("courses.access_as_student")
								: $t("courses.go_to_course")
						}} -->
						</span>
					</Btn></router-link
				>
				<router-link
					v-if="false && canAccessCoursePanel"
					class=""
					:to="{
						name: 'TeacherCourseDashboard',
						params: { courseId: course.id },
					}"
				>
					<Btn :outline="true" :variant="'icon'" class="font-medium">
						<!-- <span class="text-base 2xl:text-lg">{{ $t("courses.course_panel") }}</span> -->
						<span class="ml-1 text-lg material-icons-outlined"> shield </span>
					</Btn>
				</router-link>
			</div>
			<div class="ml-auto flex items-center mt-auto">
				<!-- TODO implement -->
				<Btn :variant="'icon'" @click="$emit('toggleFavorite')" :outline="true"
					><span class="material-icons">{{
						course.bookmarked ? "bookmark" : "bookmark_outline"
					}}</span></Btn
				>
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
import { getColorFromString } from "@/utils";
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
		bookmarkColor() {
			return getColorFromString(this.course.name);
			// return [
			// 	"#000066",
			// 	"#310987",
			// 	"#4f24a1",
			// 	"#6b3cbc",
			// 	"#8654d7",
			// 	"#a26df3",
			// 	"#c189fe",
			// 	"#e1a7ff",
			// 	"#ffc5ff",
			// ][this.course.name.length % 9];
		},
	},
	methods: {
		getColorFromString,
		getImageUrl(imageName: string) {
			// eslint-disable-next-line no-undef
			return require("@/assets/illustrations/" + imageName);
		},
	},
});
</script>

<style></style>

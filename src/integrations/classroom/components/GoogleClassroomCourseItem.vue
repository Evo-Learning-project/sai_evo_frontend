<template>
	<div
		:class="{
			'outline-success outline-4 border-transparent': selected,
		}"
		class="
			card card-border card-hoverable
			hover:border-transparent hover-shadow-elevation hover:bg-light
			duration-75
			ease-in-out
			transition-all
		"
	>
		<div class="flex items-center space-x-2 mb-6">
			<img src="@/assets/classroom.png" style="width: 25px" />
			<h4 class="">{{ course.name }}</h4>
		</div>
		<p class="overflow-hidden overflow-ellipsis mb-4">
			<a :href="course.alternateLink" target="_blank">{{ course.alternateLink }}</a>
		</p>
		<div class="flex w-full" v-if="selectable">
			<Btn
				class="ml-auto"
				:variant="'icon'"
				:outline="true"
				:tooltip="$t('misc.select')"
				:forceActive="selected"
				@click="$emit('courseSelected')"
				:class="{ 'icon-btn-success': selected }"
				><span class="text-lg material-icons-outlined"> done </span></Btn
			>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import { GoogleClassroomCourseData } from "@/integrations/classroom/interfaces";
import Btn from "@/components/ui/Btn.vue";
export default defineComponent({
	name: "GoogleClassroomCourseItem",
	props: {
		course: {
			type: Object as PropType<GoogleClassroomCourseData>,
			required: true,
		},
		selected: {
			type: Boolean,
			required: true,
		},
		selectable: {
			type: Boolean,
			default: false,
		},
	},
	methods: {},
	computed: {},
	components: { Btn },
});
</script>

<style></style>

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
			flex flex-col
		"
	>
		<div class="flex items-center space-x-2 mb-6">
			<img src="@/assets/classroom.png" style="width: 25px" />
			<h4 class="">{{ course.name }}</h4>
		</div>
		<p
			style="
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
				overflow: hidden;
			"
			v-if="course.description"
			class="mb-2 -mt-4"
		>
			{{ course.description }}
		</p>
		<p class="overflow-hidden overflow-ellipsis mb-4">
			<a :href="course.alternateLink" target="_blank">{{ course.alternateLink }}</a>
		</p>
		<div class="flex w-full mt-auto" v-if="selectable">
			<Btn
				class="ml-auto -mr-1 -mb-1"
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
			default: false,
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

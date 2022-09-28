<template>
	<div class="mt-2 mb-12">
		<!-- <div class="flex items-center mb-4 space-x-2">
			<span class="text-3xl material-icons-outlined icon-light"> manage_search </span>
			<h3 class="">{{ $t("course_list.filter_courses") }}</h3>
		</div> -->
		<div class="flex flex-col mb-3 flex-wrap md:items-center md:flex-row">
			<TextInput
				:searchBar="true"
				:leftIcon="'search'"
				:placeholder="$t('course_list.filter_courses')"
				:class="[
					!anyCourseHasPrivileges && !user.is_teacher ? 'w-full' : 'w-full  md:w-1/2',
					'mt-2 mr-auto',
				]"
				:modelValue="modelValue.name"
				@update:modelValue="emitUpdate('name', $event)"
			></TextInput>
			<Toggle
				:label-on-left="true"
				class="mt-2 mr-4"
				v-if="anyCourseHasPrivileges"
				:modelValue="modelValue.withPrivileges"
				@update:modelValue="emitUpdate('withPrivileges', $event)"
			>
				{{ $t("course_list.courses_i_teach") }}
			</Toggle>
			<Toggle
				v-if="user.is_teacher"
				class="mt-2 md:mt-4 lg:mt-2"
				:label-on-left="true"
				:modelValue="modelValue.hidden"
				@update:modelValue="emitUpdate('hidden', $event)"
			>
				{{ $t("course_list.hidden_courses") }}
			</Toggle>
		</div>
	</div>
</template>

<script lang="ts">
import { CourseSearchFilter } from "@/api/interfaces";
import { Course } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import { mapState } from "vuex";
import TextInput from "../ui/TextInput.vue";
import Toggle from "../ui/Toggle.vue";
export default defineComponent({
	name: "CourseSearchFilters",
	props: {
		modelValue: {
			type: Object as PropType<CourseSearchFilter>,
			required: true,
		},
	},
	methods: {
		emitUpdate(key: keyof CourseSearchFilter, value: unknown) {
			this.$emit("update:modelValue", {
				...this.modelValue,
				[key]: value,
			});
		},
	},
	computed: {
		...mapState("shared", ["courses", "user"]),
		anyCourseHasPrivileges(): boolean {
			return (
				this.user.is_teacher ||
				(this.courses as Course[]).some(c => (c.privileges?.length ?? 0) > 0)
			);
		},
	},
	components: { TextInput, Toggle },
});
</script>

<style></style>

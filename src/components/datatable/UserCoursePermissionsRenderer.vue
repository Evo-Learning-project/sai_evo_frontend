<template>
	<div
		class="mt-1 overflow-x-auto pt-1"
		:class="{ 'pb-4 -mt-1': privileges.length === 0 }"
	>
		<Chipset
			:compact="true"
			:options="privilegesAsOptions"
			:modelValue="[]"
			:filled="true"
			:wrap="false"
		></Chipset>
		<Btn
			v-if="privileges.length === 0"
			:variant="'icon'"
			:size="'sm'"
			:outline="true"
			class="opacity-40 hover:opacity-100 transition-opacity duration-100 -mt-1"
		>
			<span class="material-icons-outlined">add_circle_outline</span></Btn
		>
	</div>
</template>

<script lang="ts">
import { CoursePrivilege } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import { icons as coursePrivilegeIcons } from "@/assets/coursePrivilegeIcons";
import Chipset from "../ui/Chipset.vue";
import { SelectableOption } from "@/interfaces";
import { getTranslatedString as _ } from "@/i18n";
import Btn from "../ui/Btn.vue";
export default defineComponent({
	name: "UserCoursePermissionsRenderer",
	props: {
		params: {
			type: Object as PropType<{
				value: CoursePrivilege[];
			}>,
			required: true,
		},
	},
	data() {
		return {
			coursePrivilegeIcons,
		};
	},
	methods: {},
	computed: {
		privileges() {
			return this.params.value ?? [];
		},
		privilegesAsOptions(): SelectableOption[] {
			return this.privileges.map(p => ({
				value: p,
				content: _("course_privileges_short." + p),
				icons: this.coursePrivilegeIcons[p],
			}));
		},
	},
	components: { Chipset, Btn },
});
</script>

<style></style>

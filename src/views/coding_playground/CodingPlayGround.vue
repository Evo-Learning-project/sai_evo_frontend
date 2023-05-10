<template>
	<div>CodingPlayGround</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import { courseIdMixin } from "../../mixins";
export default defineComponent({
	name: "CodingPlayGround",
	mixins: [courseIdMixin],
	props: {},
	async created() {
		if (!(await this.isPlaygroundEnabled())) {
			// TODO redirect to course page
		}
	},
	methods: {
		async isPlaygroundEnabled() {
			// TODO implement
			return true;
		},
	},
	computed: {},
});
</script>

<style></style>

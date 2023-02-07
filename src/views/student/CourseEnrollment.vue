<template>
	<div>
		<Dialog :showDialog="true" :loading="true">
			<template v-slot:title>Iscrizione</template>
			<template v-slot:body>Vuoi iscriverti a {{ currentCourse.name }}?</template>
		</Dialog>
	</div>
</template>

<script lang="ts">
import Dialog from "@/components/ui/Dialog.vue";
import { courseIdMixin } from "@/mixins";
import { defineComponent, PropType } from "@vue/runtime-core";
export default defineComponent({
	name: "CourseEnrollment",
	props: {},
	mixins: [courseIdMixin],
	methods: {},
	computed: {},
	components: { Dialog },
});
</script>

<style></style>

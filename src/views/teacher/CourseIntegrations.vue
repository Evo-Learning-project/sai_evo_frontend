<template>
	<!-- for now it's only Classroom-->
	<GoogleClassroomIntegrationSettings />
</template>

<script lang="ts">
import GoogleClassroomIntegrationSettings from "@/integrations/classroom/views/GoogleClassroomIntegrationSettings.vue";
import { defineComponent, PropType } from "@vue/runtime-core";
export default defineComponent({
	name: "CourseIntegrations",
	props: {},
	methods: {},
	computed: {},
	components: { GoogleClassroomIntegrationSettings },
});
</script>

<style></style>

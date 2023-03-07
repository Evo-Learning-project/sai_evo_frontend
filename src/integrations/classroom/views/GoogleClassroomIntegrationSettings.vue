<template>
	<div>
		<div class="flex items-center space-x-3 mb-12">
			<img src="@/assets/classroom.png" style="width: 35px" />
			<h3>Google Classroom</h3>
		</div>
		<!-- display a button to get authorization if it hasn't been
            granted yet-->
		<GoogleScopeChecker
			class="flex flex-col items-center"
			:scopes="classroomScopes"
			@scopesOk="scopesVerified = true"
		></GoogleScopeChecker>
		<!-- actual settings once the integration is enabled-->
		<div v-if="scopesVerified && !integrationEnabled">
			<Toggle :labelOnLeft="true">{{ $t("integrations.classroom.enable") }}</Toggle>
		</div>
		<div v-if="scopesVerified"></div>
	</div>
</template>

<script lang="ts">
import GoogleScopeChecker from "@/integrations/components/GoogleScopeChecker.vue";
import { courseIdMixin } from "@/mixins";
import { defineComponent, PropType } from "@vue/runtime-core";
import { CLASSROOM_TEACHER_SCOPES } from "@/integrations/classroom/const";
import Toggle from "@/components/ui/Toggle.vue";
export default defineComponent({
	name: "GoogleClassroomIntegrationSettings",
	props: {},
	mixins: [courseIdMixin],
	data() {
		return {
			scopesVerified: false,
			classroomScopes: CLASSROOM_TEACHER_SCOPES,
		};
	},
	methods: {},
	computed: {
		integrationEnabled() {
			return false;
		},
	},
	components: { GoogleScopeChecker, Toggle },
});
</script>

<style></style>

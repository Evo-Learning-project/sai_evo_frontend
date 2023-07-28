<template>
	<div>
		<Dialog
			@yes="onEnroll()"
			:disableOk="enrolling"
			:dismissible="false"
			@no="onCancel()"
			:showDialog="true"
			:loading="enrolling"
			:yesText="enrolling ? $t('misc.wait') : $t('enrollment.enroll')"
			:noText="$t('dialog.default_cancel_text')"
		>
			<template v-slot:title>{{ $t("enrollment.enrollment") }}</template>
			<template v-slot:body
				>{{ $t("enrollment.do_you_want_to_enroll") }}
				<span v-if="currentCourse.name">
					{{ currentCourse.name }}
				</span>
				<span style="filter: blur(5px)" class="opacity-50" v-else>course name</span
				>?</template
			>
		</Dialog>
	</div>
</template>

<script lang="ts">
import Dialog from "@/components/ui/Dialog.vue";
import { courseIdMixin } from "@/mixins";
import { useMainStore } from "@/stores/mainStore";
import { useMetaStore } from "@/stores/metaStore";
import { setErrorNotification } from "@/utils";
import { defineComponent, PropType } from "@vue/runtime-core";
import { mapStores } from "pinia";
import { Course } from "../../models";
export default defineComponent({
	name: "CourseEnrollment",
	props: {},
	watch: {
		currentCourse(newVal: Course | undefined) {
			if (newVal?.enrolled) {
				this.$router.push({ name: "StudentCourseDashboard" });
			}
		},
	},
	data() {
		return {
			enrolling: false,
		};
	},
	mixins: [courseIdMixin],
	methods: {
		async onEnroll() {
			this.enrolling = true;
			try {
				await this.mainStore.selfEnrollInCourse({ courseId: this.courseId });
				if (this.$router.currentRoute.value.query.redirect) {
					this.$router.push(this.$router.currentRoute.value.query.redirect as string);
				} else {
					this.$router.push({ name: "StudentCourseList" });
				}
				this.metaStore.showSuccessFeedback();
			} catch (e) {
				setErrorNotification(e);
			} finally {
				this.enrolling = false;
			}
		},
		onCancel() {
			this.$router.push({ name: "StudentCourseList" });
		},
	},
	computed: {
		...mapStores(useMainStore, useMetaStore),
	},
	components: { Dialog },
});
</script>

<style></style>

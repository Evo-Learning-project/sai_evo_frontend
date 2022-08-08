<template>
	<div>
		<Card class="mb-8 border-none shadow-elevation" :filled="true" :hoverable="false">
			<template v-slot:body>
				<div class="flex items-center space-x-2">
					<span class="material-icons-outlined icon-light"> people </span>
					<p>
						<span class="text-muted">{{ $t("course_insights.active_students") }}:</span>
						{{ users.length }}
					</p>
				</div>
				<div class="flex items-center my-4 space-x-2">
					<span class="material-icons-outlined icon-light"> fitness_center </span>
					<p>
						<span class="text-muted">{{ $t("course_insights.practice_sessions") }}:</span>
						&nbsp;<em>(coming soon)</em
						><!--{{ practiceParticipations.length }}-->
					</p>
				</div>
				<div class="flex items-center space-x-2">
					<span class="material-icons-outlined icon-light"> topic </span>
					<p>
						<span class="text-muted">{{ $t("course_insights.exercises") }}:</span>
						&nbsp;<em>(coming soon)</em>
						<!-- {{ users.length }} -->
					</p>
				</div>
			</template>
		</Card>
		<h3>{{ $t("course_insights.active_students") }}</h3>
		<p class="text-muted">
			{{ $t("course_insights.active_students_description") }}
		</p>
		<div v-if="!loading && users.length === 0" class="flex flex-col items-center mt-8">
			<p style="font-size: 6rem" class="material-icons-outlined opacity-10">person_off</p>
			<h2 class="opacity-40">{{ $t("course_insights.no_active_students") }}</h2>
		</div>
		<div class="grid grid-cols-1 gap-3 mt-4 md:grid-cols-3">
			<StudentCard class="mb-auto" v-for="user in users" :key="'active-user-' + user.id" :user="user"></StudentCard>
		</div>
	</div>
</template>

<script lang="ts">
import { createNamespacedHelpers } from "vuex";
const { mapActions, mapState } = createNamespacedHelpers("teacher");
import { courseIdMixin, loadingMixin } from "@/mixins";
import { defineComponent, PropType } from "@vue/runtime-core";
import StudentCard from "@/components/shared/StudentCard.vue";
import Card from "@/components/ui/Card.vue";
export default defineComponent({
	name: "CourseInsights",
	mixins: [courseIdMixin, loadingMixin],
	props: {},
	async created() {
		await this.withLoading(async () => await this.getCourseActiveUsers({ courseId: this.courseId }));
	},
	methods: {
		...mapActions(["getCourseActiveUsers"]),
	},
	computed: {
		...mapState(["users"]),
		practiceParticipations() {
			return [];
		},
	},
	components: { StudentCard, Card },
});
</script>

<style></style>

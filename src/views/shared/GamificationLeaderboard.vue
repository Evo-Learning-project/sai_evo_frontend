<template>
	<div>
		<div
			:class="{ 'bg-gray-50': index % 2 }"
			class="py-3 px-3 w-full flex items-center"
			v-for="(user, index) in users"
			:key="'leaderboard-user-' + index"
		>
			<div
				class="mr-2"
				:class="{
					'text-yellow-400': index === 0,
					'text-gray-400': index === 1,
					'text-yellow-900': index === 2,
					'opacity-0': index >= 3,
				}"
			>
				<svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
					<path
						fill="currentColor"
						d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5M19 19C19 19.6 18.6 20 18 20H6C5.4 20 5 19.6 5 19V18H19V19Z"
					/>
				</svg>
			</div>
			<p class="text-lg mr-4">{{ user.full_name }}</p>
			<p class="ml-auto material-icons text-primary text-base mr-1">auto_awesome</p>
			<p class="font-semibold">{{ user.reputation }}</p>
		</div>
	</div>
</template>

<script lang="ts">
import { getCourseLeaderboard } from "@/api";
import { courseIdMixin, loadingMixin } from "@/mixins";
import { GamificationUser } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import { mapState, mapActions } from "vuex";

export default defineComponent({
	name: "GamificationLeaderboard",
	props: {},
	mixins: [loadingMixin, courseIdMixin],
	async created() {
		await this.withLoading(async () => {
			await this.getCourseGamificationContext({ courseId: this.courseId });
			this.users = await getCourseLeaderboard(this.gamificationContext.id);
		});
	},
	methods: {
		...mapActions("shared", ["getCourseGamificationContext"]),
	},
	data() {
		return {
			users: [] as GamificationUser[],
		};
	},
	computed: {
		...mapState("shared", ["user", "gamificationContext"]),
	},
});
</script>

<style></style>

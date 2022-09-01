<template>
	<div v-if="!firstLoading" class="">
		<div class="flex flex-col h-full">
			<div class="">
				<div
					:class="{ 'bg-gray-50': index % 2, 'opacity-60': loading }"
					class="py-3 px-3 w-full flex items-center h-full"
					v-for="(user, index) in paginatedUsers?.data"
					:key="'leaderboard-user-' + index"
				>
					<div
						class="mr-2"
						:class="{
							'text-yellow-400': index === 0,
							'text-gray-400': index === 1,
							'text-yellow-900': index === 2,
							'opacity-0': pageNumber > 1 || index >= 3,
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

			<div class="flex items-center space-x-1 mt-4" v-if="lastPageNumber > 1">
				<div v-for="page in pageNumbers" :key="'page-btn-' + page">
					<Btn
						v-if="page !== pageNumber"
						:size="'xs'"
						@click="pageNumber = page"
						:variant="'primary-borderless'"
						>{{ page }}</Btn
					>
					<p class="opacity-60 text-primary-light font-medium text-lg px-1" v-else>
						{{ page }}
					</p>
				</div>
			</div>
		</div>
	</div>
	<div v-else>
		<SlotSkeleton />
		<SlotSkeleton />
	</div>
</template>

<script lang="ts">
import { getCourseLeaderboard, PaginatedData } from "@/api";
import { courseIdMixin, loadingMixin } from "@/mixins";
import { GamificationUser } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import { mapState, mapActions } from "vuex";
import SlotSkeleton from "@/components/ui/skeletons/SlotSkeleton.vue";
import Btn from "@/components/ui/Btn.vue";

export default defineComponent({
	name: "GamificationLeaderboard",
	props: {},
	mixins: [loadingMixin, courseIdMixin],
	async created() {
		await this.withFirstLoading(async () => {
			await this.getCourseGamificationContext({ courseId: this.courseId });
			this.paginatedUsers = await getCourseLeaderboard(
				this.gamificationContext.id,
				this.pageNumber,
			);
			this.pageSize = this.paginatedUsers.data.length;
		});
	},
	watch: {
		async pageNumber() {
			await this.withLoading(async () => {
				await this.getCourseGamificationContext({ courseId: this.courseId });
				this.paginatedUsers = await getCourseLeaderboard(
					this.gamificationContext.id,
					this.pageNumber,
				);
			});
		},
	},
	methods: {
		...mapActions("shared", ["getCourseGamificationContext"]),
	},
	data() {
		return {
			paginatedUsers: null as PaginatedData<GamificationUser> | null,
			pageNumber: 1,
			pageSize: 1,
		};
	},
	computed: {
		...mapState("shared", ["user", "gamificationContext"]),
		lastPageNumber() {
			return Math.ceil((this.paginatedUsers?.count ?? 0) / this.pageSize);
		},
		pageNumbers() {
			return [...Array(this.lastPageNumber).keys()].map(p => p + 1);
		},
	},
	components: { SlotSkeleton, Btn },
});
</script>

<style></style>

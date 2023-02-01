<template>
	<div v-if="!firstLoading" class="">
		<div class="flex flex-col h-full" v-if="(paginatedUsers?.count ?? 0) > 0">
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
							'text-yellow-400': pageNumber === 1 && index === 0,
							'text-gray-400': pageNumber === 1 && index === 1,
							'text-bronze': pageNumber === 1 && index === 2,
							'opacity-0': loading,
						}"
					>
						<div style="width: 34px; height: 34px" class="relative">
							<svg
								v-if="pageNumber === 1 && index < 3"
								style="width: 34px; height: 34px"
								viewBox="0 0 24 24"
							>
								<path
									fill="currentColor"
									d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5M19 19C19 19.6 18.6 20 18 20H6C5.4 20 5 19.6 5 19V18H19V19Z"
								/>
							</svg>
							<p
								:class="{
									'font-medium opacity-90 text-sm drop-shadow-lg filter':
										pageNumber === 1 && index < 3,
									'text-yellow-800': pageNumber === 1 && index === 0,
									'text-gray-900': pageNumber === 1 && index === 1,
									'text-yellow-900': pageNumber === 1 && index === 2,
								}"
								class="
									absolute
									top-1/2
									left-1/2
									-translate-x-1/2 -translate-y-1/2
									transform
									text-muted
									opacity-50
								"
							>
								{{ getUserPosition(user.id) }}
							</p>
						</div>
					</div>
					<Avatar class="mr-2 ml-4" :user="user" />
					<p class="text-lg mr-4">{{ user.full_name }}</p>
					<p class="ml-auto material-icons text-primary text-base mr-1">auto_awesome</p>
					<p class="font-semibold">{{ user.reputation }}</p>
				</div>
			</div>

			<div class="flex items-center space-x-1 mt-4 flex-wrap" v-if="lastPageNumber > 1">
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
		<div v-else class="flex flex-col items-center w-full mx-auto mt-32">
			<p style="font-size: 10rem" class="material-icons-outlined opacity-10">
				leaderboard
			</p>
			<h2 class="opacity-40">{{ $t("gamification.no_leaderboard") }}</h2>
		</div>
	</div>
	<div v-else>
		<SlotSkeleton />
		<SlotSkeleton />
		<SlotSkeleton />
	</div>
</template>

<script lang="ts">
// TODO test this component after migrating to pinia
import { getCourseLeaderboard, PaginatedData } from "@/api";
import { courseIdMixin, loadingMixin } from "@/mixins";
import { GamificationUser } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import SlotSkeleton from "@/components/ui/skeletons/SlotSkeleton.vue";
import Btn from "@/components/ui/Btn.vue";
import { logAnalyticsEvent } from "@/utils";
import { mapStores } from "pinia";
import { useMetaStore } from "@/stores/metaStore";
import { useMainStore } from "@/stores/mainStore";
import Avatar from "@/components/ui/Avatar.vue";

export default defineComponent({
	name: "GamificationLeaderboard",
	props: {},
	mixins: [loadingMixin, courseIdMixin],
	async created() {
		await this.withFirstLoading(async () => {
			await this.mainStore.getCourseGamificationContext({ courseId: this.courseId });
			if (this.mainStore.gamificationContext) {
				this.paginatedUsers = await getCourseLeaderboard(
					this.mainStore.gamificationContext.id,
					this.pageNumber,
				);
				this.pageSize = this.paginatedUsers.data.length;
			}
			logAnalyticsEvent("viewedLeaderboard", { courseId: this.courseId });
		});
	},
	watch: {
		async pageNumber() {
			await this.withLoading(async () => {
				await this.mainStore.getCourseGamificationContext({ courseId: this.courseId });
				this.paginatedUsers = await getCourseLeaderboard(
					this.mainStore.gamificationContext?.id ?? "",
					this.pageNumber,
				);
			});
		},
	},
	methods: {
		getUserPosition(userId: string) {
			return (
				this.pageSize * (this.pageNumber - 1) +
				this.paginatedUsers?.data.findIndex(u => u.id == userId) +
				1
			);
		},
	},
	data() {
		return {
			paginatedUsers: null as PaginatedData<GamificationUser> | null,
			pageNumber: 1,
			pageSize: 1,
		};
	},
	computed: {
		...mapStores(useMainStore, useMetaStore),
		lastPageNumber() {
			return Math.ceil((this.paginatedUsers?.count ?? 0) / this.pageSize);
		},
		pageNumbers() {
			return [...Array(this.lastPageNumber).keys()].map(p => p + 1);
		},
	},
	components: { SlotSkeleton, Btn, Avatar },
});
</script>

<style></style>

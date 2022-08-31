<template>
	<div class="mt-2">
		<!-- goals -->
		<!-- <h3 class="mb-4">Obiettivi</h3> -->
		<h3>{{ $t("gamification.goals") }}</h3>
		<div class="mb-6" v-for="goal in sortedGoals" :key="'goal-' + goal.id">
			<div class="flex items-center space-x-2">
				<h5 class="text-lg font-medium">{{ goal.name }}</h5>
				<p class="text-sm text-muted -mb-1.25px">
					Livello attuale:
					<strong>{{ progressByGoalId[goal.id]?.current_level ?? 0 }}</strong>
				</p>
			</div>
			<div>
				<p class="mb-1">Per il prossimo livello:</p>
				<div class="grid grid-cols-3 gap-x-6">
					<div
						class="flex flex-col items-center whitespace-normal space-y-1"
						v-for="(requirement, index) in getNextLevel(goal)?.requirements ?? []"
						:key="'goal-' + goal.id + '-req-' + index"
					>
						<CircularProgress
							v-if="!loadingProgressByGoalId[goal.id]"
							:size="'sm'"
							:value="getActionCount(goal, requirement.action)"
							:total="requirement.amount"
						/><Spinner :size="'lg'" v-else />
						<p class="text-muted text-xs text-center">
							{{ $t("gamification.actions." + requirement.action) }}
							<!-- ({{ requirement.amount }}) -->
						</p>
					</div>
				</div>
			</div>
		</div>

		<!-- TODO sticky footer -->
		<!-- reputation & leaderboard-->
		<div class="flex items-center mt-6 pt-6 border-t border-gray-200">
			<!-- <p>{{ $t("gamification.your_reputation") }}</p> -->
			<p class="material-icons mr-1.5 text-primary">auto_awesome</p>
			<p class="font-semibold text-lg">{{ gamificationContext?.reputation ?? 0 }}</p>
			<!-- <p class="ml-4">{{ $t("gamification.your_leaderboard_position") }}</p> -->
			<!-- TODO plug in actual number -->
			<p class="ml-4 mr-1.5 material-icons-outlined text-primary">leaderboard</p>
			<p class="text-lg">1</p>
			<p class="ml-1 text-yellow-400 -mt-1">
				<!-- <svg style="width: 18px; height: 18px" viewBox="0 0 24 24">
									<path
										fill="currentColor"
										d="M12 1L21 5V11C21 16.55 17.16 21.74 12 23C6.84 21.74 3 16.55 3 11V5L12 1M16 14H8V15.5C8 15.77 8.19 15.96 8.47 16L8.57 16H15.43C15.74 16 15.95 15.84 16 15.59L16 15.5V14M17 8L17 8L14.33 10.67L12 8.34L9.67 10.67L7 8L7 8L8 13H16L17 8Z"
									/>
								</svg> -->
				<svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
					<path
						fill="currentColor"
						d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5M19 19C19 19.6 18.6 20 18 20H6C5.4 20 5 19.6 5 19V18H19V19Z"
					/>
				</svg>
			</p>
			<div class="ml-4 flex items-center flex-wrap space-x-0.5">
				<GamificationBadge class="text-primary" />
				<GamificationBadge class="text-primary" />
				<GamificationBadge class="text-primary-light" />
				<GamificationBadge class="text-primary-dark" />
				<GamificationBadge class="text-secondary" />
				<GamificationBadge class="text-success" />
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import {
	ActionCount,
	GamificationAction,
	Goal,
	GoalLevel,
	GoalProgress,
} from "@/gamification";
import { defineComponent, PropType } from "@vue/runtime-core";
import { mapActions, mapState } from "vuex";
import CircularProgress from "../ui/CircularProgress.vue";
import Spinner from "../ui/Spinner.vue";
import GamificationBadge from "../ui/GamificationBadge.vue";
export default defineComponent({
	name: "GamificationContextPanel",
	props: {},
	async created() {
		this.gamificationContextGoals.forEach(async (g: Goal) => {
			this.loadingProgressByGoalId[g.id] = true;
			await this.getGamificationGoalProgress({
				contextId: this.contextId,
				goalId: g.id,
			});
			this.loadingProgressByGoalId[g.id] = false;
		});
	},
	data() {
		return {
			loadingProgressByGoalId: {} as Record<string, boolean>,
		};
	},
	methods: {
		...mapActions("shared", [
			"getGamificationContextGoals",
			"getGamificationGoalProgress",
		]),
		getNextLevel(goal: Goal): GoalLevel | undefined {
			return goal.levels.find(
				l => l.level_value === (this.progressByGoalId[goal.id]?.current_level ?? 0) + 1,
			);
		},
		getActionCount(goal: Goal, action: GamificationAction) {
			const progress = this.progressByGoalId[goal.id] as GoalProgress | undefined;
			if (!progress) {
				return 0;
			}
			return progress.action_counts.find(c => c.action === action)?.amount ?? 0;
		},
		getPercentageRequirementProgress(goal: Goal, requirement: ActionCount): number {
			const count = this.getActionCount(goal, requirement.action);
			return (count / requirement.amount) * 100;
		},
	},
	computed: {
		...mapState("shared", [
			"gamificationContextGoals",
			"progressByGoalId",
			"gamificationContext",
		]),
		sortedGoals(): Goal[] {
			return this.gamificationContextGoals;
		},
		contextId(): string {
			return this.gamificationContext.id;
		},
	},
	components: { CircularProgress, Spinner, GamificationBadge },
});
</script>

<style></style>

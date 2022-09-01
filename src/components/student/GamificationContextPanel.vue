<template>
	<div class="mt-2">
		<!-- goals -->
		<!-- <h3 class="mb-4">Obiettivi</h3> -->
		<h3 class="mb-4">{{ $t("gamification.goals") }}</h3>
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
		<div class="flex flex-col -mt-12" v-if="sortedGoals.length === 0">
			<p style="font-size: 10rem" class="opacity-10 mx-auto">
				<svg style="width: 10rem; height: 10rem" viewBox="0 0 24 24">
					<path
						fill="currentColor"
						d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,10.84 21.79,9.69 21.39,8.61L19.79,10.21C19.93,10.8 20,11.4 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4C12.6,4 13.2,4.07 13.79,4.21L15.4,2.6C14.31,2.21 13.16,2 12,2M19,2L15,6V7.5L12.45,10.05C12.3,10 12.15,10 12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12C14,11.85 14,11.7 13.95,11.55L16.5,9H18L22,5H19V2M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12H16A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8V6Z"
					/>
				</svg>
			</p>
			<h4 class="mx-auto opacity-40 -mt-4">{{ $t("gamification.no_goals") }}</h4>
		</div>

		<!-- TODO sticky footer -->
		<!-- reputation & leaderboard-->
		<div class="flex items-center ml-1 mt-6 pt-6 border-t border-gray-200 space-x-4">
			<!-- <p>{{ }}</p> -->
			<Tooltip :placement="'top'" :textValue="$t('gamification.your_reputation')">
				<div class="flex items-center space-x-1">
					<p class="material-icons mr-1.5 text-primary">auto_awesome</p>
					<p class="font-semibold text-lg">{{ gamificationContext?.reputation ?? 0 }}</p>
				</div>
			</Tooltip>

			<Tooltip
				:placement="'top'"
				:textValue="$t('gamification.your_leaderboard_position')"
			>
				<div class="flex items-center space-x-1">
					<p class="material-icons-outlined text-primary">leaderboard</p>
					<p v-if="gamificationContext" class="text-lg">
						{{ gamificationContext.leaderboard_position }}
					</p>
					<p
						v-if="gamificationContext.leaderboard_position <= 3"
						:class="{
							'text-yellow-400': gamificationContext.leaderboard_position === 1,
							'text-gray-400': gamificationContext.leaderboard_position === 2,
							'text-yellow-900': gamificationContext.leaderboard_position === 3,
						}"
					>
						<svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
							<path
								fill="currentColor"
								d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5M19 19C19 19.6 18.6 20 18 20H6C5.4 20 5 19.6 5 19V18H19V19Z"
							/>
						</svg>
					</p>
				</div>
			</Tooltip>

			<div v-if="false" class="ml-4 flex items-center flex-wrap space-x-0.5">
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
import Tooltip from "../ui/Tooltip.vue";
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
	components: { CircularProgress, Spinner, GamificationBadge, Tooltip },
});
</script>

<style></style>

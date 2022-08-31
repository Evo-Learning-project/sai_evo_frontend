import axios from "axios";
import { Goal, GoalProgress } from "@/gamification";

export async function getContextGoals(contextId: string): Promise<Goal[]> {
	const response = await axios.get(`gamification/contexts/${contextId}/goals/`);
	return response.data;
}

export async function getGoalProgress(
	contextId: string,
	goalId: string,
): Promise<GoalProgress> {
	const response = await axios.get(
		`gamification/contexts/${contextId}/goals/${goalId}/progress/`,
	);
	return response.data;
}

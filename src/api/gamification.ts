import {
	Course,
	EventTemplateRule,
	Tag,
	Event,
	EventParticipation,
	GamificationContext,
	GamificationUser,
} from "@/models";
import axios from "axios";

export async function getCourseLeaderboard(
	contextId: string,
): Promise<GamificationUser[]> {
	const response = await axios.get(`/gamification/${contextId}/leaderboard/`);
	return response.data;
}

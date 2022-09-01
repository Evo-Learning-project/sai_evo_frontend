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
import { convertPaginatedResponseToLocalPaginatedData } from "./converters";
import { PaginatedData } from "./interfaces";

export async function getCourseLeaderboard(
	contextId: string,
	pageNumber: number,
): Promise<PaginatedData<GamificationUser>> {
	const response = await axios.get(
		`/gamification/contexts/${contextId}/leaderboard/?page=${pageNumber}`,
	);
	return convertPaginatedResponseToLocalPaginatedData(response.data, pageNumber);
}

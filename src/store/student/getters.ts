/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { EventType, Exercise } from "@/models";
import { StudentState } from "../types";

export const getters = {
	examParticipations: (state: StudentState) =>
		[
			...state.eventParticipations.filter(p => p.event.event_type === EventType.EXAM),
		].sort((p1, p2) =>
			new Date(p1.begin_timestamp) < new Date(p2.begin_timestamp) ? 1 : -1,
		),
	practiceParticipations: (state: StudentState) =>
		[
			...state.eventParticipations.filter(
				p => p.event.event_type === EventType.SELF_SERVICE_PRACTICE,
			),
		].sort((p1, p2) =>
			new Date(p1.begin_timestamp) < new Date(p2.begin_timestamp) ? 1 : -1,
		),
	exercises: (state: StudentState): Exercise[] =>
		state.currentEventParticipation?.slots.map(s => s.exercise) ?? [],
};

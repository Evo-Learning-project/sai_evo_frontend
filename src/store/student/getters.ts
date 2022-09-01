/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { EventType, Exercise } from "@/models";
import { SharedState, StudentState, TeacherState } from "../types";

export const getters = {
	examParticipations: (state: StudentState) =>
		[
			...state.eventParticipations.data.filter(
				p => p.event.event_type === EventType.EXAM,
			),
		].sort((p1, p2) =>
			new Date(p1.begin_timestamp) < new Date(p2.begin_timestamp) ? 1 : -1,
		),
	practiceParticipations: (state: StudentState) =>
		[
			...state.eventParticipations.data.filter(
				p => p.event.event_type === EventType.SELF_SERVICE_PRACTICE,
			),
		].sort((p1, p2) =>
			new Date(p1.begin_timestamp) < new Date(p2.begin_timestamp) ? 1 : -1,
		),
	// TODO refactor
	exercises: (
		state: StudentState,
		_getters: any,
		rootState: {
			shared: SharedState;
			student: StudentState;
			teacher: TeacherState;
		},
	): Exercise[] => {
		return [
			...(state.currentEventParticipation?.slots.map(s => s.exercise) ?? []),
			...state.exerciseThreads,
			...(rootState.teacher.paginatedExercises.data ?? []),
		];
	},
};

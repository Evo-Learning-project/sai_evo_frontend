/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { EventType, Event, EventTemplate, Exercise, getBlankExam, getBlankTag, Tag } from "@/models";
import { TeacherState } from "../types";

export const getters = {
	exams: (state: TeacherState): Event[] => state.events.filter(e => e.event_type == EventType.EXAM),
	event: (state: TeacherState) => (eventId: string) => state.events.find(e => e.id == eventId) ?? getBlankExam(),
	exercise: (state: TeacherState) => (exerciseId: string) => {
		const flattenedExercises = state.exercises.map(e => [e, ...(e.sub_exercises ?? [])]).flat(10);
		return flattenedExercises.find(e => e.id == exerciseId) ?? {};
	},
};

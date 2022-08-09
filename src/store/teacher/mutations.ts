/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
	EventTemplateRuleClause,
	ExerciseSolution,
	exerciseChildName,
	exerciseChildrenNames,
	EventParticipationSlot,
	EventParticipation,
	Exercise,
	User,
	Event,
	ExerciseChoice,
	ExerciseTestCase,
	EventTemplateRule,
	EventTemplate,
} from "@/models";
import { MutationPayload, TeacherState } from "../types";
import { getters } from "./getters";

export const mutations = {
	setExercises: (state: TeacherState, exercises: Exercise[]) =>
		(state.exercises = exercises),
	deleteBaseExercise: (state: TeacherState, exerciseId: string) =>
		(state.exercises = state.exercises.filter(e => e.id != exerciseId)),
	setCurrentExercisePage: (state: TeacherState, pageNumber: number) =>
		(state.currentExercisePage = pageNumber),
	setEvents: (state: TeacherState, events: Event[]) => (state.events = events),
	// sets the array of participations to the event currently being watched
	setEventParticipations: (state: TeacherState, participations: EventParticipation[]) =>
		(state.eventParticipations = participations),

	// update an event in memory with the given payload
	setEvent: (state: TeacherState, { eventId, payload }: MutationPayload<Event>) =>
		Object.assign(
			state.events.find((e: Event) => e.id == eventId),
			payload,
		),
	// update the slot with id `slotId` using the given payload
	setEventParticipationSlot: (
		state: TeacherState,
		{ participationId, slotId, payload }: MutationPayload<EventParticipationSlot>,
	) => {
		const target = state.eventParticipations
			.find((p: EventParticipation) => p.id == participationId)
			?.slots?.find((s: EventParticipationSlot) => s.id == slotId);
		console.log(target, payload);
		if (target) {
			Object.assign(target, payload);
		} else {
			console.error("setEventParticipationSlot didn't find", payload);
			throw Error();
		}
	},
	// updates the in-memory participation that has the same id as the
	// one in the payload with the given payload
	setEventParticipation: (state: TeacherState, participation: EventParticipation) => {
		const target = state.eventParticipations.find(
			(p: EventParticipation) => p.id == participation.id,
		);
		if (target) {
			Object.assign(target, participation);
		} else {
			console.error("setEventParticipation didn't find", participation);
		}
	},
	// replace the user with same id as payload user with the given payload
	setUser: (state: TeacherState, { user }: { user: User }) => {
		const target = state.users.find((u: User) => u.id == user.id);
		if (target) {
			Object.assign(target, user);
		} else {
			console.error("setUser didn't find", user);
		}
	},
	// updates the in-memory exercise with the given payload's id
	setExercise: (state: TeacherState, payload: Exercise) => {
		const targetExercise = getters.exercise(state)(payload.id) as Exercise | undefined;
		if (targetExercise) {
			Object.assign(targetExercise, payload);
		} else {
			console.error("setExercise didn't find", payload);
		}
	},
	removeExerciseChild: (
		state: TeacherState,
		{
			exerciseId,
			childType,
			childId,
		}: {
			exerciseId: string;
			childType: "choice" | "sub_exercise" | "testcase";
			childId: string;
		},
	) => {
		const targetExercise = getters.exercise(state)(exerciseId);
		const childrenName = exerciseChildrenNames[childType];
		const children = (targetExercise as Exercise | undefined)?.[childrenName];
		if (children) {
			const targetChildIndex = (
				children as (ExerciseChoice | Exercise | ExerciseTestCase)[]
			).findIndex(c => c.id == childId);
			children.splice(targetChildIndex, 1);
		} else {
			console.error("removeExerciseChild didn't find", exerciseId, childType, childId);
		}
	},
	// updates a child of the given exercises if it exists, otherwise pushes a new one
	setExerciseChild: (
		state: TeacherState,
		{
			exerciseId,
			childType,
			payload,
		}: MutationPayload<ExerciseChoice | Exercise | ExerciseTestCase | ExerciseSolution>,
	) => {
		const targetExercise = getters.exercise(state)(exerciseId as string) as Exercise;
		const childrenName = exerciseChildrenNames[childType as exerciseChildName];
		const children = (targetExercise as Exercise | undefined)?.[childrenName];
		if (children) {
			const target = (
				children as (ExerciseChoice | Exercise | ExerciseTestCase | ExerciseSolution)[]
			).find(c => c.id == payload.id);
			if (target) {
				// update child
				Object.assign(target, payload);
			} else {
				// push new child
				children.push(payload as any);
			}
		} else {
			console.error("setExerciseChild didn't find", childType, "for", exerciseId);
		}
	},
	// updates the list of elements related to an exercise (choices, sub-exercises, etc.)
	setExerciseChildren: (
		state: TeacherState,
		{
			exerciseId,
			children,
			payload,
		}: MutationPayload<ExerciseChoice[] | Exercise[] | ExerciseTestCase[]>,
	) => {
		const target = getters.exercise(state)(exerciseId as string) as Exercise | undefined;
		if (target && children) {
			target[children] = payload as any;
		} else {
			console.error("setExerciseChildren didn't find", exerciseId);
		}
	},
	patchEventTemplateRule: (
		state: TeacherState,
		{ templateId, ruleId, payload }: MutationPayload<Partial<EventTemplateRule>>,
	) => {
		const targetTemplate = state.events.find(e => e.template?.id == templateId);
		if (targetTemplate) {
			const targetRule = (targetTemplate.template as EventTemplate).rules.find(
				r => r.id == ruleId,
			);
			Object.assign(targetRule, { ...targetRule, ...payload });
		} else {
			console.error("patchEventTemplateRule didn't find", ruleId);
		}
	},
	patchEventTemplateRuleClause: (
		state: TeacherState,
		{
			templateId,
			ruleId,
			clauseId,
			payload,
		}: MutationPayload<Partial<EventTemplateRuleClause>>,
	) => {
		const target = state.events
			.find((e: Event) => e.template?.id == templateId)
			?.template?.rules?.find((r: EventTemplateRule) => r.id == ruleId)
			?.clauses?.find((c: EventTemplateRuleClause) => c.id == clauseId);
		if (target) {
			Object.assign(target, { ...target, ...payload });
		} else {
			console.error(
				"patchEventTemplateRuleClause didn't find",
				templateId,
				ruleId,
				clauseId,
			);
		}
	},
	setEventTemplateRules: (
		state: TeacherState,
		{ templateId, payload }: MutationPayload<EventTemplateRule[]>,
	) => {
		const target = state.events.find(e => e.template?.id == templateId);
		if (target) {
			(target.template as EventTemplate).rules = payload;
		} else {
			console.error("setEventTemplateRules didn't find", payload);
		}
	},
	removeEventTemplateRule: (
		state: TeacherState,
		{ templateId, ruleId }: { templateId: string; ruleId: string },
	) => {
		const target = state.events.find(e => e.template?.id == templateId);
		if (target) {
			(target.template as EventTemplate).rules = (
				target.template as EventTemplate
			).rules.filter(r => r.id != ruleId);
		} else {
			console.error("removeEventTemplateRule didn't find", templateId);
		}
	},
	removeEventTemplateRuleClause: (
		state: TeacherState,
		{
			templateId,
			ruleId,
			clauseId,
		}: { templateId: string; ruleId: string; clauseId: string },
	) => {
		const event = state.events.find(e => e.template?.id == templateId);
		const target = event?.template?.rules.find(r => r.id == ruleId);
		if (target) {
			target.clauses = target.clauses?.filter(c => c.id != clauseId);
		} else {
			console.error("removeEventTemplateRuleClause didn't find", templateId, ruleId);
		}
	},
};

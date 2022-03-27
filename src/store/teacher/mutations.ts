import { EventTemplateRuleClause } from "./../../models/interfaces";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
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
  setCurrentExercisePage: (state: TeacherState, pageNumber: number) =>
    (state.currentExercisePage = pageNumber),
  setEvents: (state: TeacherState, events: Event[]) => (state.events = events),

  // update an event in memory with the given payload
  setEvent: (
    state: TeacherState,
    { eventId, payload }: MutationPayload<Event>
  ) =>
    Object.assign(
      state.events.find((e: Event) => e.id == eventId),
      payload
    ),
  // update the slot with id `slotId` using the given payload
  setEventParticipationSlot: (
    state: TeacherState,
    {
      participationId,
      slotId,
      payload,
    }: MutationPayload<EventParticipationSlot>
  ) => {
    const target = state.eventParticipations
      .find((p: EventParticipation) => p.id == participationId)
      ?.slots?.find((s: EventParticipationSlot) => s.id == slotId);
    if (target) {
      Object.assign(target, payload);
    }
  },
  // updates the in-memory participation that has the same id as the
  // one in the payload with the given payload
  setEventParticipation: (
    state: TeacherState,
    participation: EventParticipation
  ) => {
    const target = state.eventParticipations.find(
      (p: EventParticipation) => p.id == participation.id
    );
    Object.assign(target, participation);
  },
  // sets the array of participations to the event currently being watched
  setEventParticipations: (
    state: TeacherState,
    participations: EventParticipation[]
  ) => (state.eventParticipations = participations),
  // replace the user with same id as payload user with the given payload
  setUser: (state: TeacherState, { user }: { user: User }) => {
    Object.assign(
      state.users.find((u: User) => u.id === user.id),
      user
    );
  },

  setExercise: (state: TeacherState, payload: Exercise) => {
    // look for both exercises and sub-exercises
    const flattenedExercises = state.exercises
      .map((e) => [e, ...(e.sub_exercises ?? [])])
      .flat(10);
    Object.assign(
      flattenedExercises.find((e) => e.id == payload.id),
      payload
    );
  },
  setExerciseChoice: (
    state: TeacherState,
    { exerciseId, payload }: MutationPayload<ExerciseChoice>
  ) => {
    const target = state.exercises
      .find((e) => e.id == exerciseId)
      ?.choices?.find((c) => c.id == payload.id);

    console.log(target, exerciseId, payload);
    Object.assign(target, payload);
  },
  setExerciseChild: (
    state: TeacherState,
    {
      exerciseId,
      childType,
      payload,
    }: MutationPayload<ExerciseChoice | Exercise | ExerciseTestCase>
  ) => {
    const targetExercise = getters.exercise(state)(exerciseId as string);
    //  (state.exercises as Exercise[]).find(
    //   (e) => e.id === exerciseId
    // );
    let childrenName: "choices" | "sub_exercises" | "testcases";
    switch (childType) {
      case "choice":
        childrenName = "choices";
        break;
      case "sub_exercise":
        childrenName = "sub_exercises";
        break;
      case "testcase":
        childrenName = "testcases";
        break;
      default:
        throw new Error("unreachable");
    }
    const children = (targetExercise as Exercise | undefined)?.[childrenName];
    if (children) {
      const target = (children as any)?.find((c: any) => c.id == payload.id);
      Object.assign(target, payload);
    }
  },

  // updates the list of elements related to an exercise (choices, sub-exercises, etc.)
  setExerciseChildren: (
    state: TeacherState,
    {
      exerciseId,
      children,
      payload,
    }: MutationPayload<ExerciseChoice[] | Exercise[] | ExerciseTestCase[]>
  ) => {
    const target = getters.exercise(state)(exerciseId as string) as
      | Exercise
      | undefined;
    if (target && children) {
      target[children] = payload as any;
    }
  },
  patchEventTemplateRule: (
    state: TeacherState,
    { templateId, ruleId, payload }: MutationPayload<Partial<EventTemplateRule>>
  ) => {
    const targetTemplate = state.events.find(
      (e) => e.template?.id == templateId
    );
    console.log(targetTemplate);
    if (targetTemplate) {
      const targetRule = (targetTemplate.template as EventTemplate).rules.find(
        (r) => r.id == ruleId
      );
      console.log("target RULE", targetRule, payload);
      Object.assign(targetRule, { ...targetRule, ...payload });
    }
  },
  patchEventTemplateRuleClause: (
    state: TeacherState,
    {
      templateId,
      ruleId,
      clauseId,
      payload,
    }: MutationPayload<Partial<EventTemplateRuleClause>>
  ) => {
    const target = state.events
      .find((e: Event) => e.template?.id == templateId)
      ?.template?.rules?.find((r: EventTemplateRule) => r.id == ruleId)
      ?.clauses?.find((c: EventTemplateRuleClause) => c.id == clauseId);
    Object.assign(target, { ...target, ...payload });
  },
  setEventTemplateRules: (
    state: TeacherState,
    { templateId, payload }: MutationPayload<EventTemplateRule[]>
  ) => {
    const target = state.events.find((e) => e.template?.id === templateId);
    if (target) {
      (target.template as EventTemplate).rules = payload;
    }
  },
};

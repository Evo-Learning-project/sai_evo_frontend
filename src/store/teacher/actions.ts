import { exerciseChildrenNames } from "./../../models/constants";
import { EventSearchFilter } from "./../../api/interfaces";
/* eslint-disable no-unexpected-multiline */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import axios from "axios";
import {
  Course,
  CoursePrivilege,
  Event,
  EventParticipation,
  EventParticipationSlot,
  EventTemplate,
  EventTemplateRule,
  EventTemplateRuleClause,
  EventType,
  Exercise,
  ExerciseChoice,
  ExerciseTestCase,
  Tag,
  User,
} from "@/models";
import { createCourse, getCourses, getTags, updateCourse } from "@/api/courses";

import { Commit } from "vuex";

import {
  addTagToExercise,
  createExercise,
  createExerciseChoice,
  createExerciseSubExercise,
  createExerciseTestCase,
  deleteExercise,
  deleteExerciseChoice,
  deleteExerciseSubExercise,
  deleteExerciseTestCase,
  getExerciseChoices,
  getExercises,
  removeTagFromExercise,
  updateExercise,
  updateExerciseChoice,
  updateExerciseSubExercise,
  updateExerciseTestCase,
} from "@/api/exercises";

import {
  bulkPartialUpdateEventParticipation,
  createEvent,
  createEventTemplateRule,
  createEventTemplateRuleClause,
  deleteEventTemplateRule,
  deleteEventTemplateRuleClause,
  getEvent,
  getEventParticipation,
  getEventParticipations,
  getEventParticipationSlot,
  getEvents,
  getEventTemplate,
  getEventTemplateRule,
  partialUpdateEvent,
  partialUpdateEventParticipationSlot,
  partialUpdateEventTemplateRule,
  updateEvent,
  updateEventTemplateRule,
  updateEventTemplateRuleClause,
} from "@/api/events";
import { ExerciseSearchFilter } from "@/api/interfaces";
import {
  getActiveUsersForCourse,
  getUsers,
  updateUserCoursePrivileges,
} from "@/api/users";

export const actions = {
  createCourse: async ({ commit }: { commit: Commit }, course: Course) => {
    const newCourse = await createCourse(course);
    return newCourse;
  },
  updateCourse: async ({ commit }: { commit: Commit }, course: Course) => {
    const updatedCourse = await updateCourse(course.id, course);
    commit("shared/setCourse", course, { root: true });
    return updatedCourse;
  },
  createExercise: async (
    { commit, state }: { commit: Commit; state: any },
    { courseId, exercise }: { courseId: string; exercise: Exercise }
  ) => {
    const newExercise = await createExercise(courseId, exercise);
    commit("setExercises", [newExercise, ...state.exercises]);
    return newExercise;
  },
  deleteExercise: async (
    { commit, state }: { commit: Commit; state: any },
    { courseId, exerciseId }: { courseId: string; exerciseId: string }
  ) => {
    await deleteExercise(courseId, exerciseId);
    commit("deleteBaseExercise", exerciseId);
  },
  createEvent: async (
    { commit, state }: { commit: Commit; state: any },
    { courseId, event }: { courseId: string; event: Event }
  ) => {
    const newEvent = await createEvent(courseId, event);
    commit("setEvents", [newEvent, ...state.events]);
    return newEvent;
  },
  getEventParticipations: async (
    { commit }: { commit: Commit },
    {
      courseId,
      eventId,
      includeDetails,
      forCsv,
      mutate = true,
    }: {
      courseId: string;
      eventId: string;
      includeDetails?: boolean;
      forCsv?: boolean;
      mutate: boolean;
    }
  ) => {
    const participations = await getEventParticipations(
      courseId,
      eventId,
      includeDetails,
      forCsv
    );
    if (mutate) {
      commit("setEventParticipations", participations);
    }
    return participations;
  },
  getEventParticipation: async (
    { commit }: { commit: Commit },
    {
      courseId,
      eventId,
      participationId,
    }: { courseId: string; eventId: string; participationId: string }
  ) => {
    const participation = await getEventParticipation(
      courseId,
      eventId,
      participationId
    );
    commit("setEventParticipation", participation);
  },
  updateExercise: async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    { commit }: { commit: Commit },
    { courseId, exercise }: { courseId: string; exercise: Exercise }
  ) => {
    await updateExercise(courseId, exercise.id, exercise);
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateEvent: async (
    { commit }: { commit: Commit },
    { courseId, event }: { courseId: string; event: Event }
  ) => {
    await updateEvent(courseId, event.id, event);
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  partialUpdateEvent: async (
    { commit }: { commit: Commit },
    {
      courseId,
      eventId,
      changes,
      mutate = false,
    }: {
      courseId: string;
      eventId: string;
      changes: Record<keyof Event, unknown>;
      mutate: boolean;
    }
  ) => {
    const event = await partialUpdateEvent(courseId, eventId, changes);
    if (mutate) {
      commit("setEvent", { eventId, payload: event });
    }
  },
  updateExerciseChild: async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    { commit }: { commit: Commit },
    {
      courseId,
      exerciseId,
      childType,
      payload,
      reFetch = false,
    }: {
      courseId: string;
      exerciseId: string;
      childType: "testcase" | "sub_exercise" | "choice";
      payload: ExerciseChoice | Exercise | ExerciseTestCase;
      reFetch: boolean;
    }
  ) => {
    const apiCall = {
      choice: updateExerciseChoice,
      testcase: updateExerciseTestCase,
      sub_exercise: updateExerciseSubExercise,
    }[childType];
    const childrenName = exerciseChildrenNames[childType];

    await apiCall(courseId, exerciseId, payload.id as string, payload as any);
    if (reFetch) {
      if (childType !== "choice") return;
      // TODO fix!!
      const choices = await getExerciseChoices(courseId, exerciseId);
      commit("setExerciseChildren", {
        exerciseId,
        children: "choices",
        payload: choices,
      });
    }
  },
  deleteExerciseChild: async (
    { commit }: { commit: Commit },
    {
      courseId,
      exerciseId,
      childType,
      childId,
    }: {
      courseId: string;
      exerciseId: string;
      childType: "testcase" | "sub_exercise" | "choice";
      childId: string;
    }
  ) => {
    const apiCall = {
      choice: deleteExerciseChoice,
      testcase: deleteExerciseTestCase,
      sub_exercise: deleteExerciseSubExercise,
    }[childType];
    const childrenName = exerciseChildrenNames[childType];

    await apiCall(courseId, exerciseId, childId);
    commit("removeExerciseChild", {
      exerciseId,
      childType,
      childId,
    });
  },
  deleteEventTemplateRule: async (
    { commit }: { commit: Commit },
    {
      courseId,
      templateId,
      ruleId,
    }: {
      courseId: string;
      templateId: string;
      ruleId: string;
    }
  ) => {
    await deleteEventTemplateRule(courseId, templateId, ruleId);
    commit("removeEventTemplateRule", {
      templateId,
      ruleId,
    });
  },
  deleteEventTemplateRuleClause: async (
    { commit }: { commit: Commit },
    {
      courseId,
      templateId,
      ruleId,
      clauseId,
    }: {
      courseId: string;
      templateId: string;
      ruleId: string;
      clauseId: string;
    }
  ) => {
    await deleteEventTemplateRuleClause(courseId, templateId, ruleId, clauseId);
    commit("removeEventTemplateRuleClause", {
      templateId,
      ruleId,
      clauseId,
    });
  },
  partialUpdateEventTemplateRule: async (
    { commit }: { commit: Commit },
    {
      courseId,
      templateId,
      ruleId,
      changes,
      reFetch = false,
    }: {
      courseId: string;
      templateId: string;
      ruleId: string;
      changes: Partial<EventTemplateRule>;
      reFetch: boolean;
    }
  ) => {
    await partialUpdateEventTemplateRule(courseId, templateId, ruleId, changes);

    if (reFetch) {
      const rules = (await getEventTemplate(courseId, templateId)).rules;
      commit("setEventTemplateRules", {
        templateId,
        payload: rules,
      });
    }
  },
  addExerciseChoice: async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    { commit, state, getters }: { commit: Commit; state: any; getters: any },
    {
      courseId,
      exerciseId,
      choice,
    }: {
      courseId: string;
      exerciseId: string;
      choice: ExerciseChoice;
    }
  ) => {
    const newChoice = await createExerciseChoice(courseId, exerciseId, choice);
    commit("setExerciseChild", {
      childType: "choice",
      exerciseId: exerciseId,
      payload: newChoice,
    });
    return newChoice;
  },
  addExerciseSubExercise: async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    { commit, state }: { commit: Commit; state: any },
    {
      courseId,
      exerciseId,
      subExercise,
    }: {
      courseId: string;
      exerciseId: string;
      subExercise: Exercise;
    }
  ) => {
    const newSubExercise = await createExerciseSubExercise(
      courseId,
      exerciseId,
      subExercise
    );
    commit("setExerciseChild", {
      childType: "sub_exercise",
      exerciseId: exerciseId,
      payload: newSubExercise,
    });
    return newSubExercise;
  },
  addExerciseTestCase: async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    { commit, state, getters }: { commit: Commit; state: any; getters: any },
    {
      courseId,
      exerciseId,
      testCase,
    }: {
      courseId: string;
      exerciseId: string;
      testCase: ExerciseTestCase;
    }
  ) => {
    const newTestCase = await createExerciseTestCase(
      courseId,
      exerciseId,
      testCase
    );
    commit("setExerciseChild", {
      childType: "testcase",
      exerciseId: exerciseId,
      payload: newTestCase,
    });
    return newTestCase;
  },
  getEventTemplateRule: async (
    { commit }: { commit: Commit },
    {
      courseId,
      templateId,
      ruleId,
    }: {
      courseId: string;
      templateId: string;
      ruleId: string;
    }
  ) => {
    const rule = await getEventTemplateRule(courseId, templateId, ruleId);
    commit("patchEventTemplateRule", {
      templateId,
      ruleId,
      payload: rule,
    });
  },
  addEventTemplateRule: async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    { commit, state }: { commit: Commit; state: any },
    {
      courseId,
      templateId,
      rule,
    }: {
      courseId: string;
      templateId: string;
      rule: EventTemplateRule;
    }
  ) => {
    const newRule = await createEventTemplateRule(courseId, templateId, rule);
    state.events
      .find((e: Event) => e.template?.id === templateId)
      ?.template?.rules?.push(newRule);
    return newRule;
  },
  addEventTemplateRuleClause: async (
    { commit, state }: { commit: Commit; state: any },
    {
      courseId,
      templateId,
      ruleId,
      clause,
    }: {
      courseId: string;
      templateId: string;
      ruleId: string;
      clause: EventTemplateRuleClause;
    }
  ) => {
    const newClause = await createEventTemplateRuleClause(
      courseId,
      templateId,
      ruleId,
      clause
    );
    state.events
      .find((e: Event) => e.template?.id === templateId)
      ?.template?.rules?.find((r: EventTemplateRule) => r.id === ruleId)
      ?.clauses.push(newClause);
    return newClause;
  },
  updateEventTemplateRuleClause: async (
    { commit, state }: { commit: Commit; state: any },
    {
      courseId,
      templateId,
      ruleId,
      clause,
    }: {
      courseId: string;
      templateId: string;
      ruleId: string;
      clause: EventTemplateRuleClause;
    }
  ) => {
    const updatedClause = await updateEventTemplateRuleClause(
      courseId,
      templateId,
      ruleId,
      clause
    );
    return updatedClause;
    //const target = state.events
    //   .find((e: Event) => e.template?.id === templateId)
    //   ?.template?.rules?.find((r: EventTemplateRule) => r.id === ruleId)
    //   ?.clauses?.find((c: EventTemplateRuleClause) => c.id == clause.id);

    // Object.assign(target, newClause);
  },
  getExercises: async (
    { commit, state }: { commit: Commit; state: any },
    {
      courseId,
      fromFirstPage = true,
      filters = null,
    }: {
      courseId: string;
      fromFirstPage: boolean;
      filters: ExerciseSearchFilter | null;
    }
  ) => {
    if (fromFirstPage) {
      commit("setCurrentExercisePage", 1);
    }
    const { exercises, moreResults } = await getExercises(
      courseId,
      state.currentExercisePage,
      filters
    );
    commit(
      "setExercises",
      fromFirstPage ? exercises : [...state.exercises, ...exercises]
    );
    //commit('setActiveCourseId', courseId);
    if (exercises.length > 0) {
      commit("setCurrentExercisePage", state.currentExercisePage + 1);
    }

    return moreResults;
  },
  // getTags: async (
  //   { commit }: { commit: Commit },
  //   courseId: string
  // ) => {
  //   const tags = await getTags(courseId);
  //   commit('setTags', tags);
  // },
  addExerciseTag: async (
    { commit, state }: { commit: Commit; state: any },
    {
      courseId,
      exerciseId,
      tag,
      isPublic,
    }: {
      courseId: string;
      exerciseId: string;
      tag: string;
      isPublic: boolean;
    }
  ) => {
    await addTagToExercise(courseId, exerciseId, tag, isPublic);
    const target = state.exercises.find(
      (e: Exercise) => e.id === exerciseId
    ) as Exercise;

    target[isPublic ? "public_tags" : "private_tags"]?.push({
      name: tag,
    } as Tag);
  },
  removeExerciseTag: async (
    { commit, state }: { commit: Commit; state: any },
    {
      courseId,
      exerciseId,
      tag,
      isPublic,
    }: {
      courseId: string;
      exerciseId: string;
      tag: string;
      isPublic: boolean;
    }
  ) => {
    await removeTagFromExercise(courseId, exerciseId, tag, isPublic);
    const target = state.exercises.find(
      (e: Exercise) => e.id === exerciseId
    ) as Exercise;
    target[isPublic ? "public_tags" : "private_tags"] = target[
      isPublic ? "public_tags" : "private_tags"
    ]?.filter((t) => t.name != tag);
  },
  getEvents: async (
    { commit }: { commit: Commit },
    { courseId, filters }: { courseId: string; filters?: EventSearchFilter }
  ) => {
    const events = await getEvents(courseId, filters);
    commit("setEvents", events);
  },
  getEvent: async (
    { commit, state }: { commit: Commit; state: any },
    { courseId, eventId }: { courseId: string; eventId: string }
  ) => {
    const event = await getEvent(courseId, eventId);
    commit("setEvents", [event, ...state.events]);
  },
  getUsersForCourse: async (
    // returns all users in the system and their permissions relative to given course
    { commit, state }: { commit: Commit; state: any },
    { courseId }: { courseId: string }
  ) => {
    const users = await getUsers(courseId);
    state.users = users;
  },
  getCourseActiveUsers: async (
    // returns all users that are active in given course
    { commit, state }: { commit: Commit; state: any },
    { courseId }: { courseId: string }
  ) => {
    const users = await getActiveUsersForCourse(courseId);
    state.users = users;
  },
  updateUserCoursePrivileges: async (
    { commit, state }: { commit: Commit; state: any },
    {
      courseId,
      userId,
      privileges,
    }: {
      courseId: string;
      userId: string;
      privileges: CoursePrivilege[];
    }
  ) => {
    const user = await updateUserCoursePrivileges(courseId, userId, privileges);
    commit("setUser", { user });
  },
  partialUpdateEventParticipation: async (
    { commit }: { commit: Commit },
    {
      courseId,
      changes,
      eventId,
      participationIds,
    }: {
      courseId: string;
      eventId: string;
      changes: Record<keyof EventParticipation, unknown>;
      participationIds: string[];
    }
  ) => {
    const response = await bulkPartialUpdateEventParticipation(
      courseId,
      eventId,
      participationIds,
      changes
    );
    response.forEach((p) => commit("setEventParticipation", p));
  },
  getEventParticipationSlot: async (
    { commit }: { commit: Commit },
    {
      courseId,
      eventId,
      participationId,
      slotId,
    }: {
      courseId: string;
      eventId: string;
      participationId: string;
      slotId: string;
    }
  ) => {
    const response = await getEventParticipationSlot(
      courseId,
      eventId,
      participationId,
      slotId
    );
    commit("setEventParticipationSlot", {
      slotId,
      payload: response,
      participationId,
    });
  },
  partialUpdateEventParticipationSlot: async (
    { commit, state }: { commit: Commit; state: any },
    {
      courseId,
      eventId,
      participationId,
      slotId,
      changes,
      // true if action mutates the store state to reflect changes,
      //false if action only dispatches api call
      mutate = true,
    }: {
      courseId: string;
      eventId: string;
      participationId: string;
      slotId: string;
      changes: Record<keyof EventParticipationSlot, unknown>;
      mutate: boolean;
    }
  ) => {
    const response = await partialUpdateEventParticipationSlot(
      courseId,
      eventId,
      participationId, //state.eventParticipation?.id,
      slotId,
      changes
    );
    if (mutate) {
      commit("setEventParticipationSlot", {
        slotId,
        payload: response,
        participationId,
      });
    }
    return response;
  },
};

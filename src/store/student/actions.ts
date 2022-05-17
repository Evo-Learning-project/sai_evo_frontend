/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  Event,
  EventParticipation,
  EventParticipationSlot,
  EventTemplateRule,
  EventTemplateRuleClause,
} from "@/models";

import { Commit } from "vuex";

import {
  createEvent,
  createEventTemplateRule,
  createEventTemplateRuleClause,
  getEvent,
  getEventParticipation,
  moveEventParticipationCurrentSlotCursor,
  partialUpdateEventParticipation,
  partialUpdateEventParticipationSlot,
  partialUpdateEventTemplateRule,
  participateInEvent,
  runEventParticipationSlotCode,
  updateEventTemplateRule,
  updateEventTemplateRuleClause,
} from "@/api/events";
import { StudentState } from "../types";

export const actions = {
  participateInEvent: async (
    { commit }: { commit: Commit },
    { courseId, eventId }: { courseId: string; eventId: string }
  ) => {
    const participation = await participateInEvent(courseId, eventId);
    commit("setCurrentEventParticipation", participation);
  },
  moveEventParticipationCurrentSlotCursorForward: async (
    { commit, state }: { commit: Commit; state: StudentState },
    { courseId }: { courseId: string }
  ) => {
    const slot = await moveEventParticipationCurrentSlotCursor(
      courseId,
      (state.currentEventParticipation as EventParticipation).event.id,
      (state.currentEventParticipation as EventParticipation).id,
      "forward"
    );
    commit("setEventParticipationSlots", [slot]);
  },
  moveEventParticipationCurrentSlotCursorBack: async (
    { commit, state }: { commit: Commit; state: StudentState },
    { courseId }: { courseId: string }
  ) => {
    const slot = await moveEventParticipationCurrentSlotCursor(
      courseId,
      (state.currentEventParticipation as EventParticipation).event.id,
      (state.currentEventParticipation as EventParticipation).id,
      "back"
    );
    commit("setEventParticipationSlots", [slot]);
  },
  getEvent: async (
    { commit }: { commit: Commit },
    { courseId, eventId }: { courseId: string; eventId: string }
  ) => {
    console.log("DATA: ", courseId, eventId);
    const event = await getEvent(courseId, eventId);
    commit("setPreviewingEvent", event);
  },
  createEvent: async (
    { commit, state }: { commit: Commit; state: StudentState },
    { courseId, event }: { courseId: string; event: Event }
  ) => {
    const newEvent = await createEvent(courseId, event);
    //commit('setEvents', [newEvent, ...state.events]);
    return newEvent;
  },
  partialUpdateEventParticipation: async (
    { commit, state }: { commit: Commit; state: StudentState },
    {
      courseId,
      eventId = undefined,
      participationId = undefined,
      changes,
    }: {
      courseId: string;
      eventId?: string;
      participationId?: string;
      changes: Record<keyof EventParticipation, unknown>;
    }
  ) => {
    const response = await partialUpdateEventParticipation(
      courseId,
      eventId ??
        (state.currentEventParticipation as EventParticipation).event.id,
      participationId ??
        (state.currentEventParticipation as EventParticipation).id,
      changes
    );
    if (!eventId && !participationId) {
      // no id supplied, update default participation
      commit("setCurrentEventParticipation", response);
    } else {
      commit("setEventParticipation", response);
    }
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
    commit("setCurrentEventParticipation", participation);
  },
  partialUpdateEventParticipationSlot: async (
    { commit, state }: { commit: Commit; state: StudentState },
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
      changes,
      true
    );
    if (mutate) {
      commit("setCurrentEventParticipationSlot", response);
    }
  },
  runEventParticipationSlotCode: async (
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
    const response = await runEventParticipationSlotCode(
      courseId,
      eventId,
      participationId,
      slotId
    );
    commit("setCurrentEventParticipationSlot", response);
    //    commit("patchCurrentEventParticipationSlot", { slotId, changes: response });
    return response;
  },
  addEventTemplateRule: async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    { commit }: { commit: Commit },
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
    commit("setEditingEventTemplateRule", newRule);

    return newRule;
  },
  partialUpdateEventTemplateRule: async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    { commit }: { commit: Commit },
    {
      courseId,
      templateId,
      ruleId,
      changes,
    }: {
      courseId: string;
      templateId: string;
      ruleId: string;
      changes: Partial<EventTemplateRule>;
    }
  ) => {
    const updatedRule = await partialUpdateEventTemplateRule(
      courseId,
      templateId,
      ruleId,
      changes
    );
    return updatedRule;
  },
  addEventTemplateRuleClause: async (
    { commit, state }: { commit: Commit; state: StudentState },
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
    commit("setEditingEventTemplateRuleClause", {
      ruleId,
      payload: newClause,
    });
    return newClause;
  },
  updateEventTemplateRuleClause: async (
    { commit, state }: { commit: Commit; state: StudentState },
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
  },
};

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  EventParticipation,
  EventParticipationSlot,
  EventTemplate,
  EventTemplateRule,
  Event,
  EventTemplateRuleClause,
} from "@/models";
import { MutationPayload, StudentState } from "../types";

export const mutations = {
  // update the slots of the current event participation
  setEventParticipationSlots: (
    state: StudentState,
    slots: EventParticipationSlot[]
  ) => {
    if (state.currentEventParticipation) {
      state.currentEventParticipation.slots = slots;
    }
  },
  setEventParticipations: (
    state: StudentState,
    participations: EventParticipation[]
  ) => (state.eventParticipations = participations),
  setEventParticipation: (
    state: StudentState,
    participation: EventParticipation
  ) => {
    const target = state.eventParticipations.find(
      (p) => p.id == participation.id
    );
    if (!target) {
      console.log(
        "setEventParticipation in student didn't find",
        participation.id
      );
    } else {
      Object.assign(target, participation);
    }
  },
  setCurrentEventParticipation: (
    state: StudentState,
    participation: EventParticipation
  ) => (state.currentEventParticipation = participation),
  setCurrentEventParticipationSlot: (
    state: StudentState,
    slot: EventParticipationSlot
  ) => {
    console.log("inside set mutation", slot);

    // look for both slots and sub-slots
    const flattenedSlots = (
      state.currentEventParticipation as EventParticipation
    ).slots
      .map((e) => [e, ...(e.sub_slots ?? [])])
      .flat(10);
    const target = flattenedSlots.find(
      (s: EventParticipationSlot) => s.id == slot.id
    );
    Object.assign(target, slot);
  },
  patchCurrentEventParticipationSlot: (
    state: StudentState,
    {
      slotId,
      changes,
    }: { slotId: string; changes: Partial<EventParticipationSlot> }
  ) => {
    console.log("inside patch mutation", slotId, changes);
    // look for both slots and sub-slots
    const flattenedSlots = (
      state.currentEventParticipation as EventParticipation
    ).slots
      .map((e) => [e, ...(e.sub_slots ?? [])])
      .flat(10);
    const target = flattenedSlots.find(
      (s: EventParticipationSlot) => s.id == slotId
    );
    Object.assign(target, { ...target, ...changes });
  },

  // updates the event currently being previewed
  setPreviewingEvent: (state: StudentState, event: Event | null) =>
    (state.previewingEvent = event),
  // updates the event template currently being edited
  setEditingEvent: (state: StudentState, event: Event | null) =>
    (state.editingEvent = event),
  setEditingEventTemplateRule: (
    state: StudentState,
    rule: EventTemplateRule
  ) => {
    const target = state.editingEvent?.template?.rules.find(
      (r: EventTemplateRule) => r.id == rule.id
    );
    if (target) {
      // update existing rule
      Object.assign(target, rule);
    } else {
      // push new rule
      (state.editingEvent?.template as EventTemplate).rules.push(rule);
    }
  },
  patchEditingEventTemplateRule: (
    state: StudentState,
    { ruleId, changes }: { ruleId: string; changes: Partial<EventTemplateRule> }
  ) => {
    const target = state.editingEvent?.template?.rules.find(
      (r: EventTemplateRule) => r.id == ruleId
    );
    if (target) {
      // update existing rule
      Object.assign(target, { ...target, ...changes });
    }
  },
  setEditingEventTemplateRuleClause: (
    state: StudentState,
    { ruleId, payload }: MutationPayload<EventTemplateRuleClause>
  ) => {
    const targetRule = state.editingEvent?.template?.rules.find(
      (r: EventTemplateRule) => r.id == ruleId
    ) as EventTemplateRule;
    const targetClause = targetRule.clauses?.find((c) => c.id == payload.id);
    if (targetClause) {
      // updating existing clause
      Object.assign(targetClause, payload);
    } else {
      // pushing new clause
      targetRule.clauses?.push(payload);
    }
  },
};

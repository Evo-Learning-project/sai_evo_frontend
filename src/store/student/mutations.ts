/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  EventParticipation,
  EventParticipationSlot,
  EventTemplate,
  EventTemplateRule,
  EventTemplateRuleClause,
} from '@/models';
import { MutationPayload, StudentState } from '../types';

export const mutations = {
  // update the slots of the current event participation
  setEventParticipationSlots: (
    state: StudentState,
    slots: EventParticipationSlot[]
  ) => {
    // TODO check if this correctly triggers reactivity
    if (state.currentEventParticipation) {
      state.currentEventParticipation.slots = slots;
    }
  },
  setEventParticipations: (
    state: StudentState,
    participations: EventParticipation[]
  ) => (state.eventParticipations = participations),
  setCurrentEventParticipation: (
    state: StudentState,
    participation: EventParticipation
  ) => (state.currentEventParticipation = participation),
  setCurrentEventParticipationSlot: (
    state: StudentState,
    slot: EventParticipationSlot
  ) => {
    const target = state.currentEventParticipation?.slots.find(
      (s: EventParticipationSlot) => s.id == slot.id
    );
    Object.assign(target, slot);
  },

  // updates the event template currently being edited
  setEditingEventTemplate: (
    state: StudentState,
    template: EventTemplate | null
  ) => (state.editingEventTemplate = template),
  setEditingEventTemplateRule: (
    state: StudentState,
    rule: EventTemplateRule
  ) => {
    const target = state.editingEventTemplate?.rules.find(
      (r: EventTemplateRule) => r.id == rule.id
    );
    if (target) {
      // update existing rule
      Object.assign(target, rule);
    } else {
      // push new rule
      state.editingEventTemplate?.rules.push(rule);
    }
  },
  setEditingEventTemplateRuleClause: (
    state: StudentState,
    { ruleId, payload }: MutationPayload<EventTemplateRuleClause>
  ) => {
    const targetRule = state.editingEventTemplate?.rules.find(
      (r: EventTemplateRule) => r.id == ruleId
    ) as EventTemplateRule;
    const targetClause = targetRule.clauses?.find(
      (c) => c.id == payload.id
    );
    if (targetClause) {
      // updating existing clause
      Object.assign(targetClause, payload);
    } else {
      // pushing new clause
      targetRule.clauses?.push(payload);
    }
  },
};

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  EventParticipation,
  EventParticipationSlot,
  EventTemplate,
  EventTemplateRule,
  EventTemplateRuleClause,
} from '@/models';

export const mutations = {
  // update the slots of the current event participation
  setEventParticipationSlots: (
    state: any,
    slots: EventParticipationSlot[]
  ) => {
    // TODO check if this correctly triggers reactivity
    state.currentEventParticipation.slots = slots;
  },
  setEventParticipations: (
    state: any,
    participations: EventParticipation[]
  ) => (state.eventParticipations = participations),
  setCurrentEventParticipation: (
    state: any,
    participation: EventParticipation
  ) => (state.currentEventParticipation = participation),
  setEvent: (state: any, event: Event) => (state.event = event),
  setCurrentEventParticipationSlot: (
    state: any,
    slot: EventParticipationSlot
  ) => {
    const target = state.currentEventParticipation.slots.find(
      (s: EventParticipationSlot) => s.id == slot.id
    );
    Object.assign(target, slot);
  },

  // updates the event template currently being edited
  setEditingEventTemplate: (
    state: any,
    template: EventTemplate | null
  ) => (state.editingEventTemplate = template),
  setEditingEventTemplateRule: (
    state: any,
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
    state: any,
    {
      ruleId,
      clause,
    }: { ruleId: string; clause: EventTemplateRuleClause }
  ) => {
    const targetRule = state.editingEventTemplate?.rules.find(
      (r: EventTemplateRule) => r.id == ruleId
    ) as EventTemplateRule;
    const targetClause = targetRule.clauses?.find(
      (c) => c.id == clause.id
    );
    if (targetClause) {
      // updating existing clause
      Object.assign(targetClause, clause);
    } else {
      // pushing new clause
      targetRule.clauses?.push(clause);
    }
  },
};

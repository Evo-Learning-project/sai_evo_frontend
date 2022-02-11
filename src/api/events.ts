import {
  Event,
  EventParticipation,
  EventParticipationSlot,
  EventTemplate,
  EventTemplateRule,
  EventTemplateRuleClause,
  EventTemplateRuleType,
} from '@/models';
import axios from 'axios';
import { tagIdsToTags, tagNamesToTags } from './utils';

export async function getEvents(courseId: string): Promise<Event[]> {
  const response = await axios.get(`/courses/${courseId}/events/`);
  return response.data;
}

export async function getEvent(
  courseId: string,
  eventId: string
): Promise<Event> {
  const response = await axios.get(
    `/courses/${courseId}/events/${eventId}/`
  );
  const event = response.data as Event;

  // convert tag-based template rules from backend's format (which uses a list of
  //ids to represent the field `tags` on EventTemplateRuleClause) to the
  // frontend's format, which uses Tag[] for that field
  const processedRules = event.template?.rules.map((r) => {
    if (r.rule_type != EventTemplateRuleType.TAG_BASED) {
      return r;
    }
    return {
      ...r,
      clauses: r.clauses?.map((c) => ({
        ...c,
        // we're expecting to receive EventTemplateRuleClause, but the server is sending
        // {id: string, tags: string[]}, so the conversion is needed here
        // ? might fix this by having an EventPayload, EventTemplatePayload, ... interfaces
        tags: tagIdsToTags(c.tags as unknown as string[]),
      })),
    };
  }) as EventTemplateRule[];
  const convertedEvent = {
    ...event,
    template: {
      ...event.template,
      rules: processedRules,
    },
  };
  console.log(convertedEvent);
  return convertedEvent;
}

export async function createEvent(
  courseId: string,
  event: Event
): Promise<Event> {
  const response = await axios.post(
    `courses/${courseId}/events/`,
    event
  );
  return response.data;
}

export async function updateEvent(
  courseId: string,
  eventId: string,
  event: Event
): Promise<Event> {
  const response = await axios.put(
    `courses/${courseId}/events/${eventId}/`,
    event
  );
  return response.data;
}

// TODO https://stackoverflow.com/a/49286056/12424975
export async function partialUpdateEvent(
  courseId: string,
  eventId: string,
  changes: Record<keyof Event, unknown>
): Promise<Event> {
  const response = await axios.patch(
    `courses/${courseId}/events/${eventId}/`,
    changes
  );
  return response.data;
}

export async function deleteEvent(
  courseId: string,
  eventId: string
): Promise<void> {
  const response = await axios.delete(
    `/courses/${courseId}/events/${eventId}/`
  );
  return response.data;
}

export async function getEventParticipations(
  courseId: string,
  eventId: string
): Promise<EventParticipation[]> {
  const response = await axios.get(
    `/courses/${courseId}/events/${eventId}/participations/`
  );
  return response.data;
}

export async function getEventParticipation(
  courseId: string,
  eventId: string,
  participationId: string
): Promise<EventParticipation> {
  const response = await axios.get(
    `/courses/${courseId}/events/${eventId}/participations/${participationId}/`
  );
  return response.data;
}

export async function createEventTemplateRule(
  courseId: string,
  templateId: string,
  rule: EventTemplateRule
): Promise<EventTemplateRule> {
  const response = await axios.post(
    `courses/${courseId}/templates/${templateId}/rules/`,
    rule
  );
  return response.data;
}

export async function updateEventTemplateRule(
  courseId: string,
  templateId: string,
  ruleId: string,
  rule: EventTemplateRule
): Promise<EventTemplateRule> {
  const response = await axios.put(
    `/courses/${courseId}/templates/${templateId}/rules/${ruleId}/`,
    rule
  );
  return response.data;
}

export async function createEventTemplateRuleClause(
  courseId: string,
  templateId: string,
  ruleId: string,
  clause: EventTemplateRuleClause
): Promise<EventTemplateRuleClause> {
  const payload = {
    ...clause,
    tags: tagNamesToTags(clause.tags.map((t) => t.name)).map(
      (t) => t.id
    ),
  };
  const response = await axios.post(
    `courses/${courseId}/templates/${templateId}/rules/${ruleId}/clauses/`,
    payload
  );
  const data = response.data;
  return { ...data, tags: tagIdsToTags(data.tags) };
}

export async function updateEventTemplateRuleClause(
  courseId: string,
  templateId: string,
  ruleId: string,
  clause: EventTemplateRuleClause
): Promise<EventTemplateRuleClause> {
  const payload = {
    ...clause,
    tags: tagNamesToTags(clause.tags.map((t) => t.name)).map(
      (t) => t.id
    ),
  };
  console.log('PAYLOAD', payload, 'original', clause);
  const response = await axios.put(
    `courses/${courseId}/templates/${templateId}/rules/${ruleId}/clauses/${clause.id}/`,
    payload
  );
  const data = response.data;
  return { ...data, tags: tagIdsToTags(data.tags) };
}

export async function participateInEvent(
  courseId: string,
  eventId: string
): Promise<EventParticipation> {
  const response = await axios.post(
    `/courses/${courseId}/events/${eventId}/participations/`
  );
  return response.data;
}

export async function partialUpdateEventParticipation(
  courseId: string,
  eventId: string,
  participationId: string,
  changes: Record<keyof EventParticipation, unknown>
): Promise<EventParticipation> {
  const response = await axios.patch(
    `/courses/${courseId}/events/${eventId}/participations/${participationId}/`,
    changes
  );
  return response.data;
}

export async function bulkPartialUpdateEventParticipation(
  courseId: string,
  eventId: string,
  participationIds: string[],
  changes: Record<keyof EventParticipation, unknown>
): Promise<EventParticipation[]> {
  let url = `/courses/${courseId}/events/${eventId}/participations/`;
  url += `bulk_patch/?ids=${participationIds.join(',')}`;
  const response = await axios.patch(url, changes);
  return response.data;
}

export async function partialUpdateEventParticipationSlot(
  courseId: string,
  eventId: string,
  participationId: string,
  slotId: string,
  changes: Record<keyof EventParticipationSlot, unknown>
): Promise<EventParticipationSlot> {
  const response = await axios.patch(
    `/courses/${courseId}/events/${eventId}/participations/${participationId}/slots/${slotId}/`,
    changes
  );
  return response.data;
}

export async function moveEventParticipationCurrentSlotCursor(
  courseId: string,
  eventId: string,
  participationId: string,
  direction: 'forward' | 'back'
): Promise<EventParticipationSlot> {
  const response = await axios.post(
    `/courses/${courseId}/events/${eventId}/participations/${participationId}/go_${direction}/`
  );
  return response.data;
}

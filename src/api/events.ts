import {
  Event,
  EventParticipation,
  EventParticipationSlot,
  EventTemplate,
  EventTemplateRule,
} from '@/models';
import axios from 'axios';

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
  return response.data;
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

// export async function getEventTemplate(
//   courseId: string,
//   templateId: string
// ): Promise<EventTemplate> {
//   const response = await axios.get(
//     `/courses/${courseId}/templates/${templateId}/`
//   );
//   return response.data;
// }

// export async function createEventTemplate(
//   courseId: string,
//   template: EventTemplate
// ): Promise<EventTemplate> {
//   const response = await axios.post(
//     `courses/${courseId}/templates/`,
//     template
//   );
//   return response.data;
// }

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

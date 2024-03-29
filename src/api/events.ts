import {
	convertPaginatedResponseToLocalPaginatedData,
	normalizeIncomingEvent,
	normalizeIncomingEventParticipation,
	normalizeIncomingEventParticipationSlot,
	normalizeIncomingEventTemplate,
	normalizeIncomingEventTemplateRule,
	normalizeIncomingEventTemplateRuleClause,
} from "./converters";
import {
	BackendPaginatedResponse,
	EventParticipationSearchFilter,
	EventSearchFilter,
	PaginatedData,
} from "./interfaces";
import {
	CodeExecutionResults,
	Event,
	EventParticipation,
	EventParticipationSlot,
	EventParticipationSlotSubmission,
	EventTemplate,
	EventTemplateRule,
	EventTemplateRuleClause,
	EventTemplateRuleType,
	Exercise,
} from "@/models";
import { forceFileDownload, getFileNameFromResponseHeader } from "@/utils";
import axios from "axios";
import {
	convertEventTemplateRules,
	getEventParticipationUrlQueryParams,
	getEventUrlQueryParams,
	tagIdsToTags,
	tagNamesToTags,
} from "./utils";

export async function getEvents(
	courseId: string,
	filters?: EventSearchFilter,
): Promise<Event[]> {
	const response = await axios.get(
		`/courses/${courseId}/events/${getEventUrlQueryParams(filters ?? null)}`,
	);
	return (response.data as Event[]).map(e => normalizeIncomingEvent(e));
}

export async function getEvent(
	courseId: string,
	eventId: string,
	includeDetails: boolean,
): Promise<Event> {
	const response = await axios.get(
		`/courses/${courseId}/events/${eventId}/${
			includeDetails ? "?include_event_template_rule_details=true" : ""
		}`,
	);
	return normalizeIncomingEvent(response.data);
}

export async function lockEvent(courseId: string, eventId: string): Promise<Event> {
	const response = await axios.post(`/courses/${courseId}/events/${eventId}/lock/`);
	return normalizeIncomingEvent(response.data);
}

export async function unlockEvent(courseId: string, eventId: string): Promise<void> {
	const response = await axios.post(`/courses/${courseId}/events/${eventId}/unlock/`);
	return response.data;
}

export async function heartbeatEvent(courseId: string, eventId: string): Promise<void> {
	const response = await axios.post(`/courses/${courseId}/events/${eventId}/heartbeat/`);
	return response.data;
}

export async function getEventTemplate(
	courseId: string,
	templateId: string,
): Promise<EventTemplate> {
	const response = await axios.get(`/courses/${courseId}/templates/${templateId}/`);
	return normalizeIncomingEventTemplate(response.data);
}

export async function getEventTemplateRule(
	courseId: string,
	templateId: string,
	ruleId: string,
): Promise<EventTemplateRule> {
	const response = await axios.get(
		`/courses/${courseId}/templates/${templateId}/rules/${ruleId}/`,
	);
	// const rule = response.data as EventTemplateRule;
	// const processedRule = convertEventTemplateRules([
	//   rule,
	// ]) as EventTemplateRule[];
	return normalizeIncomingEventTemplateRule(response.data);
	//return processedRule[0];
}

export async function createEvent(courseId: string, event: Event): Promise<Event> {
	// if the event contains a template with tag-based rules,
	// we need to convert the tag objects to tag ids
	const convertedEvent = {
		...event,
		...(event.template
			? {
					template: {
						...event.template,
						rules: event.template.rules.map(r => ({
							...r,
							clauses: (r.clauses ?? []).map(c => ({
								...c,
								tags: c.tags.map(t => t.id),
							})),
						})),
					},
			  }
			: {}),
	};
	const response = await axios.post(`courses/${courseId}/events/`, convertedEvent);
	return normalizeIncomingEvent(response.data);
}

export async function updateEvent(
	courseId: string,
	eventId: string,
	event: Event,
): Promise<Event> {
	const response = await axios.put(`courses/${courseId}/events/${eventId}/`, event);
	return normalizeIncomingEvent(response.data);
}

export async function getEventInstances(
	courseId: string,
	eventId: string,
	amount: number,
): Promise<Exercise[][]> {
	const response = await axios.get(
		`courses/${courseId}/events/${eventId}/instances/?amount=${amount}`,
	);
	return response.data;
}

export async function partialUpdateEvent(
	courseId: string,
	eventId: string,
	changes: Partial<Event>,
	fireIntegrationEvent?: boolean,
): Promise<Event> {
	const response = await axios.patch(
		`courses/${courseId}/events/${eventId}/${
			typeof fireIntegrationEvent === "boolean"
				? `?fire_integration_event=${JSON.stringify(fireIntegrationEvent)}`
				: ""
		}`,
		changes,
	);
	return normalizeIncomingEvent(response.data);
}

export async function deleteEvent(courseId: string, eventId: string): Promise<void> {
	const response = await axios.delete(`/courses/${courseId}/events/${eventId}/`);
	return response.data;
}

export async function getCourseEventParticipations(
	courseId: string,
	pageNumber: number,
	includeDetails?: boolean,
	includeEvent?: boolean,
	filter?: EventParticipationSearchFilter,
): Promise<PaginatedData<EventParticipation>> {
	const response = await axios.get(
		`/courses/${courseId}/participations/?page=${pageNumber}${
			includeDetails ? "&include_details=" + includeDetails : ""
		}${
			includeEvent ? "&include_event=" + includeEvent : ""
		}${getEventParticipationUrlQueryParams(filter ?? null)}`,
	);
	const normalizedData = (
		response.data as BackendPaginatedResponse<EventParticipation>
	).results.map((p: EventParticipation) => normalizeIncomingEventParticipation(p));

	return convertPaginatedResponseToLocalPaginatedData(
		{ ...response.data, results: normalizedData },
		pageNumber,
	);
}

export async function getEventParticipations(
	courseId: string,
	eventId: string,
	includeDetails?: boolean,
	forCsv?: boolean,
): Promise<EventParticipation[]> {
	const response = await axios.get(
		`/courses/${courseId}/events/${eventId}/participations/${
			includeDetails ? "?include_details=" + includeDetails : ""
		}${forCsv ? "&for_csv=" + forCsv : ""}`,
	);
	return response.data.map((p: EventParticipation) =>
		normalizeIncomingEventParticipation(p),
	);
}

export async function getEventParticipation(
	courseId: string,
	eventId: string,
	participationId: string,
): Promise<EventParticipation> {
	const response = await axios.get(
		`/courses/${courseId}/events/${eventId}/participations/${participationId}/`,
	);
	return normalizeIncomingEventParticipation(response.data);
}

export async function createEventTemplateRule(
	courseId: string,
	templateId: string,
	rule: EventTemplateRule,
): Promise<EventTemplateRule> {
	const response = await axios.post(
		`courses/${courseId}/templates/${templateId}/rules/`,
		rule,
	);
	return normalizeIncomingEventTemplateRule(response.data);
}

export async function updateEventTemplateRule(
	courseId: string,
	templateId: string,
	ruleId: string,
	rule: EventTemplateRule,
): Promise<EventTemplateRule> {
	const response = await axios.put(
		`/courses/${courseId}/templates/${templateId}/rules/${ruleId}/`,
		rule,
	);
	return normalizeIncomingEventTemplateRule(response.data);
}

export async function partialUpdateEventTemplateRule(
	courseId: string,
	templateId: string,
	ruleId: string,
	changes: Partial<EventTemplateRule>,
): Promise<EventTemplateRule> {
	const response = await axios.put(
		`/courses/${courseId}/templates/${templateId}/rules/${ruleId}/`,
		changes,
	);
	return normalizeIncomingEventTemplateRule(response.data);
}

export async function deleteEventTemplateRule(
	courseId: string,
	templateId: string,
	ruleId: string,
): Promise<void> {
	const response = await axios.delete(
		`/courses/${courseId}/templates/${templateId}/rules/${ruleId}/`,
	);
	return response.data;
}

export async function createEventTemplateRuleClause(
	courseId: string,
	templateId: string,
	ruleId: string,
	clause: EventTemplateRuleClause,
): Promise<EventTemplateRuleClause> {
	// transform tag name list to tag id list to match backend format
	const payload = {
		...clause,
		tags: tagNamesToTags(clause.tags.map(t => t.name)).map(t => t.id),
	};
	const response = await axios.post(
		`courses/${courseId}/templates/${templateId}/rules/${ruleId}/clauses/`,
		payload,
	);
	return normalizeIncomingEventTemplateRuleClause(response.data);
}

export async function updateEventTemplateRuleClause(
	courseId: string,
	templateId: string,
	ruleId: string,
	clause: EventTemplateRuleClause,
): Promise<EventTemplateRuleClause> {
	const payload = {
		...clause,
		tags: tagNamesToTags(clause.tags.map(t => t.name)).map(t => t.id),
	};
	const response = await axios.put(
		`courses/${courseId}/templates/${templateId}/rules/${ruleId}/clauses/${clause.id}/`,
		payload,
	);
	return normalizeIncomingEventTemplateRuleClause(response.data);
}

export async function deleteEventTemplateRuleClause(
	courseId: string,
	templateId: string,
	ruleId: string,
	clauseId: string,
): Promise<EventTemplateRuleClause> {
	const response = await axios.delete(
		`courses/${courseId}/templates/${templateId}/rules/${ruleId}/clauses/${clauseId}/`,
	);
	return response.data;
}

export async function participateInEvent(
	courseId: string,
	eventId: string,
): Promise<EventParticipation> {
	const response = await axios.post(
		`/courses/${courseId}/events/${eventId}/participations/?as_student=true`,
	);
	return normalizeIncomingEventParticipation(response.data);
}

export async function partialUpdateEventParticipation(
	courseId: string,
	eventId: string,
	participationId: string,
	changes: Partial<EventParticipation>,
): Promise<EventParticipation> {
	const response = await axios.patch(
		`/courses/${courseId}/events/${eventId}/participations/${participationId}/`,
		changes,
	);
	return normalizeIncomingEventParticipation(response.data);
}

export async function bulkPartialUpdateEventParticipation(
	courseId: string,
	eventId: string,
	participationIds: string[],
	changes: Partial<EventParticipation>,
	fireIntegrationEvent?: boolean,
): Promise<EventParticipation[]> {
	const url = `/courses/${courseId}/events/${eventId}/participations/bulk_patch/?ids=${participationIds.join(
		",",
	)}${
		typeof fireIntegrationEvent === "boolean"
			? `&fire_integration_event=${JSON.stringify(fireIntegrationEvent)}`
			: ""
	}`;
	const response = await axios.patch(url, changes);
	return response.data.map((p: EventParticipation) =>
		normalizeIncomingEventParticipation(p),
	);
}

export async function partialUpdateEventParticipationSlot(
	courseId: string,
	eventId: string,
	participationId: string,
	slotId: string,
	changes: Partial<EventParticipationSlot>,
	forceStudent = false,
): Promise<EventParticipationSlot> {
	const response = await axios.patch(
		`/courses/${courseId}/events/${eventId}/participations/${participationId}/slots/${slotId}/${
			forceStudent ? "?as_student=1" : ""
		}`,
		changes,
	);
	return normalizeIncomingEventParticipationSlot(response.data);
}

export async function partialUpdateEventParticipationSlotSubmission(
	courseId: string,
	eventId: string,
	participationId: string,
	slotId: string,
	changes: Partial<EventParticipationSlotSubmission>,
): Promise<EventParticipationSlotSubmission> {
	const response = await axios.patch(
		`/courses/${courseId}/events/${eventId}/participations/${participationId}/slots/${slotId}/patch_submission/`,
		changes,
	);
	return normalizeIncomingEventParticipationSlot(response.data);
}

export async function getEventParticipationSlot(
	courseId: string,
	eventId: string,
	participationId: string,
	slotId: string,
	forceStudent = false,
): Promise<EventParticipationSlot> {
	const response = await axios.get(
		`/courses/${courseId}/events/${eventId}/participations/${participationId}/slots/${slotId}/${
			forceStudent ? "?as_student=1" : ""
		}`,
	);
	return normalizeIncomingEventParticipationSlot(response.data);
}

export async function getEventParticipationSlotExecutionResults(
	courseId: string,
	eventId: string,
	participationId: string,
	slotId: string,
	forceStudent = false,
): Promise<CodeExecutionResults> {
	const response = await axios.get(
		`/courses/${courseId}/events/${eventId}/participations/${participationId}/slots/${slotId}/execution_results/${
			forceStudent ? "?as_student=1" : ""
		}`,
	);
	return response.data;
}

export async function downloadEventParticipationSlotAttachment(
	courseId: string,
	eventId: string,
	participationId: string,
	slotId: string,
): Promise<any> {
	const response = await axios.get(
		`/courses/${courseId}/events/${eventId}/participations/${participationId}/slots/${slotId}/attachment/`,
		{ responseType: "arraybuffer" },
	);
	const fileName = getFileNameFromResponseHeader(response.headers["content-disposition"]);
	// (
	// 	response.headers["content-disposition"].split(/.*filename=(.*)/)[1] ?? "attachment"
	// ).replace(/"/g, "");
	forceFileDownload(response, fileName);
}

export async function runEventParticipationSlotCode(
	courseId: string,
	eventId: string,
	participationId: string,
	slotId: string,
): Promise<EventParticipationSlot> {
	const response = await axios.post(
		`/courses/${courseId}/events/${eventId}/participations/${participationId}/slots/${slotId}/run/`,
	);
	return normalizeIncomingEventParticipationSlot(response.data);
}

export async function moveEventParticipationCurrentSlotCursor(
	courseId: string,
	eventId: string,
	participationId: string,
	direction: "forward" | "back",
): Promise<EventParticipationSlot> {
	const response = await axios.post(
		`/courses/${courseId}/events/${eventId}/participations/${participationId}/go_${direction}/`,
	);
	return normalizeIncomingEventParticipationSlot(response.data);
}

import {
	CourseSearchFilter,
	EventParticipationSearchFilter,
	EventSearchFilter,
	ExerciseSearchFilter,
	ExerciseSolutionSearchFilter,
	PaginatedData,
} from "./interfaces";
import store from "@/store";
import { EventTemplateRule, EventTemplateRuleType, Tag } from "@/models";
import { filter } from "lodash";

export const tagNamesToTags = (names: string[]): Tag[] =>
	// converts a list of tag names to a list of Tag objects
	names.map(n => store.getters["shared/tagByName"](n));

export const tagIdsToTags = (ids: string[]): Tag[] => {
	return ids.map(i => store.getters["shared/tagById"](i) as Tag);
};

export const getEventUrlQueryParams = (filters: EventSearchFilter | null): string => {
	if (!filters) {
		return "";
	}
	let ret = "";
	if (typeof filters.event_type !== "undefined" || typeof filters.state !== "undefined") {
		ret += "?";
	}
	if (typeof filters.event_type !== "undefined") {
		ret += `event_type=${filters.event_type}&`;
	}
	if (typeof filters.state !== "undefined") {
		ret += `?state=${filters.state}&`;
	}
	return ret;
};

export const getBlankExerciseSearchFilters = (): ExerciseSearchFilter => ({
	label: "",
	text: "",
	tags: [] as string[],
	exercise_types: [],
	states: [],
});

export const getBlankCourseSearchFilters = (): CourseSearchFilter => ({
	name: "",
	withPrivileges: false,
	hidden: false,
});

export const isEmptyFilter = (filter: ExerciseSearchFilter): boolean =>
	filter.label.length === 0 &&
	filter.text.length === 0 &&
	filter.exercise_types.length === 0 &&
	filter.states.length === 0 &&
	filter.tags.length === 0;

export const getExerciseSolutionUrlQueryParams = (
	filters: ExerciseSolutionSearchFilter | null,
): string => {
	if (!filters) {
		return "";
	}
	let ret = "";
	if (typeof filters.bookmarked !== "undefined" || filters.states.length > 0) {
		ret += "&";
	}

	if (typeof filters.bookmarked !== "undefined") {
		ret += `bookmarked=${JSON.stringify(filters.bookmarked)}&`;
	}

	if (filters.states && filters.states.length > 0) {
		ret += `state=${filters.states.join(",")}&`;
	}
	return ret;
};

export const getEventParticipationUrlQueryParams = (
	filters: EventParticipationSearchFilter | null,
): string => {
	if (!filters) {
		return "";
	}
	let ret = "";
	if (
		typeof filters.bookmarked !== "undefined" ||
		typeof filters.event_type !== "undefined"
	) {
		ret += "&";
	}

	if (typeof filters.bookmarked !== "undefined") {
		ret += `bookmarked=${JSON.stringify(filters.bookmarked)}&`;
	}

	if (typeof filters.event_type !== "undefined") {
		ret += `event_type=${filters.event_type}&`;
	}
	return ret;
};

export const getExerciseUrlQueryParams = (
	filters: ExerciseSearchFilter | null,
): string => {
	if (!filters) {
		return "";
	}
	let ret = "";
	if (
		(filters.label?.length ?? 0) > 0 ||
		(filters.exercise_types?.length ?? 0) > 0 ||
		(filters.states?.length ?? 0) > 0 ||
		(filters.tags?.length ?? 0) > 0 ||
		(filters.text?.length ?? 0) > 0 ||
		typeof filters.with_submitted_solutions !== "undefined" ||
		typeof filters.with_bookmarked_solutions !== "undefined" ||
		typeof filters.by_popularity !== "undefined"
	) {
		ret += "&";
	}

	if (filters.label || filters.text) {
		ret += `search=${encodeURIComponent(filters.label ?? "")} ${encodeURIComponent(
			filters.text ?? "",
		)}&`;
	}

	if (filters.exercise_types && filters.exercise_types.length > 0) {
		ret += `exercise_type=${filters.exercise_types.join(",")}&`;
	}

	if (filters.states && filters.states.length > 0) {
		ret += `state=${filters.states.join(",")}&`;
	}

	if (filters.tags && filters.tags.length > 0) {
		ret += `tags=${filters.tags.join("&tags=")}&`;
	}

	if (typeof filters.with_submitted_solutions !== "undefined") {
		ret += `with_submitted_solutions=${JSON.stringify(
			filters.with_submitted_solutions,
		)}&`;
	}

	if (typeof filters.with_bookmarked_solutions !== "undefined") {
		ret += `with_bookmarked_solutions=${JSON.stringify(
			filters.with_bookmarked_solutions,
		)}&`;
	}

	if (typeof filters.by_popularity !== "undefined") {
		ret += `by_popularity=${JSON.stringify(filters.by_popularity)}&`;
	}

	return ret;
};

export const convertEventTemplateRules = (
	rules?: EventTemplateRule[],
): EventTemplateRule[] | undefined => {
	// convert tag-based template rules from backend's format (which uses a list of
	//ids to represent the field `tags` on EventTemplateRuleClause) to the
	// frontend's format, which uses Tag[] for that field
	const processedRules = rules?.map(r => {
		if (r.rule_type != EventTemplateRuleType.TAG_BASED) {
			return r;
		}
		return {
			...r,
			clauses: r.clauses?.map(c => ({
				...c,
				// we're expecting to receive EventTemplateRuleClause, but the server is sending
				// {id: string, tags: string[]}, so the conversion is needed here
				// ? might fix this by having an EventPayload, EventTemplatePayload, ... interfaces
				tags: tagIdsToTags(c.tags as unknown as string[]),
			})),
		};
	});

	return processedRules;
};

const isNumeric = (num: any) =>
	(typeof num === "number" || (typeof num === "string" && num.trim() !== "")) &&
	!isNaN(num as number);

export const normalizeOptionalStringContainingNumber = (
	val: undefined | null | string | number,
): undefined | null | string | number => {
	/**
	 * Takes in a value that can be either null, undefined, a number, or a string
	 * If the value is null, undefined, or a string that doesn't describe a number
	 * (e.g. '2.1'), the value is returned unchanged.
	 *
	 * If the value is a string describing a number, the value is returned as a number
	 */
	if (typeof val === "undefined") {
		return undefined;
	}
	if (val === null) {
		return null;
	}

	const strVal = String(val);
	// if strVal doesn't contain a valid number, return it as is
	if (!isNumeric(strVal)) {
		return val;
	}
	// if strVal represents a number, return it as a number
	return parseFloat(strVal);
};

export const updatePaginatedData = <T>(
	existingData: PaginatedData<T>,
	newData: PaginatedData<T>,
	prepend: boolean,
): PaginatedData<T> => ({
	...existingData,
	...newData,
	data: [
		...(prepend ? newData.data : []),
		...existingData.data,
		...(prepend ? [] : newData.data),
	],
});

export const prependToPaginatedData = <T>(
	paginatedData: PaginatedData<T>,
	...newElement: T[]
): PaginatedData<T> => ({
	...paginatedData,
	data: [...newElement, ...paginatedData.data],
	//count: paginatedData.count + 1,
});

export const deleteByIdFromPaginatedData = <T extends { id: string }>(
	paginatedData: PaginatedData<T>,
	...toDelete: { id: string }[]
): PaginatedData<T> => ({
	...paginatedData,
	data: paginatedData.data.filter(
		d => !toDelete.map(t => String(t.id)).includes(String(d.id)),
	),
});

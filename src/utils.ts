import { EventParticipation, Event, Exercise } from "@/models";
import { getTranslatedString } from "./i18n/index";
/* eslint-disable @typescript-eslint/no-explicit-any */
import debounce from "lodash/debounce";
import moment from "moment";
import "moment/locale/it";
import { getTranslatedString as _ } from "./i18n";
import { ErrorMessage } from "./interfaces";
import router from "./router";
import store from "./store";
import { SharedState } from "./store/types";
import { ExerciseState } from "./models";

const EDITOR_DEBOUNCE_TIME_MS = 1500;
const EDITOR_DEBOUNCE_MAX_WAIT_MS = 4000;

const SEARCH_DEBOUNCE_TIME_MS = 500;
const SEARCH_DEBOUNCE_MAX_WAIT_MS = 1000;

const STUDENT_DEBOUNCE_TEXT_TIME_MS = 5000;
const STUDENT_DEBOUNCE_TEXT_MAX_WAIT_MS = 10000;

export const logOut = (showMessage = true): void => {
	store.commit("shared/resetToken");
	router.push({
		name: "Login",
		params: {
			courseId: -1, // !
		},
	});
	if (showMessage) {
		setErrorNotification(getTranslatedString("misc.logged_out"), true);
	}
};

export const redirectToMainView = (): void => {
	if (router.currentRoute.value.query.redirect) {
		router.push(router.currentRoute.value.query.redirect as string);
	} else if ((store.state as { shared: SharedState }).shared.user.is_teacher) {
		router.push("/teacher/courses");
	} else {
		router.push("/student/courses");
	}
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getDebouncedForFilter = (callback: any) =>
	debounce(callback, SEARCH_DEBOUNCE_TIME_MS, {
		maxWait: SEARCH_DEBOUNCE_MAX_WAIT_MS,
	});

export const getFormattedTimestamp = (
	timestamp: string,
	dateOnly = false,
	reduced = false,
): string => {
	moment().locale("it");
	return (
		moment(timestamp)
			//.calendar()
			.format(
				reduced
					? "DD MMM YYYY" + (dateOnly ? "" : ", HH:mm")
					: "DD MMMM YYYY" + (dateOnly ? "" : `, [${_("misc.at")}] HH:mm`),
			)
	);
};

export const getErrorData = (e: any, useAsIs = false): ErrorMessage => {
	if (useAsIs) {
		return { title: e };
	}
	if (e.response) {
		return {
			icon: "error_outline",
			title: _("errors." + e.response.status),
		};
	} else if (e.request) {
		return {
			title: _("errors.no_connection"),
			icon: "cloud_off",
		};
	} else {
		return {
			title: _("errors.unknown_error"),
		};
	}
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const setPageWideError = (e: any) => {
	const sharedState = (store.state as { shared: SharedState }).shared;
	sharedState.pageWideErrorData = getErrorData(e);
	throw e;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const setErrorNotification = (e: any, useAsIs = false) => {
	console.error("EEEE", e);

	store.commit("shared/setErrorNotificationData", {
		data: getErrorData(e, useAsIs),
	});
};

// export const typesetTex = () => {
//   console.log("typesetting");
//   (window as any).MathJax.typeset();
// };

export function forceFileDownload(response: { data: BlobPart }, title: string) {
	console.log("--- calling download", title, response.data);
	const url = window.URL.createObjectURL(new Blob([response.data]));
	const link = document.createElement("a");
	link.href = url;
	link.setAttribute("download", title);
	document.body.appendChild(link);
	link.click();
}

export const formatExerciseText = (text: string): string => {
	return text.replace(/```([^`]*)```/g, "<pre>$1</pre>");
};

export const getExerciseTitle = (exercise: Exercise): string =>
	(exercise?.label ?? "").trim().length > 0
		? (exercise.label as string)
		: _("exercise_preview.unnamed_exercise");

export const getClonedExercise = (exercise: Exercise): Exercise => ({
	...exercise,
	label: exercise.label + " " + _("exercise.clone_label"),
	state: ExerciseState.DRAFT,
});

export const csvToArray = (
	str: string,
	headerLineBeginning: string,
): Record<string, any>[] => {
	const delimiter = ";"; // TODO find delimiter in string

	// remove part of the string that comes before the header line
	str = str.slice(str.indexOf(headerLineBeginning));

	// slice from start of text to the first \n index
	// use split to create an array from string by delimiter
	const headers = str.slice(0, str.indexOf("\n")).split(delimiter);

	// slice from \n index + 1 to the end of the text
	// use split to create an array of each csv value row
	const rows = str.slice(str.indexOf("\n") + 1).split("\n");

	// Map the rows
	// split values from each row into an array
	// use headers.reduce to create an object
	// object properties derived from headers:values
	// the object passed as an element of the array
	const arr = rows.map(function (row) {
		const values = row.split(delimiter);
		const el = headers.reduce((object, header, index) => {
			object[header] = values[index];
			return object;
		}, {} as Record<string, any>);
		return el;
	});

	// return the array
	return arr;
};

export const getParticipationRemainingTime = (
	participation: EventParticipation,
	event: Event,
): number | null => {
	if (event.time_limit_seconds === null) {
		return null;
	}
	const endDate = new Date(participation.begin_timestamp);
	endDate.setSeconds(endDate.getSeconds() + event.time_limit_seconds);

	return Math.max(Math.floor((endDate.getTime() - new Date().getTime()) / 1000), 0);
};

export const getFileContent = async (file: File): Promise<string> => {
	return new Promise<string>((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			resolve(reader.result as string);
		};
		reader.onerror = reject;
		reader.readAsText(file);
	});
};

export const clickOutsideDirective = {
	beforeMount: (
		el: {
			clickOutsideEvent: {
				(event: any): void;
				(this: Document, ev: MouseEvent): any;
			};
			contains: (arg0: any) => any;
		},
		binding: { value: () => void },
	) => {
		el.clickOutsideEvent = (event: any) => {
			// check that click was outside the element and its children
			if (!(el == event.target || el.contains(event.target))) {
				binding.value?.();
			}
		};
		document.addEventListener("click", el.clickOutsideEvent);
	},
	unmounted: (el: { clickOutsideEvent: (this: Document, ev: MouseEvent) => any }) => {
		document.removeEventListener("click", el.clickOutsideEvent);
	},
};

export const roundToTwoDecimals = (num: number) =>
	Math.round((num + Number.EPSILON) * 100) / 100;

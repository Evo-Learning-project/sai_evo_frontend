/* eslint-disable no-var */
declare const Buffer;

import { EventParticipation, Event, Exercise, EventTimeLimitRule } from "@/models";
import { getTranslatedString } from "./i18n/index";
/* eslint-disable @typescript-eslint/no-explicit-any */
import debounce from "lodash/debounce";
import moment from "moment";
import "moment/locale/it";
import { getTranslatedString as _ } from "./i18n";
import { ErrorMessage } from "./interfaces";
import router from "./router";
import { ExerciseState } from "./models";

const EDITOR_DEBOUNCE_TIME_MS = 1500;
const EDITOR_DEBOUNCE_MAX_WAIT_MS = 4000;

const SEARCH_DEBOUNCE_TIME_MS = 500;
const SEARCH_DEBOUNCE_MAX_WAIT_MS = 1000;

const STUDENT_DEBOUNCE_TEXT_TIME_MS = 5000;
const STUDENT_DEBOUNCE_TEXT_MAX_WAIT_MS = 10000;

export const getCurrentUserId = () => useMetaStore().user.id;

export const logOut = (showMessage = true, redirect = ""): void => {
	const metaStore = useMetaStore();
	metaStore.resetToken();

	router.push({
		name: "Login",
		params: {
			courseId: -1, // !
		},
		...(redirect ? { query: { redirect } } : {}),
	});
	if (showMessage) {
		setErrorNotification(getTranslatedString("misc.logged_out"), true);
	}
};

export const redirectToMainView = (): void => {
	const metaStore = useMetaStore();
	if (router.currentRoute.value.query.redirect) {
		router.push(router.currentRoute.value.query.redirect as string);
	} else if (metaStore.user.is_teacher) {
		router.push({ name: "TeacherCourseList" });
	} else {
		router.push({ name: "StudentCourseList" });
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
	moment().locale("it"); // TODO get user locale
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
	if (isMaintenanceMode()) {
		return {
			title: _("misc.maintenance_mode"),
			icon: "engineering",
		};
	}

	if (useAsIs) {
		return { title: e };
	}
	console.log("Error data", e.response, e);
	if (e.response) {
		return {
			icon: "error_outline",
			title: _("errors." + e.response.status),
			content: e.response?.data?.detail,
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
	const metaStore = useMetaStore();
	// if the error is a 401 response, don't set the global
	// error message to allow for redirecting to the login view
	if (typeof e !== "object" || e?.response?.status !== 401) {
		metaStore.pageWideErrorData = getErrorData(e);
	}
	console.error("setPageWideError", e);
	throw e;
};

export const setErrorNotification = (e: any, useAsIs = false) => {
	console.error("setErrorNotification", e);
	const metaStore = useMetaStore();
	metaStore.setErrorNotificationData({
		data: getErrorData(e, useAsIs),
		hideTimeout: 4000,
	});
};

export const getColorFromString = (str: string) => {
	const saturation = 75;
	const lightness = 0.7;
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
		hash = hash & hash;
	}
	const h = hash % 360;
	const a = (saturation * Math.min(lightness, 1 - lightness)) / 100;
	const f = n => {
		const k = (n + h / 30) % 12;
		const color = lightness - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
		return Math.round(255 * color)
			.toString(16)
			.padStart(2, "0"); // convert to Hex and prefix "0" if needed
	};
	return `#${f(0)}${f(8)}${f(4)}`;
};

export function forceFileDownload(response: { data: BlobPart }, title: string) {
	// console.log("--- calling download", title, response.data);
	const url = window.URL.createObjectURL(new Blob([response.data]));
	const link = document.createElement("a");
	link.href = url;
	link.setAttribute("download", title);
	document.body.appendChild(link);
	link.click();
}

export function stripHtmlFromLaTexBlocks(html: string) {
	/**
		Returns the given string containing html where all blocks
		enclosed in $ or $$ have all html tags stripped off (currently
		only <p>, </p>, and <br /> tags). This is needed due to quill
		editor adding html to them, which messes with MathJax
	 */
	// eslint-disable-next-line no-useless-escape
	const LATEX_REGEX = /(\${1,2})((?:\\.|[\s\S])*)\1/g; ///(\${1,2})[^]*?[^\\]\1|[^\$]+/g;

	return html.replace(LATEX_REGEX, val => {
		const textContent = val
			.replace(/<\/p>/g, "\n")
			.replace(/<p>/g, "")
			.replace(/<br\s*\/?>/g, "\n");
		//new DOMParser().parseFromString(val, "text/html").body.textContent ?? "";
		return textContent;
	});
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
	if (
		typeof event.time_limit_seconds !== "number" ||
		event.time_limit_rule !== EventTimeLimitRule.TIME_LIMIT
	) {
		return null;
	}
	const endMoment = moment(participation.begin_timestamp).add(
		event.time_limit_seconds,
		"seconds",
	);
	const now = moment();
	const remaining = endMoment.diff(now, "seconds");

	return Math.max(remaining, 0);
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

// export function isElementVisible(element: HTMLElement | null) {
// 	if (element === null) {
// 		return true;
// 	}
// 	if (element.offsetWidth === 0 || element.offsetHeight === 0) return false;
// 	const height = document.documentElement.clientHeight,
// 		rects = element.getClientRects(),
// 		onTop = function (r: any) {
// 			const x = (r.left + r.right) / 2,
// 				y = (r.top + r.bottom) / 2;
// 			return document.elementFromPoint(x, y) === element;
// 		};
// 	for (let i = 0, l = rects.length; i < l; i++) {
// 		const r = rects[i],
// 			in_viewport = r.top > 0 ? r.top <= height : r.bottom > 0 && r.bottom <= height;
// 		if (
// 			in_viewport
// 			// TODO fix
// 			// && onTop(r)
// 		)
// 			return true;
// 	}
// 	return false;
// }

import { event } from "vue-gtag";
import { useMetaStore } from "./stores/metaStore";

export function logAnalyticsEvent(eventName: string, params: Record<string, any>) {
	event(eventName, params);
}

export const getMaxUploadFileSizeBytes = () =>
	parseFloat(process.env.VUE_APP_MAX_UPLOAD_SIZE_BYTES ?? String(1_100_000_000));
export const isDemoMode = () => JSON.parse(process.env.VUE_APP_DEMO_MODE ?? "false");
export const isMaintenanceMode = () =>
	JSON.parse(process.env.VUE_APP_MAINTENANCE_MODE ?? "false");

export function getDefaultThumbnail(mime_type: string) {
	const ARCHIVE_TYPES = [
		"application/zip",
		"application/gzip",
		"application/x-tar",
		"application/vnd.rar",
		"application/x-bzip",
		"application/x-bzip2",
		"application/java-archive",
		"application/x-7z-compressed",
	];
	const SOURCE_CODE_TYPES = [
		"text/x-script.python",
		"text/x-c",
		"text/x-java",
		"text/javascript",
		"text/x-sh",
		"application/json",
		"text/html",
		"text/css",
		"text/x-python-script",
		"text/xml",
	];
	if (ARCHIVE_TYPES.includes(mime_type)) {
		return require("@/assets/thumbnails/archive.png");
	}
	if (SOURCE_CODE_TYPES.includes(mime_type)) {
		return require("@/assets/thumbnails/code.png");
	}
	if (mime_type.split("/")[0] === "video") {
		return require("@/assets/thumbnails/video.png");
	}
	return require("@/assets/thumbnails/text.png");
}

export function getHumanFileSize(bytes: number) {
	const thresh = 1024;

	if (Math.abs(bytes) < thresh) {
		return bytes + " B";
	}

	const units = ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
	let u = -1;
	const r = 10;

	do {
		bytes /= thresh;
		++u;
	} while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

	return bytes.toFixed(1) + " " + units[u];
}

export function arraybufferToBase64(data: any): string {
	return Buffer.from(data, "binary").toString("base64");
}

//  A formatted version of a popular md5 implementation.
//  Original copyright (c) Paul Johnston & Greg Holt.
export function md5(inputString) {
	const hc = "0123456789abcdef";
	function rh(n) {
		var j,
			s = "";
		for (j = 0; j <= 3; j++)
			s += hc.charAt((n >> (j * 8 + 4)) & 0x0f) + hc.charAt((n >> (j * 8)) & 0x0f);
		return s;
	}
	function ad(x, y) {
		var l = (x & 0xffff) + (y & 0xffff);
		var m = (x >> 16) + (y >> 16) + (l >> 16);
		return (m << 16) | (l & 0xffff);
	}
	function rl(n, c) {
		return (n << c) | (n >>> (32 - c));
	}
	function cm(q, a, b, x, s, t) {
		return ad(rl(ad(ad(a, q), ad(x, t)), s), b);
	}
	function ff(a, b, c, d, x, s, t) {
		return cm((b & c) | (~b & d), a, b, x, s, t);
	}
	function gg(a, b, c, d, x, s, t) {
		return cm((b & d) | (c & ~d), a, b, x, s, t);
	}
	function hh(a, b, c, d, x, s, t) {
		return cm(b ^ c ^ d, a, b, x, s, t);
	}
	function ii(a, b, c, d, x, s, t) {
		return cm(c ^ (b | ~d), a, b, x, s, t);
	}
	function sb(x) {
		var i;
		var nblk = ((x.length + 8) >> 6) + 1;
		var blks = new Array(nblk * 16);
		for (i = 0; i < nblk * 16; i++) blks[i] = 0;
		for (i = 0; i < x.length; i++) blks[i >> 2] |= x.charCodeAt(i) << ((i % 4) * 8);
		blks[i >> 2] |= 0x80 << ((i % 4) * 8);
		blks[nblk * 16 - 2] = x.length * 8;
		return blks;
	}
	var i,
		x = sb(inputString),
		a = 1732584193,
		b = -271733879,
		c = -1732584194,
		d = 271733878,
		olda,
		oldb,
		oldc,
		oldd;
	for (i = 0; i < x.length; i += 16) {
		olda = a;
		oldb = b;
		oldc = c;
		oldd = d;
		a = ff(a, b, c, d, x[i + 0], 7, -680876936);
		d = ff(d, a, b, c, x[i + 1], 12, -389564586);
		c = ff(c, d, a, b, x[i + 2], 17, 606105819);
		b = ff(b, c, d, a, x[i + 3], 22, -1044525330);
		a = ff(a, b, c, d, x[i + 4], 7, -176418897);
		d = ff(d, a, b, c, x[i + 5], 12, 1200080426);
		c = ff(c, d, a, b, x[i + 6], 17, -1473231341);
		b = ff(b, c, d, a, x[i + 7], 22, -45705983);
		a = ff(a, b, c, d, x[i + 8], 7, 1770035416);
		d = ff(d, a, b, c, x[i + 9], 12, -1958414417);
		c = ff(c, d, a, b, x[i + 10], 17, -42063);
		b = ff(b, c, d, a, x[i + 11], 22, -1990404162);
		a = ff(a, b, c, d, x[i + 12], 7, 1804603682);
		d = ff(d, a, b, c, x[i + 13], 12, -40341101);
		c = ff(c, d, a, b, x[i + 14], 17, -1502002290);
		b = ff(b, c, d, a, x[i + 15], 22, 1236535329);
		a = gg(a, b, c, d, x[i + 1], 5, -165796510);
		d = gg(d, a, b, c, x[i + 6], 9, -1069501632);
		c = gg(c, d, a, b, x[i + 11], 14, 643717713);
		b = gg(b, c, d, a, x[i + 0], 20, -373897302);
		a = gg(a, b, c, d, x[i + 5], 5, -701558691);
		d = gg(d, a, b, c, x[i + 10], 9, 38016083);
		c = gg(c, d, a, b, x[i + 15], 14, -660478335);
		b = gg(b, c, d, a, x[i + 4], 20, -405537848);
		a = gg(a, b, c, d, x[i + 9], 5, 568446438);
		d = gg(d, a, b, c, x[i + 14], 9, -1019803690);
		c = gg(c, d, a, b, x[i + 3], 14, -187363961);
		b = gg(b, c, d, a, x[i + 8], 20, 1163531501);
		a = gg(a, b, c, d, x[i + 13], 5, -1444681467);
		d = gg(d, a, b, c, x[i + 2], 9, -51403784);
		c = gg(c, d, a, b, x[i + 7], 14, 1735328473);
		b = gg(b, c, d, a, x[i + 12], 20, -1926607734);
		a = hh(a, b, c, d, x[i + 5], 4, -378558);
		d = hh(d, a, b, c, x[i + 8], 11, -2022574463);
		c = hh(c, d, a, b, x[i + 11], 16, 1839030562);
		b = hh(b, c, d, a, x[i + 14], 23, -35309556);
		a = hh(a, b, c, d, x[i + 1], 4, -1530992060);
		d = hh(d, a, b, c, x[i + 4], 11, 1272893353);
		c = hh(c, d, a, b, x[i + 7], 16, -155497632);
		b = hh(b, c, d, a, x[i + 10], 23, -1094730640);
		a = hh(a, b, c, d, x[i + 13], 4, 681279174);
		d = hh(d, a, b, c, x[i + 0], 11, -358537222);
		c = hh(c, d, a, b, x[i + 3], 16, -722521979);
		b = hh(b, c, d, a, x[i + 6], 23, 76029189);
		a = hh(a, b, c, d, x[i + 9], 4, -640364487);
		d = hh(d, a, b, c, x[i + 12], 11, -421815835);
		c = hh(c, d, a, b, x[i + 15], 16, 530742520);
		b = hh(b, c, d, a, x[i + 2], 23, -995338651);
		a = ii(a, b, c, d, x[i + 0], 6, -198630844);
		d = ii(d, a, b, c, x[i + 7], 10, 1126891415);
		c = ii(c, d, a, b, x[i + 14], 15, -1416354905);
		b = ii(b, c, d, a, x[i + 5], 21, -57434055);
		a = ii(a, b, c, d, x[i + 12], 6, 1700485571);
		d = ii(d, a, b, c, x[i + 3], 10, -1894986606);
		c = ii(c, d, a, b, x[i + 10], 15, -1051523);
		b = ii(b, c, d, a, x[i + 1], 21, -2054922799);
		a = ii(a, b, c, d, x[i + 8], 6, 1873313359);
		d = ii(d, a, b, c, x[i + 15], 10, -30611744);
		c = ii(c, d, a, b, x[i + 6], 15, -1560198380);
		b = ii(b, c, d, a, x[i + 13], 21, 1309151649);
		a = ii(a, b, c, d, x[i + 4], 6, -145523070);
		d = ii(d, a, b, c, x[i + 11], 10, -1120210379);
		c = ii(c, d, a, b, x[i + 2], 15, 718787259);
		b = ii(b, c, d, a, x[i + 9], 21, -343485551);
		a = ad(a, olda);
		b = ad(b, oldb);
		c = ad(c, oldc);
		d = ad(d, oldd);
	}
	return rh(a) + rh(b) + rh(c) + rh(d);
}

export function sameDay(d1: Date, d2: Date) {
	return (
		d1.getFullYear() === d2.getFullYear() &&
		d1.getMonth() === d2.getMonth() &&
		d1.getDate() === d2.getDate()
	);
}

// returns a file name from the content-disposition header of a download response
// https://stackoverflow.com/a/67994693/12424975
export function getFileNameFromResponseHeader(disposition: string): string {
	const utf8FilenameRegex = /filename\*=UTF-8''([\w%\-.]+)(?:; ?|$)/i;
	const asciiFilenameRegex = /^filename=(["']?)(.*?[^\\])\1(?:; ?|$)/i;

	let fileName = "filename";
	if (utf8FilenameRegex.test(disposition)) {
		fileName = decodeURIComponent(utf8FilenameRegex.exec(disposition)?.[1] ?? "filename");
	} else {
		// prevent ReDos attacks by anchoring the ascii regex to string start and
		// slicing off everything before 'filename='
		const filenameStart = disposition.toLowerCase().indexOf("filename=");
		if (filenameStart >= 0) {
			const partialDisposition = disposition.slice(filenameStart);
			const matches = asciiFilenameRegex.exec(partialDisposition);
			if (matches != null && matches[2]) {
				fileName = matches[2];
			}
		}
	}
	return fileName;
}

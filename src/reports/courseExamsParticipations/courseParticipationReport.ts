import { getTranslatedString as _ } from "@/i18n";
import { CourseExamParticipationReport, Event, EventParticipation, User } from "@/models";
import { get } from "lodash";
import { isNumeric } from "@/api/utils";

export enum CourseParticipationReportField {
	STUDENT_EMAIL = "user.email",
	STUDENT_MAT = "user.mat",
	STUDENT_COURSE = "user.course",
	STUDENT_FULL_NAME = "user.full_name",
	EXAM_NAME = "event.name",
	EXAM_SCORE = "participation.score",
	PARTICIPATION_LINK = "participation.link",
}

export interface CourseParticipationReportSettings {
	//  reportType: ReportType;
	fields: CourseParticipationReportField[];
}

const getHeaders = (exams: Event[]) => [
	...["email", "full_name", "mat", "course"],
	...exams.map(e => `participations["${e.id}"].score`),
];

const getHeaderString = (header: string, exams: Event[]) => {
	const examMatch = header.match(/participations\["([^"]+)"\].score/);
	if (examMatch !== null) {
		const examId = examMatch[1];
		return exams.find(e => e.id == examId)?.name ?? "";
	}
	return _("reports.course_participation_report_headers." + header);
};

const getCellValue = (user, field: string) => {
	return get(user, field);
};

export const getCourseExamParticipationsReportAsCsv = (
	report: CourseExamParticipationReport,
	users: User[],
	exams: Event[],
): string => {
	const headers = getHeaders(exams);

	const replacer = (key: string, value: string) => {
		if (value === null) {
			return null;
		}
		if (isNumeric(value)) {
			// ! TODO keep an eye on this, locale problems
			return String(parseFloat(value)).replace(".", ",");
		}

		if (typeof value === "string") {
			return value
				.replace(/\\n/g, "\n")
				.replace(/<img src="[^"]+"/g, "[img]")
				.replace(/"/g, '""');
		}

		return value;
	};

	/**
	 * Report object maps exam id's to list of participations. Since the CSV will contain
	 * one row per user, we want to transform that into a list of objects that represents
	 * users and a field which represents their participations, mapping exam id's to the
	 * corresponding (possibly nonexisting) participation for easy retrieval.
	 */
	const processedUsers = users.map(u => ({
		...u,
		participations: Object.entries(report)
			.flatMap(([eventId, participations]) =>
				participations.map(p => ({
					...p,
					eventId,
				})),
			)
			.filter(p => p.user == u.id)
			.reduce((acc, { eventId, ...p }) => {
				acc[eventId] = {
					...p,
					event: exams.find(e => e.id == eventId) as Event,
				};
				return acc;
			}, {} as Record<string, { user: string; id: string; score: string; event: Event }>),
	}));

	const ret = [
		headers.map(h => getHeaderString(h, exams)).join(","),
		...processedUsers.map(u => {
			return headers
				.map(field =>
					(JSON.stringify(getCellValue(u, field), replacer) ?? "").replace(/\\"/g, '"'),
				)
				.join(",");
		}),
	].join("\r\n");
	return ret;
};

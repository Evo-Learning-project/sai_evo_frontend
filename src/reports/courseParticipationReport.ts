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

const getHeaders = (settings: CourseParticipationReportSettings) =>
	Object.values(CourseParticipationReportField).filter(v => settings.fields.includes(v));

const getHeaderString = (header: string) => {
	return _("reports.course_participation_report_headers." + header);
};

const getCellValue = (participation: EventParticipation, field: string) => {
	get(participation, field);
};

export const getCourseExamParticipationsReportAsCsv = (
	report: CourseExamParticipationReport,
	reportSettings: CourseParticipationReportSettings,
): string => {
	const headers = getHeaders(reportSettings);
	// const replacer = (key: string, value: string) =>
	//   value === null
	//     ? ""
	//     : typeof value === "string"
	//     ? value
	//         .replace(/\\n/g, "\n")
	//         .replace(/<img src="[^"]+"/g, "[img]")
	//         .replace(/"/g, '""')
	//     : value;

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

	const ret = [
		headers.map(h => getHeaderString(h)).join(","),
		...Object.entries(report).map(([eventId, participation]) => {
			// TODO put event and user data into a participation object and pass that one
			return headers
				.map(field =>
					JSON.stringify(getCellValue(participation, field), replacer).replace(
						/\\"/g,
						'"',
					),
				)
				.join(",");
		}),
	].join("\r\n");
	return ret;
};

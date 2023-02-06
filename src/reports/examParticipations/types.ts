// export interface DataFrequency<T> {
// 	datum: T;
// 	frequency: number;
// }

export enum ReportSettingsPreset {
	MAT_AND_SCORES,
	FULL_NAME_AND_SCORES,
	ALL_FIELDS,
	CUSTOM,
}

export enum ReportType {
	PDF = "pdf",
	CSV = "csv",
}

export enum ReportField {
	STUDENT_EMAIL = "email",
	STUDENT_MAT = "mat",
	STUDENT_COURSE = "course",
	STUDENT_FULL_NAME = "fullName",
	SCORE = "score",
	EXERCISES_LABEL = "exercisesLabel",
	EXERCISES_ANSWER = "exercisesAnswer",
	EXERCISES_SCORE = "exercisesScore",
}

export interface ReportSettings {
	//  reportType: ReportType;
	fields: ReportField[];
}

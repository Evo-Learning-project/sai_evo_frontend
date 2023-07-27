import { EventParticipation, ExerciseSolution } from "@/models";
import { FieldList } from "./autoSave";
import { SelectableOption } from "./interfaces";
import {
	Event,
	EventParticipationSlot,
	EventParticipationState,
	Exercise,
	ExerciseChoice,
	ExerciseState,
	ExerciseTestCase,
	ExerciseTestCaseType,
	ExerciseType,
	ParticipationAssessmentProgress,
} from "./models";
import { icons as exerciseTypesIcons } from "@/assets/exerciseTypesIcons";
import { icons as exerciseStatesIcons } from "@/assets/exerciseStatesIcons";
import { icons as testCaseTypeIcons } from "@/assets/exerciseTestCaseTypeIcons";
import { getTranslatedString as _ } from "@/i18n";
import { ColDef } from "ag-grid-community";
import { icons as assessmentStateIcons } from "@/assets/assessmentStateIcons";
import { icons as participationStateIcons } from "@/assets/participationStateIcons";
import { isDemoMode } from "./utils";

export const TEST_CASE_AUTO_SAVE_DEBOUNCE_TIME_MS = 3000;
export const TEST_CASE_AUTO_SAVE_DEBOUNCED_FIELDS: FieldList<ExerciseTestCase> = [
	"code",
	"text",
	"stdin",
	"expected_stdout",
];

export const EVENT_AUTO_SAVE_DEBOUNCE_TIME_MS = 3000;
export const EVENT_AUTO_SAVE_DEBOUNCED_FIELDS: FieldList<Event> = [
	"name",
	"instructions",
	"time_limit_seconds",
	"time_limit_exceptions",
];

export const EXERCISE_AUTO_SAVE_DEBOUNCE_TIME_MS = 3000;
export const EXERCISE_AUTO_SAVE_DEBOUNCED_FIELDS: FieldList<Exercise> = ["label", "text"];

export const EXERCISE_SOLUTION_AUTO_SAVE_DEBOUNCE_TIME_MS = 3000;
export const EXERCISE_SOLUTION_AUTO_SAVE_DEBOUNCE_FIELDS: FieldList<ExerciseSolution> = [
	"content",
];

export const EXERCISE_CHOICE_AUTO_SAVE_DEBOUNCE_TIME_MS = 3000;
export const EXERCISE_CHOICE_AUTO_SAVE_DEBOUNCED_FIELDS: FieldList<ExerciseChoice> = [
	"text",
	"correctness",
];

export const EVENT_PARTICIPATION_SLOT_DEBOUNCE_TIME_MS = 10000;
export const EVENT_PARTICIPATION_SLOT_DEBOUNCED_FIELDS: FieldList<EventParticipationSlot> =
	["answer_text"];

export const exerciseTypeOptions: SelectableOption[] = (
	Object.keys(ExerciseType) as unknown[] as ExerciseType[]
)
	.filter((key: string | number) => parseInt(key as string) == key)
	.map(key => ({
		icons: exerciseTypesIcons[key],
		value: parseInt(String(key)),
		content: _("exercise_types." + key),
	}));

export const exerciseStateOptions: SelectableOption[] = (
	Object.keys(ExerciseState) as unknown[] as ExerciseState[]
)
	.filter((key: string | number) => parseInt(key as string) == key)
	.map(key => ({
		icons: exerciseStatesIcons[key],
		value: parseInt(String(key)),
		content: _("exercise_states." + key),
		description: _("exercise_states_descriptions." + key),
	}));

export const testcaseTypeOptions: SelectableOption[] = (
	Object.keys(ExerciseTestCaseType) as unknown[] as ExerciseTestCaseType[]
)
	.filter((key: string | number) => parseInt(key as string) == key)
	.map(key => ({
		icons: testCaseTypeIcons[key],
		value: parseInt(String(key)),
		content: _("testcase_types." + key),
		//description: _("exercise_states_descriptions." + key),
	}));

export enum ProgrammingExerciseTabs {
	TEXT,
	EDITOR,
	TEST_CASES,
	EXECUTION_RESULTS,
}

export const examInsightsPageTourSteps = [
	{
		target: "#insights-btn",
		header: {
			title: _("tour.exam_insights_header"),
		},
		content: _("tour.exam_insights_content"),
		params: {
			placement: "bottom",
		},
	},
];

export const newSidebarHelpCenterTourSteps = [
	{
		target: "#toggle-sidebar",
		header: {
			title: _("tour.new_sidebar_header"),
		},
		content: _("tour.new_sidebar_content"),
	},
	{
		target: "#help-center",
		header: {
			title: _("tour.help_center_header"),
		},
		content: _("tour.help_center_content"),
	},
];

export const demoLoginTourSteps = [
	{
		target: "#login-btn",
		header: {
			title: _("tour.demo_welcome_header"),
		},
		content: _("tour.demo_welcome_content"),
		params: { placement: "top" },
	},
];

export const demoCourseTourSteps = [
	{
		target: "#course-0",
		header: {
			title: _("tour.demo_course_header"),
		},
		content: _("tour.demo_course_content"),
		params: { placement: "top" },
	},
];

export const newMaterialModuleTourSteps = [
	{
		// material
		target: "#sidebar-option-3",
		header: {
			title: _("tour.new_material_header"),
		},
		content: _("tour.new_material_content"),
		params: {
			placement: "right",
		},
	},
];

export const teacherTourSteps = [
	{
		// exercises
		target: "#sidebar-option-2",
		header: {
			title: _("tour.add_exercises_header"),
		},
		content: _("tour.add_exercises_content"),
		params: {
			placement: "right",
		},
	},
	{
		// exams
		target: "#sidebar-option-1",
		header: {
			title: _("tour.add_exams_header"),
		},
		content: _("tour.add_exams_content"),
		params: {
			placement: "right",
		},
	},
	{
		// material
		target: "#sidebar-option-3",
		header: {
			title: _("tour.material_header"),
		},
		content: _("tour.material_content"),
		params: {
			placement: "right",
		},
	},
	{
		// permissions
		target: "#sidebar-option-5",
		header: {
			title: _("tour.permissions_header"),
		},
		content: _("tour.permissions_content"),
		params: {
			placement: "right",
		},
	},
];

export const demoStudentTourSteps = [
	{
		target: "body",
		header: {
			title: _("tour.demo_student_header"),
		},
		content: _("tour.demo_student_content"),
		// params: {
		// 	placement: "bottom",
		// },
	},
	{
		target: "#create-practice-btn",
		header: {
			title: _("tour.demo_practice_header"),
		},
		content: _("tour.demo_practice_content"),
		params: {
			placement: "bottom",
		},
	},
	{
		target: ".v-sidebar-menu", //".vsm--item:nth-child(4) .vsm--link .vsm--title span",
		header: {
			title: _("tour.demo_popular_exercises_header"),
		},
		content: _("tour.demo_popular_exercises_content"),
		params: {
			placement: "right",
		},
	},
	{
		target: ".v-sidebar-menu", //".vsm--item:nth-child(5)",
		header: {
			title: _("tour.demo_leaderboard_header"),
		},
		content: _("tour.demo_leaderboard_content"),
		params: {
			placement: "right",
		},
	},
];

export const demoTeacherTourSteps = [
	{
		// exercises
		target: "#sidebar-option-2",
		header: {
			title: _("tour.demo_exercises_header"),
		},
		content: _("tour.demo_exercises_content"),
		params: {
			placement: "right",
		},
	},
	{
		// exams
		target: "#sidebar-option-1",
		header: {
			title: _("tour.demo_exams_header"),
		},
		content: _("tour.demo_exams_content"),
		params: {
			placement: "right",
		},
	},
	{
		// solutions
		target: "#sidebar-option-4",
		header: {
			title: _("tour.demo_solutions_header"),
		},
		content: _("tour.demo_solutions_content"),
		params: {
			placement: "right",
		},
	},
	{
		// permissions
		target: "#sidebar-option-4",
		header: {
			title: _("tour.demo_permissions_header"),
		},
		content: _("tour.demo_permissions_content"),
		params: {
			placement: "right",
		},
	},
	{
		// exams
		target: "#help-center",
		header: {
			title: _("tour.demo_help_center_header"),
		},
		content: _("tour.demo_help_center_content"),
		params: {
			placement: "bottom",
		},
	},
];

export const tourOptions = {
	highlight: true,
	labels: {
		buttonSkip: _("tour.skip"),
		buttonPrevious: _("tour.previous"),
		buttonNext: _("tour.next"),
		buttonStop: _("tour.finish"),
	},
};

export const programmingExerciseTabsOptions: SelectableOption[] = [
	{
		value: ProgrammingExerciseTabs.TEXT,
		content: _("programming_exercise.tab_text"),
		icons: ["description-sm"],
	},
	// {
	// 	value: ProgrammingExerciseTabs.EDITOR,
	// 	content: _("programming_exercise.tab_editor"),
	// 	icons: ["code-sm"],
	// },
	{
		value: ProgrammingExerciseTabs.EXECUTION_RESULTS,
		content: _("programming_exercise.tab_execution_results"),
		icons: ["code-sm"],
	},
	{
		value: ProgrammingExerciseTabs.TEST_CASES,
		content: _("programming_exercise.tab_testcases"),
		icons: ["integration_instructions-sm"],
	},
];

export const courseSelectionOptions: SelectableOption[] = [
	{ value: "A", content: "Corso A" },
	{ value: "B", content: "Corso B" },
	{ value: "C", content: "Corso C" },
];

export const CLOZE_PLACEHOLDER_REGEX = new RegExp("\\[\\[([A-Za-z0-9]+)\\]\\]", "g");
export const CLOZE_SEPARATOR = (id: string) => `[[${id}]]`;

// returns the headers for the CourseInsights table
export const getCourseInsightsHeaders = (
	exams: Event[],
	examsColors: Record<string, string>,
): ColDef[] => [
	{ field: "id", hide: true },
	{
		field: "email",
		headerName: _("event_participation_headings.email"),
		filterParams: {
			filterOptions: ["contains"],
			suppressAndOrCondition: true,
		},
		filter: "agTextColumnFilter",
		width: 300,
		resizable: true,
	},
	{
		field: "fullName",
		headerName: _("misc.full_name"),
		filterParams: {
			filterOptions: ["contains"],
			suppressAndOrCondition: true,
		},
		filter: "agTextColumnFilter",
		minWidth: 120,
		resizable: true,
		flex: 1,
	},
	{
		field: "mat",
		headerName: _("event_participation_headings.mat"),
		filterParams: {
			filterOptions: ["contains"],
			suppressAndOrCondition: true,
		},
		filter: "agTextColumnFilter",
		resizable: true,
	},
	...(isDemoMode()
		? []
		: [
				{
					field: "course",
					headerName: _("event_participation_headings.course"),
					filterParams: {
						filterOptions: ["contains"],
						suppressAndOrCondition: true,
					},
					filter: "agTextColumnFilter",
					resizable: true,
				},
		  ]),
	{
		field: "score_sum",
		headerName: _("course_insights.score_sum"),
		filterParams: {
			allowedCharPattern: "\\d\\-\\,", // note: ensure you escape as if you were creating a RegExp from a string
			numberParser: (text: string | null) => {
				return text == null ? null : parseFloat(text.replace(",", "."));
			},
			filterOptions: [
				"equals",
				"notEqual",
				"lessThan",
				"lessThanOrEqual",
				"greaterThan",
				"greaterThanOrEqual",
			],
			suppressAndOrCondition: true,
		},
		filter: "agNumberColumnFilter",
	},
	{
		field: "score_average",
		headerName: _("course_insights.score_average"),
		filterParams: {
			allowedCharPattern: "\\d\\-\\,", // note: ensure you escape as if you were creating a RegExp from a string
			numberParser: (text: string | null) => {
				return text == null ? null : parseFloat(text.replace(",", "."));
			},
			filterOptions: [
				"equals",
				"notEqual",
				"lessThan",
				"lessThanOrEqual",
				"greaterThan",
				"greaterThanOrEqual",
			],
			suppressAndOrCondition: true,
		},
		filter: "agNumberColumnFilter",
	},
	...exams.map((e, i) => ({
		//autoHeight: true,
		wrapText: true,
		field: "exam_" + e.id,
		headerName:
			e.name.trim().length > 0 ? e.name.trim() : _("event_preview.unnamed_event"),
		width: 100,
		resizable: true,
		filterParams: {
			allowedCharPattern: "\\d\\-\\,", // note: ensure you escape as if you were creating a RegExp from a string
			numberParser: (text: string | null) => {
				return text == null ? null : parseFloat(text.replace(",", "."));
			},
			filterOptions: [
				"equals",
				"notEqual",
				"lessThan",
				"lessThanOrEqual",
				"greaterThan",
				"greaterThanOrEqual",
			],
			suppressAndOrCondition: true,
		},
		filter: "agNumberColumnFilter",
		headerComponentParams: {
			template:
				'<div class="ag-cell-label-container" role="presentation">' +
				'  <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>' +
				'  <div ref="eLabel" class="ag-header-cell-label" role="presentation">' +
				'    <span ref="eSortOrder" class="ag-header-icon ag-sort-order" ></span>' +
				'    <span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon" ></span>' +
				'    <span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon" ></span>' +
				'    <span ref="eSortNone" class="ag-header-icon ag-sort-none-icon" ></span>' +
				`    <span style='background-color: ${
					examsColors[e.id]
				}; margin-right: 5px; min-width: 10px; min-height: 10px; width: 10px; height: 10px; border-radius: 50%;'></span>` +
				'    <span ref="eText" class="ag-header-cell-text" role="columnheader"></span>' +
				'    <span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>' +
				"  </div>" +
				"</div>",
		},
	})),
];

// returns the headers for EventParticipationMonitor table
export const getEventParticipationMonitorHeaders = (
	resultsMode: boolean, // true if the event is over
	eventParticipations: EventParticipation[],
): ColDef[] => {
	if ((eventParticipations?.length ?? 0) === 0) {
		return [];
	}
	const ret = [
		{ field: "id", hide: true },
		{
			field: "email",
			headerName: _("event_participation_headings.email"),
			filterParams: {
				filterOptions: ["contains"],
				suppressAndOrCondition: true,
			},
			filter: "agTextColumnFilter",
			width: 300,
			resizable: true,
			cellRenderer: "EventParticipationEmailRenderer",
			checkboxSelection: true,
			headerCheckboxSelection: true,
			headerCheckboxSelectionFilteredOnly: true,
		},
		{
			field: "fullName",
			headerName: _("misc.full_name"),
			filterParams: {
				filterOptions: ["contains"],
				suppressAndOrCondition: true,
			},
			filter: "agTextColumnFilter",
			minWidth: 120,
			resizable: true,
			flex: 1,
		},
		{
			field: "mat",
			headerName: _("event_participation_headings.mat"),
			filterParams: {
				filterOptions: ["contains"],
				suppressAndOrCondition: true,
			},
			filter: "agTextColumnFilter",
			resizable: true,
		},
		...(isDemoMode()
			? []
			: [
					{
						field: "course",
						headerName: _("event_participation_headings.course"),
						filterParams: {
							filterOptions: ["contains"],
							suppressAndOrCondition: true,
						},
						filter: "agTextColumnFilter",
						resizable: true,
					},
			  ]),
		{ field: "visibility", hide: true },
		...(resultsMode
			? [
					{
						field: "state", // assessment progress
						width: 90,
						headerName: _("event_participation_headings.state"),
						cellRenderer: "EventParticipationAssessmentStateRenderer",
					},
			  ]
			: []),
		...(!resultsMode
			? [
					{
						field: "state", // participation state (in progress / turned in)
						width: 90,
						headerName: _("event_participation_headings.participation_state"),
						cellRenderer: "EventParticipationStateRenderer",
					},
			  ]
			: []),
	] as ColDef[];
	if (resultsMode) {
		ret.push({
			field: "score",
			type: "numericColumn",
			width: 60,
			resizable: true,
			headerName: _("event_participation_headings.grade"),
		});
	}

	// TODO FIXME ! uses assumption that all participations have the same number of slots
	// add a heading for each slot
	(eventParticipations[0] as EventParticipation).slots.forEach(s =>
		ret.push({
			width: 90,
			...(resultsMode ? { type: "numericColumn" } : {}),
			field: "slot-" + ((s.slot_number as number) + 1),
			headerName:
				_("event_participation_headings.exercise") +
				" " +
				((s.slot_number as number) + 1),
			cellRenderer: resultsMode
				? "EventParticipationSlotScoreRenderer"
				: "EventParticipationSlotCompletionRenderer", //renderEventParticipationSlotCell(resultsMode),
		}),
	);
	return ret;
};

export const MAX_PRACTICE_EXERCISE_COUNT = 500;

export const sanitizeOptions = {
	allowedTags: [
		"h1",
		"h2",
		"h3",
		"h4",
		"h5",
		"h6",
		"div",
		"hr",
		"li",
		"ol",
		"p",
		"pre",
		"ul",
		"a",
		"b",
		"img",
		"br",
		"cite",
		"code",
		"em",
		"i",
		"s",
		"samp",
		"small",
		"span",
		"strong",
		"sub",
		"sup",
		"time",
		"u",
		"caption",
		"col",
		"colgroup",
		"table",
		"tbody",
		"td",
		"tfoot",
		"th",
		"thead",
		"tr",
	],
	disallowedTagsMode: "discard",
	allowedAttributes: {
		a: ["href", "name", "target"],
		img: ["src", "alt", "title", "width", "height", "data"],
	},
	// Lots of these won't come up by default because we don't allow them
	selfClosing: ["img", "br", "hr", "area", "base", "basefont", "input", "link", "meta"],
	// URL schemes we permit
	allowedSchemes: ["http", "https", "ftp", "mailto", "tel", "data"],
	allowedSchemesByTag: {},
	allowedSchemesAppliedToAttributes: ["href", "src", "cite"],
	allowProtocolRelative: true,
	enforceHtmlBoundary: false,
};

import {
	Exercise,
	ExerciseSolution,
	ExerciseState,
	ExerciseTestCaseType,
	ExerciseType,
} from "../../models";

export const exercise1: Exercise = {
	id: "11111",
	text: "Scrivi una funzione ricorsiva `massimoElemento(arr)` che riceve in input un array di numeri interi e restituisce il massimo elemento presente nell'array.",
	exercise_type: ExerciseType.JS,
	all_or_nothing: false,
	state: ExerciseState.PRIVATE,
	testcases: [
		{
			id: "1",
			code: 'console.assert(massimoElemento([1, 2, 3, 4, 5]) === 5, "Test case 1 fallito");',
			expected_stdout: "",
			stdin: "",
			text: "",
			testcase_type: ExerciseTestCaseType.SHOW_CODE_SHOW_TEXT,
		},
		{
			id: "2",
			code: 'console.assert(massimoElemento([-5, -3, -1, -7, -4]) === -1, "Test case 2 fallito");',
			expected_stdout: "",
			stdin: "",
			text: "",
			testcase_type: ExerciseTestCaseType.SHOW_CODE_SHOW_TEXT,
		},
		{
			id: "3",
			code: 'console.assert(massimoElemento([5, 5, 5, 5, 5]) === 5, "Test case 3 fallito");',
			expected_stdout: "",
			stdin: "",
			text: "",
			testcase_type: ExerciseTestCaseType.SHOW_CODE_SHOW_TEXT,
		},
		{
			id: "4",
			code: 'console.assert(massimoElemento([1]) === 1, "Test case 4 fallito");',
			expected_stdout: "",
			stdin: "",
			text: "",
			testcase_type: ExerciseTestCaseType.SHOW_CODE_SHOW_TEXT,
		},
		{
			id: "5",
			code: 'console.assert(massimoElemento([3, 1, 7, 2, 6]) === 7, "Test case 5 fallito");',
			expected_stdout: "",
			stdin: "",
			text: "",
			testcase_type: ExerciseTestCaseType.SHOW_CODE_SHOW_TEXT,
		},
	],
	public_tags: [
		{
			id: "1",
			name: "ricorsione",
		},
		{
			id: "2",
			name: "array",
		},
	],
	private_tags: [
		{
			id: "3",
			name: "generato automaticamente",
		},
	],
	requires_typescript: false,
};

export const exercise2: Exercise = {
	id: "22222",
	state: ExerciseState.PRIVATE,
	text: "Scrivi una funzione ricorsiva `sommaElementi(arr)` che riceve in input un array di numeri interi e restituisce la somma di tutti gli elementi dell'array.",
	testcases: [
		{
			id: "6",
			code: 'console.assert(sommaElementi([1, 2, 3, 4, 5]) === 15, "Test case 1 fallito");',
			expected_stdout: "",
			stdin: "",
			text: "",
			testcase_type: ExerciseTestCaseType.SHOW_CODE_SHOW_TEXT,
		},
		{
			id: "7",
			code: 'console.assert(sommaElementi([-5, -3, -1, -7, -4]) === -20, "Test case 2 fallito");',
			expected_stdout: "",
			stdin: "",
			text: "",
			testcase_type: ExerciseTestCaseType.SHOW_CODE_SHOW_TEXT,
		},
		{
			id: "8",
			code: 'console.assert(sommaElementi([5, 5, 5, 5, 5]) === 25, "Test case 3 fallito");',
			expected_stdout: "",
			stdin: "",
			text: "",
			testcase_type: ExerciseTestCaseType.SHOW_CODE_SHOW_TEXT,
		},
		{
			id: "9",
			code: 'console.assert(sommaElementi([1]) === 1, "Test case 4 fallito");',
			expected_stdout: "",
			stdin: "",
			text: "",
			testcase_type: ExerciseTestCaseType.SHOW_CODE_SHOW_TEXT,
		},
		{
			id: "10",
			code: 'console.assert(sommaElementi([3, 1, 7, 2, 6]) === 19, "Test case 5 fallito");',
			expected_stdout: "",
			stdin: "",
			text: "",
			testcase_type: ExerciseTestCaseType.SHOW_CODE_SHOW_TEXT,
		},
	],
	public_tags: [
		{
			id: "1",
			name: "ricorsione",
		},
		{
			id: "2",
			name: "array",
		},
	],
	private_tags: [
		{
			id: "3",
			name: "generato automaticamente",
		},
	],
	requires_typescript: false,
	exercise_type: ExerciseType.JS,
	all_or_nothing: false,
};

export const mockSolutions: Record<string, ExerciseSolution> = {
	"11111": {
		id: "1",
		content: `function massimoElemento(arr, index = 0, max = -Infinity) {
            if (index === arr.length) {
              return max;
            }
            return massimoElemento(arr, index + 1, Math.max(arr[index], max));
          }`,
		score: 0,
		comments: [],
		is_bookmarked: false,
		user: null,
	},
	"22222": {
		id: "2",
		content: `function sommaElementi(arr, index = 0, sum = 0) {
            if (index === arr.length) {
              return sum;
            }
            return sommaElementi(arr, index + 1, sum + arr[index]);
          }`,
		score: 0,
		comments: [],
		is_bookmarked: false,
		user: null,
	},
};

export const mockExercises = [exercise1, exercise2];

import { Exercise, ExerciseState, ExerciseType } from "@/models";
import {
	getExerciseTypeFromMoodleQuestion,
	getMoodleClozeQuestionsAsExercises,
	getTagsFromMoodleCategory,
	processMoodleQuestionText,
	xmlToJson,
} from "./utils";
import { ImportedExerciseData, MoodleQuestion } from "./interfaces";
import { DataFormat } from "./types";

// TODO actually implement
const importExercisesFromEvoJson = (data: string) => JSON.parse(data);

const importExercisesFromMoodleXml = async (
	data: string,
): Promise<ImportedExerciseData> => {
	let moodleExercises;
	// eslint-disable-next-line no-useless-catch
	try {
		moodleExercises = (await xmlToJson(data)).quiz.question as MoodleQuestion[];
	} catch (e: any) {
		throw e;
		// return {
		//   data: [],
		//   extras: null,
		//   errors: [e],
		// };
	}
	const ret: ImportedExerciseData = {
		data: [] as Exercise[],
		extras: {},
		errors: [],
	};

	console.log(moodleExercises);

	moodleExercises.forEach(q => {
		const questionType = q.$.type;

		if (questionType === "category") {
			ret.extras.tags = getTagsFromMoodleCategory(q.category);
		} else {
			const exerciseType = getExerciseTypeFromMoodleQuestion(q);
			if (typeof exerciseType === "undefined") {
				ret.errors?.push("Unsupported exercise type: " + questionType);
				return;
			}
			ret.data.push({
				id: "",
				state: ExerciseState.DRAFT,
				label: q.name[0].text[0],
				text: processMoodleQuestionText(q),
				exercise_type: exerciseType,
				choices: (q.answer ?? []).map(a => ({
					text: a.text[0],
					correctness: parseFloat(a.$.fraction) * 100,
				})),
				sub_exercises: getMoodleClozeQuestionsAsExercises(q),
			} as Exercise);
		}
	});

	console.log(ret);

	return ret;
};

const importFunctions: Record<
	DataFormat,
	(data: string) => Promise<ImportedExerciseData>
> = {
	[DataFormat.MOODLE_XML]: importExercisesFromMoodleXml,
	[DataFormat.EVO_JSON]: importExercisesFromEvoJson,
};

export const getImportedData = async (
	data: string,
	fromFormat: DataFormat,
): Promise<ImportedExerciseData> => await importFunctions[fromFormat](data);

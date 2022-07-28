import { CLOZE_SEPARATOR } from "./../const";
import { Exercise, ExerciseType } from "@/models";
import { MoodleCategory, MoodleQuestion } from "./interfaces";

const parseString = require("xml2js").parseString;

export const xmlToJson = async (xml: string): Promise<any> =>
  new Promise((resolve, reject) => {
    parseString(xml, (err: any, result: any) =>
      err ? reject(err) : resolve(result)
    );
  });

export const getTagsFromMoodleCategory = (category: MoodleCategory): string[] =>
  category[0].text[0].split("$course$/")[1].split("/");

export const getExerciseTypeFromMoodleQuestion = (
  q: MoodleQuestion
): ExerciseType | undefined => {
  const questionType = q.$.type;
  if (questionType === "truefalse") {
    return ExerciseType.MULTIPLE_CHOICE_SINGLE_POSSIBLE;
  }
  if (questionType === "multichoice") {
    return JSON.parse(q.single[0])
      ? ExerciseType.MULTIPLE_CHOICE_SINGLE_POSSIBLE
      : ExerciseType.MULTIPLE_CHOICE_MULTIPLE_POSSIBLE;
  }
  if (questionType === "cloze") {
    return ExerciseType.COMPLETION;
  }
  return undefined;
};

const clozeSubQuestionRegex =
  /\{(\d*\s*):(MULTICHOICE|MC):(=?([^#}]*)\s*#?\s*([^~}]*\s*)?)+\}/g;

export const getMoodleClozeQuestionsAsExercises = (
  q: MoodleQuestion
): Exercise[] => {
  const answerRegex = /(=?)\s*(%[-\d]+%)?([^~]+)/;

  const ret = [] as Exercise[];

  const matches = q.questiontext[0].text[0].matchAll(clozeSubQuestionRegex);
  for (const match of matches) {
    const childWeight = match[1];

    const child: Exercise = {
      id: "",
      text: "",
      exercise_type: ExerciseType.MULTIPLE_CHOICE_SINGLE_POSSIBLE,
      choices: [],
      child_weight: childWeight ? parseFloat(childWeight) : 1,
    };
    const answers = match[3].split("~");
    for (const answer of answers) {
      const answerMatch = answer.match(answerRegex) as RegExpMatchArray;
      const isCorrectAnswer = answerMatch[1] === "=";
      const answerScore = (answerMatch[2] ?? "").replace(/%/g, ""); // TODO check validity
      const answerText = answerMatch[3] as string;

      child.choices?.push({
        text: answerText,
        id: "",
        // TODO fix and use 1
        correctness: isCorrectAnswer ? 1 : parseFloat(answerScore) / 100 || 0,
      });
    }
    ret.push(child);
  }
  return ret;
};

export const processMoodleQuestionText = (q: MoodleQuestion): string => {
  const fileNamesAndContents = (q.questiontext[0].file ?? []).map((f) => ({
    name: f.$.name,
    content: f._,
  }));
  const ret = q.questiontext[0].text[0];

  const imgRegex = /<img[^>]+src="?([^"\s]+)"?[^>]*\/?>/g;
  return (
    ret
      // substitute any cloze questions with the CLOZE_SEPARATOR sequence
      .replace(clozeSubQuestionRegex, CLOZE_SEPARATOR)
      // import images
      .replace(imgRegex, (img, src: string) =>
        img.replace(
          src,
          `data:image/jpeg;base64,${
            fileNamesAndContents.find(
              (f) => f.name === src.substring("@@PLUGINFILE@@/".length)
            )?.content ?? ""
          }`
        )
      )
  );
};

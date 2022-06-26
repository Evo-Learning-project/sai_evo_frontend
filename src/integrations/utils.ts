import { ExerciseType } from "@/models";
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
  return undefined;
};

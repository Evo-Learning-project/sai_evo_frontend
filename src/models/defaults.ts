import {
  Exercise,
  ExerciseChoice,
  ExerciseState,
  ExerciseType,
} from '.';

export const getBlankChoice = (): ExerciseChoice => ({
  text: '',
  score: 0,
});

export const getBlankExercise = (): Exercise => ({
  label: 'ex-01-abc',
  text: 'wreh09rtruw9r0ertirwereu09rtrwe90uer90rweu09errwqjeoweru09t3reiwqojadsfihur9e0tiwropjadsifgtr',
  exercise_type: null,
  state: ExerciseState.DRAFT,
  solution: '',
  tags: [{ name: 'tag1' }, { name: 'tag2' }, { name: 'tag3' }],
  choices: [],
});

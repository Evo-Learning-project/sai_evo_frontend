export enum ExerciseType {
  MULTIPLE_CHOICE_SINGLE_POSSIBLE,
  MULTIPLE_CHOICE_MULTIPLE_POSSIBLE,
  OPEN_ANSWER,
  COMPLETION,
  AGGREGATED,
  JS,
  ATTACHMENT,
  //EXTERNAL_RESOURCE,
}

export enum ExerciseState {
  DRAFT,
  PRIVATE,
  PUBLIC,
}

export enum EventType {
  SELF_SERVICE_PRACTICE,
  IN_CLASS_PRACTICE,
  EXAM,
  HOME_ASSIGNMENT,
  EXTERNAL,
}

export enum EventState {
  DRAFT,
  PLANNED,
  OPEN,
  CLOSED,
}

export enum EventTemplateRuleType {
  TAG_BASED,
  ID_BASED,
  FULLY_RANDOM,
}

export enum EventParticipationState {
  IN_PROGRESS,
  TURNED_IN,
}

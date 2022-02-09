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

export enum ParticipationAssessmentProgress {
  NOT_ASSESSED,
  PARTIALLY_ASSESSED,
  FULLY_ASSESSED,
}

export enum AssessmentVisibility {
  DRAFT,
  FOR_REVIEW,
  PUBLISHED,
}

export enum AssessmentSlotState {
  NOT_ASSESSED,
  ASSESSED,
}

export enum CoursePrivilege {
  //ALL_PRIVILEGES = '__all__',
  UPDATE_COURSE = 'update_course',
  ACCESS_EXERCISES = 'access_exercises',
  MANAGE_EXERCISES = 'manage_exercises',
  ASSESS_PARTICIPATIONS = 'assess_participations',
  MANAGE_EVENTS = 'manage_events',
}

import { SearchFilter } from "@/api/interfaces";
import { ErrorMessage } from "@/interfaces";
import {
  Course,
  EventParticipation,
  Exercise,
  Tag,
  Event,
  User,
} from "@/models";

export interface StudentState {
  currentEventParticipation: EventParticipation | null;
  eventParticipations: EventParticipation[];
  editingEvent: Event | null;
  previewingEvent: Event | null;
}
export interface TeacherState {
  exercises: Exercise[];
  events: Event[];
  eventParticipations: EventParticipation[];
  currentExercisePage: number;
  users: User[];
}
export interface SharedState {
  user: User;
  courses: Course[];
  token: string;
  refreshToken: string;
  loading: boolean; // global spinner
  firstLoading: boolean; // skeletons on page
  localLoading: boolean; // spinners in buttons and local components
  pageWideErrorData: ErrorMessage | null; // for errors that entirely replace the current view
  errorNotificationData: ErrorMessage | null; // for small errors that can be ignored
  saving: boolean;
  savingError: boolean;
  showSuccessFeedback: boolean;
  tags: Tag[];
}

interface StoreOperationParameters<T> {
  courseId: string;
  eventId: string;
  exerciseId: string;
  ruleId: string;
  clauseId: string;
  slotId: string;
  templateId: string;
  filters: SearchFilter;
  children: "choices" | "sub_exercises" | "testcases";
  childType: "choice" | "sub_exercise" | "testcase";
  fromFirstPage: boolean;
  participationIds: string[];
  participationId: string;
  //payload: T;
  changes: Partial<T>;
  mutate: boolean;
  reFetch: boolean;
}

export type ActionPayload<T> = Partial<StoreOperationParameters<T>> & {
  payload: T;
};

export type MutationPayload<T> = Partial<StoreOperationParameters<T>> & {
  payload: T;
};

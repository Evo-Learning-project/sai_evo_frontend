/* eslint-disable @typescript-eslint/no-explicit-any */
// interface IAutoSave<T> {
//   instance: T;
//   unsavedChanges: Record<keyof T, unknown>;
//   disremotePatchFunction: () => Promise<void>;
//   debouncedFields: (keyof T)[];
// }

import { debounce, DebouncedFunc } from 'lodash';
import {
  Event,
  Exercise,
  ExerciseChoice,
  getBlankExam,
} from './models';
import store from './store';

type EmptyObject = any; // Record<string, never>;

type RemotePatchFunction<T> = (
  changes: FieldValuesObject<T>
) => Promise<void>;
type PatchFunction<T> = (changes: FieldValuesObject<T>) => void;
type FieldList<T> = (keyof T)[];
type FieldValuesObject<T> = Partial<T>; // Record<keyof T, T[keyof T]> | EmptyObject;

export class AutoSave<T> {
  instance: T;
  unsavedChanges: FieldValuesObject<T>;
  beforeChanges: FieldValuesObject<T>;
  remotePatchFunction: DebouncedFunc<RemotePatchFunction<T>>;
  localPatchFunction: PatchFunction<T>;
  errorFunction?: (e: any) => void;
  successFunction?: () => void;
  debouncedFields: FieldList<T>;
  revertOnFailure: boolean;
  alwaysPatchLocal: boolean;

  constructor(
    instance: T,
    remotePatchFunction: RemotePatchFunction<T>,
    localPatchFunction: PatchFunction<T>,
    debouncedFields: FieldList<T>,
    debounceTime: number,
    successFunction?: () => void,
    errorFunction?: (e: any) => void,
    revertOnFailure = false,
    alwaysPatchLocal = true
  ) {
    this.instance = instance;
    this.localPatchFunction = localPatchFunction;
    this.remotePatchFunction = debounce(
      this.wrapRemotePatchFunction(remotePatchFunction),
      debounceTime
    );
    this.debouncedFields = debouncedFields;
    this.unsavedChanges = {};
    this.beforeChanges = {};
    this.successFunction = successFunction;
    this.errorFunction = errorFunction;
    this.revertOnFailure = revertOnFailure;
    this.alwaysPatchLocal = alwaysPatchLocal;
  }

  async onChange({
    field,
    value,
  }: {
    field: keyof T;
    value: unknown;
  }): Promise<void> {
    console.log('calling onChange', { field, value });

    // record new change to field
    this.unsavedChanges[field] = value as any;

    // make deep copy of field that's about to change
    this.beforeChanges[field] = JSON.parse(
      JSON.stringify(this.instance[field])
    );

    if (this.alwaysPatchLocal) {
      // instantly update in-memory instance
      this.localPatchFunction({ [field]: value } as any);
    }

    // dispatch update to backend
    await this.remotePatchFunction(this.unsavedChanges);
    if (!this.debouncedFields.includes(field)) {
      // field isn't to be debounced; call remote update immediately
      this.remotePatchFunction.flush();
    }
  }

  private wrapRemotePatchFunction(
    callback: RemotePatchFunction<T>
  ): RemotePatchFunction<T> {
    /**
     * Wraps the callback into a function that awaits the callback first, and
     * if it is successful, then empties the unsaved changes object
     */
    return async (changes: FieldValuesObject<T>) => {
      try {
        await callback(changes);
        if (!this.alwaysPatchLocal) {
          // update in-memory instance
          this.localPatchFunction(changes);
        }
        this.unsavedChanges = {};
        this.beforeChanges = {};
        this.successFunction?.();
      } catch (e) {
        this.errorFunction?.(e);
        if (this.revertOnFailure) {
          console.log('rolling back changes', this.beforeChanges);
          // roll back unsaved changes
          this.localPatchFunction(this.beforeChanges);
          console.log('unsaved', this.unsavedChanges);
        }
      } finally {
        // TODO cleanup
      }
    };
  }
}

// const courseId = 'abc';
// const eventId = 'def';
// const exerciseId = 'ghi';
// const choiceId = 'jkl';

// /** EXAMPLE with EventEditor */
// const EventEditorAutoSave = new AutoSave<Event>(
//   async (changes) =>
//     await store.dispatch('patchEvent', {
//       courseId,
//       eventId,
//       changes,
//     }),
//   (changes) =>
//     store.commit('patchEvent', { courseId, eventId, changes }),
//   ['name', 'instructions'],
//   2000,
//   () => store.commit('shared/showSuccessFeedback')
// );

// /** Example with ExerciseEditor */
// const ExerciseEditorAutoSave = new AutoSave<Exercise>(
//   async (changes) =>
//     await store.dispatch('patchExercise', {
//       courseId,
//       exerciseId,
//       changes,
//     }),
//   (changes) =>
//     store.commit('patchExercise', { courseId, exerciseId, changes }),
//   ['label', 'text', 'solution'],
//   3000
// );

// // in exercise editor, you'd keep a structure that associates each choice id
// // with an AutoSave<ExerciseChoice> instance. the choice editor needs to be refactored
// // in order to send a single field update at a time, and in the exercise editor, when
// // you receive an update, you just call onChange on the appropriate AutoSave

// const ExerciseChoiceAutoSave = new AutoSave<ExerciseChoice>(
//   async (changes) =>
//     await store.dispatch('patchExerciseChoice', {
//       courseId,
//       exerciseId,
//       choiceId,
//       changes,
//     }),
//   (changes) =>
//     store.commit('patchExerciseChoice', {
//       courseId,
//       exerciseId,
//       choiceId,
//       changes,
//     }),
//   ['text'],
//   2000
// );

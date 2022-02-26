/* eslint-disable @typescript-eslint/no-explicit-any */

import { debounce, DebouncedFunc } from 'lodash';

type RemotePatchFunction<T> = (
  changes: FieldValuesObject<T>
) => Promise<void>;
type PatchFunction<T> = (changes: FieldValuesObject<T>) => void;
export type FieldList<T> = (keyof T)[];
type FieldValuesObject<T> = Partial<T>;

export class AutoSaveManager<T> {
  instance: T;
  unsavedChanges: FieldValuesObject<T>;
  beforeChanges: FieldValuesObject<T>;
  remotePatchFunction: DebouncedFunc<RemotePatchFunction<T>>;
  localPatchFunction: PatchFunction<T>;
  errorFunction?: (e: any) => void;
  successFunction?: () => void;
  cleanupFunction?: () => void;
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
    cleanupFunction?: () => void,
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
    this.cleanupFunction = cleanupFunction;
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

    // make deep copy of field about to change in case rollback becomes necessary
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

  flush(): void {
    this.remotePatchFunction.flush();
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
        // reset bookkeeping about recent changes
        this.unsavedChanges = {};
        this.beforeChanges = {};

        // call user-supplied success callback
        this.successFunction?.();
      } catch (e) {
        // call user-supplied error callback
        this.errorFunction?.(e);

        if (this.revertOnFailure) {
          // roll back unsaved changes
          this.localPatchFunction(this.beforeChanges);
        }
      } finally {
        this.cleanupFunction?.();
      }
    };
  }
}

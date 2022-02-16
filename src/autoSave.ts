/* eslint-disable @typescript-eslint/no-explicit-any */
// interface IAutoSave<T> {
//   instance: T;
//   unsavedChanges: Record<keyof T, unknown>;
//   dispatchFunction: () => Promise<void>;
//   debouncedFields: (keyof T)[];
// }

import { debounce, DebouncedFunc } from 'lodash';

type DispatchFunction = () => Promise<void>;
type FieldList<T> = (keyof T)[];

class AutoSave<T> {
  instance: T;
  // TODO fix any
  unsavedChanges: Record<keyof T | any, T[keyof T]>;
  dispatchFunction: DispatchFunction;
  errorFunction?: () => void;
  debouncedFields: FieldList<T>;
  debouncedDispatchFunction: DebouncedFunc<DispatchFunction>;

  constructor(
    instance: T,
    dispatchFunction: DispatchFunction,
    debouncedFields: FieldList<T>,
    debounceTime: number
  ) {
    this.instance = instance;
    this.dispatchFunction = dispatchFunction;
    this.debouncedDispatchFunction = debounce(
      dispatchFunction,
      debounceTime
    );
    this.debouncedFields = debouncedFields;
    this.unsavedChanges = {};
  }

  onChange(field: keyof T, value: T[keyof T]) {
    // record new change to field
    this.unsavedChanges[field] = value;

    // get correct dispatch function depending on whether the field is debounced
    const dispatchFunction = this.debouncedFields.includes(field)
      ? this.debouncedDispatchFunction
      : this.dispatchFunction;

    // TODO make a copy before each update to roll back in case of failure? only do it for non-debounced fields?

    // instantly update in-memory instance
    this.instance[field] = value;

    // dispatch update calling appropriate function
  }
}

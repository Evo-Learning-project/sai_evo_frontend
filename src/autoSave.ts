/* eslint-disable @typescript-eslint/no-explicit-any */

import { debounce, DebouncedFunc } from "lodash";

type RemotePatchFunction<T> = (changes: Partial<T>) => Promise<void>;
type PatchFunction<T> = (changes: Partial<T>, reverting?: boolean) => void;
export type FieldList<T> = (keyof T)[];

enum AutoSaveManagerState {
	UP_TO_DATE,
	PENDING,
	ERROR,
}
export class AutoSaveManager<T> {
	instance: T;
	unsavedChanges: Partial<T>;
	beforeChanges: Partial<T>;
	remotePatchFunction: DebouncedFunc<RemotePatchFunction<T>>;
	localPatchFunction: PatchFunction<T>;
	errorFunction?: (e: any) => void;
	successFunction?: () => void;
	cleanupFunction?: () => void;
	debouncedFields: FieldList<T>;
	revertOnFailure: boolean;
	alwaysPatchLocal: boolean;
	state: AutoSaveManagerState;

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
		alwaysPatchLocal = true,
	) {
		this.instance = instance;
		this.localPatchFunction = localPatchFunction;
		this.remotePatchFunction = debounce(
			this.wrapRemotePatchFunction(remotePatchFunction),
			debounceTime,
		);
		this.debouncedFields = debouncedFields;
		this.unsavedChanges = {};
		this.beforeChanges = {};
		this.successFunction = successFunction;
		this.errorFunction = errorFunction;
		this.cleanupFunction = cleanupFunction;
		this.revertOnFailure = revertOnFailure;
		this.alwaysPatchLocal = alwaysPatchLocal;
		this.state = AutoSaveManagerState.UP_TO_DATE;
	}

	async onChange(changes: Partial<T>): Promise<void> {
		this.state = AutoSaveManagerState.PENDING;

		// record new change to field
		this.unsavedChanges = { ...this.unsavedChanges, ...changes };

		// make deep copy of fields about to change in case rollback becomes necessary
		// (only for non-debounced fields as it would be disconcerting to roll back
		// debounced changes like in text fields)
		Object.keys(changes)
			.filter(k => !this.debouncedFields.includes(k as keyof T))
			.forEach(
				k => (this.beforeChanges[k] = JSON.parse(JSON.stringify(this.instance[k]))),
			);

		if (this.alwaysPatchLocal) {
			// instantly update in-memory instance
			this.localPatchFunction(changes);
		}

		// dispatch update to backend
		await this.remotePatchFunction(this.unsavedChanges);

		if (Object.keys(changes).some(k => !this.debouncedFields.includes(k as keyof T))) {
			// at least one field isn't to be debounced; call remote update immediately
			await this.remotePatchFunction.flush();
		}
	}

	async flush(): Promise<void> {
		if (this.state !== AutoSaveManagerState.UP_TO_DATE) {
			/**
			 * We don't just call .flush() on remotePatchFunction, because that'll
			 * prevent us from calling flush multiple times in a row, as the
			 * behavior of lodash's flush is to just return the last value if
			 * called more than once in a row. Instead, we cancel any pending
			 * invocations, schedule the function, and flush it immmediately
			 */
			this.remotePatchFunction.cancel();
			this.remotePatchFunction(this.unsavedChanges);
			await this.remotePatchFunction.flush();
		}
	}

	isPending(): boolean {
		return this.state === AutoSaveManagerState.PENDING;
	}

	private wrapRemotePatchFunction(
		callback: RemotePatchFunction<T>,
	): RemotePatchFunction<T> {
		/**
		 * Wraps the callback into a function that awaits the callback first, and
		 * if it is successful, then empties the unsaved changes object
		 */
		return async (changes: Partial<T>) => {
			try {
				await callback(changes);
				if (!this.alwaysPatchLocal) {
					// update in-memory instance
					this.localPatchFunction(changes);
				}
				// reset bookkeeping about recent changes
				this.unsavedChanges = {};
				this.beforeChanges = {};
				this.state = AutoSaveManagerState.UP_TO_DATE;

				// call user-supplied success callback
				this.successFunction?.();
			} catch (e) {
				// call user-supplied error callback
				this.errorFunction?.(e);

				if (this.revertOnFailure) {
					// roll back unsaved changes
					this.localPatchFunction(this.beforeChanges, true);
				}
				this.state = AutoSaveManagerState.ERROR;
			} finally {
				this.cleanupFunction?.();
			}
		};
	}
}

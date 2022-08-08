import { Exercise } from "@/models";
export interface ImportedExerciseData {
	data: Exercise[];
	extras: any;
	errors?: string[];
}

export type MoodleCategory = [{ text: string }];

export interface MoodleQuestion {
	$: { type: string };
	answer?: {
		$: { fraction: string };
		text: [string];
	}[];
	defaultgrade: [string];
	name: [{ text: [string] }];
	questiontext: [
		{
			text: [string];
			file?: {
				$: { name: string; path: string; encoding: string };
				_: string;
			}[];
		},
	];
	single: [string];
	category: MoodleCategory;
}

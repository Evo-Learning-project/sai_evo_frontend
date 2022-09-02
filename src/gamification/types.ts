export interface GoalLevel {
	id: string;
	level_value: number;
	requirements: ActionCount[];
}

export interface ActionCount {
	action: GamificationAction;
	amount: number;
}

export interface Goal {
	id: string;
	name: string;
	levels: GoalLevel[];
}

export interface GoalProgress {
	current_level: number;
	action_counts: ActionCount[];
}

export interface ActionDefinition {
	id: string;
	action_code: GamificationAction;
}

export enum GamificationAction {
	TURN_IN_PRACTICE_PARTICIPATION = "TURN_IN_PRACTICE_PARTICIPATION",
	SUBMIT_FIRST_EXERCISE_SOLUTION = "SUBMIT_FIRST_EXERCISE_SOLUTION",
	SUBMIT_EXERCISE_SOLUTION = "SUBMIT_EXERCISE_SOLUTION",
	EXERCISE_SOLUTION_APPROVED = "EXERCISE_SOLUTION_APPROVED",
	EXERCISE_SOLUTION_UPVOTED = "EXERCISE_SOLUTION_UPVOTED",
	EXERCISE_SOLUTION_DOWNVOTED = "EXERCISE_SOLUTION_DOWNVOTED",
	EXERCISE_SOLUTION_UPVOTE_DELETED = "EXERCISE_SOLUTION_UPVOTE_DELETED",
	EXERCISE_SOLUTION_DOWNVOTE_DELETED = "EXERCISE_SOLUTION_DOWNVOTE_DELETED",
	CORRECTLY_ANSWERED_EXERCISE = "CORRECTLY_ANSWERED_EXERCISE",
}

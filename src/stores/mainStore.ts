import { PaginatedData } from "@/api";
import { Goal, GoalProgress } from "@/gamification";
import {
	Course,
	CourseTreeNode,
	Tag,
	User,
	Event,
	ExerciseSolution,
	ExerciseTestCaseAttachment,
	EventParticipation,
	GamificationContext,
	Exercise,
	getBlankExam,
	getBlankExercise,
	EventType,
	exerciseChildName,
	EventParticipationSlot,
	exerciseChildrenNames,
	exerciseChildNameToChildType,
	ExerciseChoice,
	ExerciseTestCase,
	exerciseChildrenName,
	exerciseChildrenNameToChildType,
	EventTemplateRule,
	EventTemplateRuleClause,
} from "@/models";
import { MutationPayload } from "@/store/types";
import { defineStore } from "pinia";

export const useMainStore = defineStore("main", {
	state: () => ({
		courses: [] as Course[], // global list of courses
		paginatedCourseTreeNodes: null as null | PaginatedData<CourseTreeNode>,
		tags: [] as Tag[], // tags of current course
		users: [] as User[], // users currently displayed (e.g. course insights page)
		paginatedExercises: null as null | PaginatedData<Exercise>, // exercises currently displayed
		events: [] as Event[], // events currently displayed (e.g. course exam list)

		// event participations of the user
		// ! used on the home page for student dashboard, with the Event nested inside; improve
		paginatedEventParticipations: null as null | PaginatedData<EventParticipation>,

		eventParticipations: [] as EventParticipation[], // event participations currently displayed (e.g. exam results page)
		// exercise id to set of ExerciseSolution
		paginatedSolutionsByExerciseId: {} as Record<string, PaginatedData<ExerciseSolution>>,
		// testcase id to set of ExerciseTestCaseAttachment
		exerciseTestCaseAttachmentsByTestCaseId: {} as Record<
			string,
			ExerciseTestCaseAttachment[]
		>,
		// gamification goal id to GoalProgress
		progressByGoalId: {} as Record<string, GoalProgress>,
		// node id to set of children nodes
		paginatedChildrenByNodeId: {} as Record<string, PaginatedData<CourseTreeNode>>,

		// event participation currently displayed (e.g. during an exam or when reviewing answers)
		currentEventParticipation: null as EventParticipation | null,

		// event currently being edited
		editingEvent: null as Event | null, // ! see if this is really necessary here
		// event currently being displayed (e.g. in the confirmation page before joining an event)
		previewingEvent: null as Event | null,

		// gamification context for the current course
		gamificationContext: null as GamificationContext | null,
		// goals of the current gamificationContext
		gamificationContextGoals: [] as Goal[],
	}),
	getters: {
		exams: state => state.events.filter(e => e.event_type == EventType.EXAM),
		getEventById: state => (eventId: string) =>
			state.events.find(e => e.id == eventId) ?? getBlankExam(),
		getEventByTemplateId: state => (templateId: string) =>
			state.events.find(e => e.template?.id == templateId),
		exercises: state => state.paginatedExercises?.data ?? [],
		getExerciseById: state => (exerciseId: string) => {
			const flattenedExercises = (state.paginatedExercises?.data ?? [])
				.map(e => [e, ...(e.sub_exercises ?? [])])
				.flat(10);
			return flattenedExercises.find(e => e.id == exerciseId) ?? getBlankExercise();
		},
		getPaginatedSolutionsByExerciseId: state => (exerciseId: string) =>
			state.paginatedSolutionsByExerciseId[exerciseId] ?? {
				count: 0,
				data: [],
				isLastPage: true,
				pageNumber: 1,
			},
		getEventParticipationById: state => (participationId: string) => {
			const target = [
				...state.eventParticipations,
				...(state.paginatedEventParticipations?.data ?? []),
			].find(p => p.id == participationId);
			return target;
		},
		examParticipations: state =>
			[
				...(state.paginatedEventParticipations?.data ?? []).filter(
					p => p.event.event_type === EventType.EXAM,
				),
			].sort((p1, p2) =>
				new Date(p1.begin_timestamp) < new Date(p2.begin_timestamp) ? 1 : -1,
			),
		practiceParticipations: state =>
			[
				...(state.paginatedEventParticipations?.data ?? []).filter(
					p => p.event.event_type === EventType.SELF_SERVICE_PRACTICE,
				),
			].sort((p1, p2) =>
				new Date(p1.begin_timestamp) < new Date(p2.begin_timestamp) ? 1 : -1,
			),
		currentEventParticipationFlattenedSlots: state => {
			return (state.currentEventParticipation?.slots ?? [])
				.map(e => [e, ...(e.sub_slots ?? [])])
				.flat(10);
		},
	},
	actions: {
		/** Previous teacher mutations */
		// update an event in memory with the given payload
		setEvent({ eventId, payload }: { eventId: string; payload: Event }) {
			Object.assign(this.getEventById(eventId), payload);
		},
		// update the slot with id `slotId` using the given payload
		setEventParticipationSlot({
			participationId,
			slotId,
			payload,
		}: {
			participationId: string;
			slotId: string;
			payload: EventParticipationSlot;
		}) {
			const target = this.getEventParticipationById(participationId)?.slots?.find(
				s => s.id == slotId,
			);
			if (target) {
				Object.assign(target, payload);
			} else {
				console.error("setEventParticipationSlot didn't find", payload);
				throw Error();
			}
		},
		// updates the in-memory participation that has the same id as the
		// one in the payload with the given payload
		setEventParticipation(payload: EventParticipation) {
			const target = this.getEventParticipationById(payload.id);
			if (target) {
				Object.assign(target, payload);
			} else {
				console.error("setEventParticipation didn't find", payload);
			}
		},
		// replace the user with same id as payload user with the given payload
		setUser({ user }: { user: User }) {
			const target = this.users.find((u: User) => u.id == user.id);
			if (target) {
				Object.assign(target, user);
			} else {
				console.error("setUser didn't find", user);
			}
		},
		/**
		 * Operations on exercises and exercise children
		 */
		// updates the in-memory exercise with the given payload's id
		setExercise(payload: Exercise) {
			const targetExercise = this.getExerciseById(payload.id);
			if (targetExercise) {
				Object.assign(targetExercise, payload);
			} else {
				console.error("setExercise didn't find", payload);
			}
		},
		// generic function that removes from the store a child
		// element of an exercise by id
		removeExerciseChild({
			exerciseId,
			childType,
			childId,
		}: {
			exerciseId: string;
			childType: exerciseChildName;
			childId: string;
		}) {
			const targetExercise = this.getExerciseById(exerciseId);
			const childrenName = exerciseChildrenNames[childType];
			const children = targetExercise?.[childrenName];
			if (children) {
				const targetChildIndex = children.findIndex(
					(c: { id: string }) => c.id == childId,
				);
				children.splice(targetChildIndex, 1);
			} else {
				console.error("removeExerciseChild didn't find", exerciseId, childType, childId);
			}
		},
		// generic function that updates a child of the given exercises
		// if it exists, otherwise pushes a new one
		setExerciseChild<K extends exerciseChildName>({
			exerciseId,
			childType,
			payload,
		}: {
			exerciseId: string;
			childType: K;
			payload: exerciseChildNameToChildType[K];
		}) {
			const targetExercise = this.getExerciseById(exerciseId);
			const childrenName = exerciseChildrenNames[childType];
			const children = targetExercise?.[childrenName];
			if (children) {
				// TODO refactor
				const target = (
					children as (ExerciseChoice | Exercise | ExerciseTestCase | ExerciseSolution)[]
				).find(c => c.id == payload.id);
				if (target) {
					// update child
					Object.assign(target, payload);
				} else {
					// push new child
					children.push(payload as any);
				}
			} else {
				console.error("setExerciseChild didn't find", childType, "for", exerciseId);
			}
		},
		// generic function that updates the list of elements related to an
		// exercise (choices, sub-exercises, etc.)
		setExerciseChildren<K extends exerciseChildrenName>({
			exerciseId,
			childrenName,
			payload,
		}: {
			exerciseId: string;
			childrenName: K;
			payload: exerciseChildrenNameToChildType[K];
		}) {
			const target = this.getExerciseById(exerciseId);
			if (target && childrenName) {
				// TODO refactor to better use types
				target[childrenName] = payload as any;
			} else {
				console.error("setExerciseChildren didn't find", exerciseId);
			}
		},
		/** --------------------------------------------------- */

		/**
		 * Operations on event templates, template rules, and rule clauses
		 */
		patchEventTemplateRule({
			templateId,
			ruleId,
			payload,
		}: {
			templateId: string;
			ruleId: string;
			payload: EventTemplateRule;
		}) {
			const event = this.getEventByTemplateId(templateId);
			const targetTemplate = event?.template;
			if (targetTemplate) {
				const targetRule = targetTemplate.rules.find(r => r.id == ruleId);
				Object.assign(targetRule as EventTemplateRule, { ...targetRule, ...payload });
			} else {
				console.error("patchEventTemplateRule didn't find", templateId, ruleId);
			}
		},
		patchEventTemplateRuleClause({
			templateId,
			ruleId,
			clauseId,
			payload,
		}: {
			templateId: string;
			ruleId: string;
			clauseId: string;
			payload: Partial<EventTemplateRuleClause>;
		}) {
			const event = this.getEventByTemplateId(templateId);
			const template = event?.template;
			const rule = template?.rules?.find(r => r.id == ruleId);
			const target = rule?.clauses?.find(c => c.id == clauseId);

			if (target) {
				Object.assign(target, { ...target, ...payload });
			} else {
				console.error(
					"patchEventTemplateRuleClause didn't find",
					templateId,
					ruleId,
					clauseId,
				);
			}
		},
		setEventTemplateRules({
			templateId,
			payload,
		}: {
			templateId: string;
			payload: EventTemplateRule[];
		}) {
			const target = this.getEventByTemplateId(templateId);
			if (target && target.template) {
				target.template.rules = payload;
			} else {
				console.error("setEventTemplateRules didn't find", templateId, payload);
			}
		},
		removeEventTemplateRule({
			templateId,
			ruleId,
		}: {
			templateId: string;
			ruleId: string;
		}) {
			const target = this.getEventByTemplateId(templateId);
			if (target && target.template) {
				target.template.rules = target.template.rules.filter(r => r.id != ruleId);
			} else {
				console.error("removeEventTemplateRule didn't find", templateId);
			}
		},
		removeEventTemplateRuleClause({
			templateId,
			ruleId,
			clauseId,
		}: {
			templateId: string;
			ruleId: string;
			clauseId: string;
		}) {
			const event = this.getEventByTemplateId(templateId);
			const target = event?.template?.rules.find(r => r.id == ruleId);
			if (target) {
				target.clauses = target.clauses?.filter(c => c.id != clauseId);
			} else {
				console.error("removeEventTemplateRuleClause didn't find", templateId, ruleId);
			}
		},

		/** ------------------------------------------------- */

		/** Previous student mutations */

		// update the slots of the current event participation
		setEventParticipationSlots(slots: EventParticipationSlot[]) {
			if (this.currentEventParticipation) {
				this.currentEventParticipation.slots = slots;
			}
		},
		setEventParticipations(participations: PaginatedData<EventParticipation>) {
			this.paginatedEventParticipations = participations;
		},
		setEventParticipation(participation: EventParticipation) {
			const target = this.getEventParticipationById(participation.id);
			if (!target) {
				console.error("setEventParticipation in student didn't find", participation.id);
			} else {
				Object.assign(target, participation);
			}
		},
		setCurrentEventParticipationSlot(slot: EventParticipationSlot) {
			// look for both slots and sub-slots
			const flattenedSlots = this.currentEventParticipationFlattenedSlots;
			const target = flattenedSlots.find(s => s.id == slot.id);
			if (!target) {
				throw new Error(
					"setCurrentEventParticipationSlot couldn't find slot with id " + slot.id,
				);
			}
			Object.assign(target, slot);
		},
		patchCurrentEventParticipationSlot({
			slotId,
			changes,
		}: {
			slotId: string;
			changes: Partial<EventParticipationSlot>;
		}) {
			// look for both slots and sub-slots
			const flattenedSlots = this.currentEventParticipationFlattenedSlots;
			const target = flattenedSlots.find((s: EventParticipationSlot) => s.id == slotId);
			if (!target) {
				throw new Error(
					"patchCurrentEventParticipationSlot couldn't find slot with id " + slotId,
				);
			}

			Object.assign(target, { ...target, ...changes });
		},

		// ! this mutation and the two below are only used on editingEvent
		setEditingEventTemplateRule(rule: EventTemplateRule) {
			const target = this.editingEvent?.template?.rules.find(
				(r: EventTemplateRule) => r.id == rule.id,
			);
			if (target) {
				// update existing rule
				Object.assign(target, rule);
			} else {
				// push new rule
				this.editingEvent?.template?.rules.push(rule);
			}
		},
		patchEditingEventTemplateRule({
			ruleId,
			changes,
		}: {
			ruleId: string;
			changes: Partial<EventTemplateRule>;
		}) {
			const target = this.editingEvent?.template?.rules.find(
				(r: EventTemplateRule) => r.id == ruleId,
			);
			if (target) {
				// update existing rule
				Object.assign(target, { ...target, ...changes });
			}
		},
		setEditingEventTemplateRuleClause({
			ruleId,
			payload,
		}: MutationPayload<EventTemplateRuleClause>) {
			const targetRule = state.editingEvent?.template?.rules.find(
				(r: EventTemplateRule) => r.id == ruleId,
			) as EventTemplateRule;
			const targetClause = targetRule.clauses?.find(c => c.id == payload.id);
			if (targetClause) {
				// updating existing clause
				Object.assign(targetClause, payload);
			} else {
				// pushing new clause
				targetRule.clauses?.push(payload);
			}
		},
		// updates an existing solution for an exercises or pushes a new one
		setExerciseSolution({
			exerciseId,
			payload,
		}: {
			exerciseId: string;
			payload: ExerciseSolution;
		}) {
			const solutions = this.getPaginatedSolutionsByExerciseId(exerciseId);
			const target = solutions.data.find(s => s.id == payload.id);
			if (target) {
				Object.assign(target, payload);
			} else {
				solutions.data.push(payload);
			}
		},
		/** --------------------------------------------- */

		/** Previous student actions */
		// TODO

		/** Previous teacher actions */
		// TODO
	},
});

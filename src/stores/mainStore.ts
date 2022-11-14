import {
	createEvent,
	createEventTemplateRule,
	createEventTemplateRuleClause,
	createExerciseSolution,
	createExerciseSolutionComment,
	deleteExerciseSolution,
	EventParticipationSearchFilter,
	getCourseEventParticipations,
	getEvent,
	getEventParticipation,
	moveEventParticipationCurrentSlotCursor,
	PaginatedData,
	partialUpdateEventParticipation,
	partialUpdateEventParticipationSlot,
	partialUpdateEventTemplateRule,
	participateInEvent,
	runEventParticipationSlotCode,
	setExerciseSolutionBookmark,
	updateEventTemplateRuleClause,
	voteExerciseSolution,
} from "@/api";
import { updatePaginatedData } from "@/api/utils";
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
	ExerciseSolutionComment,
	ExerciseSolutionVote,
} from "@/models";
import {
	CourseIdActionPayload,
	EventActionPayload,
	EventIdActionPayload,
	EventTemplateRuleActionPayload,
	EventTemplateRuleClauseActionPayload,
	ExerciseIdActionPayload,
	ExerciseSolutionActionPayload,
	ExerciseSolutionIdActionPayload,
	MutationPayload,
	ParticipationIdActionPayload,
	ParticipationSlotIdActionPayload,
	RuleIdPayload,
	TemplateIdPayload,
	TemplateRuleIdPayload,
} from "@/store/types";
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
		async participateInEvent({ courseId, eventId }: EventIdActionPayload) {
			const participation = await participateInEvent(courseId, eventId);
			this.currentEventParticipation = participation;
		},
		async moveEventParticipationCurrentSlotCursorForward({
			courseId,
		}: CourseIdActionPayload) {
			if (!this.currentEventParticipation) {
				throw new Error(
					"moveEventParticipationCurrentSlotCursorForward called while currentEventParticipation was null",
				);
			}
			const slot = await moveEventParticipationCurrentSlotCursor(
				courseId,
				this.currentEventParticipation.event.id,
				this.currentEventParticipation.id,
				"forward",
			);
			this.setEventParticipationSlots([slot]);
		},
		async moveEventParticipationCurrentSlotCursorBack({
			courseId,
		}: CourseIdActionPayload) {
			if (!this.currentEventParticipation) {
				throw new Error(
					"moveEventParticipationCurrentSlotCursorBack called while currentEventParticipation was null",
				);
			}
			const slot = await moveEventParticipationCurrentSlotCursor(
				courseId,
				this.currentEventParticipation.event.id,
				this.currentEventParticipation.id,
				"back",
			);
			this.setEventParticipationSlots([slot]);
		},
		// TODO better naming
		async getEvent({ courseId, eventId }: EventIdActionPayload) {
			/**
			 * Gets an event in detail mode
			 *
			 * Used to display a preview of an exam before participating into it
			 */
			const event = await getEvent(courseId, eventId, false);
			this.previewingEvent = event;
		},
		// TODO better naming
		async createEvent({ courseId, event }: CourseIdActionPayload & EventActionPayload) {
			/**
			 * Creates an event
			 *
			 * Used when creating a new practice event
			 */
			const newEvent = await createEvent(courseId, event);
			return newEvent;
		},
		async partialUpdateCurrentEventParticipation({
			courseId,
			eventId,
			participationId,
			changes,
		}: ParticipationIdActionPayload & { changes: Partial<EventParticipation> }) {
			const response = await partialUpdateEventParticipation(
				courseId,
				this.currentEventParticipation.event.id,
				this.currentEventParticipation.id,
				changes,
			);
			this.currentEventParticipation = response;
		},
		async partialUpdateEventParticipation({
			courseId,
			eventId,
			participationId,
			changes,
		}: ParticipationIdActionPayload & { changes: Partial<EventParticipation> }) {
			/**
			 * Updates a participation
			 *
			 * Used with no event or participation id for when updating the current participation
			 * (e.g. turning in)
			 *
			 * Used with event and participation id when bookmarking a specific participation
			 */
			const response = await partialUpdateEventParticipation(
				courseId,
				eventId,
				participationId,
				changes,
			);
			this.setEventParticipation(response);
		},
		async getCurrentEventParticipation({
			courseId,
			eventId,
			participationId,
		}: ParticipationIdActionPayload) {
			const participation = await getEventParticipation(
				courseId,
				eventId,
				participationId,
			);
			this.currentEventParticipation = participation;
		},
		// TODO this is used for retrieving practices of a student, use better naming
		async getCourseEventParticipations({
			courseId,
			fromFirstPage,
			filter = undefined,
		}: CourseIdActionPayload & {
			fromFirstPage: boolean;
			filter: undefined | EventParticipationSearchFilter;
		}) {
			const participations = await getCourseEventParticipations(
				courseId,
				fromFirstPage ? 1 : (this.paginatedEventParticipations?.pageNumber ?? 0) + 1,
				true,
				true,
				filter,
			);

			if (fromFirstPage || !this.paginatedEventParticipations) {
				this.paginatedEventParticipations = participations;
			} else {
				this.paginatedEventParticipations = updatePaginatedData(
					this.paginatedEventParticipations,
					participations,
					false,
				);
			}
			return !participations.isLastPage;
		},
		async partialUpdateEventParticipationSlot({
			courseId,
			eventId,
			participationId,
			slotId,
			changes,
			// true if action mutates the store state to reflect changes,
			//false if action only dispatches api call
			mutate = true,
		}: ParticipationSlotIdActionPayload & {
			changes: Partial<EventParticipationSlot>;
			mutate: boolean;
		}) {
			const response = await partialUpdateEventParticipationSlot(
				courseId,
				eventId,
				participationId, //state.eventParticipation?.id,
				slotId,
				changes,
				true,
			);
			if (mutate) {
				this.setCurrentEventParticipationSlot(response);
			}
			//await new Promise(r => setTimeout(r, 5000));
		},
		async runEventParticipationSlotCode({
			courseId,
			eventId,
			participationId,
			slot,
		}: ParticipationIdActionPayload & {
			slot: EventParticipationSlot;
		}) {
			const previousExecutionResults = slot.execution_results;
			try {
				// immediately mark slot as running
				this.patchCurrentEventParticipationSlot({
					slotId: slot.id,
					changes: { execution_results: { ...slot.execution_results, state: "running" } },
				});
				// schedule running on the server-side
				const response = await runEventParticipationSlotCode(
					courseId,
					eventId,
					participationId,
					slot.id,
				);
				this.setCurrentEventParticipationSlot(response);
				return response;
			} catch (e) {
				// reset execution results in case of errors
				this.patchCurrentEventParticipationSlot({
					slotId: slot.id,
					changes: { execution_results: previousExecutionResults },
				});
				throw e;
			}
		},
		// TODO better naming for these actions that only concern editingEvent
		async addEventTemplateRule({
			courseId,
			templateId,
			rule,
		}: CourseIdActionPayload & EventTemplateRuleActionPayload & TemplateIdPayload) {
			const newRule = await createEventTemplateRule(courseId, templateId, rule);
			this.setEditingEventTemplateRule(newRule);
			return newRule;
		},
		async partialUpdateEventTemplateRule(
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			{
				courseId,
				templateId,
				ruleId,
				changes,
			}: CourseIdActionPayload &
				TemplateRuleIdPayload & {
					changes: Partial<EventTemplateRule>;
				},
		) {
			const updatedRule = await partialUpdateEventTemplateRule(
				courseId,
				templateId,
				ruleId,
				changes,
			);
			return updatedRule;
		},
		async addEventTemplateRuleClause({
			courseId,
			templateId,
			ruleId,
			clause,
		}: CourseIdActionPayload & RuleIdPayload & EventTemplateRuleClauseActionPayload) {
			const newClause = await createEventTemplateRuleClause(
				courseId,
				templateId,
				ruleId,
				clause,
			);
			this.setEditingEventTemplateRuleClause({ ruleId, payload: newClause });
			return newClause;
		},
		async updateEventTemplateRuleClause({
			courseId,
			templateId,
			ruleId,
			clause,
		}: TemplateRuleIdPayload & {
			clause: EventTemplateRuleClause;
		}) {
			const updatedClause = await updateEventTemplateRuleClause(
				courseId,
				templateId,
				ruleId,
				clause,
			);
			return updatedClause;
		},
		async createExerciseSolution({
			courseId,
			exerciseId,
			solution,
		}: ExerciseIdActionPayload & ExerciseSolutionActionPayload) {
			const newSolution = await createExerciseSolution(courseId, exerciseId, solution);
			const exerciseSolutions = this.paginatedSolutionsByExerciseId[exerciseId]?.data;

			if (!exerciseSolutions) {
				throw new Error(
					"createExerciseSolution couldn't find field solutions for exercise " +
						exerciseId,
				);
			}
			exerciseSolutions.push(newSolution);
			return newSolution;
		},
		async deleteExerciseSolution({
			courseId,
			exerciseId,
			solutionId,
		}: ExerciseSolutionIdActionPayload) {
			await deleteExerciseSolution(courseId, exerciseId, solutionId);
			const exerciseSolutions = this.paginatedSolutionsByExerciseId[exerciseId];

			if (!exerciseSolutions) {
				throw new Error(
					"addExerciseSolution couldn't find field solutions for exercise " + exerciseId,
				);
			}
			exerciseSolutions.data = exerciseSolutions.data.filter(s => s.id != solutionId);
		},
		async createExerciseSolutionComment({
			courseId,
			exerciseId,
			solutionId,
			comment,
		}: ExerciseSolutionIdActionPayload & {
			comment: ExerciseSolutionComment;
		}) {
			const newComment = await createExerciseSolutionComment(
				courseId,
				exerciseId,
				solutionId,
				comment,
			);
			const solution = this.getPaginatedSolutionsByExerciseId(exerciseId).data.find(
				s => s.id == solutionId,
			);
			if (!solution) {
				throw new Error(
					"createExerciseSolutionComment couldn't find solution with id " + solutionId,
				);
			}
			solution.comments.push(newComment);
		},
		/**
		 * Creates an ExerciseSolutionVote and re-fetches the voted solution
		 */
		async createExerciseSolutionVote({
			courseId,
			exerciseId,
			solutionId,
			vote,
		}: ExerciseSolutionIdActionPayload & {
			vote: ExerciseSolutionVote | undefined;
		}) {
			const updatedSolution = await voteExerciseSolution(
				courseId,
				exerciseId,
				solutionId,
				vote,
			);
			const solution = this.getPaginatedSolutionsByExerciseId(exerciseId).data.find(
				s => s.id == solutionId,
			);
			if (!solution) {
				throw new Error(
					"createExerciseSolutionComment couldn't find solution with id " + solutionId,
				);
			}
			Object.assign(solution, updatedSolution);
		},
		/**
		 * Toggles an ExerciseSolution bookmark status for
		 * the user  and re-fetches the solution
		 */
		async setExerciseSolutionBookmark({
			courseId,
			exerciseId,
			solutionId,
			bookmarked,
		}: ExerciseSolutionIdActionPayload & {
			bookmarked: boolean;
		}) {
			const updatedSolution = await setExerciseSolutionBookmark(
				courseId,
				exerciseId,
				solutionId,
				bookmarked,
			);

			const solution = this.getPaginatedSolutionsByExerciseId(exerciseId).data.find(
				s => s.id == solutionId,
			);

			if (!solution) {
				throw new Error(
					"setExerciseSolutionBookmark couldn't find solution with id " + solutionId,
				);
			}

			Object.assign(solution, updatedSolution);
		},
		// // ! only used once
		// async getExercises(
		// 	{ state }: { state: StudentState },
		// 	{
		// 		courseId,
		// 		exerciseIds,
		// 	}: {
		// 		courseId: string;
		// 		exerciseIds: string[];
		// 	},
		// ) {
		// 	const exercises = await getExercisesById(courseId, exerciseIds);
		// 	state.exerciseThreads = exercises;
		// },

		/** Previous teacher actions */
		// TODO
	},
});

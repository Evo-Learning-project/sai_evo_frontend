import {
	addTagToExercise,
	bulkCreateExercises,
	bulkPartialUpdateEventParticipation,
	createCourse,
	createEvent,
	createEventTemplateRule,
	createEventTemplateRuleClause,
	createExercise,
	createExerciseChoice,
	createExerciseSolution,
	createExerciseSolutionComment,
	createExerciseSubExercise,
	createExerciseTestCase,
	createExerciseTestCaseAttachment,
	deleteEventTemplateRule,
	deleteEventTemplateRuleClause,
	deleteExercise,
	deleteExerciseChoice,
	deleteExerciseSolution,
	deleteExerciseSubExercise,
	deleteExerciseTestCase,
	deleteExerciseTestCaseAttachment,
	enrollUsersInCourse,
	EventParticipationSearchFilter,
	EventSearchFilter,
	ExerciseSearchFilter,
	ExerciseSolutionSearchFilter,
	getActiveUsersForCourse,
	getCourse,
	getCourseEventParticipations,
	getCourseGamificationContext,
	getCourses,
	getEvent,
	getEventParticipation,
	getEventParticipations,
	getEventParticipationSlot,
	getEvents,
	getEventTemplate,
	getEventTemplateRule,
	getExerciseChoices,
	getExercises,
	getExercisesById,
	getExerciseSolutionsByExercise,
	getExerciseTestCaseAttachments,
	getTags,
	getUsers,
	getUsersEnrolledInCourse,
	lockEvent,
	lockExercise,
	manageSelfCourseEnrollment,
	moveEventParticipationCurrentSlotCursor,
	PaginatedData,
	partialUpdateEvent,
	partialUpdateEventParticipation,
	partialUpdateEventParticipationSlot,
	partialUpdateEventParticipationSlotSubmission,
	partialUpdateEventTemplateRule,
	participateInEvent,
	removeTagFromExercise,
	runEventParticipationSlotCode,
	setCourseBookmark,
	setExerciseSolutionBookmark,
	updateCourse,
	updateEvent,
	updateEventTemplateRuleClause,
	updateExercise,
	updateExerciseChoice,
	updateExerciseSolution,
	updateExerciseSubExercise,
	updateExerciseTestCase,
	updateUserCoursePrivileges,
	voteExerciseSolution,
} from "@/api";
import {
	createCourseNode,
	createCourseNodeComment,
	createPollNodeChoice,
	deleteCourseNode,
	deleteCourseNodeComment,
	deletePollNodeChoice,
	getCourseNode,
	getCourseNodeComments,
	getCourseRootNodeId,
	getCourseTopLevelNodes,
	getFileNodeThumbnail,
	getNodeChildren,
	moveCourseNode,
	partialUpdateCourseNode,
	partialUpdatePollNodeChoice,
	uploadNodeFile,
	votePollNodeChoice,
} from "@/api/course_tree";
import {
	deleteByIdFromPaginatedData,
	getEmptyPaginatedData,
	prependToPaginatedData,
	updatePaginatedData,
} from "@/api/utils";
import { getContextGoals, getGoalProgress, Goal, GoalProgress } from "@/gamification";
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
	CoursePrivilege,
	getBlankTag,
	FileNode,
	NodeComment,
	PollNodeChoice,
	CourseTreeNodeType,
	EventParticipationSlotSubmission,
} from "@/models";
import {
	CourseIdActionPayload,
	EventActionPayload,
	EventIdActionPayload,
	EventTemplateRuleActionPayload,
	EventTemplateRuleClauseActionPayload,
	ExerciseActionPayload,
	ExerciseIdActionPayload,
	ExerciseSolutionActionPayload,
	ExerciseSolutionIdActionPayload,
	MutationPayload,
	ParticipationIdActionPayload,
	ParticipationSlotIdActionPayload,
	TemplateRuleIdActionPayload,
	TemplateIdPayload,
	TemplateRuleClauseIdActionPayload,
	CourseTreeNodeIdActionPayload,
} from "@/store/types";
import { arraybufferToBase64 } from "@/utils";
import { AxiosRequestConfig } from "axios";
import { defineStore } from "pinia";

export const useMainStore = defineStore("main", {
	state: () => ({
		courses: [] as Course[], // global list of courses
		paginatedTopLevelCourseTreeNodes: null as null | PaginatedData<CourseTreeNode>,
		tags: [] as Tag[], // tags of current course

		privilegedUsers: [] as User[], // users with privileges for the current course
		enrolledUsers: [] as User[], // users enrolled in current course
		activeUsers: [] as User[], // users active (i.e. with >= 1 participation) in current course
		paginatedUsers: getEmptyPaginatedData() as PaginatedData<User>, // general-purpose store for users
		paginatedExercises: getEmptyPaginatedData() as PaginatedData<Exercise>, // exercises currently displayed
		events: [] as Event[], // events currently displayed (e.g. course exam list)

		// whether a node of the current course tree is being dragged
		draggingCourseTreeNode: false,

		// maps id's of courses to id's of root nodes
		courseIdToTreeRootId: {} as Record<string, string>,

		// maps id's of course tree nodes to arrays of comments
		commentsByCourseNodeId: {} as Record<string, NodeComment[]>,

		// maps id's of course tree nodes to base64 thumnbails
		thumbnailByCourseNodeId: {} as Record<string, string>,

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
		// course tree node currently viewed in detail mode
		currentCourseTreeNode: null as CourseTreeNode | null,

		// event currently being displayed (e.g. in the confirmation page before joining an event)
		previewingEvent: null as Event | null,

		// gamification context for the current course
		gamificationContext: null as GamificationContext | null,
		// goals of the current gamificationContext
		gamificationContextGoals: [] as Goal[],
	}),
	getters: {
		exams: state => state.events.filter(e => e.event_type == EventType.EXAM),
		getPaginatedExercises: state => state.paginatedExercises ?? getEmptyPaginatedData(),
		getCourseById: state => (courseId: string) =>
			state.courses.find(c => c.id == courseId),
		getUserById: state => (userId: string) =>
			[
				...state.privilegedUsers,
				...state.enrolledUsers,
				...state.activeUsers,
				...state.paginatedUsers.data,
			].find(u => u.id == userId),
		getEventById: state => (eventId: string) =>
			state.events.find(e => e.id == eventId) ?? getBlankExam(),
		getEventByTemplateId: state => (templateId: string) =>
			state.events.find(e => e.template?.id == templateId),
		exercises: state => state.paginatedExercises?.data ?? [],
		getTagById: state => (tagId: string) =>
			state.tags.find(t => t.id == tagId) ?? getBlankTag(),
		getTagByName: state => (tagName: string) =>
			state.tags.find(t => t.name == tagName) ?? getBlankTag(),
		getExerciseById: state => (exerciseId: string) => {
			const flattenedExercises = (state.paginatedExercises?.data ?? [])
				.map(e => [e, ...(e.sub_exercises ?? [])])
				.flat(10);
			return flattenedExercises.find(e => e.id == exerciseId) ?? getBlankExercise();
		},
		getPaginatedSolutionsByExerciseId: state => (exerciseId: string) =>
			state.paginatedSolutionsByExerciseId[exerciseId] ?? getEmptyPaginatedData(),
		getEventParticipationById: state => (participationId: string) => {
			const target = [
				...state.eventParticipations,
				...(state.paginatedEventParticipations?.data ?? []),
			].find(p => p.id == participationId);
			return target;
		},
		getCommentsByNodeId: state => (nodeId: string) => {
			return state.commentsByCourseNodeId[nodeId] ?? [];
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
		/* Course tree */
		flatCourseTreeNodes: state => {
			const ret = [...(state.paginatedTopLevelCourseTreeNodes?.data ?? [])];
			// flatten children
			Object.values(state.paginatedChildrenByNodeId).forEach(p => {
				const children = p.data;
				ret.push(...children);
			});
			const currentNode = state.currentCourseTreeNode
				? [state.currentCourseTreeNode]
				: [];
			return [...currentNode, ...ret];
		},
		getCourseTreeNodeById() {
			return (nodeId: string) => this.flatCourseTreeNodes.find(n => n.id == nodeId);
		},
	},
	actions: {
		async selfEnrollInCourse({ courseId }: CourseIdActionPayload) {
			await manageSelfCourseEnrollment(courseId, false);
			const course = this.getCourseById(courseId);
			if (course) {
				course.enrolled = true;
			} else {
				throw new Error("selfEnrollInCourse couldn't find course with id " + courseId);
			}
		},
		async selfUnenrollInCourse({ courseId }: CourseIdActionPayload) {
			await manageSelfCourseEnrollment(courseId, true);
			const course = this.getCourseById(courseId);
			if (course) {
				course.enrolled = false;
			} else {
				throw new Error("selfUnenrollInCourse couldn't find course with id " + courseId);
			}
		},
		async isTopLevelNode({
			courseId,
			node,
		}: CourseIdActionPayload & { node: CourseTreeNode }) {
			const rootId = await this.getCourseRootId({ courseId });
			return node.parent_id == rootId;
		},
		async getCourseRootId({ courseId }: CourseIdActionPayload) {
			if (typeof this.courseIdToTreeRootId[courseId] === "undefined") {
				this.courseIdToTreeRootId[courseId] = await getCourseRootNodeId(courseId);
			}
			const rootId = this.courseIdToTreeRootId[courseId];
			return rootId;
		},
		async loadCourseTreeNodeThumbnail({
			courseId,
			nodeId,
		}: CourseIdActionPayload & CourseTreeNodeIdActionPayload) {
			const thumbnail = await getFileNodeThumbnail(courseId, nodeId);
			const target = this.flatCourseTreeNodes.find(n => n.id == nodeId) as
				| FileNode
				| undefined;

			if (!target) {
				throw new Error(
					"loadCourseTreeNodeThumbnail couldn't find node with id " + nodeId,
				);
			}
			const thumbnail64 = arraybufferToBase64(thumbnail);
			this.thumbnailByCourseNodeId[nodeId] = thumbnail64;
		},
		async createCourseTreeNode({
			courseId,
			node,
			config = undefined,
		}: CourseIdActionPayload & { node: CourseTreeNode; config?: AxiosRequestConfig }) {
			if (node.parent_id === null) {
				// creating a top-level node
				node.parent_id = await this.getCourseRootId({ courseId });
			}
			const createdNode = await createCourseNode(courseId, node, config);
			if (await this.isTopLevelNode({ courseId, node: createdNode })) {
				this.paginatedTopLevelCourseTreeNodes = prependToPaginatedData(
					this.paginatedTopLevelCourseTreeNodes ?? getEmptyPaginatedData(),
					createdNode,
				);
			} else {
				// child of some other node
				const currentChildren =
					this.paginatedChildrenByNodeId[createdNode.parent_id as string] ??
					getEmptyPaginatedData();
				this.paginatedChildrenByNodeId[createdNode.parent_id as string] =
					prependToPaginatedData(currentChildren, createdNode);
			}
			return createdNode;
		},
		async createCourseTreeNodeComment({
			courseId,
			nodeId,
			comment,
		}: CourseIdActionPayload & CourseTreeNodeIdActionPayload & { comment: NodeComment }) {
			const newComment = await createCourseNodeComment(courseId, nodeId, comment);
			if (typeof this.commentsByCourseNodeId[nodeId] === "undefined") {
				this.commentsByCourseNodeId[nodeId] = [];
			}
			this.commentsByCourseNodeId[nodeId].push(newComment);
		},
		async deleteCourseNodeComment({
			courseId,
			nodeId,
			commentId,
		}: CourseIdActionPayload & CourseTreeNodeIdActionPayload & { commentId: string }) {
			await deleteCourseNodeComment(courseId, nodeId, commentId);
			this.commentsByCourseNodeId[nodeId] = this.commentsByCourseNodeId[nodeId].filter(
				c => c.id != commentId,
			);
		},
		async createPollNodeChoice({
			courseId,
			nodeId,
			choice,
		}: CourseIdActionPayload &
			CourseTreeNodeIdActionPayload & { choice: PollNodeChoice }) {
			const newChoice = await createPollNodeChoice(courseId, nodeId, choice);
			const poll = this.getCourseTreeNodeById(nodeId);
			if (!poll || poll.resourcetype !== CourseTreeNodeType.PollNode) {
				throw new Error(
					"createPollNodeChoice couldn't find node with id " +
						nodeId +
						" or its type was " +
						poll?.resourcetype,
				);
			}
			poll.choices.push(newChoice);
		},
		async partialUpdatePollNodeChoice({
			courseId,
			nodeId,
			choiceId,
			changes,
		}: CourseIdActionPayload &
			CourseTreeNodeIdActionPayload & {
				choiceId: string;
				changes: Partial<PollNodeChoice>;
			}) {
			const updatedChoice = await partialUpdatePollNodeChoice(
				courseId,
				nodeId,
				choiceId,
				changes,
			);
			const poll = this.getCourseTreeNodeById(nodeId);
			if (!poll || poll.resourcetype !== CourseTreeNodeType.PollNode) {
				throw new Error(
					"updatePollNodeChoice couldn't find node with id " +
						nodeId +
						" or its type was " +
						poll?.resourcetype,
				);
			}
			const target = poll.choices.find(c => c.id == choiceId);
			if (!target) {
				throw new Error(
					"updatePollNodeChoice couldn't find poll choice with id " + choiceId,
				);
			}
			Object.assign(target, { ...target, ...updatedChoice });
		},
		async deletePollNodeChoice({
			courseId,
			nodeId,
			choiceId,
		}: CourseIdActionPayload &
			CourseTreeNodeIdActionPayload & {
				choiceId: string;
			}) {
			await deletePollNodeChoice(courseId, nodeId, choiceId);
			const poll = this.getCourseTreeNodeById(nodeId);
			if (!poll || poll.resourcetype !== CourseTreeNodeType.PollNode) {
				throw new Error(
					"updatePollNodeChoice couldn't find node with id " +
						nodeId +
						" or its type was " +
						poll?.resourcetype,
				);
			}
			poll.choices = poll.choices.filter(c => c.id != choiceId);
		},
		async votePollNodeChoice({
			courseId,
			nodeId,
			choiceId,
			remove,
		}: CourseIdActionPayload &
			CourseTreeNodeIdActionPayload & {
				choiceId: string;
				remove: boolean;
			}) {
			const pollWithNewVote = await votePollNodeChoice(
				courseId,
				nodeId,
				choiceId,
				remove,
			);
			const poll = this.getCourseTreeNodeById(nodeId);
			if (!poll || poll.resourcetype !== CourseTreeNodeType.PollNode) {
				throw new Error(
					"updatePollNodeChoice couldn't find node with id " +
						nodeId +
						" or its type was " +
						poll?.resourcetype,
				);
			}
			Object.assign(poll, pollWithNewVote);
		},
		async getCourseTreeNodeComments({
			courseId,
			nodeId,
		}: CourseIdActionPayload & CourseTreeNodeIdActionPayload) {
			const comments = await getCourseNodeComments(courseId, nodeId);
			this.commentsByCourseNodeId[nodeId] = comments;
		},
		async moveCourseTreeNode({
			courseId,
			node,
			targetId,
			position,
		}: CourseIdActionPayload & {
			node: CourseTreeNode;
			targetId: string;
			position: "first-child" | "last-child" | "left" | "right";
		}) {
			// get target node from target id. if the target id is the id of the root
			// node of the course, set the target to null
			const target =
				targetId == (await this.getCourseRootId({ courseId }))
					? null
					: this.getCourseTreeNodeById(targetId);

			if (typeof target === "undefined") {
				throw new Error("moveCourseTreeNode didn't find target with id " + targetId);
			}

			const targetNodeList =
				// if the target is null, the list of siblings of the moved
				// node is the list of top-level nodes of the course
				target === null
					? this.paginatedTopLevelCourseTreeNodes?.data ?? []
					: ["first-child", "last-child"].includes(position)
					? // per django-mptt, if position is first-child or last-child, the target
					  // is to be interpreted as the new parent
					  this.paginatedChildrenByNodeId[targetId].data
					: // otherwise, the target is to be interpreted as the node whose
					// parent will become the new parent. here, position will either
					// be `left` or `right`
					(await this.isTopLevelNode({ courseId, node: target }))
					? // node will become sibling of a top-level node
					  this.paginatedTopLevelCourseTreeNodes?.data ?? []
					: // node will become sibling of `target`, therefore the sibling list
					  // will be that of children of `target.parent_id`
					  this.paginatedChildrenByNodeId[target?.parent_id as string].data;

			const currentNodeList = (await this.isTopLevelNode({ courseId, node }))
				? this.paginatedTopLevelCourseTreeNodes?.data ?? []
				: this.paginatedChildrenByNodeId[node.parent_id as string]?.data ?? [];

			// save before state in order to be able to restore it
			// if an error occurs when making the API call
			const targetNodeListBefore = [...targetNodeList];
			const currentNodeListBefore = [...currentNodeList];
			const parentIdBefore = node.parent_id;

			// again, per django-mptt semantics, if position is `first-child` or
			// `last-child`, then the new parent will be `target`, otherwise it'll
			// be `target`'s parent
			const newParentId = ["first-child", "last-child"].includes(position)
				? targetId
				: (target?.parent_id as string);

			const currentIndex = currentNodeList.findIndex(n => n.id == node.id);
			const targetIndex =
				position === "first-child"
					? 0
					: position === "last-child"
					? targetNodeList.length - 1
					: // if position is `left` or `right`, node will
					  // take up the position of `target`
					  targetNodeList.findIndex(n => n.id == targetId);

			// perform move locally
			currentNodeList.splice(currentIndex, 1);
			node.parent_id = newParentId;
			targetNodeList.splice(targetIndex, 0, node);

			try {
				await moveCourseNode(courseId, node.id, targetId, position);
			} catch (e) {
				// roll back state
				Object.assign(targetNodeList, targetNodeListBefore);
				Object.assign(currentNodeList, currentNodeListBefore);
				node.parent_id = parentIdBefore;
				throw e;
			}
		},
		async deleteCourseTreeNode({
			courseId,
			nodeId,
		}: CourseIdActionPayload & CourseTreeNodeIdActionPayload) {
			const toDelete = this.getCourseTreeNodeById(nodeId);
			if (!toDelete) {
				throw new Error("deleteCourseTreeNode couldn't find node with id " + nodeId);
			}
			await deleteCourseNode(courseId, nodeId);
			if (await this.isTopLevelNode({ courseId, node: toDelete })) {
				this.paginatedTopLevelCourseTreeNodes = deleteByIdFromPaginatedData(
					this.paginatedTopLevelCourseTreeNodes ?? getEmptyPaginatedData(),
					{ id: nodeId },
				);
			} else {
				this.paginatedChildrenByNodeId[toDelete.parent_id as string] =
					deleteByIdFromPaginatedData(
						this.paginatedChildrenByNodeId[toDelete.parent_id as string] ??
							getEmptyPaginatedData(),
						{ id: nodeId },
					);
			}
		},
		async partialUpdateCourseTreeNode({
			courseId,
			nodeId,
			changes,
			fireIntegrationEvent = false,
		}: CourseIdActionPayload &
			CourseTreeNodeIdActionPayload & {
				changes: Partial<CourseTreeNode>;
				fireIntegrationEvent?: boolean;
			}) {
			const updatedNode = await partialUpdateCourseNode(
				courseId,
				nodeId,
				changes,
				fireIntegrationEvent,
			);
			return updatedNode;
		},
		patchCourseTreeNode({
			courseId,
			nodeId,
			changes,
		}: CourseIdActionPayload &
			CourseTreeNodeIdActionPayload & { changes: Partial<CourseTreeNode> }) {
			const target = this.flatCourseTreeNodes.find(n => n.id == nodeId);
			if (!target) {
				throw new Error("patchCourseTreeNode couldn't find node with id " + nodeId);
			}
			const oldParentId = target.parent_id;
			Object.assign(target, { ...target, ...changes });
			if (changes.parent_id) {
				if (oldParentId == this.courseIdToTreeRootId[courseId]) {
					// remove node from children list of top-level nodes
					this.paginatedTopLevelCourseTreeNodes = deleteByIdFromPaginatedData(
						this.paginatedTopLevelCourseTreeNodes ?? getEmptyPaginatedData(),
						{ id: nodeId },
					);
				} else {
					// remove node from children list of old parent
					const oldChildren =
						this.paginatedChildrenByNodeId[oldParentId as string] ??
						getEmptyPaginatedData();
					// remove node from children list of old parent
					this.paginatedChildrenByNodeId[oldParentId as string] =
						deleteByIdFromPaginatedData(oldChildren, { id: nodeId });
				}

				// add to new list (either top-level or children list of new parent)
				if (changes.parent_id == this.courseIdToTreeRootId[courseId]) {
					this.paginatedTopLevelCourseTreeNodes = prependToPaginatedData(
						this.paginatedTopLevelCourseTreeNodes ?? getEmptyPaginatedData(),
						target,
					);
				} else {
					this.paginatedChildrenByNodeId[changes.parent_id] = prependToPaginatedData(
						this.paginatedChildrenByNodeId[changes.parent_id] ?? getEmptyPaginatedData(),
						target,
					);
				}
			}
		},
		async uploadCourseTreeNodeFile({
			courseId,
			nodeId,
			file,
		}: CourseIdActionPayload & CourseTreeNodeIdActionPayload & { file: Blob }) {
			const updatedNode = await uploadNodeFile(courseId, nodeId, file);
			const target = this.getCourseTreeNodeById(nodeId);
			if (!target) {
				throw new Error("uploadCourseTreeNodeFile couldn't find node with id " + nodeId);
			}
			Object.assign(target, updatedNode);
		},
		/** Course tree */
		async getCourseTreeNodeDetail({
			courseId,
			nodeId,
		}: CourseIdActionPayload & CourseTreeNodeIdActionPayload) {
			const node = await getCourseNode(courseId, nodeId);
			this.currentCourseTreeNode = node;
		},
		async getCourseTopLevelNodes({
			courseId,
			fromFirstPage,
		}: CourseIdActionPayload & {
			fromFirstPage: boolean;
		}) {
			const nodes = await getCourseTopLevelNodes(
				courseId,
				fromFirstPage ? 1 : (this.paginatedTopLevelCourseTreeNodes?.pageNumber ?? 0) + 1,
			);
			if (fromFirstPage || !this.paginatedTopLevelCourseTreeNodes) {
				this.paginatedTopLevelCourseTreeNodes = nodes;
			} else {
				this.paginatedTopLevelCourseTreeNodes = updatePaginatedData(
					this.paginatedTopLevelCourseTreeNodes,
					nodes,
					false,
				);
			}
			return !nodes.isLastPage;
		},
		async getCourseTreeNodeChildren({
			courseId,
			nodeId,
			fromFirstPage,
		}: CourseIdActionPayload &
			CourseTreeNodeIdActionPayload & {
				fromFirstPage: boolean;
			}) {
			const existingChildren =
				this.paginatedChildrenByNodeId[nodeId] ?? getEmptyPaginatedData();
			const nodes = await getNodeChildren(
				courseId,
				nodeId,
				fromFirstPage ? 1 : existingChildren.pageNumber + 1,
			);
			if (fromFirstPage || !this.paginatedChildrenByNodeId[nodeId]) {
				this.paginatedChildrenByNodeId[nodeId] = nodes;
			} else {
				this.paginatedChildrenByNodeId[nodeId] = updatePaginatedData(
					this.paginatedChildrenByNodeId[nodeId],
					nodes,
					false,
				);
			}
			return !nodes.isLastPage;
		},
		/** Previous shared mutations */
		setCourse(course: Course) {
			const target = this.courses.find(c => c.id == course.id);
			if (target) {
				Object.assign(target, course);
			} else {
				throw new Error("setCourse couldn't find " + course.id);
			}
		},
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
			payload: Partial<EventTemplateRule>;
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
		setCurrentEventParticipationSlot(slot: Partial<EventParticipationSlot>) {
			// look for both slots and sub-slots
			const flattenedSlots = this.currentEventParticipationFlattenedSlots;
			const target = flattenedSlots.find(s => s.id == slot.id);
			if (!target) {
				throw new Error(
					"setCurrentEventParticipationSlot couldn't find slot with id " + slot.id,
				);
			}
			Object.assign(target, { ...target, ...slot });
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
		async getEventPreview({ courseId, eventId }: EventIdActionPayload) {
			/**
			 * Gets an event in detail mode
			 *
			 * Used to display a preview of an exam before participating into it
			 */
			const event = await getEvent(courseId, eventId, false);
			this.previewingEvent = event;
		},
		async partialUpdateCurrentEventParticipation({
			courseId,
			changes,
		}: CourseIdActionPayload & { changes: Partial<EventParticipation> }) {
			if (!this.currentEventParticipation) {
				throw new Error(
					"partialUpdateCurrentEventParticipation called with null currentParticipation",
				);
			}
			const response = await partialUpdateEventParticipation(
				courseId,
				// TODO assumes currentEventParticipation contains Event
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
		async partialUpdateCurrentEventParticipationSlot({
			courseId,
			slotId,
			changes,
			// true if action mutates the store state to reflect changes,
			//false if action only dispatches api call
			mutate = true,
			forceStudent,
		}: CourseIdActionPayload & { slotId: string } & {
			changes: Partial<EventParticipationSlot>;
			mutate: boolean;
			forceStudent: boolean;
		}) {
			if (!this.currentEventParticipation) {
				throw new Error(
					"partialUpdateCurrentEventParticipation called with null currentParticipation",
				);
			}
			const response = await partialUpdateEventParticipationSlot(
				courseId,
				// TODO assumes currentEventParticipation contains Event
				this.currentEventParticipation.event.id,
				this.currentEventParticipation.id,
				slotId,
				changes,
				forceStudent,
			);
			if (mutate) {
				this.setCurrentEventParticipationSlot(response);
			}
		},

		async partialUpdateCurrentEventParticipationSlotSubmission({
			courseId,
			slotId,
			changes,
		}: CourseIdActionPayload & { slotId: string } & {
			changes: Partial<EventParticipationSlotSubmission>;
		}) {
			if (!this.currentEventParticipation) {
				throw new Error(
					"partialUpdateCurrentEventParticipationSubmission called with null currentParticipation",
				);
			}
			const response = await partialUpdateEventParticipationSlotSubmission(
				courseId,
				// TODO assumes currentEventParticipation contains Event
				this.currentEventParticipation.event.id,
				this.currentEventParticipation.id,
				slotId,
				changes,
			);
			this.setCurrentEventParticipationSlot(response);
		},
		async runCurrentEventParticipationSlotCode({
			courseId,
			slot,
		}: CourseIdActionPayload & {
			slot: EventParticipationSlot;
		}) {
			if (!this.currentEventParticipation) {
				throw new Error(
					"runCurrentEventParticipationSlotCode called with null currentParticipation",
				);
			}
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
					// TODO assumes currentEventParticipation contains Event
					this.currentEventParticipation.event.id,
					this.currentEventParticipation.id,
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
		async updateExerciseSolution({
			courseId,
			exerciseId,
			solution,
		}: ExerciseIdActionPayload & ExerciseSolutionActionPayload) {
			const updatedSolution = await updateExerciseSolution(
				courseId,
				exerciseId,
				solution.id,
				solution,
			);
			//this.setExerciseSolution({ exerciseId, solution: updatedSolution });
		},
		async getSolutionsByExercise({
			courseId,
			exerciseId,
			fromFirstPage = true,
			filter = null,
		}: ExerciseIdActionPayload & {
			fromFirstPage: boolean;
			filter: ExerciseSolutionSearchFilter | null;
		}) {
			const paginatedSolutionsForExercise =
				this.paginatedSolutionsByExerciseId[exerciseId];
			const paginatedSolutions = await getExerciseSolutionsByExercise(
				courseId,
				exerciseId,
				fromFirstPage ? 1 : (paginatedSolutionsForExercise?.pageNumber ?? 0) + 1, // TODO refactor
				filter,
			);

			if (fromFirstPage) {
				this.paginatedSolutionsByExerciseId[exerciseId] = paginatedSolutions;
			} else {
				this.paginatedSolutionsByExerciseId[exerciseId] = updatePaginatedData(
					this.getPaginatedSolutionsByExerciseId(exerciseId),
					paginatedSolutions,
					false,
				);
			}

			return !this.paginatedSolutionsByExerciseId[exerciseId].isLastPage;
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

		/** Previous teacher actions */
		// CRUD on courses
		async getCourse({ courseId }: CourseIdActionPayload) {
			const course = await getCourse(courseId);
			this.setCourse(course);
		},
		async getCourseGamificationContext({ courseId }: CourseIdActionPayload) {
			try {
				const context = await getCourseGamificationContext(courseId);
				this.gamificationContext = context;
			} catch {
				this.gamificationContext = null;
			}
		},
		async getGamificationContextGoals({ contextId }: { contextId: string }) {
			const goals = await getContextGoals(contextId);
			this.gamificationContextGoals = goals;
			this.progressByGoalId = {};
		},
		async getGamificationGoalProgress({
			contextId,
			goalId,
		}: {
			contextId: string;
			goalId: string;
		}) {
			try {
				const progress = await getGoalProgress(contextId, goalId);
				this.progressByGoalId[goalId] = progress;
			} catch (e) {
				this.progressByGoalId[goalId] = { current_level: 0, action_counts: [] };
			}
		},
		async getCourses() {
			const courses = await getCourses();
			this.courses = courses;
		},
		async getTags({
			courseId,
			includeExerciseCount = false,
		}: CourseIdActionPayload & { includeExerciseCount: boolean }) {
			const tags = await getTags(courseId, includeExerciseCount);
			this.tags = tags;
		},
		async createCourse(course: Course) {
			const newCourse = await createCourse(course);
			return newCourse;
		},
		async bookmarkCourse({
			courseId,
			remove,
		}: CourseIdActionPayload & { remove: boolean }) {
			const updatedCourse = await setCourseBookmark(courseId, remove);
			const oldCourse = this.getCourseById(courseId);
			if (!oldCourse) {
				throw new Error("updateCourse couldn't find course with id " + courseId);
			}
			Object.assign(oldCourse, updatedCourse);
			return updatedCourse;
		},
		async updateCourse(course: Course) {
			const updatedCourse = await updateCourse(course.id, course);
			const oldCourse = this.getCourseById(course.id);
			if (!oldCourse) {
				throw new Error("updateCourse couldn't find course with id " + course.id);
			}
			Object.assign(oldCourse, updatedCourse);
			return updatedCourse;
		},

		// CRUD on exercises
		async createExercise({
			courseId,
			exercise,
		}: CourseIdActionPayload & ExerciseActionPayload) {
			const newExercise = await createExercise(courseId, exercise);
			this.paginatedExercises = prependToPaginatedData(
				this.paginatedExercises,
				newExercise,
			);
			return newExercise;
		},
		async createMockExercises(exercises: Exercise[]) {
			await new Promise(resolve => setTimeout(resolve, 3000));
			this.paginatedExercises = prependToPaginatedData(
				this.paginatedExercises,
				...exercises,
			);
		},
		async getExercise({ courseId, exerciseId }: ExerciseIdActionPayload) {
			const exercise = (await getExercisesById(courseId, [exerciseId]))[0];
			this.setExercise(exercise);
		},
		async bulkCreateExercises({
			courseId,
			exercises,
		}: CourseIdActionPayload & {
			exercises: Exercise[];
		}) {
			const newExercises = await bulkCreateExercises(courseId, exercises);
			this.paginatedExercises = prependToPaginatedData(
				this.getPaginatedExercises,
				...newExercises,
			);
			return newExercises;
		},
		async updateExercise({
			courseId,
			exercise,
		}: CourseIdActionPayload & ExerciseActionPayload) {
			await updateExercise(courseId, exercise.id, exercise);
		},
		async deleteExercise({ courseId, exerciseId }: ExerciseIdActionPayload) {
			await deleteExercise(courseId, exerciseId);
			this.paginatedExercises = deleteByIdFromPaginatedData(this.paginatedExercises, {
				id: exerciseId,
			});
		},
		async lockExercise({ courseId, exerciseId }: ExerciseIdActionPayload) {
			const exercise = await lockExercise(courseId, exerciseId);
			this.setExercise(exercise);
		},
		async createExerciseChild<K extends exerciseChildName>(
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			{
				courseId,
				exerciseId,
				childType,
				payload,
			}: ExerciseIdActionPayload & {
				childType: K;
				payload: exerciseChildNameToChildType[K];
			},
		) {
			const apiCalls: Record<exerciseChildName, any> = {
				choice: createExerciseChoice,
				testcase: createExerciseTestCase,
				sub_exercise: createExerciseSubExercise,
			};
			// get the correct api call to create the child
			const apiCall = apiCalls[childType];
			const newChild = await apiCall(courseId, exerciseId, payload);
			this.setExerciseChild({
				childType,
				exerciseId: exerciseId,
				payload: newChild as any, // TODO review
			});
			return newChild;
		},
		async updateExerciseChild<K extends exerciseChildName>({
			courseId,
			exerciseId,
			childType,
			payload,
			reFetch = false,
		}: ExerciseIdActionPayload & {
			childType: K;
			payload: exerciseChildNameToChildType[K];
			reFetch: boolean;
		}) {
			const apiCalls: Record<exerciseChildName, any> = {
				choice: updateExerciseChoice,
				testcase: updateExerciseTestCase,
				sub_exercise: updateExerciseSubExercise,
			};
			const apiCall = apiCalls[childType];

			await apiCall(courseId, exerciseId, payload.id as string, payload as any);

			if (reFetch) {
				if (childType !== "choice") {
					throw new Error("reFetch not implemented for " + childType);
				}
				const choices = await getExerciseChoices(courseId, exerciseId);
				this.setExerciseChildren({
					exerciseId,
					childrenName: "choices",
					payload: choices,
				});
			}
		},
		async deleteExerciseChild({
			courseId,
			exerciseId,
			childType,
			childId,
		}: ExerciseIdActionPayload & {
			childType: exerciseChildName;
			childId: string;
		}) {
			const apiCalls: Record<exerciseChildName, any> = {
				choice: deleteExerciseChoice,
				testcase: deleteExerciseTestCase,
				sub_exercise: deleteExerciseSubExercise,
			};
			const apiCall = apiCalls[childType];
			await apiCall(courseId, exerciseId, childId);
			this.removeExerciseChild({ exerciseId, childType, childId });
		},
		async getExercisesById({
			courseId,
			exerciseIds,
			replace = true,
		}: CourseIdActionPayload & {
			exerciseIds: string[];
			replace: boolean;
		}) {
			const exercises = await getExercisesById(courseId, exerciseIds);
			if (replace) {
				this.paginatedExercises = {
					data: exercises,
					isLastPage: true,
					count: exercises.length,
					pageNumber: 1,
				};
			} else {
				this.paginatedExercises = prependToPaginatedData(
					this.paginatedExercises,
					...exercises,
				);
			}
		},
		async getExerciseTestCaseAttachments({
			courseId,
			exerciseId,
			testcaseId,
		}: ExerciseIdActionPayload & {
			testcaseId: string;
		}) {
			const attachments = await getExerciseTestCaseAttachments(
				courseId,
				exerciseId,
				testcaseId,
			);
			this.exerciseTestCaseAttachmentsByTestCaseId[testcaseId] = attachments;
			return attachments;
		},
		async createExerciseTestCaseAttachment({
			courseId,
			exerciseId,
			testcaseId,
			attachment,
		}: ExerciseIdActionPayload & {
			testcaseId: string;
			attachment: Blob;
		}) {
			const response = await createExerciseTestCaseAttachment(
				courseId,
				exerciseId,
				testcaseId,
				attachment,
			);
			this.exerciseTestCaseAttachmentsByTestCaseId[testcaseId] ??= [];
			this.exerciseTestCaseAttachmentsByTestCaseId[testcaseId].push(response);
		},
		async deleteExerciseTestCaseAttachment({
			courseId,
			exerciseId,
			testcaseId,
			attachmentId,
		}: ExerciseIdActionPayload & {
			testcaseId: string;
			attachmentId: string;
		}) {
			await deleteExerciseTestCaseAttachment(
				courseId,
				exerciseId,
				testcaseId,
				attachmentId,
			);
			this.exerciseTestCaseAttachmentsByTestCaseId[testcaseId] =
				this.exerciseTestCaseAttachmentsByTestCaseId[testcaseId]?.filter(
					a => a.id != attachmentId,
				) ?? [];
		},
		async getExercises({
			courseId,
			fromFirstPage = true,
			filters = null,
		}: CourseIdActionPayload & {
			fromFirstPage: boolean;
			filters: ExerciseSearchFilter | null;
		}) {
			const paginatedExercises = await getExercises(
				courseId,
				fromFirstPage ? 1 : (this.paginatedExercises.pageNumber ?? 0) + 1, // TODO refactor
				filters,
			);

			// investigate https://sentry.io/organizations/samuele/issues/3565313088/?project=6265941&query=is%3Aunresolved
			if (!paginatedExercises.data) {
				console.error(
					{ courseId, fromFirstPage, filters },
					"responded with undefined",
					paginatedExercises,
				);
			}

			if (fromFirstPage) {
				this.paginatedExercises = paginatedExercises;
			} else {
				this.paginatedExercises = updatePaginatedData(
					this.paginatedExercises,
					paginatedExercises,
					false,
				);
			}

			return !this.paginatedExercises.isLastPage;
		},
		async addExerciseTag({
			courseId,
			exerciseId,
			tag,
			isPublic,
		}: ExerciseIdActionPayload & {
			tag: string;
			isPublic: boolean;
		}) {
			await addTagToExercise(courseId, exerciseId, tag, isPublic);
			const target = this.getExerciseById(exerciseId);
			target[isPublic ? "public_tags" : "private_tags"]?.push({
				name: tag,
			});
		},
		async removeExerciseTag({
			courseId,
			exerciseId,
			tag,
			isPublic,
		}: ExerciseIdActionPayload & {
			tag: string;
			isPublic: boolean;
		}) {
			await removeTagFromExercise(courseId, exerciseId, tag, isPublic);
			const target = this.getExerciseById(exerciseId);
			target[isPublic ? "public_tags" : "private_tags"] = target[
				isPublic ? "public_tags" : "private_tags"
			]?.filter(t => t.name != tag);
		},

		// CRUD on events
		async createEvent({ courseId, event }: CourseIdActionPayload & EventActionPayload) {
			const newEvent = await createEvent(courseId, event);
			this.events.unshift(newEvent);
			return newEvent;
		},
		// TODO better naming scheme, e.g. getEventsByFilter
		async getEvents({
			courseId,
			filters,
		}: CourseIdActionPayload & {
			filters?: EventSearchFilter;
		}) {
			const events = await getEvents(courseId, filters);
			this.events = events;
		},
		async getEvent({
			courseId,
			eventId,
			includeDetails = false,
		}: EventIdActionPayload & {
			includeDetails: boolean;
		}) {
			const event = await getEvent(courseId, eventId, includeDetails);
			this.events.unshift(event);
		},
		async updateEvent({ courseId, event }: CourseIdActionPayload & EventActionPayload) {
			await updateEvent(courseId, event.id, event);
		},
		async partialUpdateEvent({
			courseId,
			eventId,
			changes,
			mutate = false,
			fireIntegrationEvent = false,
		}: EventIdActionPayload & {
			changes: Partial<Event>;
			mutate: boolean;
			fireIntegrationEvent?: boolean;
		}) {
			const event = await partialUpdateEvent(
				courseId,
				eventId,
				changes,
				fireIntegrationEvent,
			);
			if (mutate) {
				this.setEvent({ eventId, payload: event });
			}
		},
		async lockEvent({ courseId, eventId }: EventIdActionPayload) {
			const event = await lockEvent(courseId, eventId);
			this.setEvent({ eventId, payload: event });
		},

		// CRUD on event participations
		async getEventParticipations({
			courseId,
			eventId,
			includeDetails,
			forCsv, // TODO refactor
			// TODO mutate = false is only used by course insights & csv downloader, consider calling the api function directly and removing this param
			mutate = true,
		}: EventIdActionPayload & {
			includeDetails?: boolean;
			forCsv?: boolean;
			mutate: boolean;
		}) {
			const participations = await getEventParticipations(
				courseId,
				eventId,
				includeDetails,
				forCsv,
			);
			if (mutate) {
				this.eventParticipations = participations;
			}
			return participations;
		},
		async getEventParticipation({
			courseId,
			eventId,
			participationId,
		}: ParticipationIdActionPayload) {
			const participation = await getEventParticipation(
				courseId,
				eventId,
				participationId,
			);
			this.setEventParticipation(participation);
		},

		// CRUD on event templates, template rules, and rule clauses
		async deleteEventTemplateRule({
			courseId,
			templateId,
			ruleId,
		}: TemplateRuleIdActionPayload) {
			await deleteEventTemplateRule(courseId, templateId, ruleId);
			this.removeEventTemplateRule({ templateId, ruleId });
		},
		async deleteEventTemplateRuleClause({
			courseId,
			templateId,
			ruleId,
			clauseId,
		}: TemplateRuleClauseIdActionPayload) {
			await deleteEventTemplateRuleClause(courseId, templateId, ruleId, clauseId);
			this.removeEventTemplateRuleClause({
				templateId,
				ruleId,
				clauseId,
			});
		},
		async partialUpdateEventTemplateRule({
			courseId,
			templateId,
			ruleId,
			changes,
			reFetch = false,
		}: TemplateRuleIdActionPayload & {
			changes: Partial<EventTemplateRule>;
			reFetch: boolean;
		}) {
			await partialUpdateEventTemplateRule(courseId, templateId, ruleId, changes);
			if (reFetch) {
				const rules = (await getEventTemplate(courseId, templateId)).rules;
				this.setEventTemplateRules({
					templateId,
					payload: rules,
				});
			}
		},
		async getEventTemplateRule({
			courseId,
			templateId,
			ruleId,
		}: TemplateRuleIdActionPayload) {
			const rule = await getEventTemplateRule(courseId, templateId, ruleId);
			this.patchEventTemplateRule({
				templateId,
				ruleId,
				payload: rule,
			});
		},
		async createEventTemplateRule({
			courseId,
			templateId,
			rule,
		}: CourseIdActionPayload & TemplateIdPayload & EventTemplateRuleActionPayload) {
			const newRule = await createEventTemplateRule(courseId, templateId, rule);
			const event = this.getEventByTemplateId(templateId);
			const rules = event?.template?.rules;
			if (!rules) {
				throw new Error(
					"addEventTemplateRule couldn't find event with template id " + templateId,
				);
			}
			rules.push(newRule);
			return newRule;
		},
		async createEventTemplateRuleClause({
			courseId,
			templateId,
			ruleId,
			clause,
		}: TemplateRuleIdActionPayload & EventTemplateRuleClauseActionPayload) {
			const newClause = await createEventTemplateRuleClause(
				courseId,
				templateId,
				ruleId,
				clause,
			);
			const event = this.getEventByTemplateId(templateId);
			const rules = event?.template?.rules;
			if (!rules) {
				throw new Error(
					"addEventTemplateRuleClause couldn't find event with template id " + templateId,
				);
			}
			const targetRule = rules?.find((r: EventTemplateRule) => r.id === ruleId);
			if (!targetRule) {
				throw new Error(
					"addEventTemplateRuleClause couldn't find rule with id " + ruleId,
				);
			}
			targetRule?.clauses?.push(newClause);
			return newClause;
		},
		async updateEventTemplateRuleClause({
			courseId,
			templateId,
			ruleId,
			clause,
		}: TemplateRuleIdActionPayload & EventTemplateRuleClauseActionPayload) {
			const updatedClause = await updateEventTemplateRuleClause(
				courseId,
				templateId,
				ruleId,
				clause,
			);
			//return updatedClause;
		},

		/** CRUD on users */
		async getUsersForCourse(
			// returns users with applied filters their permissions relative to given course
			{
				courseId,
				teachersOnly,
				search,
			}: CourseIdActionPayload & { teachersOnly: boolean; search?: string },
		) {
			// TODO pagination
			const users = await getUsers(courseId, {
				isTeacher: teachersOnly ? true : undefined,
				search,
			});
			this.paginatedUsers = users;
		},
		async getPrivilegedUsersForCourse({ courseId }: CourseIdActionPayload) {
			// we can assume the number of privileged users for a given course will be fairly
			// small, therefore no need to keep them paginated - we can fetch all of them at once
			const users = await getUsers(courseId, { hasPrivileges: true, size: 99999999 });
			this.privilegedUsers = users.data;
		},
		async getCourseEnrolledUsers(
			// returns all users that are enrolled in given course
			{ courseId }: CourseIdActionPayload,
		) {
			const users = await getUsersEnrolledInCourse(courseId);
			this.enrolledUsers = users;
		},
		async enrollUsersInCourse(
			// returns all users that are enrolled in given course
			{
				courseId,
				userIds,
				emails,
			}: CourseIdActionPayload & { userIds: string[]; emails: string[] },
		) {
			await enrollUsersInCourse(courseId, userIds, emails);
		},
		async getCourseActiveUsers(
			// returns all users that are active in given course
			{ courseId }: CourseIdActionPayload,
		) {
			const users = await getActiveUsersForCourse(courseId);
			this.activeUsers = users;
		},
		async updateUserCoursePrivileges({
			courseId,
			userId,
			email,
			privileges,
		}: CourseIdActionPayload & {
			userId: string | null;
			email: string | null;
			privileges: CoursePrivilege[];
		}) {
			const user = await updateUserCoursePrivileges(courseId, userId, email, privileges);

			const newPrivileges = user.course_privileges ?? [];
			const privilegedUserIndex = this.privilegedUsers.findIndex(u => u.id == user.id);
			const userWasPrivileged = privilegedUserIndex !== -1;

			// if user was not among the privileged users but now has at least
			// one privilege, it should be added
			const shouldAddToPrivilegedUsers = !userWasPrivileged && newPrivileges.length > 0;

			// if user was among the privileged users but now has 0 privileges,
			// it should be removed
			const shouldRemoveFromPrivilegedUsers =
				userWasPrivileged && newPrivileges.length === 0;

			// update or add user to user list
			const target = this.paginatedUsers.data.find(u => u.id == user.id);
			if (target) {
				Object.assign(target, user);
			} else {
				prependToPaginatedData(this.paginatedUsers, user);
			}

			// update, add, or remove user in privileged users list
			if (shouldRemoveFromPrivilegedUsers) {
				this.privilegedUsers.splice(privilegedUserIndex, 1);
			} else if (shouldAddToPrivilegedUsers) {
				this.privilegedUsers.push(user);
			} else {
				Object.assign(this.privilegedUsers[privilegedUserIndex], user);
			}

			return user;
		},
		async bulkPartialUpdateEventParticipation({
			courseId,
			changes,
			eventId,
			participationIds,
			fireIntegrationEvent,
		}: EventIdActionPayload & {
			changes: Partial<EventParticipation>;
			participationIds: string[];
			fireIntegrationEvent?: boolean;
		}) {
			const response = await bulkPartialUpdateEventParticipation(
				courseId,
				eventId,
				participationIds,
				changes,
				fireIntegrationEvent,
			);
			response.forEach(p => this.setEventParticipation(p));
		},
		async getEventParticipationSlot({
			courseId,
			eventId,
			participationId,
			slotId,
		}: ParticipationSlotIdActionPayload) {
			const response = await getEventParticipationSlot(
				courseId,
				eventId,
				participationId,
				slotId,
			);
			this.setEventParticipationSlot({ participationId, slotId, payload: response });
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
				participationId,
				slotId,
				changes,
			);
			if (mutate) {
				this.setEventParticipationSlot({ slotId, payload: response, participationId });
			}
			return response;
		},
	},
});

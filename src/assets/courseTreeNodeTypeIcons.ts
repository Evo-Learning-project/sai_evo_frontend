import { CourseTreeNodeType } from "@/models";

export const icons = {
	[CourseTreeNodeType.LessonNode]: ["book"],
	[CourseTreeNodeType.FileNode]: ["file_present"],
	[CourseTreeNodeType.TopicNode]: ["splitscreen"],
	[CourseTreeNodeType.AnnouncementNode]: ["campaign"],
	[CourseTreeNodeType.PollNode]: ["poll"],
};

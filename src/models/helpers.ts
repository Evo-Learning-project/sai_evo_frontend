import { getTranslatedString as _ } from "@/i18n";
import { CourseTreeNode } from "./interfaces";
import { CourseTreeNodeType } from "./types";

export function getCourseTreeNodeTitle(node: CourseTreeNode) {
	switch (node.resourcetype) {
		case CourseTreeNodeType.LessonNode:
			return node.title;
		case CourseTreeNodeType.TopicNode:
			return node.name;
		case CourseTreeNodeType.FileNode:
			return (node.file as { name: string }).name;
		case CourseTreeNodeType.AnnouncementNode:
			return _("course_tree.announcement_title");
		case CourseTreeNodeType.PollNode:
			return _("course_tree.poll_title");
		default:
			throw new Error("getCourseTreeNodeTitle not implemented for " + node);
	}
}

import { CoursePrivilege } from "@/models";

export const icons = {
	[CoursePrivilege.ACCESS_EXERCISES]: ["visibility"],
	[CoursePrivilege.ASSESS_PARTICIPATIONS]: ["grading"],
	[CoursePrivilege.MANAGE_EVENTS]: ["edit"],
	[CoursePrivilege.MANAGE_EXERCISES]: ["edit"],
	[CoursePrivilege.UPDATE_COURSE]: ["settings"],
	[CoursePrivilege.MANAGE_EXERCISE_SOLUTIONS]: ["grading"],
};

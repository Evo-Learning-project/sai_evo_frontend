import { CoursePrivilege, User } from "@/models";
import axios from "axios";

export async function getUsers(courseId: string): Promise<User[]> {
	const response = await axios.get(`/users/?course_id=${courseId}`);
	return response.data;
}

export async function getMe(): Promise<User> {
	const response = await axios.get("/users/me/");
	return response.data;
}

export async function updateUser(userId: string, changes: Partial<User>): Promise<User> {
	const response = await axios.patch(`/users/${userId}/`, changes);
	return response.data;
}

export async function getActiveUsersForCourse(courseId: string): Promise<User[]> {
	const response = await axios.get(`/courses/${courseId}/active_users/`);
	return response.data;
}

export async function updateUserCoursePrivileges(
	courseId: string,
	userId: string,
	privileges: CoursePrivilege[],
): Promise<User> {
	const response = await axios.patch(
		`/courses/${courseId}/privileges/?user_id=${userId}`,
		{
			course_privileges: privileges,
		},
	);
	return response.data;
}

import { CoursePrivilege, User } from "@/models";
import axios from "axios";
import { convertPaginatedResponseToLocalPaginatedData } from "./converters";
import { PaginatedData } from "./interfaces";

export async function getUsers(
	courseId: string,
	{
		search,
		isTeacher,
		hasPrivileges,
		size,
	}: { search?: string; isTeacher?: boolean; hasPrivileges?: boolean; size?: number },
): Promise<PaginatedData<User>> {
	const queryParams =
		(typeof isTeacher === "boolean" ? `&is_teacher=${String(isTeacher)}` : "") +
		(typeof hasPrivileges === "boolean"
			? `&has_privileges=${String(hasPrivileges)}`
			: "") +
		(typeof search === "string" ? `&search=${encodeURIComponent(search)}` : "") +
		(typeof size === "number" ? `&size=${size}` : "");
	const response = await axios.get(`/users/?course_id=${courseId}${queryParams}`);
	// !! TODO take in a page arg
	return convertPaginatedResponseToLocalPaginatedData(response.data, 1);
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

export async function getUsersEnrolledInCourse(courseId: string): Promise<User[]> {
	const response = await axios.get(`/courses/${courseId}/enrollments/`);
	return response.data;
}

export async function updateUserCoursePrivileges(
	courseId: string,
	userId: string | null,
	email: string | null,
	privileges: CoursePrivilege[],
): Promise<User> {
	const response = await axios.patch(
		`/courses/${courseId}/privileges/?${userId ? "user_id=" + userId : "email=" + email}`,
		{
			course_privileges: privileges,
		},
	);
	return response.data;
}

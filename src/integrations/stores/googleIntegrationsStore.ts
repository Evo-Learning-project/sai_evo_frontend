import { defineStore } from "pinia";
import axios from "axios";
import {
	GoogleClassroomCourseData,
	GoogleClassroomCourseTwin,
	GoogleClassroomCourseWorkTwin,
} from "../classroom/interfaces";

export const useGoogleIntegrationsStore = defineStore("googleIntegration", {
	state: () => ({
		// Google OAuth scopes that the user has granted access to
		authorizedScopes: [] as string[],
		// maps course id's to their course twins (i.e. the Classroom course to
		// which they are paired), if they exist
		courseTwins: {} as Record<string, GoogleClassroomCourseTwin>,
	}),
	getters: {},
	actions: {
		async getClassroomScopesAuthUrl(): Promise<string> {
			/**
			 * Returns a URL that can be used to authenticate and grant scopes
			 * that allow the application to use Classroom's features
			 */
			const response = await axios.get(`/integrations/classroom/auth_url/`);
			return response.data;
		},
		async getAuthorizedScopes(): Promise<string[]> {
			/**
			 * Returns an array of strings each representing a Google OAuth
			 * scope granted by the user. This is used to check whether the user
			 * has granted all the necessary scopes for the integrations to work
			 */
			const response = await axios.get(`/integrations/classroom/authorized_scopes/`);
			this.authorizedScopes = response.data;
			return this.authorizedScopes;
		},
		async getCourseTwin(courseId: string): Promise<GoogleClassroomCourseTwin | null> {
			try {
				const response = await axios.get(
					`/integrations/classroom/course/?course_id=${courseId}`,
				);
				this.courseTwins[courseId] = response.data;
				return response.data;
			} catch (e) {
				console.error(e);
				return null;
			}
		},
		async isGoogleClassroomIntegrationActive(courseId: string) {
			return (await this.getCourseTwin(courseId))?.enabled ?? false;
		},
		async getGoogleClassroomCourseWorkTwin(
			eventId: string,
		): Promise<GoogleClassroomCourseWorkTwin | null> {
			try {
				const response = await axios.get(
					`/integrations/classroom/coursework/?event_id=${eventId}`,
				);
				return response.data;
			} catch (e) {
				return null;
			}
		},
		async createCourseTwin(
			courseId: string,
			classroomCourseId: string,
		): Promise<GoogleClassroomCourseTwin> {
			const response = await axios.post(
				`/integrations/classroom/course/?course_id=${courseId}`,
				{
					classroom_course_id: classroomCourseId,
				},
			);
			this.courseTwins[courseId] = response.data;
			return response.data;
		},
		async partialUpdateCourseTwin(
			courseId: string,
			payload: Partial<GoogleClassroomCourseTwin>,
		): Promise<GoogleClassroomCourseTwin> {
			const response = await axios.patch(
				`/integrations/classroom/course/?course_id=${courseId}`,
				payload,
			);
			this.courseTwins[courseId] = response.data;
			return response.data;
		},
		async getGoogleClassroomCoursesTaughtByCurrentUser(): Promise<
			GoogleClassroomCourseData[]
		> {
			const response = await axios.get(`/integrations/classroom/classroom_courses/`);
			return response.data;
		},
	},
});

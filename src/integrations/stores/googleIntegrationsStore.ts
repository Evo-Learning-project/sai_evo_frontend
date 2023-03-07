import { defineStore } from "pinia";
import axios from "axios";

export const useGoogleIntegrationsStore = defineStore("googleIntegration", {
	state: () => ({
		// Google OAuth scopes that the user has granted access to
		authorizedScopes: [] as string[],
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
	},
});

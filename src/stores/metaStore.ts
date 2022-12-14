import { defineStore } from "pinia";
import { User } from "@/models";
import axios from "axios";
import { ErrorMessage } from "@/interfaces";
import { getMe, updateUser } from "@/api";

export const useMetaStore = defineStore("meta", {
	state: () => ({
		user: {} as User,
		token: "",
		refreshToken: "",
		loading: false,
		firstLoading: false,
		localLoading: false,
		pageWideErrorData: null as ErrorMessage | null,
		errorNotificationData: null as ErrorMessage | null,
		saving: false,
		savingError: false,
		_showSuccessFeedback: false,
		dirtyTex: false,
		helpCenterOpen: false,
		helpCenterSelectedArticleId: null as string | null,
	}),
	getters: {
		email: state => state.user.email,
		isAuthenticated: state => !!state.token,
		unsavedChanges: state => state.saving || state.savingError,
	},
	actions: {
		initStore() {
			const token = localStorage.getItem("token");
			const refreshToken = localStorage.getItem("refreshToken");
			const user = localStorage.getItem("user");

			if (token) {
				console.log("restoring token");
				this.token = token;
				axios.defaults.headers.common["Authorization"] = "Bearer " + this.token;
			}
			if (refreshToken) {
				this.refreshToken = refreshToken;
			}
			if (user) {
				this.user = JSON.parse(user);
			}
		},
		showSuccessFeedback() {
			this._showSuccessFeedback = true;
			setTimeout(() => (this._showSuccessFeedback = false), 2000);
		},
		setUser(user: User) {
			Object.assign(this.user, user);
			// TODO use plugin
			localStorage.setItem("user", JSON.stringify(user));
		},
		setToken(token: string) {
			this.token = token;
			localStorage.setItem("token", token);
			axios.defaults.headers.common["Authorization"] = "Bearer " + token;
		},
		resetToken() {
			this.token = "";
			localStorage.removeItem("token");
			axios.defaults.headers.common["Authorization"] = "";
		},
		setRefreshToken(token: string) {
			this.refreshToken = token;
			localStorage.setItem("refreshToken", token);
		},
		setHelpCenterVisibility(visibility: boolean) {
			this.helpCenterOpen = visibility;
			if (!visibility) {
				this.helpCenterSelectedArticleId = null;
			}
		},
		setHelpCenterArticleId(articleId: string | null) {
			this.helpCenterSelectedArticleId = articleId;
		},
		setErrorNotificationData({
			data,
			hideTimeout = 4000,
		}: {
			data: ErrorMessage | null;
			hideTimeout: number;
		}) {
			this.errorNotificationData = data;
			if (data) {
				setTimeout(() => (this.errorNotificationData = null), hideTimeout);
			}
		},
		// previous vuex actions
		async convertToken(token: string) {
			const response = await axios.post("/users/auth/convert-token/", {
				token,
				grant_type: "convert_token",
				client_id: process.env.VUE_APP_GOOGLE_OAUTH_CLIENT_ID,
				client_secret: process.env.VUE_APP_GOOGLE_OAUTH_CLIENT_SECRET,
				backend: "google-oauth2",
			});

			this.setToken(response.data.access_token);
			this.setRefreshToken(response.data.refresh_token);
		},
		async getUserData() {
			const response = await getMe();
			this.setUser(response);
		},
		async patchUser({ userId, changes }: { userId: string; changes: Partial<User> }) {
			const response = await updateUser(userId, changes);
			this.setUser(response);
		},
	},
});

import { User } from "@/models";
import { MetaStoreState } from "../types";

export const metaStore = {
	namespaced: true,
	state: (): MetaStoreState => ({
		user: {} as User,
		token: "",
		refreshToken: "",
		loading: false,
		firstLoading: false,
		localLoading: false,
		pageWideErrorData: null,
		errorNotificationData: null,
		saving: false,
		savingError: false,
		showSuccessFeedback: false,
		dirtyTex: false,
		helpCenterOpen: false,
		helpCenterSelectedArticleId: null,
	}),
};

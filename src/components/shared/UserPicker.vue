<template>
	<div>
		<!-- selected users-->
		<p :class="{ 'opacity-0': addingUsers.length === 0 }" class="mb-4 mt-2 font-medium">
			{{ addingUsers.length }} {{ $t("misc.selected") }}
		</p>
		<div class="flex items-center mr-2 mb-6 flex-wrap">
			<TransitionGroup name="quick-bounce">
				<div
					class="mr-2.5 mb-2.5 bg-light flex px-3 my-auto w-max rounded-full"
					v-for="user in addingUsers"
					:key="user.email"
				>
					<div class="flex items-center">
						<Avatar :user="user" class="-ml-3 mr-1.5" />
						<div class="flex flex-col">
							<p>{{ user.full_name }}</p>
							<!-- <p class="text-muted text-sm -mt-1">{{ user.email }}</p> -->
						</div>
						<Btn
							:variant="'icon'"
							class="bg-gray-200 -mr-2 ml-2"
							:outline="true"
							:size="'xs'"
							@click="onRemoveUser(user)"
							><span
								style="font-size: 15px !important; margin-left: 0.5px !important"
								class="material-icons"
								>close</span
							></Btn
						>
					</div>
				</div></TransitionGroup
			>
		</div>
		<TextInput v-model="searchText" class="mt-4">{{
			$t("course_insights.search_student")
		}}</TextInput>
		<p class="text-muted text-sm mt-0.5">
			{{ $t("course_permissions.search_user_hint") }}
		</p>
		<div class="mt-4 relative">
			<div class="absolute top-0 left-1/2 -translate-x-1/2 transform" v-if="loadingUsers">
				<Spinner :size="'lg'" />
			</div>
			<div class="mt-4 -mb-3 h-100 overflow-auto">
				<!-- create by email-->
				<div
					v-if="filteredUsers.length === 0 && isSearchTextValidEmail"
					v-wave
					tabindex="0"
					class="py-2 px-2 transition-colors duration-75 cursor-pointer"
					@click="onSelectUserByEmail(searchText)"
					@keyup.enter="onSelectUserByEmail(searchText)"
					:class="[
						modelValue.emails.includes(searchText)
							? 'text-primary-dark bg-primary-light hover:bg-primary-light bg-opacity-15 hover:bg-opacity-20'
							: 'hover:bg-light',
					]"
				>
					<div class="flex items-center space-x-4 mr-8">
						<Avatar :user="{ full_name: searchText }" />
						<p>{{ searchText }}</p>
					</div>
				</div>
				<!-- empty results-->
				<div
					class="flex flex-col items-center mt-12 mx-2"
					v-if="filteredUsers.length === 0 && !isSearchTextValidEmail && !loadingUsers"
				>
					<h3 class="font-medium">
						{{ $t("course_permissions.search_cant_find_user") }}
					</h3>
					<p class="text-muted">
						{{ $t("course_permissions.try_with_email_hint") }}
					</p>
				</div>
				<div
					v-wave
					tabindex="0"
					class="py-2 px-2 transition-colors duration-75 cursor-pointer"
					v-for="user in filteredUsers"
					:key="user.id"
					@click="onSelectUserById(user.id)"
					@keyup.enter="onSelectUserById(user.id)"
					:class="[
						modelValue.ids.includes(user.id)
							? 'text-primary-dark bg-primary-light hover:bg-primary-light bg-opacity-15 hover:bg-opacity-20'
							: 'hover:bg-light',
					]"
				>
					<div class="flex items-center space-x-4">
						<Avatar :user="user" />
						<div class="flex flex-col">
							<p v-html="highlightMatchingText(searchText, user.full_name)" />
							<p
								v-html="highlightMatchingText(searchText, user.email)"
								class="text-muted text-sm -mt-1"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script lang="ts">
import { SelectableOption } from "@/interfaces";
import { courseIdMixin } from "@/mixins";
import { userMatchesSearch, User } from "@/models";
import { useMainStore } from "@/stores/mainStore";
import {
	highlightMatchingText,
	setErrorNotification,
	isValidEmailAddress,
} from "@/utils";
import { defineComponent, PropType } from "@vue/runtime-core";
import { throttle } from "lodash";
import { mapStores } from "pinia";
import Avatar from "../ui/Avatar.vue";
import Btn from "../ui/Btn.vue";
import Combobox from "../ui/Combobox.vue";
import Spinner from "../ui/Spinner.vue";
import TextInput from "../ui/TextInput.vue";
export default defineComponent({
	name: "UserPicker",
	props: {
		modelValue: {
			type: Object as PropType<{
				ids: string[];
				emails: [];
			}>,
			required: true,
		},
	},
	async created() {
		this.loadingUsers = true;
		await this.throttledGetUsers(null);
	},
	mixins: [courseIdMixin],
	watch: {
		searchText(newVal) {
			this.loadingUsers = true;
			this.throttledGetUsers(newVal);
		},
	},
	data() {
		return {
			searchText: "",
			loadingUsers: false,
			addingUserIds: [] as string[],
			addingEmails: [] as string[],
			/**
			 * Users in the store may change due to filtered API calls,
			 * so keep a local cache of selected user objects
			 */
			cachedUsers: [] as User[],
		};
	},
	methods: {
		onRemoveUser(user: Partial<User>) {
			if (user.id) {
				this.$emit("update:modelValue", {
					emails: this.modelValue.emails,
					ids: this.modelValue.ids.filter(i => i != user.id),
				});
			} else {
				this.$emit("update:modelValue", {
					emails: this.modelValue.emails.filter(e => e != user.email),
					ids: this.modelValue.ids,
				});
			}
		},
		onSelectUserById(userId: string) {
			if (this.modelValue.ids.includes(userId)) {
				this.onRemoveUser({ id: userId });
			} else {
				this.addingUserIds.push(userId);
				this.cachedUsers.push(this.mainStore.getUserById(userId));
				this.$emit("update:modelValue", {
					emails: this.modelValue.emails,
					ids: [...this.modelValue.ids, userId],
				});
			}
		},
		onSelectUserByEmail(email: string) {
			if (this.modelValue.emails.includes(email)) {
				this.onRemoveUser({ email });
			} else {
				this.addingEmails.push(email);
				this.$emit("update:modelValue", {
					emails: [...this.modelValue.emails, email],
					ids: this.modelValue.ids,
				});
			}
		},
		async onUserSearch(search: string) {
			this.loadingUsers = true;
			await this.throttledGetUsers(search);
		},
		throttledGetUsers: throttle(async function (this: any, search) {
			try {
				await this.mainStore.getUsersForCourse({
					courseId: this.courseId,
					teachersOnly: false,
					search,
				});
			} catch (e) {
				setErrorNotification(e);
			} finally {
				this.loadingUsers = false;
			}
		}, 500),
		highlightMatchingText,
	},
	computed: {
		...mapStores(useMainStore),
		users() {
			return this.mainStore.paginatedUsers.data;
		},
		filteredUsers() {
			return this.users.filter(u => userMatchesSearch(this.searchText, u));
		},
		isSearchTextValidEmail() {
			return isValidEmailAddress(this.searchText);
		},
		addingUsers() {
			return [
				...this.modelValue.ids.map(i => this.cachedUsers.find(u => u.id == i)),
				...this.modelValue.emails.map(e => ({
					full_name: e,
					email: e,
				})),
			];
		},
	},
	components: { Avatar, Spinner, TextInput, Btn },
});
</script>

<template>
	<div class="h-full">
		<!-- user search -->
		<div class="flex items-center space-x-2 mt-4 mb-12" v-if="canManagePermissions">
			<span class="material-icons icon-light">person_add</span>
			<Combobox
				class="lg:w-3/5 w-full"
				:items="usersAsOptions"
				:placeholder="''"
				:label="$t('course_permissions.search_user')"
				@update:modelValue="onShowUserPermissionsDialog($event, null)"
				@createOption="onShowUserPermissionsDialog(null, $event)"
				:hint="$t('course_permissions.search_user_hint')"
				:filterFunction="filterUser"
				:isCreatableFunction="isValidEmailAddress"
			>
				<template v-slot="{ item }">
					<div class="flex items-center space-x-4">
						<Avatar :user="item.data" />
						<div class="flex flex-col">
							<p>{{ item.data.full_name }}</p>
							<p class="text-muted text-sm -mt-1">{{ item.data.email }}</p>
						</div>
					</div>
				</template>
				<template v-slot:noResults>
					<div class="flex flex-col items-center my-4 mx-2">
						<p class="text-lg">{{ $t("course_permissions.search_cant_find_user") }}</p>
						<p class="text-sm text-muted">
							{{ $t("course_permissions.try_with_email_hint") }}
						</p>
					</div>
				</template>
				<template v-slot:createOption="{ searchText }">
					<div class="flex items-center space-x-4 mr-8">
						<Avatar :user="{ full_name: searchText }" />
						<p>{{ searchText }}</p>
					</div>
				</template>
			</Combobox>
		</div>

		<!-- list of privileged users-->
		<div class="mt-6">
			<h3 class="mb-1">{{ $t("course_permissions.users_with_privileges") }}</h3>
			<div
				v-for="user in privilegedUsers"
				:key="user.id"
				class="py-2 hover:bg-light hover:bg-opacity-60 transition-colors duration-100"
			>
				<div
					class="
						flex
						lg:flex-row
						flex-col
						lg:space-y-0
						space-y-4
						lg:items-center
						card
						w-full
					"
				>
					<!-- user data -->
					<div class="flex items-center space-x-3 lg:w-1/3">
						<Avatar :size="'lg'" :user="user" />
						<div class="ml-2 mr-4 flex flex-col -space-y-1">
							<div class="flex items-center space-x-1">
								<p class="text-lg">{{ user.full_name }}</p>
								<Tooltip
									v-if="isCourseCreator(user)"
									:textValue="$t('course_permissions.course_creator')"
									:placement="'bottom'"
									:noArrow="true"
								>
									<span class="material-icons ml-1 inline-icon text-muted"> shield </span>
								</Tooltip>
							</div>
							<div
								v-if="user.email !== user.full_name"
								class="flex items-center space-x-1"
							>
								<p class="text-sm text-muted">{{ user.email }}</p>
								<a style="margin-bottom: -4.85px" :href="'mailto:' + user.email">
									<Btn :size="'xs'" :variant="'icon'" :outline="true">
										<span
											style="font-size: 14px !important"
											class="material-icons-outlined icon-light"
										>
											email
										</span>
									</Btn>
								</a>
							</div>
						</div>
					</div>
					<!-- permissions chips -->
					<div class="flex flex-wrap w-full">
						<Chipset
							:showAddChip="canManagePermissions"
							:disabled="
								!canManagePermissions || isCourseCreator(user) || user.id == currentUserId
							"
							:deletable="true"
							:modelValue="[]"
							:options="getUserPermissionsAsOptions(user)"
							@deleteChip="onRemoveUserPrivilege(user, $event)"
							@addChip="onShowUserPermissionsDialog(user.id, null)"
							:addChipTooltip="$t('course_permissions.add_permissions_tooltip')"
						/>
					</div>
				</div>
			</div>
		</div>
		<!-- user permission dialog -->
		<Dialog :showDialog="showDialog" :confirmOnly="true" @yes="hideDialog()">
			<template v-slot:title>
				{{ $t("course_privileges_page.edit_permissions_title") }}&nbsp;{{
					editingUser?.full_name
				}}
			</template>
			<template v-slot:body>
				<div class="text-darkText">
					<CheckboxGroup
						:options="privilegesAsOptions"
						v-model="editingUserPrivileges"
						:labelClass="'text-xl flex-grow'"
						:optionClass="'my-4'"
						:useToggles="true"
					>
						<template v-slot="{ icons }">
							<span
								style="font-size: 1.3rem"
								v-if="icons?.length > 0"
								class="ml-1 mr-2 material-icons-outlined"
								>{{ icons[0] }}</span
							></template
						>
						<template v-slot:item="{ description }">
							<p class="ml-1 mt-0.5 text-sm text-muted">{{ description }}</p>
						</template>
					</CheckboxGroup>
				</div>
			</template>
		</Dialog>
	</div>
</template>

<script lang="ts">
// TODO have a way to add permissions to users that haven't logged in for the first time yet
import { courseIdMixin, coursePrivilegeMixin, loadingMixin, savingMixin } from "@/mixins";
import { defineComponent } from "@vue/runtime-core";

import { getTranslatedString as _ } from "@/i18n";
import { CoursePrivilege, getBlankUser, User } from "@/models";
import { icons as coursePrivilegeIcons } from "@/assets/coursePrivilegeIcons";
import Dialog from "@/components/ui/Dialog.vue";
import CheckboxGroup from "@/components/ui/CheckboxGroup.vue";
import { SelectableOption } from "@/interfaces";
import { mapStores } from "pinia";
import { useMetaStore } from "@/stores/metaStore";
import { useMainStore } from "@/stores/mainStore";
import { getCurrentUserId, setErrorNotification, setPageWideError } from "@/utils";
import Combobox from "@/components/ui/Combobox.vue";
import Avatar from "@/components/ui/Avatar.vue";
import Tooltip from "@/components/ui/Tooltip.vue";
import Chipset from "@/components/ui/Chipset.vue";
import { hasCoursePrivileges } from "@/navigation/permissions";
import Btn from "@/components/ui/Btn.vue";

export default defineComponent({
	name: "CoursePermissions",
	components: {
		Dialog,
		CheckboxGroup,
		Combobox,
		Avatar,
		Tooltip,
		Chipset,
		Btn,
	},
	mixins: [courseIdMixin, loadingMixin, savingMixin, coursePrivilegeMixin],
	async created() {
		await this.withLoading(
			async () =>
				await this.mainStore.getUsersForCourse({
					courseId: this.courseId,
				}),
			setPageWideError,
		);
	},
	data() {
		return {
			showDialog: false,
			editingUserId: null as string | null,
			// used when editing privileges for a user that doesn't exist yet
			editingUserEmail: null as string | null,
			coursePrivilegeIcons,
		};
	},
	methods: {
		hideDialog() {
			this.showDialog = false;
			this.editingUserId = null;
			this.editingUserEmail = null;
		},
		onShowUserPermissionsDialog(userId: string | null, email: string | null) {
			this.editingUserId = userId;
			this.editingUserEmail = email;
			this.showDialog = true;
		},
		isCourseCreator(user: User) {
			return this.currentCourse?.creator?.id == user.id;
		},
		getUserPermissionsAsOptions(user: User) {
			return (user.course_privileges ?? []).map(key => ({
				value: key,
				content: _("course_privileges_short." + key),
				icons: coursePrivilegeIcons[key],
			}));
		},
		async onSetUserPrivileges(
			userId: string | null,
			email: string | null,
			privileges: CoursePrivilege[],
		) {
			await this.withLoading(async () => {
				const updatedUser = await this.mainStore.updateUserCoursePrivileges({
					courseId: this.courseId,
					userId,
					email,
					privileges,
				});
				if (email !== null) {
					// user was just created using provided email address, now switch to editing
					// the newly created user instead of using the email address only
					this.editingUserId = updatedUser.id;
					this.editingUserEmail = null;
				}
			}, setErrorNotification);
		},
		async onRemoveUserPrivilege(user: User, privilege: CoursePrivilege) {
			await this.onSetUserPrivileges(
				user.id,
				null,
				(user.course_privileges ?? []).filter(p => p != privilege),
			);
		},
		// for combobox
		filterUser(search: string, userOption: SelectableOption) {
			const searchTokens = search.toLowerCase().split(/\s/);
			const user = this.mainStore.getUser(userOption.value);
			const fullName = (user?.full_name ?? "").toLowerCase().replace(/\s/g, "");
			const email = (user?.email ?? "").toLowerCase().replace(/\s/g, "");

			return searchTokens.every(t => fullName.includes(t) || email.includes(t));
		},
		isValidEmailAddress(text: string) {
			// TODO improve to match django logic for validating an email
			const input = document.createElement("input");
			input.type = "email";
			input.required = true;
			input.value = text;
			return typeof input.checkValidity === "function"
				? input.checkValidity()
				: /\S+@\S+\.\S+/.test(text);
		},
	},
	computed: {
		...mapStores(useMainStore, useMetaStore),
		editingUser(): User | undefined {
			if (this.editingUserId !== null) {
				// an actual user is being edited
				return this.mainStore.users.find(u => u.id == this.editingUserId);
			}
			if (this.editingUserEmail !== null) {
				// a nonexistent user is being edited - the backend will create its account
				// as soon as the first request is issued using the email address
				return {
					...getBlankUser(),
					full_name: this.editingUserEmail,
					course_privileges: [],
				};
			}
			return undefined;
		},
		editingUserPrivileges: {
			get() {
				return this.editingUser?.course_privileges ?? [];
			},
			async set(val: CoursePrivilege[]) {
				await this.onSetUserPrivileges(this.editingUserId, this.editingUserEmail, val);
			},
		},
		privilegedUsers() {
			return [
				...this.mainStore.users.filter(u => this.isCourseCreator(u)),
				...this.mainStore.users
					.filter(u => !this.isCourseCreator(u) && (u.course_privileges ?? []).length > 0)
					.sort(
						(a, b) =>
							(b.course_privileges ?? []).length - (a.course_privileges ?? []).length,
					),
			];
		},
		usersAsOptions(): SelectableOption[] {
			return this.mainStore.users.map(u => ({
				value: u.id,
				content: u.full_name,
				data: u,
			}));
		},
		privilegesAsOptions(): SelectableOption[] {
			return Object.values(CoursePrivilege).map(key => ({
				value: key,
				content: _("course_privileges_short." + key),
				icons: coursePrivilegeIcons[key],
				description: _("course_privileges." + key),
			}));
		},
		canManagePermissions() {
			return this.hasPrivileges([CoursePrivilege.UPDATE_COURSE]);
		},
		currentUserId() {
			return getCurrentUserId();
		},
	},
});
</script>

<style></style>

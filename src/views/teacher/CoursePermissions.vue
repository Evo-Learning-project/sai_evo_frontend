<template>
	<div class="h-full">
		<!-- user search -->
		<Combobox
			leftIcon="person_add"
			class="w-1/2 mt-4"
			:items="usersAsOptions"
			:placeholder="''"
			:label="$t('course_permissions.search_user')"
			@update:modelValue="onSetUserPermissions($event)"
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
		</Combobox>
		<!-- list of privileged users-->
		<div class="mt-12">
			<h3 class="mb-4">{{ $t("course_permissions.users_with_privileges") }}</h3>
			<div
				v-for="user in privilegedUsers"
				:key="user.id"
				class="py-2 hover:bg-light hover:bg-opacity-60 transition-colors duration-100"
			>
				<div class="flex items-center card w-full">
					<!-- user data -->
					<div class="flex items-center w-1/3">
						<Avatar :user="user" />
						<div class="ml-2 mr-4 flex flex-col -space-y-0.5">
							<div class="flex items-center space-x-1">
								<p>{{ user.full_name }}</p>
								<Tooltip
									v-if="isCourseCreator(user)"
									:textValue="$t('course_permissions.course_creator')"
									:placement="'bottom'"
									:noArrow="true"
								>
									<span class="material-icons ml-1 inline-icon text-muted"> shield </span>
								</Tooltip>
							</div>
							<p class="text-sm text-muted">{{ user.email }}</p>
						</div>
					</div>
					<!-- permissions chips -->
					<div class="flex flex-wrap w-full">
						<div
							v-for="privilege in user.course_privileges"
							:key="user.id + '-' + privilege"
							class="chip flex items-center space-x-1 text-sm"
						>
							<span style="font-size: 18px !important" class="material-icons-outlined">{{
								coursePrivilegeIcons[privilege][0]
							}}</span>
							<p>{{ $t("course_privileges_short." + privilege) }}</p>
						</div>
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
				</div></template
			>
		</Dialog>
	</div>
</template>

<script lang="ts">
// TODO have a way to add permissions to users that haven't logged in for the first time yet
import { courseIdMixin, loadingMixin, savingMixin } from "@/mixins";
import { defineComponent } from "@vue/runtime-core";

import { getTranslatedString as _ } from "@/i18n";
import { CoursePrivilege, User } from "@/models";
import { icons as coursePrivilegeIcons } from "@/assets/coursePrivilegeIcons";
import Dialog from "@/components/ui/Dialog.vue";
import CheckboxGroup from "@/components/ui/CheckboxGroup.vue";
import { SelectableOption } from "@/interfaces";
import { mapStores } from "pinia";
import { useMetaStore } from "@/stores/metaStore";
import { useMainStore } from "@/stores/mainStore";
import { setErrorNotification, setPageWideError } from "@/utils";
import Combobox from "@/components/ui/skeletons/Combobox.vue";
import Avatar from "@/components/ui/Avatar.vue";
import Tooltip from "@/components/ui/Tooltip.vue";

export default defineComponent({
	name: "CoursePermissions",
	components: {
		Dialog,
		CheckboxGroup,
		Combobox,
		Avatar,
		Tooltip,
	},
	mixins: [courseIdMixin, loadingMixin, savingMixin],
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
			editingUserId: "",
			coursePrivilegeIcons,
		};
	},
	methods: {
		hideDialog() {
			this.showDialog = false;
			this.editingUserId = "";
		},
		onSetUserPermissions(userId: string) {
			this.editingUserId = userId;
			this.showDialog = true;
		},
		isCourseCreator(user: User) {
			return this.currentCourse.creator.id == user.id;
		},
	},
	computed: {
		...mapStores(useMainStore, useMetaStore),
		editingUser(): User | undefined {
			return this.mainStore.users.find(u => u.id == this.editingUserId);
		},
		editingUserPrivileges: {
			get() {
				return this.editingUser?.course_privileges;
			},
			async set(val: CoursePrivilege[]) {
				await this.withLoading(
					async () =>
						await this.mainStore.updateUserCoursePrivileges({
							courseId: this.courseId,
							userId: this.editingUserId,
							privileges: val,
						}),
					setErrorNotification,
				);
			},
		},
		usersData() {
			return (
				this.mainStore.users
					.map(u => ({
						id: u.id,
						email: u.email,
						fullName: u.full_name,
						coursePrivileges: u.course_privileges,
					}))
					// put users with more privileges at the top
					.sort(
						(a, b) =>
							(b.coursePrivileges ?? []).length - (a.coursePrivileges ?? []).length,
					)
			);
		},
		privilegedUsers() {
			return this.mainStore.users
				.filter(u => (u.course_privileges ?? []).length > 0)
				.sort(
					(a, b) =>
						(b.course_privileges ?? []).length - (a.course_privileges ?? []).length,
				);
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
	},
});
</script>

<style></style>

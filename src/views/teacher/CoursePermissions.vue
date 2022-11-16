<template>
	<div>
		<DataTable
			:class="{ 'opacity-50': usersData.length === 0 }"
			:columnDefs="columns"
			:rowData="usersData"
			@cellClicked="onCellClicked"
			@gridReady="gridApi = $event.api"
			:getRowClass="getRowClass"
			:getRowId="getRowId"
		></DataTable>
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
import DataTable from "@/components/ui/DataTable.vue";
import { courseIdMixin, loadingMixin, savingMixin } from "@/mixins";
import { defineComponent } from "@vue/runtime-core";
import { CellClickedEvent, ColDef, RowClassParams, RowNode } from "ag-grid-community";

import { getTranslatedString as _ } from "@/i18n";
import { Course, CoursePrivilege, User } from "@/models";
import { icons as coursePrivilegeIcons } from "@/assets/coursePrivilegeIcons";
import Dialog from "@/components/ui/Dialog.vue";
import CheckboxGroup from "@/components/ui/CheckboxGroup.vue";
import { SelectableOption } from "@/interfaces";
import UserCoursePermissionsRenderer from "@/components/datatable/UserCoursePermissionsRenderer.vue";
import { mapStores } from "pinia";
import { useMetaStore } from "@/stores/metaStore";
import { useMainStore } from "@/stores/mainStore";

export default defineComponent({
	name: "CoursePermissions",
	components: {
		DataTable,
		Dialog,
		CheckboxGroup,

		/* Ag grid renderers */
		// eslint-disable-next-line vue/no-unused-components
		UserCoursePermissionsRenderer,
	},
	mixins: [courseIdMixin, loadingMixin, savingMixin],
	async created() {
		await this.withLoading(
			async () =>
				await this.mainStore.getUsersForCourse({
					courseId: this.courseId,
				}),
			this.setPageWideError,
		);
	},
	data() {
		return {
			showDialog: false,
			editingUserId: "",
			gridApi: null as any,
		};
	},
	methods: {
		getRowId(data: any) {
			return data.id;
		},
		onCellClicked(event: CellClickedEvent) {
			if (
				event.data.id !== this.metaStore.user.id &&
				event.data.id != this.currentCourse?.creator?.id
			) {
				this.showDialog = true;
				this.editingUserId = event.data.id;
			}
		},
		hideDialog() {
			this.showDialog = false;
			this.editingUserId = "";
		},
		getRowClass(row: RowClassParams) {
			const userId = row.data.id as string;
			if (userId == this.metaStore.user.id || userId == this.currentCourse?.creator?.id) {
				return "opacity-60 bg-light-important";
			}
			return "";
		},
	},
	computed: {
		...mapStores(useMainStore, useMetaStore),
		editingUser(): User | undefined {
			return this.mainStore.users.find(u => u.id === this.editingUserId);
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
					this.setErrorNotification,
				);
				this.gridApi.refreshCells();
			},
		},
		columns(): ColDef[] {
			return [
				{ field: "id", hide: true },
				{
					field: "email",
					filterParams: {
						filterOptions: ["contains"],
						suppressAndOrCondition: true,
					},
					filter: "agTextColumnFilter",
				},
				{
					field: "fullName",
					headerName: _("misc.full_name"),
					filterParams: {
						filterOptions: ["contains"],
						suppressAndOrCondition: true,
					},
					filter: "agTextColumnFilter",
				},
				{
					field: "coursePrivileges",
					headerName:
						_("course_privileges_page.course_privileges") +
						" (" +
						_("misc.click_to_edit") +
						")",
					minWidth: 685,
					flex: 1,
					cellRenderer: "UserCoursePermissionsRenderer",
				},
			];
		},
		usersData() {
			return this.mainStore.users.map(u => ({
				id: u.id,
				email: u.email,
				fullName: u.full_name,
				coursePrivileges: u.course_privileges,
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

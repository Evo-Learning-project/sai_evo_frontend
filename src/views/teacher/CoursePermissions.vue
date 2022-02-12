<template>
  <div>
    <DataTable
      v-if="usersData.length > 0"
      :columnDefs="columns"
      :rowData="usersData"
      @cellClicked="onCellClicked"
      @gridReady="gridApi = $event.api"
      :getRowClass="getRowClass"
    ></DataTable>
    <Dialog :showDialog="showDialog" :confirmOnly="true" @yes="hideDialog()">
      <template v-slot:title>
        {{ $t('course_privileges_page.edit_permissions_title') }}&nbsp;{{
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
            v-slot="{ description, icons }"
          >
            <span
              v-if="icons?.length > 0"
              class="mx-1 mt-0.5 text-base material-icons-outlined"
              >{{ icons[0] }}</span
            >
            <p class="ml-1 mt-0.5 text-sm text-muted">{{ description }}</p>
          </CheckboxGroup>
        </div></template
      >
    </Dialog>
  </div>
</template>

<script lang="ts">
import DataTable from '@/components/ui/DataTable.vue'
import { courseIdMixin, loadingMixin, savingMixin } from '@/mixins'
import { defineComponent } from '@vue/runtime-core'
import {
  CellClickedEvent,
  ColDef,
  RowClassParams,
  RowNode
} from 'ag-grid-community'

import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('teacher')

import { getTranslatedString as _ } from '@/i18n'
import { Course, CoursePrivilege, User } from '@/models'
import { icons as coursePrivilegeIcons } from '@/assets/coursePrivilegeIcons'
import Dialog from '@/components/ui/Dialog.vue'
import CheckboxGroup from '@/components/ui/CheckboxGroup.vue'
import { SelectableOption } from '@/interfaces'

export default defineComponent({
  name: 'CoursePermissions',
  components: {
    DataTable,
    Dialog,
    CheckboxGroup
  },
  mixins: [courseIdMixin, loadingMixin, savingMixin],
  async created () {
    await this.withLoading(
      async () =>
        await this.$store.dispatch('getUsersForCourse', {
          courseId: this.courseId
        })
    )
  },
  data () {
    return {
      showDialog: false,
      editingUserId: '',
      gridApi: null as any
    }
  },
  methods: {
    onCellClicked (event: CellClickedEvent) {
      if (
        event.data.id !== this.user.id &&
        event.data.id != this.currentCourse?.creator?.id
      ) {
        this.showDialog = true
        this.editingUserId = event.data.id
      }
    },
    hideDialog () {
      this.showDialog = false
      this.editingUserId = ''
    },
    getRowClass (row: RowClassParams) {
      const userId = row.data.id as string
      if (userId == this.user.id || userId == this.currentCourse?.creator?.id) {
        return 'opacity-60 bg-light-important'
      }
      return ''
    }
  },
  computed: {
    ...mapState(['user', 'users']),
    editingUser (): User {
      return this.$store.state.users.find(
        (u: User) => u.id === this.editingUserId
      )
    },
    editingUserPrivileges: {
      get () {
        return this.editingUser?.course_privileges
      },
      async set (val: CoursePrivilege[]) {
        // eslint-disable-next-line @typescript-eslint/no-extra-semi
        //;(this.editingUser as User).course_privileges = val
        await this.withLoading(
          async () =>
            await this.$store.dispatch('updateUserCoursePrivileges', {
              courseId: this.courseId,
              userId: this.editingUserId,
              privileges: val
            })
        )
        this.gridApi.refreshCells()
      }
    },
    columns (): ColDef[] {
      return [
        { field: 'id', hide: true },
        {
          field: 'email',
          filterParams: {
            filterOptions: ['contains'],
            suppressAndOrCondition: true
          },
          filter: 'agTextColumnFilter'
        },
        {
          field: 'fullName',
          headerName: _('misc.full_name'),
          filterParams: {
            filterOptions: ['contains'],
            suppressAndOrCondition: true
          },
          filter: 'agTextColumnFilter'
        },
        {
          field: 'coursePrivileges',
          headerName:
            _('course_privileges_page.course_privileges') +
            ' (' +
            _('misc.click_to_edit') +
            ')',
          minWidth: 685,
          cellRenderer: (params: any) =>
            '<div class="flex mt-2 space-x-4 cursor-pointer">' +
            (params.value as CoursePrivilege[]).reduce(
              (acc, curr) =>
                acc +
                `
          <div class="flex items-center space-x-1 text-muted"><span class="text-base material-icons-outlined" title="${_(
            'course_privileges.' + curr
          )}">${coursePrivilegeIcons[curr]}</span> <p class="text-sm">${_(
                  'course_privileges_short.' + curr
                )}</p></div>`,
              ''
            ) +
            '</div>'
        }
      ]
    },
    usersData () {
      return this.users.map((u: User) => ({
        id: u.id,
        email: u.email,
        fullName: u.full_name,
        coursePrivileges: u.course_privileges
      }))
    },
    privilegesAsOptions (): SelectableOption[] {
      return Object.values(CoursePrivilege).map(key => ({
        value: key,
        content: _('course_privileges_short.' + key),
        icons: [coursePrivilegeIcons[key]],
        description: _('course_privileges.' + key)
      }))
    },
    currentCourse (): Course {
      return this.$store.state.courses.find(
        (c: Course) => c.id == this.courseId
      )
    }
  }
})
</script>

<style></style>

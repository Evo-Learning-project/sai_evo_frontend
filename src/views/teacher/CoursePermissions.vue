<template>
  <div>
    <DataTable
      v-if="!loading"
      :columnDefs="columns"
      :rowData="usersData"
      @cellClicked="onCellClicked"
      @gridReady="gridApi = $event.api"
    ></DataTable>
    <Dialog :showDialog="showDialog" :confirmOnly="true" @yes="hideDialog()">
      <template v-slot:title>
        {{ $t('course_privileges_page.edit_permissions_title') }}&nbsp;{{
          editingUser?.full_name
        }}
      </template>
      <template v-slot:body>
        <CheckboxGroup
          :options="privilegesAsOptions"
          v-model="editingUserPrivileges"
        ></CheckboxGroup>
      </template>
    </Dialog>
  </div>
</template>

<script lang="ts">
import DataTable from '@/components/ui/DataTable.vue'
import { courseIdMixin, loadingMixin, savingMixin } from '@/mixins'
import { defineComponent } from '@vue/runtime-core'
import { CellClickedEvent, ColDef } from 'ag-grid-community'
import { mapState } from 'vuex'
import { getTranslatedString as _ } from '@/i18n'
import { CoursePrivilege, User } from '@/models'
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
      this.showDialog = true
      this.editingUserId = event.data.id
    },
    hideDialog () {
      this.showDialog = false
      this.editingUserId = ''
    }
  },
  computed: {
    ...mapState(['users', 'loading']),
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
        this.gridApi.refreshCells({ force: true })
      }
    },
    columns (): ColDef[] {
      return [
        { field: 'id', hide: true },
        { field: 'email' },
        { field: 'fullName', headerName: _('misc.full_name') },
        {
          field: 'coursePrivileges',
          headerName: _('course_privileges_page.course_privileges'),
          flex: 1,
          cellRenderer: (params: any) =>
            '<div class="flex mt-2 space-x-4 cursor-pointer ">' +
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
        content: _('course_privileges.' + key),
        icons: [coursePrivilegeIcons[key]]
      }))
    }
  }
})
</script>

<style></style>

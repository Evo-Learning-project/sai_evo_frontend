import { getTranslatedString as _ } from '@/i18n';

export interface SidebarOption {
  label: string;
  routeName?: string; // ? use better typing
  children?: string[];
  icon?: string;
}

export const courseListSidebarOptions: SidebarOption[] = [
  {
    label: _('sidebar_labels.course_list_courses'),
    icon: 'list',
    routeName: 'TeacherCourseList',
  },
  {
    label: _('sidebar_labels.course_list_new_course'),
    icon: 'add_circle_outline',
  },
];

export const courseDashboardSidebarOptions: SidebarOption[] = [
  {
    label: _('sidebar_labels.course_dashboard_dashboard'),
    icon: 'home',
    routeName: 'CourseDashboard',
  },
  {
    label: _('sidebar_labels.course_dashboard_exams'),
    icon: 'quiz',
    routeName: 'CourseExams',
    children: ['ExamEditor'],
  },
  // {
  //   label: _('sidebar_labels.course_dashboard_practices'),
  //   icon: 'fitness_center',
  //   routeName: '',
  // },
  {
    label: _('sidebar_labels.course_dashboard_exercises'),
    icon: 'list_alt',
    routeName: 'CourseExercises',
  },
  {
    label: _('sidebar_labels.course_dashboard_back_to_courses'),
    icon: 'arrow_back_ios',
    routeName: 'TeacherCourseList',
  },
];

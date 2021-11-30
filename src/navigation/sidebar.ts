import { getTranslatedString as _ } from '@/i18n';

export interface SidebarOption {
  label: string;
  path?: string; // ? use better typing
  icon?: string;
}

export const courseDashboardSidebarOptions: SidebarOption[] = [
  {
    label: _('sidebar_labels.course_dashboard_dashboard'),
    icon: 'home',
  },
  {
    label: _('sidebar_labels.course_dashboard_exams'),
    icon: 'quiz',
  },
  {
    label: _('sidebar_labels.course_dashboard_practices'),
    icon: 'fitness_center',
  },
  {
    label: _('sidebar_labels.course_dashboard_exercises'),
    icon: 'list_alt',
  },
  {
    label: _('sidebar_labels.course_dashboard_back_to_courses'),
    icon: 'arrow_back_ios',
  },
];

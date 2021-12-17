import { ExerciseType } from '@/models';

export const it = {
  misc: {
    select_empty_option: 'Seleziona',
  },
  sidebar_labels: {
    course_dashboard_dashboard: 'Dashboard',
    course_dashboard_exams: 'Esami',
    course_dashboard_practices: 'Esercitazioni',
    course_dashboard_exercises: 'Esercizi',
    course_dashboard_back_to_courses: 'Torna ai corsi',
    course_list_courses: 'Corsi',
    course_list_new_course: 'Nuovo corso',
  },
  exercise_editor: {
    exercise_editor_title: 'Editor esercizio',
    choices_title: 'Scelte',
    exercise_label: "Etichetta dell'esercizio",
    exercise_text: "Testo dell'esercizio",
    exercise_solution: "Soluzione dell'esercizio (opzionale)",
    select_exercise_type: 'Seleziona tipologia',
    exercise_type: 'Tipologia esercizio',
  },
  exercise_types: {
    [ExerciseType.MULTIPLE_CHOICE_SINGLE_POSSIBLE]:
      'Scelta multipla con una sola scelta possibile',
    [ExerciseType.MULTIPLE_CHOICE_MULTIPLE_POSSIBLE]:
      'Scelta multipla con più scelte possibili',
    [ExerciseType.OPEN_ANSWER]: 'Risposta aperta',
    [ExerciseType.JS]: 'Esercizio JavaScript',
    [ExerciseType.COMPLETION]: 'Esercizio a completamento',
    [ExerciseType.ATTACHMENT]: 'Caricamento di allegato',
    [ExerciseType.AGGREGATED]: 'Esercizio composto',
  },
};

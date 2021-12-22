import { ExerciseState, ExerciseType } from '@/models';

export const it = {
  filter_results: {
    title: 'Filtra risultati',
    filter_by_tag: 'Filtra per tag',
    filter_by_type: 'Filtra per tipologia',
    there_are_active_filters: 'Ci sono filtri attivi',
  },
  headings: {
    course_title: 'Corso',
    course_exercises: 'Esercizi',
  },
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
  exercise_preview: {
    unnamed_exercise: 'Esercizio senza nome',
  },
  exercise_editor: {
    exercise_editor_title: 'Editor esercizio',
    draft_notice: 'Bozza',
    choices_title: 'Scelte',
    exercise_label: "Etichetta dell'esercizio",
    exercise_text: "Testo dell'esercizio",
    exercise_solution: "Soluzione dell'esercizio (opzionale)",
    select_exercise_type: 'Seleziona tipologia',
    exercise_type: 'Tipologia',
    exercise_state: 'Visibilità',
    exercise_tags: 'Tag',
    choice_text: 'Testo',
    choice_score: 'Punteggio',
    new_choice: 'Nuova',
  },
  exercise_types: {
    [ExerciseType.MULTIPLE_CHOICE_SINGLE_POSSIBLE]:
      'Scelta multipla con una sola scelta possibile',
    [ExerciseType.MULTIPLE_CHOICE_MULTIPLE_POSSIBLE]:
      'Scelta multipla con più scelte possibili',
    [ExerciseType.OPEN_ANSWER]: 'Risposta aperta',
    [ExerciseType.JS]: 'Esercizio JavaScript',
    [ExerciseType.COMPLETION]: 'Esercizio a completamento',
    [ExerciseType.ATTACHMENT]: 'Caricamento di file',
    [ExerciseType.AGGREGATED]: 'Esercizio composto',
  },
  exercise_states: {
    [ExerciseState.PUBLIC]: 'Pubblico',
    [ExerciseState.PRIVATE]: 'Nascosto',
    [ExerciseState.DRAFT]: 'Bozza',
  },
  exercise_states_descriptions: {
    [ExerciseState.PUBLIC]:
      'Sarà visibile agli studenti e potrà essere inserito negli esami o comparire nelle esercitazioni.',
    [ExerciseState.PRIVATE]:
      'Non comparirà nelle esercitazioni iniziate dagli studenti, ma potrà essere inserito negli esami dagli insegnanti.',
    [ExerciseState.DRAFT]:
      'Non potrà essere inserito negli esami e non comparirà nelle esercitazioni.',
  },
};

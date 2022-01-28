import { EventState, ExerciseState, ExerciseType } from '@/models';

export const it = {
  dialog: {
    default_yes_text: 'Sì',
    default_confirm_text: 'Conferma',
    default_cancel_text: 'Annulla',
    default_no_text: 'No',
    default_ok_text: 'OK',
  },
  filter_results: {
    title: 'Filtra esercizi',
    filter_by_tag: 'Filtra per tag',
    filter_by_type: 'Filtra per tipologia',
    there_are_active_filters: 'Ci sono filtri attivi',
    more_filters: 'Filtri avanzati',
  },
  headings: {
    course_title: 'Corso',
    course_exercises: 'Esercizi',
    course_exams: 'Esami',
  },
  misc: {
    select_empty_option: 'Seleziona',
    or_label: 'Oppure',
    changes_saved_to_server:
      'Tutte le modifiche sono state salvate sul server',
    exercise_preview_title: 'Anteprima esercizio',
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
  course_exercises: {
    new_exercise: 'Nuovo esercizio',
    selected_exercises: 'esercizi selezionati',
    selected_exercise: 'esercizio selezionato',
    create_exam_from_selected_exercises:
      'Crea esame con questi esercizi',
  },
  course_events: {
    new_exam: 'Nuovo esame',
  },
  exercise_preview: {
    unnamed_exercise: 'Esercizio senza nome',
  },
  event_preview: {
    unnamed_event: 'Esame senza nome',
  },
  event_template_editor: {
    editor_title: 'Modello esame',
    introduction_text:
      'Crea il modello per questo esame. Per ogni slot, puoi scegliere se far vedere a ogni studente lo stesso esercizio o se utilizzare i criteri di scelta casuale.',
    // same_exercises_for_everyone_or_randomize:
    //   'Vuoi che tutti gli studenti abbiano gli stessi esercizi o vuoi utilizzare le opzioni di randomizzazione?',
    // same_exercises_for_everyone: 'Stessi esercizi per tutti',
    // use_randomization: 'Randomizzazione',
    // same_exercises_for_everyone_choose_exercises:
    //   "Seleziona gli esercizi che comporranno l'esame. Tutti gli studenti vedranno questi esercizi durante l'esame.",
    // same_exercises_for_everyone_randomize_order:
    //   'Randomizza ordine degli esercizi',
    // same_exercises_for_everyone_randomize_order_help_text:
    //   'Tutti gli studenti vedranno gli stessi esercizi ma in ordine casuale',
    add_rule: 'Aggiungi slot',
  },
  event_template_rule_editor: {
    exercise_number: 'Slot',
    choose_exercise: 'Scegli esercizio',
    change_exercise: 'Cambia esercizio',
    populate_slot_title: 'Seleziona esercizio per lo slot',
    mode_selection_text:
      "Come vuoi scegliere l'esercizio per questo slot?",
    pick_single_exercise: 'Seleziona un esercizio',
    pick_exercise_from_pool: 'Seleziona esercizio da un insieme',
    pick_exercise_tag_based: 'Seleziona esercizio in base ai tag',
    pick_single_exercise_help_text:
      'Tutti gli studenti vedranno lo stesso esercizio',
    pick_exercise_from_pool_help_text:
      "Ogni studente vedrà un esercizio scelto a caso dall'insieme selezionato",
    pick_exercise_tag_based_help_text:
      'Ogni studente vedrà un esercizio scelto a caso con i tag selezionati',
    one_exercise_from_set_description:
      'Ogni studente vedrà un esercizio scelto a caso tra questi:',
    same_exercise_for_everyone_description:
      'Tutti gli studenti vedranno questo esercizio:',
  },
  event_editor: {
    name: 'Nome',
    state_editor_title: 'Pubblica',
    state: 'Stato esame',
    current_state_is: "L'esame è attualmente in stato",
    begin_timestamp: 'Data e ora di inizio',
    end_timestamp: 'Data e ora di fine',
    instructions: 'Istruzioni (opzionale)',
    editor_title: 'Editor esame',
    flow_rules: 'Regole di svolgimento',
    exercises_shown_at_a_time_label:
      'Numero di esercizi da mostrare per pagina',
    allow_going_back_label:
      'Permetti agli studenti di tornare indietro a un esercizio già visto',
    show_all_exercises_at_once: 'Mostra tutti gli esercizi insieme',
    show_one_exercise_at_once: 'Mostra solo un esercizio alla volta',
    publish: 'Pubblica',
    revert_to_draft: 'Torna a stato di bozza',
    event_planned_help_text:
      "L'esame verrà aperto agli studenti automaticamente in data",
  },
  exercise_editor: {
    exercise_editor_title: 'Editor esercizio',
    draft_notice: 'Bozza',
    saving: 'Salvataggio in corso...',
    saved: 'Salvato!',
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
    cannot_publish: 'Non puoi ancora pubblicare questo esercizio',
    cannot_publish_body:
      'Per poter rimuovere lo stato di bozza, correggi i seguenti errori:',
    make_public_confirmation_title:
      'Sei sicuro di voler rendere questo esercizio pubblico?',
    make_public_confirmation_body:
      'Se rendi questo esercizio pubblico, tutti gli studenti potranno visualizzarlo in qualsiasi momento. Se vuoi utilizzare questo esercizio in un esame, rendilo privato.',
  },
  exercise_wrapper: {
    select: 'Seleziona',
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
  event_states: {
    [EventState.DRAFT]: 'Bozza',
    [EventState.PLANNED]: 'Pianificato',
    [EventState.OPEN]: 'In corso',
    [EventState.CLOSED]: 'Terminato',
  },
  exercise_states_descriptions: {
    [ExerciseState.PUBLIC]:
      'Sarà visibile agli studenti e potrà essere inserito negli esami o comparire nelle esercitazioni.',
    [ExerciseState.PRIVATE]:
      'Non comparirà nelle esercitazioni iniziate dagli studenti, ma potrà essere inserito negli esami dagli insegnanti.',
    [ExerciseState.DRAFT]:
      'Non potrà essere inserito negli esami e non comparirà nelle esercitazioni.',
  },
  event_states_descriptions: {
    [EventState.PLANNED]:
      "È tutto pronto! L'anteprima dell'esame è visibile agli studenti, ma questi non potranno accedervi fino alla data e ora di inizio.",
    // [EventState.OPEN]:
    //   'Non comparirà nelle esercitazioni iniziate dagli studenti, ma potrà essere inserito negli esami dagli insegnanti.',
    [EventState.DRAFT]:
      "L'esame non è visibile agli studenti e non sarà accessibile fino a quando viene pubblicato.",
  },
};

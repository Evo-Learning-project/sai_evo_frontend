import { ExerciseTestCaseType } from "./../models/types";
import {
  CoursePrivilege,
  EventParticipationState,
  EventState,
  EventTemplateRuleType,
  ExamValidationError,
  ExerciseState,
  ExerciseType,
  ExerciseValidationError,
} from "@/models";
import {
  ROUTE_TITLE_COURSE_NAME_TOKEN,
  ROUTE_TITLE_EVENT_NAME_TOKEN,
} from "@/navigation/const";

export const it = {
  dialog: {
    default_yes_text: "Sì",
    default_confirm_text: "Conferma",
    default_cancel_text: "Annulla",
    default_no_text: "No",
    default_ok_text: "OK",
  },
  courses: {
    enroll: "Iscriviti",
    enroll_title: "Iscriviti al corso",
    course_panel: "Pannello",
    go_to_course: "Vai al corso",
  },
  filter_results: {
    title: "Filtra esercizi",
    filter_by_tag: "Filtra per tag",
    filter_by_type: "Filtra per tipologia",
    there_are_active_filters: "Ci sono filtri attivi",
    more_filters: "Filtri avanzati",
  },
  login_screen: {
    login: "Entra",
    login_text: "Effettua l'accesso con la tua email",
    warning: "Attenzione",
    cookies_warning:
      "i cookie devono essere abilitati per effettuare il login, e non si deve essere in modalità incognito.",
  },
  headings: {
    login: "Login",
    course_title: "Corso " + ROUTE_TITLE_COURSE_NAME_TOKEN,
    new_course: "Nuovo corso",
    course_dashboard: "Dashboard",
    course_exercises: "Esercizi corso " + ROUTE_TITLE_COURSE_NAME_TOKEN,
    course_exams: "Esami corso " + ROUTE_TITLE_COURSE_NAME_TOKEN,
    course_permissions: "Permessi corso " + ROUTE_TITLE_COURSE_NAME_TOKEN,
    course_list: "Corsi",
    exam_progress: "Progresso esame " + ROUTE_TITLE_EVENT_NAME_TOKEN,
    exam_results: "Risultati esame " + ROUTE_TITLE_EVENT_NAME_TOKEN,
    ongoing_practice: "Esercitazione in corso",
    ongoing_exam: "Esame " + ROUTE_TITLE_EVENT_NAME_TOKEN + " in corso",
    exam_preview: "Anteprima esame",
    review_submission: "Revisione risposte",
    review_assessment: "Correzione risposte",
    practice_summary: "Riepilogo esercitazione",
  },
  event_participation_page: {
    exercise: "Esercizio",
    of: "di",
    next_exercise: "Avanti",
    previous_exercise: "Indietro",
    skip_exercise: "Salta esercizio",
    turn_in: "Consegna",
    turn_in_dialog_title: "Sei sicuro di voler consegnare?",
    turn_in_dialog_text:
      "Una volta consegnato, non potrai più modificare le tue risposte.",
    turn_in_confirm_button: "Consegna",
    turned_in_text:
      "Fatto! Hai consegnato con successo. Qui sotto puoi rivedere le tue risposte. Quando vuoi, puoi chiudere questa pagina.",
    review_answers: "Revisione risposte",
    next_dialog_title: "Sei sicuro di voler passare al prossimo esercizio?",
    next_dialog_text:
      "Se vai avanti, non potrai più tornare indietro a questo esercizio.",
    next_dialog_confirm_button: "Vai avanti",
    participate: "Partecipa",
    exam_not_yet_begun: "L'esame non è ancora iniziato.",
    exam_is_over: "L'esame è terminato.",
    begin_timestamp: "Data e ora di inizio",
    turn_in_timestamp: "Data e ora di consegna",
  },

  event_participation_slot: {
    text_answer_label: "La tua risposta",
  },
  event_participation_headings: {
    state: "Stato",
    participation_state: "Consegna",
    email: "Email",
    exercise: "Es.",
  },
  event_assessment: {
    all_participations_assesses:
      "Tutti gli esami sono stati corretti. Puoi pubblicare i risultati.",
    some_exams_require_manual_assessment:
      "Alcuni esercizi richiedono una correzione manuale. Prima di poter pubblicare i risultati, devi assegnare un punteggio agli esercizi che ancora non lo hanno.",
    exams_awaiting_assessment_are_marked:
      "Per assegnare un punteggio alle risposte non ancora valutate, clicca sull'icona",
    ready_to_publish_1:
      "I risultati sono pronti per essere pubblicati. Seleziona le righe che vuoi pubblicare e clicca su",
    ready_to_publish_2:
      "Le righe evidenziate in verde corrispondono a risultati già pubblicati.",
    all_published:
      "Tutti i risultati sono stati pubblicati e sono ora visibili agli studenti.",
    publish_results: "Pubblica i risultati",
    this_comment_is_private:
      "Questo commento verrà visualizzato dagli insegnanti ma non dallo studente",
    comment_for_student: "Commento per lo studente",
    student_will_see_this_comment:
      "Questo commento sarà visibile allo studente quando pubblicherai i risultati",
    this_exercise_requires_manual_assessment:
      "Devi assegnare manualmente un punteggio a questa risposta.",
    assessment_state: "Stato della correzione",
    confirm_assessment: "Salva valutazione",
    exercise: "esercizio",
    assess: "Valuta",
    assigned_score: "Punteggio assegnato",
    your_assessment: "La tua valutazione",
    text_answer_label: "Risposta dello studente",
    exercise_seen_at: "Visto:",
    exercise_answered_at: "Risposto:",
  },
  misc: {
    file_upload_no_files: "Nessun file presente",
    file_upload: "Trascina qui il tuo file oppure clicca qui",
    course_settings: "Impostazioni corso",
    example: "Esempio",
    select_empty_option: "Seleziona",
    changes_saved_to_server: "Tutte le modifiche sono state salvate sul server",
    exercise_preview_title: "Anteprima esercizio",
    for: "per",
    success: "Operazione completata con successo",
    participants: "partecipanti",
    participant: "partecipante",
    close: "Chiudi",
    reopen: "Riapri",
    exams: "esami",
    exam: "esame",
    edit: "Modifica",
    at: "alle",
    copy: "Copia",
    copied: "Copiato",
    confirm_exiting_unsaved_changes:
      "Hai effettuato delle modifiche non ancora salvate. Se esci, perderai le ultime modifiche. Vuoi uscire?",
    full_name: "Nome e cognome",
    click_to_edit: "Clicca per modificare",
    among: "tra",
    and: "e",
    tags: "Tag",
    score: "Punteggio",
    teacher_comment: "Commento del docente",
    out_of: "su",
    save: "Salva",
  },
  cloud: {
    saving: "Salvataggio in corso...",
    saved: "Salvato!",
    changes_saved_to_server: "Tutte le modifiche sono state salvate sul server",
    error: "Si è verificato un errore nel salvataggio dei dati. Riprova.",
  },
  sidebar_labels: {
    course_dashboard_dashboard: "Dashboard",
    course_permissions: "Permessi",
    course_dashboard_exams: "Esami",
    course_dashboard_practices: "Esercitazioni",
    course_dashboard_exercises: "Esercizi",
    course_dashboard_back_to_courses: "Torna ai corsi",
    course_list_courses: "Corsi",
    course_list_new_course: "Nuovo corso",
  },
  teacher_course_dashboard: {
    dashboard: "Dashboard",
    see_all: "Visualizza tutti",
    recent_exams: "Esami recenti",
    recently_edited_exercises: "Esercizi modificati di recente",
    course_creator: "Creatore del corso",
    course_name: "Nome del corso",
    course_description: "Descrizione del corso (opzionale)",
  },
  course_creation_form: {
    course_name: "Nome del corso",
    course_description: "Descrizione del corso (opzionale)",
    name_required: "Il nome del corso non può essere vuoto",
    name_already_taken: "Esiste già un corso con questo nome",
    course_visibility: "Visibilità",
    hide_course: "Nascondi corso",
    public_description:
      "Visibile da subito sia agli studenti che agli altri insegnanti.",
    hidden_description:
      "Non comparirà nella lista dei corsi mostrata agli studenti, ma sarà visible agli altri insegnanti. Potrai rendere il corso pubblico in un secondo momento.",
    create: "Crea",
    import_exercises: "Importa esercizi",
    import_exercises_description:
      "Puoi importare da subito esercizi per questo corso. Se non li importi ora, potrai farlo in un secondo momento dalla pagina degli esercizi per questo corso.",
  },
  course_exercises: {
    new_exercise: "Nuovo esercizio",
    no_exercises: "Non ci sono ancora esercizi",
    selected_exercises: "esercizi selezionati",
    selected_exercise: "esercizio selezionato",
    create_exam_from_selected_exercises: "Crea esame con questi esercizi",
  },
  exercise: {
    choice_score_word_singular: "punto",
    choice_score_word_plural: "punti",
  },
  course_events: {
    new_exam: "Nuovo esame",
    no_exams: "Non ci sono ancora esami",
    close_exam_for_everyone_title: "Chiudi l'esame per tutti",
    close_for_everyone: "Chiudi per tutti",
    close_exam_for_everyone_body_1: "Stai per chiudere l'esame",
    close_exam_for_everyone_body_2: "per tutti i partecipanti.",
    close_exam_for_everyone_body_3:
      "Se vuoi chiudere l'esame solo per alcuni studenti, selezionali dalla pagina",
  },
  exercise_preview: {
    unnamed_exercise: "Esercizio senza nome",
  },
  event_preview: {
    unnamed_event: "Esame senza nome",
    monitor: "Monitora",
    results: "Risultati",
    editor: "Editor",
    close: "Chiudi",
    still_open_for_some: "L'esame è ancora aperto per alcuni studenti.",
    copy_link: "Copia link per gli studenti",
    copied_link: "Copiato link per gli studenti",
  },
  event_monitor: {
    close_for_selected: "Chiudi esame per i selezionati",
    open_for_selected: "Apri esame per i selezionati",
    close_for_selected_text_1: "Stai per chiudere l'esame per",
    open_for_selected_text: "Stai per riaprire l'esame per",
    close_for_selected_text_2: "L'esame rimarrà aperto per",
    some_exams_still_open:
      "L'esame è stato chiuso per alcuni partecipanti. Ricorda di chiudere l'esame per tutti al termine. Le righe evidenziate in rosso corrispondono a esami già chiusi.",
    un_turn_in_text:
      "Questo studente ha già consegnato. Puoi annullare la sua consegna per permettergli di modificare le sue risposte. Vuoi annullare la consegna di ",
  },
  event_results: {
    publish_results: "Pubblica risultati",
    publish_confirm_text:
      "Una volta pubblicati, i risultati selezionati saranno visibili agli studenti. Confermi di volerli pubblicare?",
    publish: "Pubblica",
  },
  event_template_editor: {
    editor_title: "Modello esame",
    introduction_text:
      "Crea il modello per questo esame. Per ogni slot, puoi scegliere se far vedere a ogni studente lo stesso esercizio o se utilizzare i criteri di scelta casuale.",
    add_rule: "Aggiungi slot",
  },
  exercise_picker: {
    cannot_pick_draft:
      "Non puoi usare un esercizio in stato di bozza in un esame",
    already_selected:
      "Questo esercizio è già stato selezionato in un altro slot",
  },
  event_template_rule_editor: {
    exercise_number: "Slot",
    choose_exercise: "Scegli esercizio",
    change_exercise: "Cambia esercizio",
    populate_slot_title: "Seleziona esercizio per lo slot",
    mode_selection_text: "Come vuoi scegliere l'esercizio per questo slot?",
    pick_single_exercise: "Seleziona un esercizio",
    pick_exercise_from_pool: "Seleziona esercizio da un insieme",
    pick_exercise_tag_based: "Seleziona esercizio in base ai tag",
    pick_single_exercise_help_text:
      "Tutti gli studenti vedranno lo stesso esercizio",
    pick_exercise_from_pool_help_text:
      "Ogni studente vedrà un esercizio scelto a caso dall'insieme selezionato",
    pick_exercise_tag_based_help_text:
      "Ogni studente vedrà un esercizio scelto a caso con i tag selezionati",
    one_exercise_from_set_description:
      "Ogni studente vedrà un esercizio scelto a caso tra questi:",
    tag_based_description:
      "Ogni studente vedrà un esercizio scelto a caso che tra i tag ha:",
    same_exercise_for_everyone_description:
      "Tutti gli studenti vedranno questo esercizio:",
    tag_based_introduction:
      "Ogni studente vedrà un esercizio scelto a caso che rispetta le condizioni definite qui. Un esercizio è idoneo se, per ogni gruppo di tag definito, contiene almeno un tag di quel gruppo.",
    tag_based_select_exercises: "Verranno scelti solo esercizi che hanno",
    tag_based_at_least_one: "almeno uno",
    tag_based_among: "tra i seguenti tag:",
    tag_based_and: "... e",
    tag_based_add_condition: "Aggiungi condizione",
    eligible_exercises: "Esercizi che soddisfano queste condizioni:",
  },
  event_editor: {
    name: "Nome",
    state_editor_title: "Pubblica",
    state: "Stato esame",
    current_state_is: "L'esame è attualmente in stato",
    state_is: "L'esame è",
    begin_timestamp: "Data e ora di inizio",
    end_timestamp: "Data e ora di fine",
    instructions: "Istruzioni (opzionale)",
    editor_title: "Editor esame",
    flow_rules: "Regole di svolgimento",
    exercises_shown_at_a_time_label:
      "Numero di esercizi da mostrare per pagina",
    allow_going_back_label:
      "Permetti agli studenti di tornare indietro a un esercizio già visto",
    show_all_exercises_at_once: "Mostra tutti gli esercizi insieme",
    show_one_exercise_at_once: "Mostra solo un esercizio alla volta",
    publish: "Pubblica",
    revert_to_draft: "Torna a stato di bozza",
    event_planned_help_text:
      "L'esame verrà aperto agli studenti automaticamente in data",
    editing_open_event_title: "Modifica di un esame in corso",
    editing_open_event_body:
      "Stai modificando un esame già iniziato. Sei sicuro di volerlo modificare?",
    correct_errors_to_publish:
      "Prima di poter pubblicare l'esame, correggi i seguenti errori:",
    cannot_change_timestamp:
      "Non puoi modificare la data e ora di inizio dell'esame una volta pianificato. Per modificare questo campo, metti l'esame in stato di bozza.",
    this_is_the_link_to_the_event:
      "Ecco il link per accedere all'esame. Comunicalo agli studenti che parteciperanno.",
  },
  exercise_editor: {
    exercise_editor_title: "Editor esercizio",
    draft_notice: "Bozza",
    choices_title: "Scelte",
    testcases_title: "Test case",
    exercise_label: "Etichetta dell'esercizio",
    exercise_text: "Testo dell'esercizio",
    exercise_solution: "Soluzione dell'esercizio (opzionale)",
    select_exercise_type: "Seleziona tipologia",
    exercise_type: "Tipologia",
    exercise_state: "Visibilità",
    exercise_public_tags: "Tag pubblici",
    exercise_tags: "Tag",
    exercise_private_tags: "Tag privati",
    choice_text: "Testo",
    choice_score: "Punteggio",
    testcase_type: "Visibilità",
    testcase_text: "Descrizione",
    testcase_code: "Codice",
    hidden_to_students: "Nascosto agli studenti",
    edit_non_draft_title: "Modifica di un esercizio non bozza",
    edit_non_draft_body:
      "Stai per modificare un esercizio non in stato di bozza. Potrebbe essere già presente in un esame o essere già stato visto dagli studenti. Sei sicuro di volerlo modificare?",
    new_choice: "Nuova",
    cannot_publish: "Non puoi ancora pubblicare questo esercizio",
    cannot_publish_body:
      "Per poter rimuovere lo stato di bozza, correggi i seguenti errori:",
    make_public_confirmation_title:
      "Sei sicuro di voler rendere questo esercizio pubblico?",
    make_public_confirmation_body:
      "Se rendi questo esercizio pubblico, tutti gli studenti potranno visualizzarlo in qualsiasi momento. Se vuoi utilizzare questo esercizio in un esame, rendilo privato.",
  },
  exercise_wrapper: {
    select: "Seleziona",
  },
  student_course_dashboard: {
    your_practice_events: "Le tue esercitazioni",
    new_practice_event: "Nuova esercitazione",
    exams_you_participated_in: "Esami a cui hai partecipato",
    review_submission: "Rivedi risposte",
    view_assessment: "Valutazione",
    resume: "Riprendi",
    assessment_available:
      "Sono stati pubblicati i voti relativi a questo esame",
    new_practice: "Nuova esercitazione",
    resume_practice: "Riprendi esercitazione",
    draft_practice: "Bozza esercitazione",
    pending: "In corso",
    practice_summary: "Riepilogo",
  },
  practice_template_editor: {
    begin_practice: "Inizia esercitazione",
    add_rule: "Aggiungi esercizi",
    choose_exercises_text:
      "Scegli come generare gli esercizi per questa esercitazione. Puoi far scegliere gli esercizi al sistema completamente a caso oppure restringere la selezione a quelli che hanno tag da te scelti.",
  },
  programming_exercise: {
    tab_text: "Testo",
    tab_testcases: "Test case",
    tab_editor: "Editor",
    run_code: "Esegui",
    testcase: "Test case",
    passed: "Superato",
    not_passed: "Non superato",
    test_failed_with_error: "Il test ha fallito producendo il seguente errore",
    code_errored: "L'esecuzione del codice ha prodotto il seguente errore",
  },
  exercise_types: {
    [ExerciseType.MULTIPLE_CHOICE_SINGLE_POSSIBLE]:
      "Scelta multipla con selezione singola",
    [ExerciseType.MULTIPLE_CHOICE_MULTIPLE_POSSIBLE]:
      "Scelta multipla con selezione multipla",
    [ExerciseType.OPEN_ANSWER]: "Risposta aperta",
    [ExerciseType.JS]: "Esercizio JavaScript",
    [ExerciseType.COMPLETION]: "Esercizio a completamento",
    [ExerciseType.ATTACHMENT]: "Caricamento di file",
    [ExerciseType.AGGREGATED]: "Esercizio composto",
  },
  exercise_states: {
    [ExerciseState.PUBLIC]: "Pubblico",
    [ExerciseState.PRIVATE]: "Solo esami",
    [ExerciseState.DRAFT]: "Bozza",
  },
  event_states: {
    [EventState.DRAFT]: "Bozza",
    [EventState.PLANNED]: "Pianificato",
    [EventState.OPEN]: "In corso",
    [EventState.CLOSED]: "Terminato",
    [EventState.RESTRICTED]: "Aperto per alcuni",
  },
  event_participation_states: {
    [EventParticipationState.IN_PROGRESS]: "In corso",
    [EventParticipationState.TURNED_IN]: "Consegnato",
  },
  exercise_states_descriptions: {
    [ExerciseState.PUBLIC]:
      "Sarà visibile agli studenti e potrà essere inserito negli esami o comparire nelle esercitazioni.",
    [ExerciseState.PRIVATE]:
      "Non comparirà nelle esercitazioni iniziate dagli studenti, ma potrà essere inserito negli esami dagli insegnanti.",
    [ExerciseState.DRAFT]:
      "Non potrà essere inserito negli esami e non comparirà nelle esercitazioni.",
  },
  event_states_descriptions: {
    [EventState.PLANNED]:
      "È tutto pronto! L'anteprima dell'esame è visibile agli studenti, ma questi non potranno accedervi fino alla data e ora di inizio.",
    [EventState.DRAFT]:
      "L'esame non è visibile agli studenti e non sarà accessibile fino a quando viene pubblicato.",
    [EventState.OPEN]: "",
    [EventState.CLOSED]: "",
  },
  validation_errors: {
    course: {
      "name-required": "Il nome del corso non può essere vuoto",
      "name-unique": "Esiste già un corso con questo nome",
    },
    dirtyCourse: {
      "name-required": "Il nome del corso non può essere vuoto",
      "name-unique": "Esiste già un corso con questo nome",
    },
    eventTemplateRule: {
      no_exercises: "Questo slot non contiene esercizi",
      no_rule_type: "Non hai impostato un criterio per popolare questo slot",
      no_valid_clauses: "Questo slot non contiene tag",
    },
  },
  exam_validation_errors: {
    [ExamValidationError.NO_NAME]: "Non hai assegnato un nome all'esame",
    [ExamValidationError.NO_VALID_TEMPLATE_RULES]:
      "Non hai creato slot per gli esercizi per questo esame",
    [ExamValidationError.NO_END_TIMESTAMP]:
      "Non hai assegnato una data e ora di fine a questo esame",
    [ExamValidationError.NO_BEGIN_TIMESTAMP]:
      "Non hai assegnato una data e ora di inizio a questo esame",
    [ExamValidationError.INVALID_TIMESTAMPS]:
      "Hai selezionato data e ora di inizio e fine non corrette per questo esame",
  },
  exercise_validation_errors: {
    [ExerciseValidationError.BLANK_TEXT]: "Questo esercizio è senza testo",
    [ExerciseValidationError.NO_CHOICES]:
      "Questo esercizio a scelta multipla non ha scelte",
    [ExerciseValidationError.BLANK_CHOICE]:
      "Questo esercizio a scelta multipla contiene delle scelte senza testo",
    [ExerciseValidationError.NO_TESTCASES]:
      "Questo esercizio di programmazione non ha test case",
    [ExerciseValidationError.NO_SUB_EXERCISES]:
      "Questo esercizio composto non contiene sotto-esercizi",
  },
  course_privileges: {
    [CoursePrivilege.ACCESS_EXERCISES]:
      "Può accedere alla lista degli esercizi del corso.",
    [CoursePrivilege.ASSESS_PARTICIPATIONS]:
      "Può vedere le partecipazioni agli esami e assegnare voti.",
    [CoursePrivilege.MANAGE_EVENTS]:
      "Può creare e modificare gli esami del corso.",
    [CoursePrivilege.MANAGE_EXERCISES]: "Può creare e modificare esercizi.",
    [CoursePrivilege.UPDATE_COURSE]:
      "Può modificare le impostazioni del corso, incluso assegnare permessi ad altri utenti.",
    //[CoursePrivilege.ALL_PRIVILEGES]: 'Tutti i permessi',
  },
  course_privileges_short: {
    [CoursePrivilege.ACCESS_EXERCISES]: "Vedere esercizi",
    [CoursePrivilege.ASSESS_PARTICIPATIONS]: "Assegnare voti",
    [CoursePrivilege.MANAGE_EVENTS]: "Creare esami",
    [CoursePrivilege.MANAGE_EXERCISES]: "Creare esercizi",
    [CoursePrivilege.UPDATE_COURSE]: "Modificare impostazioni corso",
    //[CoursePrivilege.ALL_PRIVILEGES]: 'Tutti',
  },
  testcase_types: {
    [ExerciseTestCaseType.SHOW_CODE_SHOW_TEXT]: "Pubblico",
    [ExerciseTestCaseType.SHOW_TEXT_ONLY]: "Solo descrizione",
    [ExerciseTestCaseType.HIDDEN]: "Nascosto",
  },
  event_template_rule_type: {
    [EventTemplateRuleType.TAG_BASED]: "Per tag",
    [EventTemplateRuleType.FULLY_RANDOM]: "A caso",
  },
  course_privileges_page: {
    course_privileges: "Permessi",
    edit_permissions_title: "Modifica i permessi di",
  },
  data_table: {
    filterOoo: "Cerca...",
    contains: "Contenuto",
    noRowsToShow: "Non ci sono dati da mostrare",
  },
  errors: {
    retry: "Riprova",
    no_connection: "Connessione assente",
    403: "Non hai i permessi necessari per effettuare quest'azione",
    404: "La pagina richiesta non sembra esistere",
    500: "Si è verificato un errore interno",
    unknown_error: "Si è verificato un errore sconosciuto",
  },
  breadcrumbs: {
    course_list: "Lista dei corsi",
    course_dashboard: "Dashboard corso " + ROUTE_TITLE_COURSE_NAME_TOKEN,
    exam_participation_page: "Esame " + ROUTE_TITLE_EVENT_NAME_TOKEN,
    practice_participation_page: "Esercitazione in corso",
    submission_review: "Revisione risposte " + ROUTE_TITLE_EVENT_NAME_TOKEN,
    practice_review: "Riepilogo esercitazione",
    exam_assessment: "Valutazione " + ROUTE_TITLE_EVENT_NAME_TOKEN,
  },
  course_list: {
    no_courses: "Non ci sono ancora corsi",
  },
  help_texts: {
    exercise_editor: {
      public_tags:
        "Se pubblichi questo esercizio, i tag pubblici potranno essere utilizzati dagli studenti per cercarlo quando compongono un'esercitazione",
      private_tags:
        "Questi tag non verranno mai mostrati agli studenti e possono essere utilizzati per organizzare gli esercizi e aggiungerli agli esami",
    },
  },
  tour: {
    skip: "Salta tour",
    next: "Avanti",
    previous: "Indietro",
    finish: "Termina",
    add_exercises_header: "Creazione esercizi",
    add_exercises_content:
      "Per prima cosa, aggiungi esercizi al corso. Dalla pagina degli esercizi, puoi crearne e modificare quelli esistenti. Gli esercizi che crei potranno essere usati per comporre esami oppure resi disponibili agli studenti per esercitarsi.",
    add_exams_header: "Creazione esami",
    add_exams_content:
      "Dopo aver creato gli esercizi, puoi utilizzarli per comporre esami. ",
    permissions_header: "Aggiungi docenti",
    permissions_content:
      "Dalla pagina dei permessi puoi consentire l'accesso alle funzionalità di gestione del corso ad altri docenti o figure di rilievo, come i tutor.",
  },
};

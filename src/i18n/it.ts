import { DataFormat } from "./../integrations/types";
import { ReportField } from "./../reports/types";
import {
	CoursePrivilege,
	EventParticipationState,
	EventState,
	EventTemplateRuleType,
	EventType,
	ExerciseSolutionState,
	ExerciseTestCaseType,
	ExerciseState,
	ExerciseType,
	ExerciseValidationError,
	CourseTreeNodeType,
} from "@/models";
import {
	ROUTE_TITLE_COURSE_NAME_TOKEN,
	ROUTE_TITLE_EVENT_NAME_TOKEN,
	ROUTE_TITLE_NODE_NAME_TOKEN,
} from "@/navigation/const";
import { GamificationAction } from "@/gamification";

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
		course_panel: "Pannello docente",
		go_to_course: "Vai al corso",
		access_as_student: "Entra come studente",
	},
	filter_results: {
		title: "Cerca esercizi",
		filter_by_tag: "Filtra per tag",
		filter_by_type: "Filtra per tipologia",
		there_are_active_filters: "Ci sono filtri attivi",
		more_filters: "Filtri avanzati",
		remove_filters: "Rimuovi filtri",
	},
	login_screen: {
		login: "Entra",
		login_text: "Effettua l'accesso con la tua email",
		warning: "Attenzione",
		cookies_warning: "i cookie del tuo browser sono disattivati. Per accedere, abilita ",
		all_cookies: "tutti i cookie",
		enable_third_party_cookies_1: "Assicurati anche di abilitare i",
		enable_third_party_cookies_2: "cookie di terze parti",
	},
	headings: {
		course_tree: "Materiale " + ROUTE_TITLE_COURSE_NAME_TOKEN,
		exercise_solution_threads: "Soluzioni esercizi " + ROUTE_TITLE_COURSE_NAME_TOKEN,
		login: "Login",
		course_title: ROUTE_TITLE_COURSE_NAME_TOKEN,
		new_course: "Nuovo corso",
		exercise_solution_thread_detail: "Discussione esercizio",
		course_dashboard: "Dashboard " + ROUTE_TITLE_COURSE_NAME_TOKEN,
		course_exercises: "Esercizi " + ROUTE_TITLE_COURSE_NAME_TOKEN,
		course_exams: "Esami " + ROUTE_TITLE_COURSE_NAME_TOKEN,
		course_permissions: "Permessi " + ROUTE_TITLE_COURSE_NAME_TOKEN,
		course_insights: "Statistiche " + ROUTE_TITLE_COURSE_NAME_TOKEN,
		course_list: "Corsi",
		exam_progress: "Progresso " + ROUTE_TITLE_EVENT_NAME_TOKEN,
		exam_results: "Risultati " + ROUTE_TITLE_EVENT_NAME_TOKEN,
		ongoing_practice: "Esercitazione in corso",
		ongoing_exam: "Esame " + ROUTE_TITLE_EVENT_NAME_TOKEN + " in corso",
		exam_preview: "Anteprima esame",
		review_submission: "Revisione risposte",
		review_assessment: "Correzione risposte",
		practice_summary: "Riepilogo esercitazione",
		student_exercise_solution_thread: "Discussione esercizio",
		student_exercise_solution_threads: "Esercizi popolari",
		student_favorites: "Contenuti salvati",
		student_course_leaderboard: "Classifica",
	},
	event_participation_page: {
		times_up: "Tempo scaduto",
		all_answers_saved: "Tutte le tue risposte sono state salvate",
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
		mat: "Matricola",
		course: "Corso",
		state: "Correzione",
		participation_state: "Consegna",
		email: "Email",
		exercise: "Es.",
		grade: "Voto",
	},
	event_assessment: {
		no_score_for_exercise: "Punteggio non assegnato",
		undo_score_edit_tooltip: "Ripristina punteggio originale",
		overall_score: "Voto",
		you_overrode_score:
			"Hai assegnato manualmente un voto all'esame." +
			" Se modifichi il punteggio di un esercizio adesso, il voto complessivo non verrà aggiornato.",
		// " Se vuoi che il voto si aggiorni automaticamente in base ai punteggi degli esercizi, ripristina il voto di default.",
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
			"Devi assegnare un punteggio a questa risposta.",
		some_sub_slots_pending:
			"Il punteggio mostrato è incompleto perché alcuni sotto-esercizi non hanno ancora ricevuto una valutazione.",
		some_slots_pending:
			"Il punteggio mostrato è incompleto perché alcuni esercizi non hanno ancora ricevuto una valutazione.",
		default_score:
			"Il punteggio mostrato è la somma dei punteggi dei singoli esercizi." +
			" Se modifichi il punteggio di un esercizio, il voto verrà aggiornato automaticamente." +
			" Puoi sovrascrivere il voto inserendo manualmente un valore.",
		assessment_state: "Stato della correzione",
		confirm_assessment: "Salva",
		exercise: "esercizio",
		assess: "Valuta",
		assigned_score: "Punteggio assegnato",
		your_assessment: "Valutazione",
		text_answer_label: "Risposta",
		exercise_seen_at: "Visto:",
		exercise_answered_at: "Risposto:",
		viewing_participation_of: "Stai visualizzando l'esame di",
		viewing_practice_of: "Stai visualizzando un'esercitazione di",
		sub_slot_assessment_unavailable_open_full_1: "Apri la",
		sub_slot_assessment_unavailable_open_full_2: "partecipazione completa",
		sub_slot_assessment_unavailable_open_full_3:
			"all'esame per assegnare un punteggio a questo sotto-esercizio.",
		undo_overall_score_edit: "Vuoi ripristinare il voto originale?",
		undo_score_edit: "Vuoi ripristinare il punteggio originale per questo esercizio?",
		overall_score_instructions:
			"Puoi assegnare manualmente un voto allo studente. Il voto può essere numerico" +
			" oppure una stringa.",
	},
	course_insights: {
		filter_exams: "Filtra esami",
		score_sum: "Somma",
		score_average: "Media",
		practice_sessions: "Esercitazioni",
		exercises: "Esercizi presenti nel corso",
		active_students: "Studenti attivi",
		no_active_students: "Non ci sono ancora studenti attivi nel corso",
		active_students_description:
			"Gli studenti attivi sono studenti che hanno partecipato ad almeno un esame o hanno iniziato autonomamente almeno un'esercitazione nel corso.",
		user_history_event_descriptions: {
			[EventType.EXAM]: "Ha partecipato all'esame",
			[EventType.SELF_SERVICE_PRACTICE]: "Ha svolto un'esercitazione",
		},
	},
	student_data: {
		edit_mat_title: "Modifica matricola",
		your_mat: "Il tuo numero di matricola",
		your_course: "Il tuo corso",
		you_havent_yet: "Non hai ancora",
		missing_mat: "inserito il tuo numero di matricola",
		and: "e",
		missing_course: "selezionato il tuo corso",
		insert_mat_and_course:
			"L'inserimento del numero di matricola e la selezione del corso sono necessari per poter partecipare agli esami. Fallo ora e non pensarci più!",
	},
	donate: {
		donate_title: "Dona",
		donate_content:
			"Evo Learning è un progetto open source. Se vuoi sostenerne lo sviluppo, considera di effettuare una donazione. Ti ringraziamo in anticipo!",
		donate_now: "Dona ora",
	},
	misc: {
		no_native_video_support:
			"Il tuo browser non supporta la riproduzione video HTML5. Scarica il file per visualizzarlo.",
		show_all: "Mostra tutti",
		show_more: "Mostra di più",
		share: "Condividi",
		page: "pagina",
		pages: "pagine",
		maintenance_mode: "Evo Learning è in modalità manutenzione. Riprova più tardi.",
		show_preview: "Mostra anteprima",
		hide_preview: "Nascondi anteprima",
		contact_us: "Contattaci",
		select_all: "Seleziona tutti",
		unselect_all: "Deseleziona tutti",
		ads: "Pubblicità",
		no_favorites: "Non ci sono contenuti salvati",
		undo: "Annulla",
		redo: "Ripeti",
		correct_answers: "Risposte corrette",
		wait: "Attendi...",
		limit: "Limite",
		find_out_more: "Scopri di più",
		experimental_feature_warning:
			"Questa funzionalità è ancora in fase sperimentale. Per favore, segnala eventuali bug verificatisi durante l'utilizzo.",
		time_limit: "Limite di tempo",
		minutes: "minuti",
		scored_plural: "punti",
		scored_singular: "punto",
		download: "Scarica",
		downloading: "Download in corso...",
		csv: "CSV",
		pdf: "PDF",
		ok: "OK",
		slots: "slot",
		from: "da",
		to: "a",
		add: "Aggiungi",
		wrong_file_format: "Il formato del file che hai selezionato non è corretto",
		expand: "Espandi",
		collapse: "Riduci",
		back: "Indietro",
		no_answer: "Nessuna risposta",
		using_base_editor: "Stai usando la versione base dell'editor",
		having_troubles_with_editor: "Problemi con l'editor?",
		show_full_editor: "Torna all'editor completo",
		fix_sidebar: "Blocca menu",
		unfix_sidebar: "Nascondi menu",
		show_recent: "Mostra recenti",
		logged_in: "Login effettuato con successo",
		logged_out: "Logout effettuato con successo",
		select: "Seleziona",
		preview: "Anteprima",
		save_and_close: "Salva e chiudi",
		hidden: "Nascosto",
		teacher: "Docente",
		passed_tests: "Test case superati",
		hidden_to_students: "Nascosto agli studenti",
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
		copied: "Copiato negli appunti",
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
		solution: "Soluzione",
		warning: "Attenzione",
		download_as_csv: "Scarica come CSV",
		download_results: "Scarica risultati",
		select_one: "Seleziona...",
		delete: "Elimina",
		logout: "Logout",
	},
	exercise_solution_thread: {
		thread_title: "Discussione esercizio",
		teacher_description:
			"In questa pagina sono visulizzate le soluzioni agli esercizi proposte dagli studenti. Puoi rendere ufficiali quelle corrette e scartare quelle errate.",
	},
	student_dashboard_options: {
		my_exams: "I miei esami",
		my_practice_sessions: "Le mie esercitazioni",
		popular_exercises: "Esercizi popolari",
		leaderboard: "Classifica",
		my_favorites: "Salvati",
	},
	exercise_solution: {
		copyright_disclaimer:
			"Proponendo una soluzione, accetti di rinunciare alla proprietà intellettuale su di essa. ",
		confirm_deletion:
			"Sei sicuro di voler cancellare questa soluzione? Quest'operazione è irreversibile.",
		load_more_solutions: "Carica più soluzioni",
		go_to_exercise_thread: "Vai alla discussione di questo esercizio",
		reveal_solutions_1: "Mostra",
		reveal_solutions_2_singular: "soluzione proposta",
		reveal_solutions_2_plural: "soluzioni proposte",
		there_are_pending_solutions_1: "Ci sono",
		there_are_pending_solutions_2: "esercizi con soluzioni da visionare.",
		no_solutions_to_review: "Non ci sono soluzioni da visionare",
		you_rejected_this_solution: "Hai scartato questa soluzione",
		verified: "Soluzione verificata",
		comments: "Commenti",
		add_comment: "Aggiungi commento",
		teacher_is_this_solution_correct: "Questa soluzione è corretta?",
		approve: "Approva",
		reject: "Scarta",
		default_author: "Docenti del corso",
		edit: "Modifica",
		delete: "Elimina",
		share: "Condividi",
		add_bookmark: "Aggiungi ai preferiti",
		remove_bookmark: "Rimuovi dai preferiti",
		no_solutions_call_to_action:
			"Non ci sono ancora soluzioni. Sii il primo a proporne una!",
		propose_solution: "Proponi soluzione",
		proposed_solutions_title: "Soluzioni proposte",
		propose_solution_title: "Proponi una soluzione per l'esercizio",
		publish: "Pubblica",
		publishing: "Pubblicazione in corso...",
		your_solution_placeholder: "La tua soluzione",
		show_all: "Mostra tutte",
		reveal_solution: "Continua a leggere",
		states: {
			[ExerciseSolutionState.DRAFT]: "Bozza",
			[ExerciseSolutionState.APPROVED]: "Pubblicata",
			[ExerciseSolutionState.SUBMITTED]: "Proposta",
			[ExerciseSolutionState.REJECTED]: "Scartata",
		},
	},
	participation_downloader: {
		report_type: "Formato del report",
		download_results: "Scarica risultati",
		mat_and_scores_title: "Matricola e voto",
		full_name_and_scores_title: "Nome, cognome e voto",
		all_fields_title: "Tutte le informazioni",
		all_fields_description:
			"Nome, cognome, matricola, corso, voto e, per ogni esercizio, risposta data e punteggio",
		custom_title: "Personalizzato",
		custom_description: "Scegli quali campi includere",
		introduction:
			"Scegli quali informazioni vuoi includere nel report. Per ciascuno studente, includi:",
	},
	report_fields: {
		[ReportField.EXERCISES_ANSWER]: "Risposte dello studente",
		[ReportField.EXERCISES_SCORE]: "Punteggio ottenuto per ciascun esercizio",
		[ReportField.EXERCISES_LABEL]: "Nomi degli esercizi assegnati",
		[ReportField.STUDENT_COURSE]: "Corso",
		[ReportField.STUDENT_MAT]: "Matricola",
		[ReportField.STUDENT_FULL_NAME]: "Nome e cognome",
		[ReportField.STUDENT_EMAIL]: "Email",
		[ReportField.STUDENT_COURSE]: "Corso",
		[ReportField.SCORE]: "Voto",
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
		course_dashboard_material: "Materiale",
		course_dashboard_exams: "Esami",
		course_dashboard_practices: "Esercitazioni",
		course_dashboard_exercises: "Esercizi",
		exercise_solution_threads: "Soluzioni",
		course_insights: "Statistiche",
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
		course_link_for_students: "Link al corso per gli studenti",
	},
	course_creation_form: {
		course_name: "Nome del corso",
		course_description: "Descrizione del corso (opzionale)",
		name_required: "Il nome del corso non può essere vuoto",
		name_already_taken: "Esiste già un corso con questo nome",
		course_visibility: "Visibilità",
		hide_course: "Nascondi corso",
		public_description: "Visibile da subito sia agli studenti che agli altri insegnanti.",
		hidden_description:
			"Non comparirà nella lista dei corsi mostrata agli studenti, ma sarà visible agli altri insegnanti. Potrai rendere il corso pubblico in un secondo momento.",
		create: "Crea",
		import_exercises: "Importa esercizi",
		import_exercises_description:
			"Puoi importare da subito esercizi per questo corso. Se non li importi ora, potrai farlo in un secondo momento dalla pagina degli esercizi per questo corso.",
	},
	course_exercises: {
		new_exercise: "Nuovo esercizio",
		export_exercises: "Esporta",
		import_exercises: "Importa",
		import_exercises_title: "Importa esercizi",
		no_exercises: "Non ci sono ancora esercizi",
		no_matching_exercises: "Non ci sono risultati coi filtri di ricerca selezionati",
		selected_exercises: "esercizi selezionati",
		selected_exercise: "esercizio selezionato",
		create_exam_from_selected_exercises: "Crea esame con questi esercizi",
		cannot_delete_nondraft:
			"Questo esercizio non è in stato di bozza. Per eliminarlo, imposta prima il suo stato a Bozza.",
		confirm_delete_exercise:
			"Sei sicuro di voler eliminare questo esercizio? Quest'azione è irreversibile.",
		confirm_delete_exercise_title: "Conferma eliminazione",
	},
	exercise: {
		choice_score_word_singular: "punto",
		choice_score_word_plural: "punti",
		clone_label: "(copia)",
	},
	course_events: {
		new_exam: "Nuovo esame",
		no_exams: "Non ci sono ancora esami",
		reopen: "Riapri",
		reopen_exam_body: "Vuoi riaprire l'esame",
		reopen_exam_title: "Riapri esame",
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
		reopen: "Riapri",
		still_open_for_some: "L'esame è ancora aperto per alcuni studenti.",
		copy_link: "Copia link per gli studenti",
		copied_link: "Copiato link per gli studenti negli appunti",
	},
	event_monitor: {
		assess_slot: "Valuta",
		change_slot_score: "Modifica punteggio",
		undo_turn_in: "Annulla consegna",
		stats_turned_in: "Consegnati",
		stats_participants: "Partecipanti",
		stats_average_progress: "Completamento medio",
		close_for_selected: "Chiudi esame per i selezionati",
		open_for_selected: "Apri esame per i selezionati",
		close_for_selected_text_1: "Stai per chiudere l'esame per",
		open_for_selected_text: "Stai per riaprire l'esame per",
		close_for_selected_text_2: "L'esame rimarrà aperto per",
		some_exams_still_open:
			"L'esame è stato chiuso per alcuni partecipanti. Ricorda di chiudere l'esame per tutti al termine. Le righe evidenziate in rosso corrispondono a esami già chiusi.",
		un_turn_in_text:
			"Questo studente ha già consegnato. Puoi annullare la sua consegna per permettergli di modificare le sue risposte. Vuoi annullare la consegna di ",
		un_turn_in_instructions:
			"Per riaprire l'esame di uno studente che ha già consegnato, clicca sull'icona",
		in_column_state: "nella colonna Consegna.",
	},
	event_stats: {
		not_yet_assessed: "Non ancora corretto",
		overall: "Riepilogo",
		exercises: "Esercizi",
		score_distribution: "Distribuzione voti",
		per_exercise_stats: "Statistiche per esercizio",
		selections: "Selezioni",
		answers: "Risposte",
		event_stats: "Statistiche",
		back_to_results: "Torna ai risultati",
		testcase_passed_in: "Superato in",
		submissions: "sottomissioni",
		no_stats_available_for_exercise:
			"Nessuna statistica disponibile per questo esercizio",
		incomplete_scores:
			"Le statistiche visualizzate sono incomplete perché non hai ancora corretto tutti gli esami",
	},
	event_results: {
		publish_results: "Pubblica risultati",
		publish_confirm_text:
			"Una volta pubblicati, i risultati selezionati saranno visibili agli studenti. Confermi di volerli pubblicare?",
		publish: "Pubblica",
	},
	event_template_editor: {
		no_rules: "Non ci sono ancora slot",
		list_view: "Visualizzazione lista",
		grid_view: "Visualizzazione griglia",
		add_more_rules: "Aggiungi più slot",
		editor_title: "Modello esame",
		introduction_text:
			"Crea il modello per questo esame. Per ogni slot, puoi scegliere se far vedere a ogni studente lo stesso esercizio o se utilizzare i criteri di scelta casuale.",
		add_rule: "Aggiungi slot",
		confirm_delete_rule: "Sei sicuro di voler eliminare questo slot?",
		randomize_rule_order: "Randomizza ordine degli slot",
		rule_order_randomization_off:
			"Gli slot verranno assegnati agli studenti nell'ordine in cui sono disposti qui",
		rule_order_randomization_on:
			"Gli slot verranno assegnati agli studenti in ordine casuale",
	},
	exercise_picker: {
		cannot_pick_draft: "Non puoi usare un esercizio in stato di bozza in un esame",
		already_selected: "Questo esercizio è già stato selezionato in un altro slot",
		go_to_exercises: "Vai agli esercizi",
		no_available_exercises:
			"Non hai ancora creato esercizi per questo corso. Dalla pagina degli esercizi, creane almeno uno per poter popolare questo slot. Ricordati di rimuovere lo stato di bozza dagli esercizi che vuoi inserire in un esame!",
	},
	help: {
		help_guide_label: "Guida all'utilizzo",
		help_center_title: "Guida all'utilizzo",
		based_on_your_activity: "In base alla tua attività",
		take_the_tour: "Scopri le funzionalità della piattaforma col feature tour.",
		cannot_find_the_answer: "Non trovi la risposta?",
		start_tour: "Inizia",
		articles: "Articoli",
	},
	event_template_rule_editor: {
		weight: "Peso esercizio",
		reset_slot_settings: "Resetta slot",
		exercise_number: "Slot",
		choose_exercise: "Scegli esercizio",
		change_exercise: "Cambia esercizio",
		populate_slot_singular_title: "Seleziona esercizio per lo slot",
		populate_slot_plural_title: "Seleziona esercizi per gli slot",
		mode_selection_text: "Come vuoi scegliere l'esercizio per questo slot?",
		pick_single_exercise: "Seleziona un esercizio",
		pick_exercise_from_pool: "Seleziona esercizio da un insieme",
		pick_exercise_tag_based: "Seleziona esercizio in base ai tag",
		pick_single_exercise_help_text: "Tutti gli studenti vedranno lo stesso esercizio",
		pick_exercise_from_pool_help_text:
			"Ogni studente vedrà un esercizio scelto a caso dall'insieme selezionato",
		pick_exercise_tag_based_help_text:
			"Ogni studente vedrà un esercizio scelto a caso con i tag selezionati",
		one_exercise_from_set_description:
			"Ogni studente vedrà un esercizio scelto a caso tra questi:",
		tag_based_description:
			"Ogni studente vedrà un esercizio scelto a caso che tra i tag ha:",
		tag_based_description_multiple_1: "Ogni studente vedrà",
		tag_based_description_multiple_2: "esercizi scelti a caso che tra i tag hanno:",
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
		no_tags_student:
			"I docenti del corso non hanno ancora inserito tag, quindi la ricerca per tag non è abilitata. Verranno scelti esercizi in maniera casuale.",
		no_tags:
			"Non puoi utilizzare questa funzionalità in quanto non hai ancora creato tag per questo corso. Dalla pagina degli esercizi, puoi aggiungere tag agli esercizi già esistenti, o crearne di nuovi.",
		unsatisfiable_tag_rule:
			"Non ci sono esercizi con i tag richiesti: modifica le condizioni",
		unset_rule_type_confirmation:
			"Sei sicuro di voler resettare le impostazioni per questo slot?",
	},
	event_editor: {
		name: "Nome",
		state_editor_title: "Pubblica",
		state: "Stato esame",
		current_state_is: "L'esame è attualmente in stato",
		state_is: "L'esame è",
		max_grade: "Voto massimo",
		begin_timestamp: "Data e ora di inizio",
		end_timestamp: "Data e ora di fine",
		instructions: "Istruzioni (opzionale)",
		editor_title: "Editor esame",
		flow_rules: "Visualizzazione esercizi",
		access_rules: "Accesso all'esame",
		time_limit_rules: "Limite di tempo",
		time_limit_label: "Imponi un limite di tempo ai partecipanti",
		manage_time_limit_exceptions: "Gestisci eccezioni",
		time_limit_exceptions: "eccezioni",
		no_time_limit_description: "Dovrai chiudere manualmente l'esame.",
		exceptions_to_time_limit: "Eccezioni al limite di tempo",
		time_limit_description: "Al termine del tempo, l'esame si chiude automaticamente.",
		add_exception: "Aggiungi eccezione",
		no_time_limit_exception: "Non hai impostato eccezioni al limite di tempo.",
		remove_time_limit_exception_confirmation:
			"Sei sicuro di voler rimuovere questa eccezione al limite di tempo?",
		delete_exception: "Rimuovi eccezione",
		exercises_shown_at_a_time_label: "Numero di esercizi da mostrare per pagina",
		allow_everyone_access_label:
			"Permetti di partecipare a tutti quelli che hanno il link all'esame",
		deny_access_by_default_label:
			"Permetti di partecipare solo agli studenti da te indicati",
		allow_going_back_label:
			"Permetti agli studenti di tornare indietro a un esercizio già visto",
		show_all_exercises_at_once: "Mostra tutti gli esercizi insieme",
		show_one_exercise_at_once: "Mostra solo un esercizio alla volta",
		publish: "Pubblica",
		revert_to_draft: "Torna a stato di bozza",
		event_planned_help_text: "L'esame verrà aperto agli studenti automaticamente in data",
		editing_open_event_title: "Modifica di un esame in corso",
		editing_open_event_body:
			"Stai modificando un esame già iniziato. Sei sicuro di volerlo modificare?",
		correct_errors_to_publish:
			"Prima di poter pubblicare l'esame, correggi i seguenti errori:",
		cannot_change_timestamp:
			"Non puoi modificare la data e ora di inizio dell'esame una volta pianificato. Per modificare questo campo, metti l'esame in stato di bozza.",
		this_is_the_link_to_the_event:
			"Ecco il link per accedere all'esame. Comunicalo agli studenti che parteciperanno.",
		edit_template_in_progress_warning:
			"Modificare il modello dell'esame quando questo è già iniziato può avere conseguenze imprevedibili. Gli studenti che hanno già iniziato l'esame non saranno interessati dalle modifiche. Procedi solo se sai cosa stai facendo.",
		currently_locked_by: "È in corso una modifica a questo esame da parte di",
		lock_stand_by: "L'editor verrà sbloccato non appena la modifica sarà conclusa.",
		tip_you_used_randomization:
			"Hai utilizzato alcune delle funzionalità di randomizzazione. Verifica che gli esami generati siano corretti.",
		generate_examples: "Genera esempi",
		generating_examples: "Generazione esempi...",
		allow_access_description:
			"Tutti coloro che hanno il link potranno partecipare all'esame una volta aperto.",
		deny_access_description:
			"Solo gli studenti da te indicati potranno partecipare all'esame una volta aperto.",
		choose_allowed: "Gestisci ammessi",
		import_from_valutami: "Importa da Valutami",
		manage_allowed_description:
			"Inserisci gli indirizzi email degli studenti che possono partecipare all'esame. Solo gli studenti il cui indirizzo email è in questa lista potranno accedere all'esame quando viene aperto.",
		manage_allowed_import_from_valutami_1:
			"Puoi importare la lista degli iscritti all'esame dal portale",
		manage_allowed_import_from_valutami_2: "Valutami",
		manage_allowed_import_from_valutami_3:
			"Questo permetterà solo agli studenti che si sono iscritti all'appello sul portale di accedere a questo esame.",
		student_email: "Email dello studente",
		import_enrolled: "Importa iscritti",
		allowed_students: "studenti ammessi",
	},
	exercise_editor: {
		confirm_delete_testcase_attachment: "Sei sicuro di voler eliminare l'allegato",
		testcase_add_attachments: "Aggiungi allegati",
		testcase_attachments: "Allegati",
		testcase_attachments_description:
			"I file che alleghi a un test case verranno inclusi nella directory di lavoro nella quale verrà eseguito il codice. Gli allegati di un test case sono disponibili solo durante l'esecuzione di quel test case.",
		use_assert_lib: "Per scrivere il codice dei test case, utilizza la libreria",
		exercise_editor_title: "Editor esercizio",
		draft_notice: "Bozza",
		max_score: "Punteggio massimo",
		solutions_title: "Soluzioni",
		choices_title: "Scelte",
		clozes_title: "Gruppi di scelte",
		testcases_title: "Test case",
		exercise_label: "Nome dell'esercizio",
		exercise_text: "Testo dell'esercizio",
		exercise_solution: "Soluzione dell'esercizio (opzionale)",
		select_exercise_type: "Seleziona tipologia",
		exercise_type: "Tipologia",
		exercise_state: "Visibilità",
		exercise_public_tags: "Tag pubblici",
		exercise_tags: "Tag",
		exercise_private_tags: "Tag privati",
		all_or_nothing: "All or nothing",
		choice_text: "Testo",
		choice_correctness: "Punteggio",
		choice_score_checked: "Punteggio selez.",
		choice_score_unchecked: "Punteg. non selez.",
		testcase_type: "Visibilità",
		testcase_text: "Descrizione",
		testcase_code: "Codice",
		testcase_stdin: "Input (stdin)",
		test_solution: "Testa",
		testing_solution: "Test in corso...",
		testcase_expected_stdout: "Output atteso (stdout)",
		hidden_to_students: "Nascosto agli studenti",
		edit_non_draft_title: "Modifica di un esercizio non bozza",
		edit_non_draft_body:
			"Stai per modificare un esercizio non in stato di bozza. Potrebbe essere già presente in un esame o essere già stato visto dagli studenti. Sei sicuro di volerlo modificare?",
		new_choice: "Nuova",
		new_solution: "Nuova",
		new_testcase: "Nuovo",
		new_sub_exercise: "Nuovo",
		new_cloze: "Aggiungi domanda",
		edit_cloze: "Modifica domanda",
		editing_cloze: "Stai modificando il gruppo di scelte",
		sub_exercises_title: "Sotto-esercizi",
		sub_exercise_weight: "Peso sotto-esercizio",
		cannot_publish: "Non puoi ancora pubblicare questo esercizio",
		cannot_publish_body:
			"Per poter rimuovere lo stato di bozza, correggi i seguenti errori:",
		make_public_confirmation_title:
			"Sei sicuro di voler rendere questo esercizio pubblico?",
		make_public_confirmation_body:
			"Se rendi questo esercizio pubblico, tutti gli studenti potranno visualizzarlo in qualsiasi momento. Se vuoi utilizzare questo esercizio in un esame, rendilo privato.",
		currently_locked_by: "È in corso una modifica a questo esercizio da parte di",
		requires_typescript: "Richiedi l'utilizzo di TypeScript",
		confirm_delete_choice: "Sei sicuro di voler eliminare questa scelta?",
		confirm_delete_solution: "Sei sicuro di voler eliminare questa soluzione?",
		confirm_delete_testcase: "Sei sicuro di voler eliminare questo test case?",
		confirm_delete_sub_exercise: "Sei sicuro di voler eliminare questo sotto-esercizio?",
		code_execution_will_appear_here:
			"I risultati dell'esecuzione del codice della soluzione appariranno qui.",
		clone: "Clona esercizio",
		delete: "Elimina esercizio",
		delete_sub_exercise: "Elimina sotto-esercizio",
		delete_choice: "Elimina scelta",
		delete_testcase: "Elimina test case",
		clone_confirm: "Sei sicuro di voler clonare",
		is_choice_correct: "Corretta",
		no_choice_penalty_warning:
			"Non hai impostato una penalità (punteggio negativo) per alcuna scelta. Gli studenti potranno ottenere il punteggio massimo per questo esercizio selezionando tutte le scelte disponibili.",
	},
	exercise_wrapper: {
		select: "Seleziona",
	},
	student_course_dashboard: {
		you_are_in_student_mode: "Stai visualizzando il corso in modalità studente",
		no_exams: "Non hai ancora partecipato a nessun esame",
		show_bookmarked: "Mostra solo preferite",
		add_bookmark: "Aggiungi ai preferiti",
		remove_bookmark: "Rimuovi dai preferiti",
		show_all_practices: "Mostra tutte",
		too_many_exercises: "Hai aggiunto troppi esercizi. Selezionane al massimo",
		your_practice_events: "Le mie esercitazioni",
		new_practice_event: "Nuova esercitazione",
		exams_you_participated_in: "I miei esami",
		review_submission: "Rivedi risposte",
		view_assessment: "Valutazione",
		resume: "Riprendi",
		assessment_available: "Sono stati pubblicati i voti relativi a questo esame",
		new_practice: "Nuova esercitazione",
		resume_practice: "Riprendi esercitazione",
		draft_practice: "Bozza esercitazione",
		pending: "In corso",
		practice_summary: "Riepilogo",
		available_exercises_tooltip: "esercizi disponibili",
		no_public_exercises:
			"Non puoi iniziare un'esercitazione perché i docenti del corso non hanno ancora aggiunto esercizi",
	},
	practice_template_editor: {
		begin_practice: "Inizia esercitazione",
		add_rule: "Aggiungi esercizi",
		choose_tags_text: "Seleziona i tag che ti interessano per creare l'esercitazione.",
		choose_exercises_no_tag_text: "Quanti esercizi vuoi che l'esercitazione contenga?",
		rule_amount_1: "Quanti esercizi col tag",
		rule_amount_2: "vuoi vedere?",
		exercise_amount: "Numero di esercizi",
		seen_exercises_wont_be_selected:
			"Non verranno selezionati esercizi che hai già visto. Hai già incontrato",
		exercises_with_this_tag: "esercizi con questo tag.",
		all_exercises_seen_with_this_tag: "Hai già visto tutti gli esercizi per questo tag",
	},
	programming_exercise: {
		open_text_popup: "Apri popup",
		tab_text: "Testo",
		tab_testcases: "Test case",
		tab_editor: "Editor",
		tab_execution_results: "Risultato",
		run_code: "Esegui",
		running_code: "Esecuzione in corso...",
		execution_results: "Risultato esecuzione",
		testcase: "Test case",
		testcase_stdin: "Input",
		testcase_expected_stdout: "Output atteso",
		passed: "Superato",
		not_passed: "Non superato",
		test_failed_with_error:
			"L'esecuzione del programma si è interrotta producendo il seguente errore",
		test_failed_stdout: "Il programma ha prodotto il seguente output",
		code_errored: "L'esecuzione del codice ha prodotto il seguente errore",
		compilation_errored: "La fase di compilazione ha prodotto i seguenti errori",
		no_testcases:
			"Questo esercizio non contiene test case. Prova a chiedere al docente di inserirne qualcuno.",
		results_ok_but_no_testcases:
			"L'esecuzione del tuo codice non ha prodotto errori. Purtroppo questo esercizio non ha test case, quindi questo è tutto ciò che sappiamo.",
		internal_error:
			"Si è verificato un errore interno durante l'esecuzione del codice. Per favore, segnala questo errore ai docenti.",
		code_execution_will_appear_here:
			"I risultati dell'esecuzione del tuo codice appariranno qui.",
	},
	exercise_types: {
		[ExerciseType.MULTIPLE_CHOICE_SINGLE_POSSIBLE]:
			"Scelta multipla con selezione singola",
		[ExerciseType.MULTIPLE_CHOICE_MULTIPLE_POSSIBLE]:
			"Scelta multipla con selezione multipla",
		[ExerciseType.OPEN_ANSWER]: "Risposta aperta",
		[ExerciseType.JS]: "Esercizio JavaScript",
		[ExerciseType.C]: "Esercizio C",
		[ExerciseType.PYTHON]: "Esercizio Python",
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
		event: {
			modelValue: {
				"name-required": "Inserisci un nome per l'esame",
				"begin_timestamp-required": "Inserisci una data e ora di inizio",
				"end_timestamp-required": "Inserisci una data e ora di fine",
				template: {
					"rules-$each": "Alcuni slot sono configurati in maniera errata",
					"rules-required": "Aggiungi almeno uno slot",
				},
			},
		},
		exercise: {
			modelValue: {
				"text-required": "Il testo dell'esercizio non può essere vuoto.",
				"choices-choicesRequiredIfMultipleChoiceExercise":
					"L'esercizio deve avere almeno una scelta selezionabile.",
				"choices-atLeastOneCorrectChoice":
					"L'esercizio deve avere almeno una scelta corretta (con punteggio maggiore di 0).",
				"choices-$each": "Alcune scelte non sono configurate correttamente.",
				"sub_exercises-$each":
					"Alcuni sotto-esercizi non sono configurati correttamente.",
			},
			choice: {
				choice: {
					"text-required": "Il testo della scelta non può essere vuoto.",
				},
				"text-required": "Il testo della scelta non può essere vuoto.",
			},
		},
		course: {
			"name-required": "Il nome del corso non può essere vuoto",
			"name-unique": "Esiste già un corso con questo nome",
		},
		dirtyCourse: {
			"name-required": "Il nome del corso non può essere vuoto",
			"name-unique": "Esiste già un corso con questo nome",
		},
		eventTemplateRule: {
			modelValue: {
				"rule_type-ruleTypeSet": "Non hai impostato un criterio per popolare questo slot",
				"exercises-idBasedRulePopulated": "Questo slot non contiene esercizi",
				"clauses-tagBasedRulePopulated": "Questo slot non contiene tag",
				"satisfying-tagBasedRuleSatisfied":
					"Non ci sono abbastanza esercizi che soddisfano le condizioni scelte",
				// not_satisfied_by_enough:
				//   "Non ci sono abbastanza esercizi che soddisfano le condizioni scelte",
			},
		},
	},
	// exam_validation_errors: {
	//   [ExamValidationError.NO_NAME]: "Non hai assegnato un nome all'esame",
	//   [ExamValidationError.NO_VALID_TEMPLATE_RULES]:
	//     "Non hai creato slot per gli esercizi per questo esame",
	//   [ExamValidationError.NO_END_TIMESTAMP]:
	//     "Non hai assegnato una data e ora di fine a questo esame",
	//   [ExamValidationError.NO_BEGIN_TIMESTAMP]:
	//     "Non hai assegnato una data e ora di inizio a questo esame",
	//   [ExamValidationError.INVALID_TIMESTAMPS]:
	//     "Hai selezionato data e ora di inizio e fine non corrette per questo esame",
	// },
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
		[CoursePrivilege.MANAGE_EVENTS]: "Può creare e modificare gli esami del corso.",
		[CoursePrivilege.MANAGE_EXERCISE_SOLUTIONS]:
			"Può visionare le soluzioni agli esercizi scritte dagli studenti e approvarle o scartarle.",
		[CoursePrivilege.MANAGE_EXERCISES]: "Può creare e modificare esercizi.",
		[CoursePrivilege.UPDATE_COURSE]:
			"Può modificare le impostazioni del corso, incluso assegnare permessi ad altri utenti.",
		[CoursePrivilege.MANAGE_MATERIAL]:
			"Può creare e modificare materiale didattico per il corso, come lezioni, allegati, annunci e sondaggi.",
	},
	course_privileges_short: {
		[CoursePrivilege.ACCESS_EXERCISES]: "Vedere esercizi",
		[CoursePrivilege.ASSESS_PARTICIPATIONS]: "Assegnare voti",
		[CoursePrivilege.MANAGE_EVENTS]: "Creare esami",
		[CoursePrivilege.MANAGE_EXERCISES]: "Creare esercizi",
		[CoursePrivilege.UPDATE_COURSE]: "Modificare impostazioni corso",
		[CoursePrivilege.MANAGE_EXERCISE_SOLUTIONS]: "Gestire soluzioni",
		[CoursePrivilege.MANAGE_MATERIAL]: "Gestire materiale didattico",
	},
	testcase_types: {
		[ExerciseTestCaseType.SHOW_CODE_SHOW_TEXT]: "Pubblico",
		[ExerciseTestCaseType.SHOW_TEXT_ONLY]: "Solo descriz.",
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
		equals: "Uguale a",
		notEqual: "Diverso da",
		lessThan: "Minore di",
		lessThanOrEqual: "Minore di o uguale a",
		greaterThan: "Maggiore di",
		greaterThanOrEqual: "Maggiore di o uguale a",
		filterOoo: "Cerca...",
		contains: "Contenuto",
		noRowsToShow: "Non ci sono dati da mostrare",
	},
	errors: {
		retry: "Riprova",
		back: "Torna indietro",
		no_connection: "Connessione assente",
		400: "La tua richiesta contiene un errore",
		401: "Effettua il login per visualizzare questa pagina",
		403: "Non hai i permessi necessari per effettuare quest'azione",
		404: "La pagina richiesta non sembra esistere",
		500: "Si è verificato un errore interno",
		unknown_error: "Si è verificato un errore sconosciuto",
	},
	course_tree: {
		editor_discard_unsaved_changes: "Vuoi scartare le modifiche non salvate?",
		confirm_delete_comment: "Sei sicuro di voler eliminare questo commento?",
		file_by_url_description:
			"Inserisci l'URL del file da condividere. È possibile visualizzare alcune tipologie di file in modalità integrata direttamente all'interno di Evo Learning.",
		file_url: "Indirizzo del file",
		file_editor_title: "Nuovo file",
		file_node_editor_file_upload: "Carica file",
		file_node_editor_url: "Importa da URL",
		poll_results: "Risultati",
		save_poll_choice: "Conferma",
		poll_choice_not_saved_yet: "Selezione non ancora salvata",
		confirm_delete_poll_choice: "Vuoi eliminare questa scelta?",
		new_poll_choice: "Nuova",
		poll_choice_text: "Testo opzione",
		poll_closed: "Questo sondaggio è chiuso",
		poll_title: "Sondaggio",
		publish_poll: "Pubblica",
		poll_text: "Testo del sondaggio",
		poll_choices: "Opzioni",
		poll_editor_title: "Sondaggio",
		announcement_title: "Annuncio",
		publish_announcement: "Pubblica",
		announcement_body: "Annuncio",
		announcement_attachments: "Allegati",
		announcement_editor_title: "Annuncio",
		node_comments_title: "commenti",
		node_comment_title: "commento",
		cannot_delete_nonempty_topic: "Sezione non vuota",
		delete_node_confirm:
			"Sei sicuro di voler eliminare questo elemento? Quest'azione è irreversibile.",
		topic_label: "Sezione",
		no_topic: "Nessuna sezione",
		create: "Crea",
		topic_node_name: "Nome sezione",
		new_topic_title: "Nuova sezione",
		save: "Salva",
		save_draft: "Salva bozza",
		create_file_node_title: "Nuovo file",
		no_nodes: "Non c'è ancora materiale",
		unnamed_lesson: "Lezione senza titolo",
		back_to_tree: "Torna al materiale",
		new: "Nuovo",
		lesson_title: "Titolo",
		lesson_body: "Contenuti",
		lesson_editor_title: "Editor lezione",
		draft: "Bozza",
		publish_lesson: "Pubblica",
		lesson_creation_date: "Creata il",
		lesson_attachments: "Allegati",
		add_attachment: "Aggiungi allegato",
	},
	course_tree_node_types: {
		[CourseTreeNodeType.FileNode]: "File",
		[CourseTreeNodeType.TopicNode]: "Sezione",
		[CourseTreeNodeType.LessonNode]: "Lezione",
		[CourseTreeNodeType.PollNode]: "Sondaggio",
		[CourseTreeNodeType.AnnouncementNode]: "Annuncio",
	},
	breadcrumbs: {
		course_list: "Corsi",
		course_dashboard: ROUTE_TITLE_COURSE_NAME_TOKEN,
		exam_participation_page: ROUTE_TITLE_EVENT_NAME_TOKEN,
		practice_participation_page: "Esercitazione",
		submission_review: "Revisione " + ROUTE_TITLE_EVENT_NAME_TOKEN,
		practice_review: "Riepilogo esercitazione",
		exam_assessment: "Valutazione " + ROUTE_TITLE_EVENT_NAME_TOKEN,
		course_tree: "Materiale",
		course_tree_node: ROUTE_TITLE_NODE_NAME_TOKEN,
		exercise_solution_thread: "Discussione esercizio",
		exercise_solution_threads: "Esercizi popolari",
		student_favorites: "Contenuti salvati",
		student_course_leaderboard: "Classifica",
	},
	course_list: {
		filter_courses: "Cerca corsi",
		courses_i_teach: "Mostra solo i miei corsi",
		hidden_courses: "Mostra corsi nascosti agli studenti",
		no_courses: "Non ci sono ancora corsi",
		no_courses_with_filters: "Non ci sono corsi che corrispondono ai criteri di ricerca",
	},
	help_texts: {
		telegram: "Canale Telegram",
		testcase_passes: "Test case superato dalla soluzione",
		testcase_fails: "Test case non superato dalla soluzione",
		practice_score: "Basato sugli esercizi correggibili automaticamente",
		student_practice_rule_amount: "Quanti esercizi con questo tag vuoi vedere?",
		exercise_editor: {
			all_or_nothing_programming:
				"Se attivo, le sottomissioni che non superano tutti i test case riceveranno 0 punti.",
			all_or_nothing:
				"Se attivo, gli studenti che selezionano almeno una scelta errata o non selezionano tutte quelle corrette otterranno 0 punti.",
			label: "Il nome dell'esercizio non viene mai mostrato agli studenti",
			sub_exercise_weight:
				"Peso con cui il punteggio ottenuto in questo sotto-esercizio incide sulla valutazione complessiva dell'esercizio.",
			// score_if_checked:
			//   "100% indica risposta corretta. Puoi usare valori negativi per dare una penalità.",
			//score_if_unchecked: "Punteggio se la risposta non viene selezionata",
			solution:
				"Se pubblichi questo esercizio, quando viene incluso in un'esercitazione creata da uno studente, la soluzione verrà mostrata al termine della stessa.",
			public_tags:
				"Se pubblichi questo esercizio, i tag pubblici potranno essere utilizzati dagli studenti per cercarlo quando compongono un'esercitazione",
			private_tags:
				"Questi tag non verranno mai mostrati agli studenti e possono essere utilizzati per organizzare gli esercizi e aggiungerli agli esami",
			clozes:
				"Per aggiungere una sotto-domanda, posiziona il cursore nella posizione del testo dove vuoi aggiungerla e clicca Aggiungi domanda. Per modificare una sotto-domanda, clicca sul simbolo [[?]] corrispondente e clicca Modifica domanda.",
		},
		event_template_rule_editor: {
			weight: "Punteggio massimo ottenibile per gli esercizi di questo slot",
		},
		copy_exam_link: "Copia link all'esame",
		stats: "Statistiche esame",
		edit_score: "Modifica punteggio",
		edit_overall_grade: "Modifica voto",
		hidden_course: "Corso nascosto agli studenti",
	},
	tour: {
		demo_student_header: "Benvenuto nella sezione studenti!",
		demo_student_content:
			"Questa è la dashboard che i tuoi studenti visualizzeranno quando accedono ai tuoi corsi. Vediamo alcune delle funzionalità principali.",
		demo_practice_header: "Esercitazioni",
		demo_practice_content:
			"Evo Learning permette agli studenti di creare autonomamente esercitazioni sfruttando gli esercizi che il docente ha reso pubblici. Prova a creare un'esercitazione.",
		demo_popular_exercises_header: "Esercizi popolari",
		demo_popular_exercises_content:
			"Da questa sezione, gli studenti possono visualizzare gli esercizi che hanno ricevuto più attenzione e discuterne tra di loro, proponendo soluzioni e votando le soluzioni proposte da altri.",
		demo_leaderboard_header: "Classifica",
		demo_leaderboard_content:
			"Per i corsi in cui le funzionalità di gioco sono attive la classifica mostra gli studenti più attivi. Attenzione: nella demo non potrai gestire le funzionalità di gioco nei tuoi corsi, ma abbiamo già attivato queste funzionalità per te, quindi potrai provarle da studente.",
		demo_help_center_header: "Centro supporto",
		demo_help_center_content:
			"Se hai dubbi su qualche funzionalità, visita il centro di supporto: troverai articoli che rispondono alle domande più frequenti sull'utilizzo. Se non trovi la risposta alla tua domanda, utilizza la funzione Contattaci.",
		demo_permissions_header: "Permessi",
		demo_permissions_content:
			"Da questa sezione puoi aggiungere docenti al tuo corso, assegnando loro permessi diversi a seconda del loro ruolo.",
		demo_solutions_header: "Soluzioni agli esercizi",
		demo_solutions_content:
			"Mentre dalla sezione Esercizi potrai scrivere le soluzioni per gli esercizi del tuo corso, in questa sezione troverai le soluzioni proposte dagli studenti.",
		demo_exams_header: "Esami",
		demo_exams_content:
			"Gli esercizi che crei potranno essere inseriti in prove d'esame. In questa sezione potrai creare esami per il tuo corso, monitorare l'andamento di quelli in corso e visualizzare le statistiche di quelli già conclusi.",
		demo_exercises_header: "Esercizi",
		demo_exercises_content:
			"La maggior parte delle funzionalità di Evo Learning sono incentrate sugli esercizi. In questa sezione troverai gli esercizi del tuo corso e potrai crearne di nuovi.",
		demo_course_header: "È tutto pronto",
		demo_course_content:
			"Abbiamo già creato alcuni corsi per te, in modo che tu possa provare tutte le funzionaltà di Evo Learning. Inizia accedendo al pannello docente di uno dei corsi disponibili.",
		demo_welcome_header: "Benvenuto nella tua demo di Evo Learning!",
		demo_welcome_content:
			"Per iniziare, effettua l'accesso con l'indirizzo email che hai usato per attivare la demo.",
		new_sidebar_header: "Nuova sidebar",
		new_sidebar_content:
			"La nuova sidebar collassabile ti permette di concentrarti sul tuo lavoro senza distrazioni. Per mantenerla aperta sempre, clicca sul bottone qui in alto.",
		help_center_header: "Nuova guida all'utilizzo",
		help_center_content:
			"Nella nuova guida all'utilizzo della piattaforma, troverai articoli e risposte alle domande più frequenti. Consultala se trovi difficoltà nell'utilizzo o se hai domande sulla piattaforma.",
		skip: "Salta tour",
		next: "Avanti",
		previous: "Indietro",
		finish: "Termina",
		add_exercises_header: "Creazione esercizi",
		add_exercises_content:
			"Per prima cosa, aggiungi esercizi al corso. Gli esercizi che crei potranno essere usati per comporre esami oppure resi disponibili agli studenti per esercitarsi.",
		add_exams_header: "Creazione esami",
		add_exams_content:
			"Dopo aver creato gli esercizi, puoi utilizzarli per comporre esami.",
		permissions_header: "Aggiungi docenti",
		permissions_content:
			"Dalla pagina dei permessi puoi consentire l'accesso alle funzionalità di gestione del corso ad altri docenti o figure di rilievo, come i tutor.",
		exam_insights_header: "Statistiche esame",
		exam_insights_content:
			"Visita la pagina delle statistiche per vedere approfondimenti sull'andamento dell'esame.",
	},
	gamification: {
		your_reputation: "La tua reputazione",
		your_leaderboard_position: "La tua posizione in classifica",
		your_badges: "Le tue medaglie",
		show_panel: "Mostra dettagli",
		goals: "Obiettivi",
		no_leaderboard: "La classifica è vuota... per ora",
		no_goals: "Non ci sono ancora obiettivi",
		actions: {
			[GamificationAction.SUBMIT_EXERCISE_SOLUTION]:
				"Proponi la soluzione di un esercizio",
			[GamificationAction.EXERCISE_SOLUTION_APPROVED]:
				"Ottieni l'approvazione del docente per una tua soluzione",
			[GamificationAction.TURN_IN_PRACTICE_PARTICIPATION]: "Completa un'esercitazione",
			[GamificationAction.CORRECTLY_ANSWERED_EXERCISE]:
				"Risolvi correttamente un esercizio",
			[GamificationAction.EXERCISE_SOLUTION_UPVOTED]:
				"Ottieni un Mi piace a una soluzione da te scritta",
			[GamificationAction.SUBMIT_FIRST_EXERCISE_SOLUTION]:
				"Proponi la soluzione di un esercizio per primo",
		},
	},
	reports: {
		csv_headers: {
			user: {
				email: "Email",
				course: "Corso",
				full_name: "Nome e cognome",
				first_name: "Nome",
				last_name: "Cognome",
				mat: "Matricola",
			},
			begin_timestamp: "Data e ora di inizio",
			end_timestamp: "Data e ora di consegna",
			score: "Voto",
			slot: "Slot",
			slots: {
				exercise: {
					label: "nome esercizio",
				},
				score: "punteggio",
				answer_text: "risposta",
				selected_choices: "risposte selezionate",
				passed_testcases: "test case superati",
				failed_testcases: "test case falliti",
				passed_testcase_0: "Test case 1 superato",
				passed_testcase_1: "Test case 2 superato",
				passed_testcase_2: "Test case 3 superato",
				passed_testcase_3: "Test case 4 superato",
				passed_testcase_4: "Test case 5 superato",
				passed_testcase_5: "Test case 6 superato",
				passed_testcase_6: "Test case 7 superato",
				passed_testcase_7: "Test case 8 superato",
				passed_testcase_8: "Test case 9 superato",
				passed_testcase_9: "Test case 10 superato",
			},
		},
	},
	locales: {
		it: "Italiano",
		en: "English",
	},
	server_messages: {
		error: {
			EVENT_CLOSED: "L'esame è terminato.",
			NOT_IN_EVENT_ALLOWED_LIST:
				"Non sei nella lista di studenti ammessi a questo esame. Se ritieni che si tratti di un errore, contatta il docente.",
		},
	},
	exercise_import: {
		formats: {
			[DataFormat.MOODLE_XML]: "Moodle XML",
			[DataFormat.EVO_JSON]: "SAI Evo JSON",
		},
		select_format: "Seleziona il formato",
		choose_file: "Scegli il file da importare",
		import: "Importa",
		importing: "Attendi...",
		imported_exercises_state: "Visibilità degli esercizi importati",
		detected_exercises: "esercizi rilevati",
		extras_detected_tags: "Tag rilevati",
		extras_detected_tags_description:
			"Clicca sui tag che vuoi aggiungere agli esercizi importati. I tag selezionati verranno aggiunti come tag pubblici.",
	},
};

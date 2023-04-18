import {
	courseListSidebarOptions,
	courseDashboardSidebarOptions,
} from "./../navigation/sidebar";
import { getTranslatedString } from "./../i18n/index";
import { ArticleTag, HelpCenterArticle } from "./index";

const getSidebarOptionHtml = (routeName: string): string => {
	const sideBarOptions = [...courseListSidebarOptions, ...courseDashboardSidebarOptions];

	const option = sideBarOptions.find(o => o.routeName === routeName);

	if (!option) {
		throw new Error(routeName);
	}

	return `
  <span class="material-icons-outlined inline-icon text-primary">${option.icon}</span> 
  <span class="font-semibold text-primary">${option.label}</span>`;
};

export const articles: HelpCenterArticle[] = [
	{
		id: "multiple_choice_eval_logic",
		title: "Come sono valutate le risposte a scelta multipla?",
		content: ``,
		tags: ["exercises"],
	},
	{
		id: "what_are_tags_for",
		title: "A cosa servono i tag negli esercizi?",
		content: `<div>
    <p>I tag servono per classificare gli esercizi in base a criteri stabiliti dal docente, come per esempio l'argomento o la difficoltà.</p>
    <p>Gli esercizi hanno due tipi di tag: i <strong>tab pubblici</strong> e i <strong>tag privati</strong>.</p>

    <p class="mt-4">Se pubblichi un esercizio, i suoi <strong>tag pubblici</strong> verranno mostrati agli studenti e compariranno 
    nella lista di tag che possono essere usati per creare esercitazioni. Se intendi pubblicare un esercizio, utilizza tag pubblici
    che possano essere utili agli studenti per trovare l'esercizio. &Egrave; consigliato utilizzare i tag pubblici per elencare gli
    argomenti di un esercizio.</p>

    <p class="mt-4">I <strong>tag privati</strong> non verranno mai mostrati agli studenti, nemmeno se pubblichi un esercizio. Puoi utilizzarli
    per qualsiasi criterio di classificazione, per esempio per tenere traccia degli esami nei quali hai inserito un esericizio, 
    oppure della sua difficoltà.</p>
    </div>`,
		tags: ["exercises", "general"],
		related: [],
	},
	{
		id: "why_evo_asks_for_google_scopes",
		title:
			"Perché Evo Learning richiede accesso alle informazioni del mio account Google?",
		content: `<div>
    <div class="flex items-center space-x-4 mt-4 mb-4">
      <img style="width: 130px" src=${require("@/assets/evo_classroom.png")} />
      <!-- <h4>Integrazione con Google Classroom</h4> -->
    </div>
      <p>Evo Learning realizza un'integrazione con Google Classroom che consente di sincronizzare i dati tra le 
      due piattaforme. I dati interessati includono: </p>
      <ul class="list-disc list-inside my-2">
        <li>Iscrizioni ai corsi</li>
        <li>Lezioni, annunci e materiale didattico</li>
        <li>Esami e voti</li>
      </ul>
      <p>Al fine di fonirti la migliore esperienza possibile, Evo Learning richiede di accedere ai
      dati del tuo account Google d'interesse per l'integrazione con Google Classroom.</p>
    </div>`,
		tags: ["general", "integrations"],
		related: [],
	},
	{
		id: "close_exams_for_certain_students",
		title: "Come si chiude un esame solo per alcuni studenti?",
		content: `
        <p>Dalla pagina ${getSidebarOptionHtml(
					"CourseExams",
				)} del tuo corso, clicca sul bottone con l'icona&nbsp; <span class="material-icons inline-icon">visibility</span>
        dell'esame in questione per entrare nella pagina di monitoraggio.</p>
        <p class="mt-4">Dalla pagina di monitoraggio, seleziona gli studenti per i quali vuoi chiudere l'esame cliccando sulla checkbox vicino all'indirizzo
        <strong>email</strong> dello studente.</p>
        <p class="mt-4">Clicca su <span class="material-icons-outlined text-danger-dark inline-icon">block</span>
        <span class="text-danger-dark">${getTranslatedString(
					"event_monitor.close_for_selected",
				)}</span> e conferma.</p>
        
        <div class="article-separator"></div>
        <p class="">Se vuoi riaprire l'esame per alcuni studenti per i quali lo avevi precedentemente chiuso, selezionali
        cliccando le checkbox relative, poi clicca su <span class="material-icons-outlined text-primary inline-icon">redo</span> <span class="text-primary">${getTranslatedString(
					"event_monitor.open_for_selected",
				)}</span> e conferma.</p>
      `,
		tags: ["exams", "participations"],
		related: [],
	},
	{
		id: "whats_publishing_exercises_for",
		title: "A cosa serve pubblicare un esercizio?",
		content: `
    <p>Gli esercizi hanno tre possibili valori di visibilità: <strong>bozza</strong>, <strong>solo esami</strong> e <strong>pubblico</strong>.</p>
    <p class="mt-4">Gli esercizi che sono in modalità <strong>pubblico</strong> possono comparire nelle esercitazioni degli studenti.</p>
    <p>Pubblicare un esercizio dà quindi agli studenti la possibilità di visualizzarlo nelle esercitazioni.</p>

    <div class="banner banner-light mt-4">
    <span class="material-icons-two-tone inline-icon" style="
    filter: invert(80%) sepia(67%) saturate(1803%) hue-rotate(348deg)
      brightness(80%) contrast(96%);
  ">
    tips_and_updates
    </span>
    <p class="">Un buon momento per pubblicare un esercizio è subito dopo aver chiuso un esame nel quale lo hai inserito: questo darà la possibilità agli studenti che
    non hanno sostenuto quell'esame di esercitarsi in futuro con quell'esercizio.</p></div>
    `,
		tags: ["exercises"],
		related: [],
	},
	{
		id: "whats_exam_template",
		title: "Cos'è il modello di un esame?",
		tags: ["exams"],
		related: [],
		content: `
    <p>Il modello di un esame è un insieme di regole che stabilisce come vengono selezionati gli esercizi
    da assegnare agli studenti che partecipano all'esame.</p>

    <p class="mt-4">Il modello è composto da slot, e ogni slot stabilisce il criterio per scegliere un esercizio
    da assegnare ai partecipanti dell'esame. Questo ti consente sia di creare esami uguali per tutti,
    che di creare esami dove ogni studente
    vedrà esercizi diversi.</p>

    <p class="mt-4">
    Ogni slot del modello ti permette di impostare un criterio di scelta tra questi:
    </p>

    <ul class="list-none list-inside">
      <li class="my-2">
      <span class="mr-1 inline-icon material-icons text-primary">topic</span>
      <span class="mt-4 text-primary font-semibold">Stesso esercizio per tutti</span>
        <p>A tutti gli studenti verrà assegnato lo stesso esercizio.</p>
      </li>

      <li class="my-2">
        <span class="mr-1 inline-icon material-icons text-primary">shuffle</span>
        <span class="mt-4 text-primary font-semibold">Esercizio scelto casualmente da un insieme</span>
        <p>A ciascuno studente verrà assegnato un esercizio scelto casualmente tra quelli che selezioni.</p>
      </li>

      <li class="my-2">
        <span class="mr-1 inline-icon material-icons text-primary">label</span>
        <span class="mt-4 text-primary font-semibold">Esercizio scelto casualmente in base ai tag</span>
        <p>A ciascuno studente verrà assegnato un esercizio scelto casualmente tra quelli che hanno i tag che selezioni.</p>
      </li>
   </ul>
    `,
	},
	{
		id: "how_to_add_exercises_to_exam",
		title: "Come si inseriscono esercizi in un esame?",
		tags: ["exercises", "exams"],
		related: [],
		content: `
      <p>Dalla pagina ${getSidebarOptionHtml(
				"CourseExercises",
			)} del tuo corso, crea per prima cosa gli esercizi che vuoi inserire.</p>
      <p><strong>Attenzione:</strong> dopo aver terminato le modifiche, cambia la visibilità degli esercizi in <strong>solo esami</strong>.</p>

      <p class="mt-4">Dalla pagina ${getSidebarOptionHtml(
				"CourseExams",
			)} del tuo corso, crea l'esame se non esiste già oppure apri il suo editor.</p>
      <p>Nella sezione <strong>${getTranslatedString(
				"event_template_editor.editor_title",
			)}</strong>, crea uno slot cliccando su 
      <span class="material-icons-outlined inline-icon text-primary">add</span> <span class="text-primary">${getTranslatedString(
				"event_template_editor.add_rule",
			)}</span>.</p>
    <p>Clicca su <span class="material-icons inline-icon text-onSecondary">settings</span> <span class="text-onSecondary">${getTranslatedString(
			"event_template_rule_editor.choose_exercise",
		)}</span> nello slot creato.</p>

    <h4 class="mt-4">Se vuoi inserire lo stesso esercizio per tutti</h4>
    <p>Clicca su <span class="opacity-50 inline-icon material-icons-two-tone two-tone-light">topic</span>
    <span class="text-muted">${getTranslatedString(
			"event_template_rule_editor.pick_single_exercise",
		)}</span>.</p>
    <p>Trova l'esercizio che vuoi aggiungere, poi clicca sulla sua icona 
    <span class="inline-icon text-success material-icons-outlined"> done </span>.</p>

    <h4 class="mt-4">Se vuoi randomizzare gli esercizi</h4>
    <p>Clicca su <span class="opacity-50 inline-icon material-icons-two-tone two-tone-light">shuffle</span>
    <span class="text-muted">${getTranslatedString(
			"event_template_rule_editor.pick_exercise_from_pool",
		)}</span>.</p>
    <p>Trova gli esercizi che vuoi aggiungere, poi clicca sull'icona 
    <span class="inline-icon text-success material-icons-outlined"> done </span> di ciascuno di essi.</p>
    <p>Ogni studente che parteciperà all'esame vedrà un esercizio tra quelli che hai scelto nella posizione dello slot.</p>
      `,
	},
	{
		id: "how_to_create_an_exam",
		title: "Come si crea un esame?",
		tags: ["exams", "general"],
		related: [],
		content: `<div class="banner banner-light">
    <span class="material-icons-two-tone inline-icon" style="
      filter: invert(80%) sepia(67%) saturate(1803%) hue-rotate(348deg)
        brightness(80%) contrast(96%);">tips_and_updates</span>
         <p>
         Prima di creare un esame, assicurati di aver creato gli esercizi che vuoi inserirvi e 
         di aver impostato la loro visibilità a <strong>solo esami</strong>.</p>
         </div>

         <p class="mt-4">Dalla pagina ${getSidebarOptionHtml(
						"CourseExams",
					)} del tuo corso, clicca su <span class="material-icons-outlined inline-icon text-primary">add</span> <span class="text-primary">${getTranslatedString(
			"course_events.new_exam",
		)}</span>.</p>
         <p class="mt-4">Seleziona il nome, la data e orario di inizio e fine dell'esame.</p>
         <p>Seleziona le regole di svolgimento e quelle di accesso.</p>
         <p>Crea il modello dell'esame aggiungendo gli esercizi precedentemente creati.</p>
         <p class="mt-4">Al termine delle modifiche, clicca su <span class="text-primary">${getTranslatedString(
						"event_editor.publish",
					)}</span>,
         poi copia il link all'esame e comunicalo agli studenti che vi parteciperanno. L'esame inizierà automaticamnte una volta raggiunta la data e ora indicate.</p>
      `,
	},
	{
		id: "how_to_add_teachers",
		title: "Come si aggiungono docenti a un corso?",
		tags: ["permissions", "general"],
		related: [],
		content: `
      <p>Accedi alla pagina ${getSidebarOptionHtml(
				"CoursePermissions",
			)} del tuo corso.</p>
      <p class="mt-4">Nella casella di ricerca, digita il nome e cognome oppure l'indirizzo email
      dell'utente a cui vuoi aggiungere i permessi.</p>

      <p class="mt-4">Seleziona dai risultati l'utente al quale vuoi aggiungere i permessi.</p>
      <p>Clicca sugli switch <span class="mr-1.5 transform scale-150 ml-1 text-4xl inline-icon material-icons text-primary">toggle_on</span> relativi
      ai permessi che vuoi abilitare.</p>

      <div class="banner banner-light mt-4">
      <span class="material-icons-two-tone inline-icon" style="
      filter: invert(80%) sepia(67%) saturate(1803%) hue-rotate(348deg)
        brightness(80%) contrast(96%);
    ">
      tips_and_updates
      </span>
      <p class="">Se vuoi aggiungere i permessi a un utente ma non riesci a trovarlo, potrebbe non aver effettuato il primo login. Puoi comunque inserire
      il suo indirizzo email e assegnargli i permessi, che verranno applicati appena l'utente effettuerà il primo accesso.</p></div>
      `,
	},
	{
		id: "how_to_limit_exam_access",
		title: "Come si limita l'accesso a un esame solo per alcuni studenti?",
		tags: ["exams"],
		related: [],
		content: `
      <p>Di default, tutti gli studenti che hanno il link per un esame possono parteciparvi. Potresti voler restringere l'accesso solo ad alcuni studenti, come quelli iscritti all'appello o che hanno superato un altro compito.</p>
      <p class="mt-4">Dall'<strong>editor</strong> dell'esame, nella sezione <strong>${getTranslatedString(
				"event_editor.access_rules",
			)}</strong>, 
      seleziona l'opzione <span class="text-primary">${getTranslatedString(
				"event_editor.deny_access_by_default_label",
			)}</span>.</p>
      <p class="mt-4">Dopodiché, clicca sul bottone <span class="text-primary inline-icon material-icons">people</span> <span class="text-primary">${getTranslatedString(
				"event_editor.choose_allowed",
			)}</span>.</p>
      <h4 class="my-2">Inserimento manuale</h4>
      <p>Nell'area di input che apparirà, inserisci gli <strong>indirizzi email</strong> degli studenti che possono partecipare. Solo gli studenti il 
      cui indirizzo email è in questa lista potranno accedere all'esame, quando viene aperto.</p>
      <h4 class="my-2">Importare da Valutami</h4>
      <p>Puoi importare la lista degli iscritti all'appello dal portale <strong>Valutami</strong>. Seleziona il file CSV scaricato da Valutami
      che contiene la lista degli iscritti all'esame e importalo nella sezione <strong>Importa da Valutami</strong>. Gli indirzzi email degli studenti
      contenuti nel foglio CSV verranno automaticamente aggiunti.</p>`,
	},
	{
		id: "how_to_save_exercises",
		title: "Come si salvano le modifiche fatte a un esercizio?",
		tags: ["exercises", "editor"],
		related: [],
		content: `
    <p>Tutte le modifiche che fai a un esercizio sono salvate automaticamente; non c'è bisogno di salvare manualmente le tue modifiche.</p>
    <p class="mt-4">Se in alto a destra nell'editor compare l'icona <span class="material-icons-outlined inline-icon icon-light">
    cloud_done
    </span>, le tue modifiche sono state salvate.
    </p>
    <p class="mt-4">
    <span class="material-icons-outlined inline-icon mr-1 icon-light">
    error_outline
    </span>
    A volte il salvataggio potrebbe richiedere un po' più tempo, per cui assicurati che tutte le modifiche siano state salvate prima di uscire
    dalla pagina. In ogni caso, se esci prima che le modifiche siano state salvate, ti verrà chiesta conferma.</p>
    `,
	},
	{
		id: "how_to_save_exams",
		title: "Come si salvano le modifiche fatte a un esame?",
		tags: ["exams", "editor"],
		related: [],
		content: `
    <p>Tutte le modifiche che fai a un esame sono salvate automaticamente; non c'è bisogno di salvare manualmente le tue modifiche.</p>
    <p class="mt-4">Se in alto a destra nell'editor compare l'icona <span class="material-icons-outlined inline-icon icon-light">
    cloud_done
    </span>, le tue modifiche sono state salvate.
    </p>
    <p class="mt-4">
    <span class="material-icons-outlined inline-icon mr-1 icon-light">
    error_outline
    </span>
    A volte il salvataggio potrebbe richiedere un po' più tempo, per cui assicurati che tutte le modifiche siano state salvate prima di uscire
    dalla pagina. In ogni caso, se esci prima che le modifiche siano state salvate, ti verrà chiesta conferma.</p>
    `,
	},
	{
		id: "where_do_i_find_enrolled_students",
		title: "Dove trovo la lista degli studenti attivi nel mio corso?",
		tags: ["general"],
		related: [],
		content: `
    <p>
    Dalla pagina
    ${getSidebarOptionHtml("CourseInsights")}, puoi 
    visualizzare la lista degli studenti attivi nel tuo corso.</p>
    <p class="mt-4">Per ciascuno studente attivo, puoi visualizzare la lista delle sue esercitazioni e
    degli esami che ha sostenuto. Per farlo, clicca sull'icona <span class="material-icons-outlined inline-icon light-icon">
    expand_more</span> accanto al suo nome.</p>
    `,
	},
];

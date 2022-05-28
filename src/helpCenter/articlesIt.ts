import { getTranslatedString } from "./../i18n/index";
import { HelpCenterArticle } from "./index";
export const articles: HelpCenterArticle[] = [
  {
    id: "what_are_tags_for",
    title: "A cosa servono i tag negli esercizi?",
    content: `<div>
    <p>I tag servono per classificare gli esercizi in base a criteri stabiliti dal docente, come per esempio l'argomento o la difficoltà.</p>
    <p>Gli esercizi hanno due tipi di tag: i <strong>tab pubblici</strong> e i <strong>tag privati</strong>.</p>

    <p class="mt-2">Se pubblichi un esercizio, i suoi <strong>tag pubblici</strong> verranno mostrati agli studenti e compariranno 
    nella lista di tag che possono essere usati per creare esercitazioni. Se intendi pubblicare un esercizio, utilizza tag pubblici
    che possano essere utili agli studenti per trovare l'esercizio. &Egrave; consigliato utilizzare i tag pubblici per elencare gli
    argomenti di un esercizio.</p>

    <p class="mt-2">I <strong>tag privati</strong> non verranno mai mostrati agli studenti, nemmeno se pubblichi un esercizio. Puoi utilizzarli
    per qualsiasi criterio di classificazione, per esempio per tenere traccia degli esami nei quali hai inserito un esericizio, 
    oppure della sua difficoltà.</p>
    </div>`,
    tags: [],
    related: [],
  },
  {
    id: "close_exams_for_certain_students",
    title: "Come si chiude un esame solo per alcuni studenti?",
    content: `
        <p>Dalla lista degli esami del tuo corso, clicca sul bottone con l'icona&nbsp; <span class="material-icons inline-icon">visibility</span>
        dell'esame in questione per entrare nella pagina di monitoraggio.</p>
        <p class="mt-2">Dalla pagina di monitoraggio, seleziona gli studenti per i quali vuoi chiudere l'esame cliccando sulla checkbox vicino all'indirizzo
        <strong>email</strong> dello studente.</p>
        <p class="mt-2">Clicca su <span class="material-icons-outlined text-danger-dark inline-icon">block</span>
        <span class="text-danger-dark">${getTranslatedString(
          "event_monitor.close_for_selected"
        )}</span> e conferma.</p>
        
        <div class="my-4 w-full h-0 border-b border-light"></div>
        <p class="">Se vuoi riaprire l'esame per alcuni studenti per i quali lo avevi precedentemente chiuso, selezionali
        cliccando le checkbox relative, poi clicca su <span class="material-icons-outlined text-primary inline-icon">redo</span> <span class="text-primary">${getTranslatedString(
          "event_monitor.open_for_selected"
        )}</span> e conferma.</p>
      `,
    tags: [],
    related: [],
  },
];

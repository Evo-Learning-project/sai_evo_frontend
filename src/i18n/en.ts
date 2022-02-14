import { ExerciseState, ExerciseType } from '@/models';

export const en = {
  exercise_editor: {
    exercise_editor_title: 'Exercise editor',
    draft_notice: 'Draft',
    choices_title: 'Choices',
    exercise_label: 'Exercise label',
    exercise_text: 'Text',
    exercise_solution: 'Solution (optional)',
    select_exercise_type: 'Select type',
    exercise_type: 'Type',
    exercise_state: 'Visibility',
    exercise_public_tags: 'Public tags',
    exercise_private_tags: 'Private tags',
    choice_text: 'Text',
    choice_score: 'Score',
    edit_non_draft_title: 'Modifica di un esercizio non bozza',
    edit_non_draft_body:
      'Stai per modificare un esercizio non in stato di bozza. Potrebbe essere già presente in un esame o essere già stato visto dagli studenti. Sei sicuro di volerlo modificare?',
    new_choice: 'Nuova',
    cannot_publish: 'Non puoi ancora pubblicare questo esercizio',
    cannot_publish_body:
      'Per poter rimuovere lo stato di bozza, correggi i seguenti errori:',
    make_public_confirmation_title:
      'Sei sicuro di voler rendere questo esercizio pubblico?',
    make_public_confirmation_body:
      'Se rendi questo esercizio pubblico, tutti gli studenti potranno visualizzarlo in qualsiasi momento. Se vuoi utilizzare questo esercizio in un esame, rendilo privato.',
  },
  exercise_types: {
    [ExerciseType.MULTIPLE_CHOICE_SINGLE_POSSIBLE]:
      'Multiple choices, only one correct',
    [ExerciseType.MULTIPLE_CHOICE_MULTIPLE_POSSIBLE]:
      'Multiple choices, more than one correct',
    [ExerciseType.OPEN_ANSWER]: 'Open answer',
    [ExerciseType.JS]: 'Esercizio JavaScript',
    [ExerciseType.COMPLETION]: 'Esercizio a completamento',
    [ExerciseType.ATTACHMENT]: 'Caricamento di file',
    [ExerciseType.AGGREGATED]: 'Esercizio composto',
  },
  exercise_states: {
    [ExerciseState.PUBLIC]: 'Public',
    [ExerciseState.PRIVATE]: 'Hidden',
    [ExerciseState.DRAFT]: 'Draft',
  },
};

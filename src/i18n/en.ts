import { ExerciseState, ExerciseType } from '@/models';

export const en = {
  dialog: {
    default_ok_text: 'OK',
    default_cancel_text: 'Cancel',
  },
  exercise_editor: {
    exercise_tags: 'Tags',
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
  misc: {
    tags: 'Tags',
    example: 'Example',
  },
  event_template_rule_editor: {
    exercise_number: 'Slot',
    choose_exercise: 'Scegli esercizio',
    change_exercise: 'Cambia esercizio',
    populate_slot_title: 'Select exercise(s) for slot',
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
    tag_based_description:
      'Ogni studente vedrà un esercizio a caso che tra i tag ha:',
    same_exercise_for_everyone_description:
      'Tutti gli studenti vedranno questo esercizio:',
    tag_based_introduction:
      'Each student will see one exercise chosen randomly among those that meet the conditions defined here. An exercise is eligible if, for each group of tags defined, it contains at least one tag from that group.',
    tag_based_select_exercises:
      'Exercises will be eligible only if they have',
    tag_based_at_least_one: 'at least one',
    tag_based_among: 'among the following tags:',
    tag_based_and: '... and',
    tag_based_add_condition: 'Aggiungi condizione',
    eligible_exercises: 'Eligible exercises:',
  },
};

import { createI18n } from 'vue-i18n';
import { it } from './it';
import { en } from './en';

export const messages = {
  it,
  en,
};

export const i18n = createI18n({
  messages,
  locale: 'it',
});

export const getTranslatedString = i18n.global.t;

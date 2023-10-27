import { createSelector } from 'reselect';

export const selectLangState = (state) => state.lang;

export const selectCurrentLang = createSelector([selectLangState], (lang) => lang.result);
export const selectLangCode = createSelector([selectLangState], (lang) => lang.langCode);

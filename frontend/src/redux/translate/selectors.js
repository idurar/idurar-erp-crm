import { createSelector } from 'reselect';

export const selectLangState = (state) => state.translate;

export const selectCurrentLang = createSelector([selectLangState], (translate) => translate.result);
export const selectLangCode = createSelector([selectLangState], (translate) => translate.langCode);

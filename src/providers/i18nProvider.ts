import polyglotI18nProvider from "ra-i18n-polyglot";
import spanishMessages from "./languages/spanishLanguage.ts";

export const i18nProvider = polyglotI18nProvider(() => spanishMessages, "es");

import polyglotI18nProvider from "ra-i18n-polyglot";
import spanishMessages from "./languages/spanishLanguage.ts";

export default polyglotI18nProvider(() => spanishMessages, "es");

/* Flexstad language picker: the pages are written in Dutch, every other language is
   translated by Google Translate only after a visitor picks it. */
window.LangPickerConfig = {
  pageLanguages: [
    { code: 'nl', name: 'Nederlands', flag: 'nl', prefix: '' }
  ],
  machine: ['en', 'de', 'fr', 'es', 'pt', 'it', 'pl', 'tr', 'ar', 'ru', 'zh-CN', 'ja', 'el'],
  labels: {
    nl: { choose: 'Taal kiezen', list: 'Talen', other: 'Automatisch vertaald met Google Translate' },
    en: { choose: 'Choose language', list: 'Languages', other: 'Automatically translated with Google Translate' }
  },
  mount: { selector: '.lp-host', position: 'append' },
  align: 'right'
};

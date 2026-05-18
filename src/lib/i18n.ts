interface Dictionary {
  introTitle: string
  introBio: string
  introSubtitle: string
  projectsTitle: string
  projectsSubtitle: string
  contactTitle: string
  contactSubtitle: string
}

const dictionaries = {
  en: {
    introTitle: 'Hello',
    introBio: 'I am Andy, a programmer and gamer.',
    introSubtitle: '',
    projectsTitle: 'Projects',
    projectsSubtitle: 'Recent work and experiments rendered from project data.',
    contactTitle: 'Contact & Legacy',
    contactSubtitle: 'Get in touch and browse older mini-game experiments.'
  }
} satisfies Record<string, Dictionary>

export type LanguageCode = keyof typeof dictionaries

export function t(language: LanguageCode = 'en'): Dictionary {
  return dictionaries[language]
}

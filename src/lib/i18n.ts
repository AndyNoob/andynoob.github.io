export type LanguageCode = 'en'

interface Dictionary {
  introTitle: string
  introBio: string
  introSubtitle: string
  projectsTitle: string
  projectsSubtitle: string
  contactTitle: string
  contactSubtitle: string
}

const dictionaries: Record<LanguageCode, Dictionary> = {
  en: {
    introTitle: 'Hello',
    introBio: 'I am Andy, a programmer and gamer.',
    introSubtitle: 'Welcome to my corner of the internet.',
    projectsTitle: 'Projects',
    projectsSubtitle: 'Recent work and experiments rendered from project data.',
    contactTitle: 'Contact & Legacy',
    contactSubtitle: 'Get in touch and browse older mini-game experiments.'
  }
}

export function t(language: LanguageCode = 'en'): Dictionary {
  return dictionaries[language]
}

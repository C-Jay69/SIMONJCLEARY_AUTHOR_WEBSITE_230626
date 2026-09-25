"use client";

import * as React from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// ─────────────────────────────────────────────────────────────────────
// Languages
// ─────────────────────────────────────────────────────────────────────

export type Lang = "en" | "es" | "fr" | "zh";

export const LANGUAGES: { code: Lang; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "EN" },
  { code: "es", label: "Español", flag: "ES" },
  { code: "fr", label: "Français", flag: "FR" },
  { code: "zh", label: "简体中文", flag: "中" },
];

// ─────────────────────────────────────────────────────────────────────
// Dictionary
// ─────────────────────────────────────────────────────────────────────

type Dict = Record<string, string>;

const en: Dict = {
  // Header / nav
  "nav.novels": "Novels",
  "nav.about": "About",
  "nav.journal": "Journal",
  "nav.events": "Events",
  "nav.podcast": "Podcast",
  "nav.freeChapter": "Free Chapter",
  "nav.menu": "Menu",
  "nav.readChapterFree": "Read Chapter 1 free",
  "nav.noSpam": "No spam · Unsubscribe anytime",
  "nav.newsletter": "Newsletter",
  "nav.contact": "Contact",
  "nav.shatteredCity": "The Shattered City",
  "nav.ghostsInTheAsh": "Ghosts in the Ash",
  "nav.new": "New",

  // Hero
  "hero.eyebrow": "// AUTHOR · NOVELIST",
  "hero.comingSoon": "Explore the novels",
  "hero.readChapterFree": "Read Chapter 1 free",
  "hero.seriesTag": "Irish-born · Thrillers about the machinery underneath",
  "hero.fileTag": "FILE 001 · DUKE SAVAGE · DEBUT",

  // Books
  "books.eyebrow": "// THE NOVELS",
  "books.title": "The Novels",
  "books.intro": "Two worlds to enter: the Duke Savage trilogy, and the science-fantasy second novel.",
  "books.new": "NEW",
  "books.forthcoming": "FORTHCOMING",
  "books.book": "Book",
  "books.comingSoon": "Coming soon",
  "books.notifyMe": "Notify me",
  "books.readNovel": "Read the novel",
  "books.readChapter": "Read Chapter 1 free",
  "books.buyDirect": "Buy the book",
  "books.buying": "Redirecting to checkout…",
  "books.buyError": "Couldn't start checkout. Please try again.",

  // About
  "about.eyebrow": "// ABOUT THE AUTHOR",
  "about.title": "Irish-born. Los Angeles-set. Writing the system.",
  "about.intro": "A debut novelist exploring how power learns to be invisible.",
  "about.born": "Born",
  "about.background": "Background",
  "about.debut": "Debut",
  "about.series": "Series",
  "about.setting": "Setting",
  "about.caption": "Simon J Cleary · Author photo",
  "about.bornValue": "Ireland",
  "about.backgroundValue": "Writer & entrepreneur",
  "about.debutValue": "Ghosts in the Ash — 27 drafts",
  "about.seriesValue": "The Duke Savage Trilogy",
  "about.settingValue": "Los Angeles · Baltimore · Arlington",

  // Excerpt
  "excerpt.eyebrow": "// PROLOGUE · OMAHA, 1999",
  "excerpt.title": "The prologue from Ghosts in the Ash",
  "excerpt.intro": "The origin of everything that follows. The lamp that never goes out.",
  "excerpt.cta": "The rest of the prologue and the opening chapters live in the book.",
  "excerpt.button": "Keep reading",

  // Case file
  "casefile.eyebrow": "// CASE FILE 001",
  "casefile.intro": "A working dossier on the investigator at the center of the trilogy. Compiled from case files, bar napkins, and the occasional 3 a.m. phone call.",
  "casefile.confidential": "Confidential",
  "casefile.pi": "Private Investigator",
  "casefile.subjectProfile": "Subject Profile",
  "casefile.fileTag": "FILE 001 · SAVAGE",
  "casefile.name": "Name",
  "casefile.age": "Age",
  "casefile.formerly": "Formerly",
  "casefile.now": "Now",
  "casefile.broke": "What broke him",
  "casefile.kryptonite": "Kryptonite",
  "casefile.motivation": "Motivation",
  "casefile.voice": "Voice",
  "casefile.theCase": "The case",
  "casefile.territory": "The Territory",
  "casefile.territoryIntro": "Locations featured across the trilogy. A mechanism that runs from a desk in the Arts District to a footnote in a federal policy report.",
  "casefile.updated": "Updated",
  "casefile.status": "Status",
  "casefile.active": "Active",

  // Podcast
  "podcast.eyebrow": "// THE DISPATCH · AUDIO",
  "podcast.title": "The Podcast",
  "podcast.intro": "Conversations on craft, the system, and what the city won't say out loud. Hosted by Simon J. Cleary.",
  "podcast.episode": "Episode",
  "podcast.latest": "Latest",
  "podcast.comingSoon": "Coming soon.",
  "podcast.comingSoonDesc": "Episodes will appear here as they are published. Join the dispatch below to be notified when the first one drops.",

  // Events
  "events.eyebrow": "// APPEARANCES",
  "events.title": "Events",
  "events.intro": "Readings, panels, and the occasional workshop. To be announced.",
  "events.upcoming": "Upcoming",
  "events.past": "Past",
  "events.tba": "T.B.A.",
  "events.tbaDesc": "Appearances, readings, and festival dates for the Ghosts in the Ash launch will be posted here as they are confirmed. Join the dispatch below to be the first to know.",
  "events.upcomingTba": "Upcoming · T.B.A.",
  "events.upcomingTbaDesc": "New appearances will be posted here as they are confirmed.",

  // Journal
  "journal.eyebrow": "// THE DISPATCH",
  "journal.title": "Journal",
  "journal.intro": "Notes on craft, the writing life, and what the system is doing now. Sporadic. No spam.",
  "journal.minRead": "MIN READ",

  // Newsletter
  "newsletter.title": "Read the opening of Ghosts in the Ash — free.",
  "newsletter.intro": "Plus The Savage Dispatch, a sporadic letter from Simon on craft, the writing life, and what the system is doing now. No spam. Unsubscribe anytime.",
  "newsletter.name": "NAME (OPTIONAL)",
  "newsletter.email": "EMAIL *",
  "newsletter.namePlaceholder": "Savage, Duke (allegedly)",
  "newsletter.button": "Send me the opening",
  "newsletter.sending": "Sending…",
  "newsletter.success": "Check your inbox",
  "newsletter.successDesc": "The opening of Ghosts in the Ash is on its way. Look for a message from Simon in the next few minutes.",
  "newsletter.sendAnother": "Send another",
  "newsletter.emailRequired": "Email is required",
  "newsletter.emailRequiredDesc": "We need somewhere to send the opening.",
  "newsletter.emailInvalid": "That email doesn't look right",
  "newsletter.emailInvalidDesc": "Try again — we promise not to share it.",
  "newsletter.whatYouGet.opening": "The complete opening of Ghosts in the Ash, as a PDF.",
  "newsletter.whatYouGet.dispatch": "The Savage Dispatch — a sporadic letter from Simon on craft and the writing life.",
  "newsletter.whatYouGet.signed": "First crack at signed-copy drops and tour dates.",

  // Contact
  "contact.title": "Get in touch",
  "contact.intro": "For press, rights, events, or just to say hello.",
  "contact.name": "NAME *",
  "contact.email": "EMAIL *",
  "contact.subject": "SUBJECT",
  "contact.message": "MESSAGE",
  "contact.button": "Send message",
  "contact.sending": "Sending…",
  "contact.success": "Message received",
  "contact.successDesc": "Simon reads everything, replies to most.",
  "contact.error": "Something went wrong",
  "contact.errorDesc": "Please try again in a moment.",

  // Footer
  "footer.tagline": "Literary crime. The system as a weapon.",
  "footer.bio": "The Duke Savage trilogy. Los Angeles, Baltimore, Arlington — and the mechanism that learns to hide.",
  "footer.index": "// Index",
  "footer.elsewhere": "// Elsewhere",
  "footer.copyright": "Site set in Fraunces & Inter",
  "footer.madeWith": "Made with rain and ash.",
  "footer.admin": "Admin",

  // Theme toggle
  "theme.toLight": "Switch to light (paper) theme",
  "theme.toDark": "Switch to dark (noir) theme",

  // Language
  "lang.label": "Language",
  "lang.switch": "Switch language",
};

const es: Dict = {
  // Header / nav
  "nav.novels": "Novelas",
  "nav.about": "Biografía",
  "nav.journal": "Diario",
  "nav.events": "Eventos",
  "nav.podcast": "Podcast",
  "nav.freeChapter": "Capítulo gratis",
  "nav.menu": "Menú",
  "nav.readChapterFree": "Lee el capítulo 1 gratis",
  "nav.noSpam": "Nada de spam · Cancela cuando quieras",
  "nav.newsletter": "Boletín",
  "nav.contact": "Contacto",
  "nav.shatteredCity": "The Shattered City",
  "nav.ghostsInTheAsh": "Ghosts in the Ash",
  "nav.new": "Nuevo",

  // Hero
  "hero.eyebrow": "// AUTOR · NOVELISTA",
  "hero.comingSoon": "Explora las novelas",
  "hero.readChapterFree": "Lee el capítulo 1 gratis",
  "hero.seriesTag": "Nacido en Irlanda · Thrillers sobre la maquinaria invisible",
  "hero.fileTag": "EXPEDIENTE 001 · DUKE SAVAGE · DEBUT",

  // Books
  "books.eyebrow": "// LAS NOVELAS",
  "books.title": "Las novelas",
  "books.intro": "Dos mundos a los que entrar: la trilogía de Duke Savage y la ciencia-fantasía de la segunda novela.",
  "books.new": "NUEVO",
  "books.forthcoming": "PRÓXIMAMENTE",
  "books.book": "Libro",
  "books.comingSoon": "Próximamente",
  "books.notifyMe": "Avísame",
  "books.readNovel": "Leer la novela",
  "books.readChapter": "Lee el capítulo 1 gratis",
  "books.buyDirect": "Comprar el libro",
  "books.buying": "Redirigiendo al pago…",
  "books.buyError": "No se pudo iniciar el pago. Inténtalo de nuevo.",

  // About
  "about.eyebrow": "// SOBRE EL AUTOR",
  "about.title": "Nacido en Irlanda. Ambientada en Los Ángeles. Escribiendo el sistema.",
  "about.intro": "Un novelista debut que explora cómo el poder aprende a hacerse invisible.",
  "about.born": "Nacido en",
  "about.background": "Formación",
  "about.debut": "Debut",
  "about.series": "Serie",
  "about.setting": "Ambientación",
  "about.caption": "Simon J Cleary · Foto del autor",
  "about.bornValue": "Irlanda",
  "about.backgroundValue": "Escritor y empresario",
  "about.debutValue": "Ghosts in the Ash — 27 borradores",
  "about.seriesValue": "La trilogía de Duke Savage",
  "about.settingValue": "Los Ángeles · Baltimore · Arlington",

  // Excerpt
  "excerpt.eyebrow": "// PRÓLOGO · OMAHA, 1999",
  "excerpt.title": "El prólogo de Ghosts in the Ash",
  "excerpt.intro": "El origen de todo lo que sigue. La lámpara que nunca se apaga.",
  "excerpt.cta": "El resto del prólogo y los primeros capítulos están en el libro.",
  "excerpt.button": "Seguir leyendo",

  // Case file
  "casefile.eyebrow": "// EXPEDIENTE 001",
  "casefile.intro": "Un dosier de trabajo sobre el investigador en el centro de la trilogía. Recopilado a partir de archivos, servilletas de bar y alguna que otra llamada a las 3 de la madrugada.",
  "casefile.confidential": "Confidencial",
  "casefile.pi": "Investigador privado",
  "casefile.subjectProfile": "Perfil del sujeto",
  "casefile.fileTag": "EXPEDIENTE 001 · SAVAGE",
  "casefile.name": "Nombre",
  "casefile.age": "Edad",
  "casefile.formerly": "Anteriormente",
  "casefile.now": "Ahora",
  "casefile.broke": "Lo que lo quebró",
  "casefile.kryptonite": "Kryptonita",
  "casefile.motivation": "Motivación",
  "casefile.voice": "Voz",
  "casefile.theCase": "El caso",
  "casefile.territory": "El territorio",
  "casefile.territoryIntro": "Localizaciones destacadas en la trilogía. Un mecanismo que va de un escritorio en el Arts District a una nota al pie en un informe de política federal.",
  "casefile.updated": "Actualizado",
  "casefile.status": "Estado",
  "casefile.active": "Activo",

  // Podcast
  "podcast.eyebrow": "// EL DISPATCH · AUDIO",
  "podcast.title": "El pódcast",
  "podcast.intro": "Conversaciones sobre el oficio, el sistema y lo que la ciudad no dice en voz alta. Presentado por Simon J. Cleary.",
  "podcast.episode": "Episodio",
  "podcast.latest": "Último",
  "podcast.comingSoon": "Próximamente.",
  "podcast.comingSoonDesc": "Los episodios aparecerán aquí a medida que se publiquen. Únete al dispatch para ser el primero en saber cuándo sale el primero.",

  // Events
  "events.eyebrow": "// APARICIONES",
  "events.title": "Eventos",
  "events.intro": "Lecturas, paneles y algún que otro taller. Por anunciar.",
  "events.upcoming": "Próximos",
  "events.past": "Pasados",
  "events.tba": "P. A. C.",
  "events.tbaDesc": "Las apariciones, lecturas y fechas de festivales para el lanzamiento de Ghosts in the Ash se publicarán aquí a medida que se confirmen. Únete al dispatch para ser el primero en saberlo.",
  "events.upcomingTba": "Próximos · P. A. C.",
  "events.upcomingTbaDesc": "Las nuevas apariciones se publicarán aquí a medida que se confirmen.",

  // Journal
  "journal.eyebrow": "// EL DISPATCH",
  "journal.title": "Diario",
  "journal.intro": "Notas sobre el oficio, la vida de escritor y lo que hace ahora el sistema. Esporádico. Nada de spam.",
  "journal.minRead": "MIN DE LECTURA",

  // Newsletter
  "newsletter.title": "Lee el inicio de Ghosts in the Ash — gratis.",
  "newsletter.intro": "Además, The Savage Dispatch, una carta esporádica de Simon sobre el oficio, la vida de escritor y lo que hace ahora el sistema. Nada de spam. Cancela cuando quieras.",
  "newsletter.name": "NOMBRE (OPCIONAL)",
  "newsletter.email": "CORREO *",
  "newsletter.namePlaceholder": "Savage, Duke (presuntamente)",
  "newsletter.button": "Envíenme el inicio",
  "newsletter.sending": "Enviando…",
  "newsletter.success": "Revisa tu bandeja de entrada",
  "newsletter.successDesc": "El inicio de Ghosts in the Ash va de camino. Busca un mensaje de Simon en los próximos minutos.",
  "newsletter.sendAnother": "Enviar otro",
  "newsletter.emailRequired": "El correo es obligatorio",
  "newsletter.emailRequiredDesc": "Necesitamos un lugar donde enviar el inicio.",
  "newsletter.emailInvalid": "Ese correo no parece correcto",
  "newsletter.emailInvalidDesc": "Inténtalo de nuevo — prometemos no compartirlo.",
  "newsletter.whatYouGet.opening": "El inicio completo de Ghosts in the Ash, en PDF.",
  "newsletter.whatYouGet.dispatch": "The Savage Dispatch — una carta esporádica de Simon sobre el oficio y la vida de escritor.",
  "newsletter.whatYouGet.signed": "Primer acceso a copias firmadas y fechas de gira.",

  // Contact
  "contact.title": "Ponte en contacto",
  "contact.intro": "Para prensa, derechos, eventos o simplemente para saludar.",
  "contact.name": "NOMBRE *",
  "contact.email": "CORREO *",
  "contact.subject": "ASUNTO",
  "contact.message": "MENSAJE",
  "contact.button": "Enviar mensaje",
  "contact.sending": "Enviando…",
  "contact.success": "Mensaje recibido",
  "contact.successDesc": "Simon lo lee todo, responde a la mayoría.",
  "contact.error": "Algo salió mal",
  "contact.errorDesc": "Por favor, inténtalo de nuevo en un momento.",

  // Footer
  "footer.tagline": "Novela negra literaria. El sistema como arma.",
  "footer.bio": "La trilogía de Duke Savage. Los Ángeles, Baltimore, Arlington — y el mecanismo que aprende a ocultarse.",
  "footer.index": "// Índice",
  "footer.elsewhere": "// En otros sitios",
  "footer.copyright": "Sitio en Fraunces e Inter",
  "footer.madeWith": "Hecho con lluvia y ceniza.",
  "footer.admin": "Admin",

  // Theme toggle
  "theme.toLight": "Cambiar a tema claro (papel)",
  "theme.toDark": "Cambiar a tema oscuro (noir)",

  // Language
  "lang.label": "Idioma",
  "lang.switch": "Cambiar idioma",
};

const fr: Dict = {
  // Header / nav
  "nav.novels": "Romans",
  "nav.about": "Biographie",
  "nav.journal": "Journal",
  "nav.events": "Événements",
  "nav.podcast": "Podcast",
  "nav.freeChapter": "Chapitre gratuit",
  "nav.menu": "Menu",
  "nav.readChapterFree": "Lire le chapitre 1 gratuitement",
  "nav.noSpam": "Pas de spam · Désabonnement à tout moment",
  "nav.newsletter": "Newsletter",
  "nav.contact": "Contact",
  "nav.shatteredCity": "The Shattered City",
  "nav.ghostsInTheAsh": "Ghosts in the Ash",
  "nav.new": "Nouveau",

  // Hero
  "hero.eyebrow": "// ROMANCIER",
  "hero.comingSoon": "Découvrir les romans",
  "hero.readChapterFree": "Lire le chapitre 1 gratuitement",
  "hero.seriesTag": "Né en Irlande · Des thrillers sur la machinerie invisible",
  "hero.fileTag": "DOSSIER 001 · DUKE SAVAGE · PREMIER ROMAN",

  // Books
  "books.eyebrow": "// LES ROMANS",
  "books.title": "Les romans",
  "books.intro": "Deux mondes où entrer : la trilogie Duke Savage et le second roman de science-fantasy.",
  "books.new": "NOUVEAU",
  "books.forthcoming": "À PARAÎTRE",
  "books.book": "Livre",
  "books.comingSoon": "Bientôt disponible",
  "books.notifyMe": "Prévenez-moi",
  "books.readNovel": "Lire le roman",
  "books.readChapter": "Lire le chapitre 1 gratuitement",
  "books.buyDirect": "Acheter le livre",
  "books.buying": "Redirection vers le paiement…",
  "books.buyError": "Impossible de lancer le paiement. Réessayez.",

  // About
  "about.eyebrow": "// L'AUTEUR",
  "about.title": "Né en Irlande. L'action à Los Angeles. Écrire le système.",
  "about.intro": "Un romancier du premier roman qui explore comment le pouvoir apprend à devenir invisible.",
  "about.born": "Né en",
  "about.background": "Parcours",
  "about.debut": "Premier roman",
  "about.series": "Série",
  "about.setting": "Décors",
  "about.caption": "Simon J Cleary · Photo de l'auteur",
  "about.bornValue": "Irlande",
  "about.backgroundValue": "Écrivain et entrepreneur",
  "about.debutValue": "Ghosts in the Ash — 27 versions",
  "about.seriesValue": "La trilogie Duke Savage",
  "about.settingValue": "Los Angeles · Baltimore · Arlington",

  // Excerpt
  "excerpt.eyebrow": "// PROLOGUE · OMAHA, 1999",
  "excerpt.title": "Le prologue de Ghosts in the Ash",
  "excerpt.intro": "L'origine de tout ce qui suit. La lampe qui ne s'éteint jamais.",
  "excerpt.cta": "Le reste du prologue et les premiers chapitres sont dans le livre.",
  "excerpt.button": "Continuer la lecture",

  // Case file
  "casefile.eyebrow": "// DOSSIER 001",
  "casefile.intro": "Un dossier de travail sur l'enquêteur au cœur de la trilogie. Compilé à partir de dossiers, de serviettes de bar et de quelques appels à 3 heures du matin.",
  "casefile.confidential": "Confidentiel",
  "casefile.pi": "Détective privé",
  "casefile.subjectProfile": "Profil du sujet",
  "casefile.fileTag": "DOSSIER 001 · SAVAGE",
  "casefile.name": "Nom",
  "casefile.age": "Âge",
  "casefile.formerly": "Auparavant",
  "casefile.now": "Actuellement",
  "casefile.broke": "Ce qui l'a brisé",
  "casefile.kryptonite": "Kryptonite",
  "casefile.motivation": "Motivation",
  "casefile.voice": "Voix",
  "casefile.theCase": "L'affaire",
  "casefile.territory": "Le territoire",
  "casefile.territoryIntro": "Lieux emblématiques de la trilogie. Un mécanisme qui va d'un bureau du Arts District à une note de bas de page dans un rapport de politique fédérale.",
  "casefile.updated": "Mis à jour",
  "casefile.status": "Statut",
  "casefile.active": "Actif",

  // Podcast
  "podcast.eyebrow": "// LE DISPATCH · AUDIO",
  "podcast.title": "Le podcast",
  "podcast.intro": "Conversations sur l'art, le système et ce que la ville ne dit pas à voix haute. Présenté par Simon J. Cleary.",
  "podcast.episode": "Épisode",
  "podcast.latest": "Dernier",
  "podcast.comingSoon": "Bientôt disponible.",
  "podcast.comingSoonDesc": "Les épisodes apparaîtront ici au fur et à mesure de leur publication. Inscrivez-vous au dispatch pour être averti de la sortie du premier.",

  // Events
  "events.eyebrow": "// APPARITIONS",
  "events.title": "Événements",
  "events.intro": "Lectures, tables rondes et quelques ateliers. À annoncer.",
  "events.upcoming": "À venir",
  "events.past": "Passés",
  "events.tba": "À annoncer",
  "events.tbaDesc": "Les apparitions, lectures et dates de festivals pour le lancement de Ghosts in the Ash seront publiées ici au fur et à mesure de leur confirmation. Inscrivez-vous au dispatch pour être le premier informé.",
  "events.upcomingTba": "À venir · À annoncer",
  "events.upcomingTbaDesc": "Les nouvelles apparitions seront publiées ici au fur et à mesure de leur confirmation.",

  // Journal
  "journal.eyebrow": "// LE DISPATCH",
  "journal.title": "Journal",
  "journal.intro": "Notes sur l'art, la vie d'écrivain et ce que fait le système maintenant. Sporadique. Pas de spam.",
  "journal.minRead": "MIN DE LECTURE",

  // Newsletter
  "newsletter.title": "Lire le début de Ghosts in the Ash — gratuitement.",
  "newsletter.intro": "Plus The Savage Dispatch, une lettre sporadique de Simon sur l'art, la vie d'écrivain et ce que fait le système maintenant. Pas de spam. Désabonnement à tout moment.",
  "newsletter.name": "NOM (FACULTATIF)",
  "newsletter.email": "E-MAIL *",
  "newsletter.namePlaceholder": "Savage, Duke (soi-disant)",
  "newsletter.button": "Envoyez-moi le début",
  "newsletter.sending": "Envoi…",
  "newsletter.success": "Vérifiez votre boîte de réception",
  "newsletter.successDesc": "Le début de Ghosts in the Ash est en route. Cherchez un message de Simon dans les prochaines minutes.",
  "newsletter.sendAnother": "En envoyer un autre",
  "newsletter.emailRequired": "L'e-mail est requis",
  "newsletter.emailRequiredDesc": "Nous avons besoin d'un endroit où envoyer le début.",
  "newsletter.emailInvalid": "Cet e-mail n'a pas l'air correct",
  "newsletter.emailInvalidDesc": "Réessayez — nous promettons de ne pas le partager.",
  "newsletter.whatYouGet.opening": "Le début complet de Ghosts in the Ash, en PDF.",
  "newsletter.whatYouGet.dispatch": "The Savage Dispatch — une lettre sporadique de Simon sur l'art et la vie d'écrivain.",
  "newsletter.whatYouGet.signed": "Accès en avant-première aux exemplaires dédicacés et aux dates de tournée.",

  // Contact
  "contact.title": "Prendre contact",
  "contact.intro": "Pour la presse, les droits, les événements ou simplement pour dire bonjour.",
  "contact.name": "NOM *",
  "contact.email": "E-MAIL *",
  "contact.subject": "SUJET",
  "contact.message": "MESSAGE",
  "contact.button": "Envoyer le message",
  "contact.sending": "Envoi…",
  "contact.success": "Message reçu",
  "contact.successDesc": "Simon lit tout, répond à la plupart.",
  "contact.error": "Une erreur s'est produite",
  "contact.errorDesc": "Veuillez réessayer dans un instant.",

  // Footer
  "footer.tagline": "Roman noir littéraire. Le système comme arme.",
  "footer.bio": "La trilogie Duke Savage. Los Angeles, Baltimore, Arlington — et le mécanisme qui apprend à se cacher.",
  "footer.index": "// Index",
  "footer.elsewhere": "// Ailleurs",
  "footer.copyright": "Site en Fraunces et Inter",
  "footer.madeWith": "Fait avec de la pluie et des cendres.",
  "footer.admin": "Admin",

  // Theme toggle
  "theme.toLight": "Passer au thème clair (papier)",
  "theme.toDark": "Passer au thème sombre (noir)",

  // Language
  "lang.label": "Langue",
  "lang.switch": "Changer de langue",
};

const zh: Dict = {
  // Header / nav
  "nav.novels": "小说",
  "nav.about": "作者",
  "nav.journal": "手记",
  "nav.events": "活动",
  "nav.podcast": "播客",
  "nav.freeChapter": "免费章节",
  "nav.menu": "菜单",
  "nav.readChapterFree": "免费阅读第一章",
  "nav.noSpam": "不发垃圾邮件 · 随时取消订阅",
  "nav.newsletter": "订阅",
  "nav.contact": "联系",
  "nav.shatteredCity": "破碎之城",
  "nav.ghostsInTheAsh": "Ghosts in the Ash",
  "nav.new": "新",

  // Hero
  "hero.eyebrow": "// 作者 · 小说家",
  "hero.comingSoon": "浏览小说",
  "hero.readChapterFree": "免费阅读第一章",
  "hero.seriesTag": "生于爱尔兰 · 关于隐形机器的惊悚小说",
  "hero.fileTag": "档案 001 · 杜克·萨维奇 · 处女作",

  // Books
  "books.eyebrow": "// 小说",
  "books.title": "小说",
  "books.intro": "两个可供沉浸的世界：杜克·萨维奇三部曲，以及第二部科学奇幻小说。",
  "books.new": "新作",
  "books.forthcoming": "即将出版",
  "books.book": "第",
  "books.comingSoon": "即将上市",
  "books.notifyMe": "到货通知",
  "books.readNovel": "阅读小说",
  "books.readChapter": "免费阅读第一章",
  "books.buyDirect": "购买本书",
  "books.buying": "正在跳转至结账…",
  "books.buyError": "无法开始结账，请重试。",

  // About
  "about.eyebrow": "// 关于作者",
  "about.title": "生于爱尔兰。以洛杉矶为背景。书写体制。",
  "about.intro": "一位探索权力如何学会隐形的处女作小说家。",
  "about.born": "出生地",
  "about.background": "背景",
  "about.debut": "处女作",
  "about.series": "系列",
  "about.setting": "背景地",
  "about.caption": "西蒙·J·克莱瑞 · 作者照片",
  "about.bornValue": "爱尔兰",
  "about.backgroundValue": "作家与企业家",
  "about.debutValue": "《Ghosts in the Ash》—— 27 稿",
  "about.seriesValue": "杜克·萨维奇三部曲",
  "about.settingValue": "洛杉矶 · 巴尔的摩 · 阿灵顿",

  // Excerpt
  "excerpt.eyebrow": "// 序章 · 奥马哈，1999",
  "excerpt.title": "《Ghosts in the Ash》序章",
  "excerpt.intro": "一切后续的起源。那盏永不熄灭的灯。",
  "excerpt.cta": "序章其余部分与开篇章节都在书中。",
  "excerpt.button": "继续阅读",

  // Case file
  "casefile.eyebrow": "// 档案 001",
  "casefile.intro": "三部曲核心调查者的工作档案。取材自案件卷宗、酒吧餐巾纸，以及偶尔凌晨三点的电话。",
  "casefile.confidential": "机密",
  "casefile.pi": "私家侦探",
  "casefile.subjectProfile": "目标档案",
  "casefile.fileTag": "档案 001 · 萨维奇",
  "casefile.name": "姓名",
  "casefile.age": "年龄",
  "casefile.formerly": "曾任",
  "casefile.now": "现状",
  "casefile.broke": "击垮他的事",
  "casefile.kryptonite": "克星",
  "casefile.motivation": "动机",
  "casefile.voice": "声音",
  "casefile.theCase": "案件",
  "casefile.territory": "活动范围",
  "casefile.territoryIntro": "三部曲中出现的主要地点。一个从艺术区办公桌延伸到联邦政策报告脚注的机制。",
  "casefile.updated": "更新于",
  "casefile.status": "状态",
  "casefile.active": "活跃",

  // Podcast
  "podcast.eyebrow": "// 来信 · 音频",
  "podcast.title": "播客",
  "podcast.intro": "关于技艺、体制，以及这座城市不愿说出口之事的对话。由西蒙·J·克莱瑞主持。",
  "podcast.episode": "第",
  "podcast.latest": "最新",
  "podcast.comingSoon": "即将上线。",
  "podcast.comingSoonDesc": "节目将在发布后显示于此。订阅下方来信，第一时间获知首期上线。",

  // Events
  "events.eyebrow": "// 露面",
  "events.title": "活动",
  "events.intro": "朗读会、座谈，以及偶尔的工作坊。待公布。",
  "events.upcoming": "即将",
  "events.past": "已过",
  "events.tba": "待定",
  "events.tbaDesc": "《Ghosts in the Ash》新书发布的露面、朗读及文学节日期将在确认后公布于此。订阅下方来信，第一时间获知。",
  "events.upcomingTba": "即将 · 待定",
  "events.upcomingTbaDesc": "新的活动安排将在确认后公布于此。",

  // Journal
  "journal.eyebrow": "// 来信",
  "journal.title": "手记",
  "journal.intro": "关于技艺、写作生涯，以及体制当下的所作所为的笔记。不定期。不发垃圾邮件。",
  "journal.minRead": "分钟阅读",

  // Newsletter
  "newsletter.title": "免费阅读《Ghosts in the Ash》开篇。",
  "newsletter.intro": "另有 The Savage Dispatch，西蒙不定期寄出的信件，谈技艺、写作生涯，以及体制当下的动态。不发垃圾邮件。随时取消订阅。",
  "newsletter.name": "姓名（选填）",
  "newsletter.email": "邮箱 *",
  "newsletter.namePlaceholder": "萨维奇，杜克（据说）",
  "newsletter.button": "把开篇发给我",
  "newsletter.sending": "发送中…",
  "newsletter.success": "请查收邮箱",
  "newsletter.successDesc": "《Ghosts in the Ash》的开篇已在路上。几分钟后留意西蒙的邮件。",
  "newsletter.sendAnother": "再发一封",
  "newsletter.emailRequired": "邮箱为必填项",
  "newsletter.emailRequiredDesc": "我们需要一个地址来发送开篇。",
  "newsletter.emailInvalid": "这个邮箱看起来不对",
  "newsletter.emailInvalidDesc": "再试一次 —— 我们保证不外泄。",
  "newsletter.whatYouGet.opening": "《Ghosts in the Ash》完整开篇，PDF 格式。",
  "newsletter.whatYouGet.dispatch": "The Savage Dispatch —— 西蒙不定期寄出的信件，谈技艺与写作生涯。",
  "newsletter.whatYouGet.signed": "优先获得签名版上架与巡回活动信息。",

  // Contact
  "contact.title": "联系",
  "contact.intro": "媒体、版权、活动，或只是想打个招呼。",
  "contact.name": "姓名 *",
  "contact.email": "邮箱 *",
  "contact.subject": "主题",
  "contact.message": "留言",
  "contact.button": "发送留言",
  "contact.sending": "发送中…",
  "contact.success": "留言已收到",
  "contact.successDesc": "西蒙每封必读，大部分会回复。",
  "contact.error": "出了点问题",
  "contact.errorDesc": "请稍后重试。",

  // Footer
  "footer.tagline": "文学犯罪小说。体制即武器。",
  "footer.bio": "杜克·萨维奇三部曲。洛杉矶、巴尔的摩、阿灵顿 —— 以及学会隐匿的机制。",
  "footer.index": "// 目录",
  "footer.elsewhere": "// 其他平台",
  "footer.copyright": "本站使用 Fraunces 与 Inter 字体",
  "footer.madeWith": "以雨与灰烬铸成。",
  "footer.admin": "管理",

  // Theme toggle
  "theme.toLight": "切换至浅色（纸张）主题",
  "theme.toDark": "切换至深色（黑色电影）主题",

  // Language
  "lang.label": "语言",
  "lang.switch": "切换语言",
};

const DICTS: Record<Lang, Dict> = { en, es, fr, zh };

// ─────────────────────────────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────────────────────────────
// IMPORTANT: `skipHydration: true` prevents Zustand from reading
// localStorage synchronously during the client's first render. Without
// this, the server renders "en" but the client hydrates with the stored
// language (e.g. "es"), causing a hydration mismatch. We manually
// rehydrate after mount via the useT hook's mounted guard.
// ─────────────────────────────────────────────────────────────────────

type LangState = {
  lang: Lang;
  _hydrated: boolean;
  setLang: (l: Lang) => void;
  _setHydrated: () => void;
};

export const useLangStore = create<LangState>()(
  persist(
    (set) => ({
      lang: "en",
      _hydrated: false,
      setLang: (lang) => set({ lang }),
      _setHydrated: () => set({ _hydrated: true }),
    }),
    {
      name: "sjc-lang",
      skipHydration: true,
      onRehydrateStorage: () => (state) => {
        state?._setHydrated();
      },
    }
  )
);

// ─────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────
// useT returns English until the store has rehydrated from localStorage
// (after mount). This guarantees server and first-client-render both
// produce identical English text, eliminating hydration mismatches.

export function useT() {
  const lang = useLangStore((s) => s.lang);
  const hydrated = useLangStore((s) => s._hydrated);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // Rehydrate from localStorage on mount (client-only).
    useLangStore.persist.rehydrate();
    setMounted(true);
  }, []);

  const effectiveLang = mounted && hydrated ? lang : "en";
  return React.useCallback(
    (key: string): string => {
      const dict = DICTS[effectiveLang as Lang] ?? en;
      return dict[key] ?? en[key] ?? key;
    },
    [effectiveLang]
  );
}

export function useLang() {
  return useLangStore((s) => s.lang);
}

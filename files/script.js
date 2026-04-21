/**
 * ========================================
 * ANDREJ KNEISL — CAREER PORTFOLIO
 * script.js — Main JavaScript
 *
 * ========================================
 * ARCHITECTURE OVERVIEW:
 * ========================================
 *
 * [TRANSLATIONS]      → translations object (all UI text, 4 languages)
 *                       updateLanguage(lang) applies to entire app
 *
 * [PERSONAL INFO]     → defaultPersonalInfo + localStorage 'careerAppPersonalInfo'
 *                       loadPersonalInfo() / savePersonalInfo() / updatePersonalInfoDisplay()
 *
 * [SETTINGS]          → settings object + localStorage 'careerAppSettings'
 *                       loadSettings() / saveSettings() / applySettings()
 *
 * [PUBLIC/EDIT MODE]  → URL params: ?view=public&lang=en
 *                       checkURLParams() on init, togglePublicMode() manually
 *                       generatePublicLink() / copyPublicLink() in Settings
 *
 * [DATE/TIME]         → settings.dateTime object
 *                       formatDateTime() / updateTimestamps()
 *
 * [EXPORT/PRINT]      → exportCV()           → window.print() (active CV tab)
 *                       exportDeck()          → body.printing-deck class → all slides visible
 *                       exportCoverLetter()   → body.printing-cl class → cl-print-output div
 *
 * [COVER LETTER]      → coverLetterTemplates (4 langs × 3 tones)
 *                       generateCoverLetter() builds from template + form inputs
 * ========================================
 */

'use strict';

// ========================================
// PERSONAL INFORMATION
// Default values — editable in Settings → Personal Information
// Persisted in localStorage under 'careerAppPersonalInfo'
// ========================================
const defaultPersonalInfo = {
    fullName:       'Andrej Kneisl',
    primaryEmail:   'Kneisl.andrej@icloud.com',
    secondaryEmail: 'info@andykgroupinternational.com',
    phone:          '+44 330 027 1319',
    website:        'www.andykgroupinternational.com',
    location:       'Asunción, Paraguay',
    linkedin:       'linkedin.com/in/yourprofile',
    profilePhoto:   'images/profile.jpg'   // REPLACE: path to your headshot
};

// ========================================
// TRANSLATIONS
// All UI text in English, German, Slovak, Spanish.
// updateLanguage(lang) applies the selected language to the entire app.
// Keys follow the pattern: section.key (e.g. cv.summary, settings.language)
// ========================================
const translations = {

    // ── ENGLISH ──────────────────────────────────────────────────────────
    en: {
        header: {
            headline: 'Business Development Analyst | GTM Support | Commercial Operations'
        },
        tabs: {
            cv: 'CV',
            deck: 'Pitch Deck',
            coverLetter: 'Cover Letter',
            settings: 'Settings'
        },
        cv: {
            headline: 'Business Development Analyst | GTM Support | Commercial Operations',
            email: 'Email',
            secondaryEmail: 'Secondary Email',
            phone: 'Phone',
            linkedin: 'LinkedIn',
            website: 'Website',
            location: 'Location',
            exportPDF: 'Export CV to PDF',
            copySummary: 'Copy Summary',
            compactView: 'Compact View',
            fullWidthView: 'Full View',
            summary: 'Professional Summary',
            summaryText: 'Business development and commercial operations professional with experience across outbound execution, market segmentation, pipeline management, CRM workflow coordination, reporting, and commercial support. Strongest in the analytical and structured side of business development, including follow-up logic, messaging refinement, deal tracking, market insight, and process visibility. Experienced in supporting commercial activities across international markets with a disciplined, research-driven, and execution-focused approach. Comfortable using OpenAI tools to support research, drafting, information synthesis, and workflow efficiency. Currently seeking remote-friendly roles in business development operations, GTM support, sales operations, market research, or commercial strategy support.',
            strengths: 'Core Strengths',
            experience: 'Work Experience',
            education: 'Education',
            tools: 'Tools & AI Tools',
            languages: 'Languages',
            timestamp: 'Last updated: '
        },
        deck: {
            exportPDF: 'Export Deck to PDF',
            presentationMode: 'Presentation Mode',
            exitPresentation: 'Exit Presentation',
            headline: 'Business Development Analyst | GTM Support | Commercial Operations',
            coverSubtitle: 'Structured commercial support for international, remote-friendly teams.',
            coverIntro: 'Andrej Kneisl supports commercial teams and growing businesses through structured execution, market insight, CRM discipline, and multilingual communication. His strongest value lies in the analytical and operational side of business development, especially GTM support, market segmentation, pipeline visibility, reporting, and AI-assisted workflow support.',
            positioningTitle: 'Professional Positioning',
            positioningText: 'I support commercial teams and growing businesses through structured execution, market insight, and pipeline discipline. My strongest value lies in the analytical and operational side of business development — especially market segmentation, messaging logic, follow-up systems, CRM visibility, reporting, and process support across international markets.',
            whatIBringTitle: 'What I Bring',
            coreStrengthsTitle: 'Core Strengths',
            workStyleTitle: 'Work Style',
            idealRoleTitle: 'Ideal Role Fit',
            internationalTitle: 'International Advantage',
            internationalText: 'Multilingual profile with professional communication ability across German, Slovak, English, and Spanish contexts. Comfortable supporting commercial activities across international markets and multicultural environments.',
            contactTitle: 'Contact',
            timestamp: 'Generated: '
        },
        coverLetter: {
            generate: 'Generate Cover Letter',
            reset: 'Reset',
            copy: 'Copy Text',
            exportPDF: 'Export to PDF',
            companyName: 'Company Name',
            companyPlaceholder: 'e.g. TechCorp GmbH',
            roleTitle: 'Role Title',
            rolePlaceholder: 'e.g. Business Development Analyst',
            hiringManager: 'Hiring Manager Name',
            managerPlaceholder: 'e.g. Ms. Schmidt',
            jobSource: 'Job Source',
            sourcePlaceholder: 'e.g. LinkedIn',
            mainFocus: 'Main Focus of Role',
            focusPlaceholder: 'e.g. Market research and pipeline management',
            keySkills: 'Key Skills to Emphasize',
            skillsPlaceholder: 'e.g. CRM discipline, reporting, GTM support',
            language: 'Language',
            langEnglish: 'English',
            langGerman: 'German',
            langSlovak: 'Slovak',
            langSpanish: 'Spanish',
            tone: 'Tone',
            toneProfessional: 'Professional',
            toneWarm: 'Warm Professional',
            toneDirect: 'More Direct / Executive',
            preview: 'Preview',
            timestamp: 'Date: '
        },
        settings: {
            title: 'Settings',
            personalInfo: 'Personal Information',
            labelFullName: 'Full Name',
            labelPrimaryEmail: 'Primary Email',
            labelSecondaryEmail: 'Secondary Email',
            labelPhone: 'Phone',
            labelWebsite: 'Website',
            labelLocation: 'Location',
            labelLinkedIn: 'LinkedIn',
            labelPhoto: 'Profile Photo Path',
            photoHint: 'Recommended: 400×400px JPG, professional headshot',
            savePersonalInfo: 'Save Personal Info',
            appearance: 'Appearance',
            profileMode: 'Profile Mode',
            modeATS: 'ATS Mode (Document)',
            modePremium: 'Premium Profile Mode',
            language: 'Language',
            fontSize: 'Font Size',
            fontSizeSmall: 'Small',
            fontSizeMedium: 'Medium',
            fontSizeLarge: 'Large',
            defaultTab: 'Default Startup Tab',
            compactCV: 'Compact CV View',
            showContact: 'Show Contact Details',
            showPhoto: 'Show Profile Photo',
            dateTime: 'Date & Time',
            showDate: 'Show Date',
            showTime: 'Show Time',
            dateFormat: 'Date Format',
            dateFormatISO: 'YYYY-MM-DD',
            dateFormatEU: 'DD.MM.YYYY',
            dateFormatUS: 'MM/DD/YYYY',
            dateFormatLong: 'DD MMM YYYY',
            timeFormat: 'Time Format',
            timeFormat12h: '12-hour (AM/PM)',
            timeFormat24h: '24-hour',
            docTimestamp: 'Document Timestamp on PDFs',
            pitchDeck: 'Pitch Deck',
            transitionSpeed: 'Transition Speed',
            speedFast: 'Fast',
            speedNormal: 'Normal',
            speedSlow: 'Slow',
            // Public link section
            publicLink: 'Shareable Public Link',
            publicLinkDesc: 'Recruiter-facing link with selected language',
            generateLink: 'Generate Link',
            copyLink: 'Copy Link',
            publicLinkNote: 'Format: ?view=public&lang=en — opens directly in public mode with the selected language.',
            linkCopied: 'Link copied to clipboard!',
            print: 'Print & Export',
            printOptimized: 'Print Optimized',
            data: 'Data Management',
            resetPreferences: 'Reset All Preferences',
            resetButton: 'Reset'
        },
        publicMode: {
            exitPublic: 'Exit Public View'
        },
        alerts: {
            personalSaved: 'Personal information saved successfully.',
            noLetter: 'Please generate a cover letter first.',
            copiedSummary: 'Summary copied to clipboard!',
            copiedLetter: 'Cover letter copied to clipboard!',
            confirmReset: 'Are you sure you want to reset all settings and personal information?'
        }
    },

    // ── GERMAN ───────────────────────────────────────────────────────────
    de: {
        header: {
            headline: 'Business Development Analyst | GTM Support | Commercial Operations'
        },
        tabs: {
            cv: 'Lebenslauf',
            deck: 'Präsentation',
            coverLetter: 'Anschreiben',
            settings: 'Einstellungen'
        },
        cv: {
            headline: 'Business Development Analyst | GTM Support | Commercial Operations',
            email: 'E-Mail',
            secondaryEmail: 'Zweite E-Mail',
            phone: 'Telefon',
            linkedin: 'LinkedIn',
            website: 'Website',
            location: 'Standort',
            exportPDF: 'Als PDF exportieren',
            copySummary: 'Zusammenfassung kopieren',
            compactView: 'Kompakte Ansicht',
            fullWidthView: 'Vollständige Ansicht',
            summary: 'Profil',
            summaryText: 'Business Development und Commercial Operations Fachkraft mit Erfahrung in Outbound-Execution, Marktsegmentierung, Pipeline-Management, CRM-Workflow-Koordination, Reporting und kommerzieller Unterstützung. Stärken im analytischen und strukturierten Bereich des Business Development, einschließlich Follow-up-Logik, Messaging-Verfeinerung, Deal-Tracking, Marktanalyse und Prozesstransparenz. Erfahren in der Unterstützung kommerzieller Aktivitäten auf internationalen Märkten mit einem disziplinierten, forschungsbasierten und ausführungsorientierten Ansatz. Vertraut im Einsatz von OpenAI-Tools für Recherche, Entwurf, Informationssynthese und Workflow-Effizienz. Suche remote-freundliche Rollen in Business Development Operations, GTM Support, Sales Operations, Marktforschung oder kommerzieller Strategieunterstützung.',
            strengths: 'Kernkompetenzen',
            experience: 'Berufserfahrung',
            education: 'Ausbildung',
            tools: 'Tools & KI-Tools',
            languages: 'Sprachen',
            timestamp: 'Zuletzt aktualisiert: '
        },
        deck: {
            exportPDF: 'Präsentation als PDF exportieren',
            presentationMode: 'Präsentationsmodus',
            exitPresentation: 'Beenden',
            headline: 'Business Development Analyst | GTM Support | Commercial Operations',
            coverSubtitle: 'Strukturierte kommerzielle Unterstützung für internationale, remote-freundliche Teams.',
            coverIntro: 'Andrej Kneisl unterstützt kommerzielle Teams und wachstumsorientierte Unternehmen durch strukturierte Ausführung, Marktanalyse, CRM-Disziplin und mehrsprachige Kommunikation. Seine größte Stärke liegt im analytischen und operativen Bereich des Business Development — insbesondere GTM-Support, Marktsegmentierung, Pipeline-Sichtbarkeit, Reporting und KI-unterstützte Workflow-Unterstützung.',
            positioningTitle: 'Professionelle Positionierung',
            positioningText: 'Ich unterstütze kommerzielle Teams und wachstumsorientierte Unternehmen durch strukturierte Ausführung, Marktanalyse und Pipeline-Disziplin. Mein größter Wert liegt im analytischen und operativen Bereich des Business Development — insbesondere Marktsegmentierung, Messaging-Logik, Follow-up-Systeme, CRM-Sichtbarkeit, Reporting und Prozessunterstützung auf internationalen Märkten.',
            whatIBringTitle: 'Was ich mitbringe',
            coreStrengthsTitle: 'Kernkompetenzen',
            workStyleTitle: 'Arbeitsstil',
            idealRoleTitle: 'Ideale Rollenpassung',
            internationalTitle: 'Internationaler Vorteil',
            internationalText: 'Mehrsprachiges Profil mit professioneller Kommunikationsfähigkeit in deutschen, slowakischen, englischen und spanischen Kontexten. Vertraut in der Unterstützung kommerzieller Aktivitäten auf internationalen Märkten und in multikulturellen Umgebungen.',
            contactTitle: 'Kontakt',
            timestamp: 'Erstellt: '
        },
        coverLetter: {
            generate: 'Anschreiben generieren',
            reset: 'Zurücksetzen',
            copy: 'Text kopieren',
            exportPDF: 'Als PDF exportieren',
            companyName: 'Firmenname',
            companyPlaceholder: 'z.B. TechCorp GmbH',
            roleTitle: 'Positionsbezeichnung',
            rolePlaceholder: 'z.B. Business Development Analyst',
            hiringManager: 'Ansprechpartner',
            managerPlaceholder: 'z.B. Frau Schmidt',
            jobSource: 'Jobquelle',
            sourcePlaceholder: 'z.B. LinkedIn',
            mainFocus: 'Hauptfokus der Rolle',
            focusPlaceholder: 'z.B. Marktforschung und Pipeline-Management',
            keySkills: 'Zu betonende Kompetenzen',
            skillsPlaceholder: 'z.B. CRM-Disziplin, Reporting, GTM Support',
            language: 'Sprache',
            langEnglish: 'Englisch',
            langGerman: 'Deutsch',
            langSlovak: 'Slowakisch',
            langSpanish: 'Spanisch',
            tone: 'Ton',
            toneProfessional: 'Professionell',
            toneWarm: 'Warm Professionell',
            toneDirect: 'Direkt / Exekutiv',
            preview: 'Vorschau',
            timestamp: 'Datum: '
        },
        settings: {
            title: 'Einstellungen',
            personalInfo: 'Persönliche Informationen',
            labelFullName: 'Vollständiger Name',
            labelPrimaryEmail: 'Primäre E-Mail',
            labelSecondaryEmail: 'Sekundäre E-Mail',
            labelPhone: 'Telefon',
            labelWebsite: 'Website',
            labelLocation: 'Standort',
            labelLinkedIn: 'LinkedIn',
            labelPhoto: 'Profilfoto-Pfad',
            photoHint: 'Empfohlen: 400×400px JPG, professionelles Foto',
            savePersonalInfo: 'Persönliche Infos speichern',
            appearance: 'Erscheinungsbild',
            profileMode: 'Profil-Modus',
            modeATS: 'ATS-Modus (Dokument)',
            modePremium: 'Premium Profil-Modus',
            language: 'Sprache',
            fontSize: 'Schriftgröße',
            fontSizeSmall: 'Klein',
            fontSizeMedium: 'Mittel',
            fontSizeLarge: 'Groß',
            defaultTab: 'Standard-Starttab',
            compactCV: 'Kompakte Lebenslauf-Ansicht',
            showContact: 'Kontaktdetails anzeigen',
            showPhoto: 'Profilfoto anzeigen',
            dateTime: 'Datum & Uhrzeit',
            showDate: 'Datum anzeigen',
            showTime: 'Uhrzeit anzeigen',
            dateFormat: 'Datumsformat',
            timeFormat: 'Zeitformat',
            timeFormat12h: '12-Stunden (AM/PM)',
            timeFormat24h: '24-Stunden',
            docTimestamp: 'Zeitstempel auf PDFs',
            pitchDeck: 'Präsentation',
            transitionSpeed: 'Übergangsgeschwindigkeit',
            speedFast: 'Schnell',
            speedNormal: 'Normal',
            speedSlow: 'Langsam',
            publicLink: 'Teilbarer öffentlicher Link',
            publicLinkDesc: 'Recruiter-freundlicher Link mit gewählter Sprache',
            generateLink: 'Link generieren',
            copyLink: 'Link kopieren',
            publicLinkNote: 'Format: ?view=public&lang=de — öffnet direkt im öffentlichen Modus mit der gewählten Sprache.',
            linkCopied: 'Link in Zwischenablage kopiert!',
            print: 'Drucken & Exportieren',
            printOptimized: 'Druckoptimiert',
            data: 'Datenverwaltung',
            resetPreferences: 'Alle Einstellungen zurücksetzen',
            resetButton: 'Zurücksetzen'
        },
        publicMode: {
            exitPublic: 'Öffentliche Ansicht beenden'
        },
        alerts: {
            personalSaved: 'Persönliche Informationen erfolgreich gespeichert.',
            noLetter: 'Bitte zuerst ein Anschreiben generieren.',
            copiedSummary: 'Zusammenfassung in die Zwischenablage kopiert!',
            copiedLetter: 'Anschreiben in die Zwischenablage kopiert!',
            confirmReset: 'Möchten Sie wirklich alle Einstellungen und persönlichen Informationen zurücksetzen?'
        }
    },

    // ── SLOVAK ───────────────────────────────────────────────────────────
    sk: {
        header: {
            headline: 'Business Development Analyst | GTM Support | Commercial Operations'
        },
        tabs: {
            cv: 'Životopis',
            deck: 'Prezentácia',
            coverLetter: 'Motivačný list',
            settings: 'Nastavenia'
        },
        cv: {
            headline: 'Business Development Analyst | GTM Support | Commercial Operations',
            email: 'Email',
            secondaryEmail: 'Sekundárny email',
            phone: 'Telefón',
            linkedin: 'LinkedIn',
            website: 'Webstránka',
            location: 'Lokalita',
            exportPDF: 'Exportovať do PDF',
            copySummary: 'Kopírovať zhrnutie',
            compactView: 'Kompaktný pohľad',
            fullWidthView: 'Plný pohľad',
            summary: 'Profesijný profil',
            summaryText: 'Profesionál v oblasti business developmentu a komerčných operácií so skúsenosťami v outbound exekúcii, segmentácii trhu, manažmente pipeline, koordinácii CRM workflow, reportingu a komerčnej podpore. Najsilnejší v analytickej a štruktúrovanej stránke business developmentu, vrátane follow-up logiky, vylepšovania messagingu, sledovania dealov, trhových insightov a viditeľnosti procesov. Skúsený v podpore komerčných aktivít na medzinárodných trhoch s disciplinovaným, výskumom podloženým a exekučne zameraným prístupom. Komfortný v používaní OpenAI nástrojov na podporu výskumu, tvorby konceptov, syntézy informácií a efektivity workflow. Hľadám remote-friendly role v business development operations, GTM podpore, sales operations, prieskume trhu alebo podpore komerčnej stratégie.',
            strengths: 'Kľúčové kompetencie',
            experience: 'Pracovné skúsenosti',
            education: 'Vzdelanie',
            tools: 'Nástroje & AI nástroje',
            languages: 'Jazyky',
            timestamp: 'Posledná aktualizácia: '
        },
        deck: {
            exportPDF: 'Exportovať prezentáciu do PDF',
            presentationMode: 'Režim prezentácie',
            exitPresentation: 'Ukončiť',
            headline: 'Business Development Analyst | GTM Support | Commercial Operations',
            coverSubtitle: 'Štruktúrovaná komerčná podpora pre medzinárodné, remote-friendly tímy.',
            coverIntro: 'Andrej Kneisl podporuje komerčné tímy a rastúce businessy prostredníctvom štruktúrovanej exekúcie, trhových insightov, CRM disciplíny a viacjazyčnej komunikácie. Jeho najsilnejšia hodnota leží v analytickej a operačnej stránke business developmentu — najmä GTM support, segmentácia trhu, pipeline viditeľnosť, reporting a AI-asistovaná workflow podpora.',
            positioningTitle: 'Profesionálny positioning',
            positioningText: 'Podporujem komerčné tímy a rastúce businessy prostredníctvom štruktúrovanej exekúcie, trhových insightov a pipeline disciplíny. Moja najsilnejšia hodnota leží v analytickej a operačnej stránke business developmentu — najmä segmentácia trhu, messaging logika, follow-up systémy, CRM viditeľnosť, reporting a procesná podpora naprieč medzinárodnými trhmi.',
            whatIBringTitle: 'Čo prinášam',
            coreStrengthsTitle: 'Kľúčové kompetencie',
            workStyleTitle: 'Štýl práce',
            idealRoleTitle: 'Ideálna rola',
            internationalTitle: 'Medzinárodná výhoda',
            internationalText: 'Viacjazyčný profil s profesionálnou komunikačnou schopnosťou v nemeckom, slovenskom, anglickom a španielskom kontexte. Komfortný v podpore komerčných aktivít na medzinárodných trhoch a v multikultúrnych prostrediach.',
            contactTitle: 'Kontakt',
            timestamp: 'Vygenerované: '
        },
        coverLetter: {
            generate: 'Generovať motivačný list',
            reset: 'Resetovať',
            copy: 'Kopírovať text',
            exportPDF: 'Exportovať do PDF',
            companyName: 'Názov spoločnosti',
            companyPlaceholder: 'napr. TechCorp GmbH',
            roleTitle: 'Názov pozície',
            rolePlaceholder: 'napr. Business Development Analyst',
            hiringManager: 'Meno hiring managera',
            managerPlaceholder: 'napr. p. Schmidt',
            jobSource: 'Zdroj pracovnej ponuky',
            sourcePlaceholder: 'napr. LinkedIn',
            mainFocus: 'Hlavný fokus roly',
            focusPlaceholder: 'napr. Prieskum trhu a manažment pipeline',
            keySkills: 'Kľúčové zručnosti na zdôraznenie',
            skillsPlaceholder: 'napr. CRM disciplína, reporting, GTM support',
            language: 'Jazyk',
            langEnglish: 'Angličtina',
            langGerman: 'Nemčina',
            langSlovak: 'Slovenčina',
            langSpanish: 'Španielčina',
            tone: 'Tón',
            toneProfessional: 'Profesionálny',
            toneWarm: 'Teplý profesionálny',
            toneDirect: 'Priamejší / Exekutívny',
            preview: 'Náhľad',
            timestamp: 'Dátum: '
        },
        settings: {
            title: 'Nastavenia',
            personalInfo: 'Osobné informácie',
            labelFullName: 'Celé meno',
            labelPrimaryEmail: 'Primárny email',
            labelSecondaryEmail: 'Sekundárny email',
            labelPhone: 'Telefón',
            labelWebsite: 'Webstránka',
            labelLocation: 'Lokalita',
            labelLinkedIn: 'LinkedIn',
            labelPhoto: 'Cesta k profilovej fotke',
            photoHint: 'Odporúčané: 400×400px JPG, profesionálna fotka',
            savePersonalInfo: 'Uložiť osobné info',
            appearance: 'Vzhľad',
            profileMode: 'Profilový režim',
            modeATS: 'ATS režim (Dokument)',
            modePremium: 'Premium profilový režim',
            language: 'Jazyk',
            fontSize: 'Veľkosť písma',
            fontSizeSmall: 'Malá',
            fontSizeMedium: 'Stredná',
            fontSizeLarge: 'Veľká',
            defaultTab: 'Predvolený štartovací tab',
            compactCV: 'Kompaktný pohľad na CV',
            showContact: 'Zobraziť kontaktné údaje',
            showPhoto: 'Zobraziť profilovú fotku',
            dateTime: 'Dátum a čas',
            showDate: 'Zobraziť dátum',
            showTime: 'Zobraziť čas',
            dateFormat: 'Formát dátumu',
            timeFormat: 'Formát času',
            timeFormat12h: '12-hodinový (AM/PM)',
            timeFormat24h: '24-hodinový',
            docTimestamp: 'Časová pečiatka na PDF',
            pitchDeck: 'Prezentácia',
            transitionSpeed: 'Rýchlosť prechodov',
            speedFast: 'Rýchlo',
            speedNormal: 'Normálne',
            speedSlow: 'Pomaly',
            publicLink: 'Zdieľateľný verejný odkaz',
            publicLinkDesc: 'Recruiter-friendly odkaz s vybraným jazykom',
            generateLink: 'Generovať odkaz',
            copyLink: 'Kopírovať odkaz',
            publicLinkNote: 'Formát: ?view=public&lang=sk — otvorí priamo vo verejnom režime s vybraným jazykom.',
            linkCopied: 'Odkaz skopírovaný do schránky!',
            print: 'Tlač & Export',
            printOptimized: 'Optimalizované pre tlač',
            data: 'Správa dát',
            resetPreferences: 'Resetovať všetky nastavenia',
            resetButton: 'Resetovať'
        },
        publicMode: {
            exitPublic: 'Ukončiť verejný pohľad'
        },
        alerts: {
            personalSaved: 'Osobné informácie úspešne uložené.',
            noLetter: 'Najskôr prosím vygenerujte motivačný list.',
            copiedSummary: 'Zhrnutie skopírované do schránky!',
            copiedLetter: 'Motivačný list skopírovaný do schránky!',
            confirmReset: 'Naozaj chcete resetovať všetky nastavenia a osobné informácie?'
        }
    },

    // ── SPANISH ──────────────────────────────────────────────────────────
    es: {
        header: {
            headline: 'Business Development Analyst | GTM Support | Commercial Operations'
        },
        tabs: {
            cv: 'Currículum',
            deck: 'Presentación',
            coverLetter: 'Carta de presentación',
            settings: 'Configuración'
        },
        cv: {
            headline: 'Business Development Analyst | GTM Support | Commercial Operations',
            email: 'Correo electrónico',
            secondaryEmail: 'Correo secundario',
            phone: 'Teléfono',
            linkedin: 'LinkedIn',
            website: 'Sitio web',
            location: 'Ubicación',
            exportPDF: 'Exportar a PDF',
            copySummary: 'Copiar resumen',
            compactView: 'Vista compacta',
            fullWidthView: 'Vista completa',
            summary: 'Resumen profesional',
            summaryText: 'Profesional de desarrollo de negocios y operaciones comerciales con experiencia en ejecución outbound, segmentación de mercado, gestión de pipeline, coordinación de flujos de trabajo CRM, reporting y soporte comercial. Fortalezas en el lado analítico y estructurado del desarrollo de negocios, incluyendo lógica de seguimiento, refinamiento de mensajes, seguimiento de deals, insights de mercado y visibilidad de procesos. Experimentado en apoyar actividades comerciales en mercados internacionales con un enfoque disciplinado, basado en investigación y orientado a la ejecución. Cómodo utilizando herramientas OpenAI para apoyar investigación, redacción, síntesis de información y eficiencia de flujos de trabajo. En búsqueda de roles remotos en operaciones de desarrollo de negocios, soporte GTM, operaciones de ventas, investigación de mercado o soporte de estrategia comercial.',
            strengths: 'Fortalezas clave',
            experience: 'Experiencia laboral',
            education: 'Educación',
            tools: 'Herramientas y herramientas de IA',
            languages: 'Idiomas',
            timestamp: 'Última actualización: '
        },
        deck: {
            exportPDF: 'Exportar presentación a PDF',
            presentationMode: 'Modo presentación',
            exitPresentation: 'Salir',
            headline: 'Business Development Analyst | GTM Support | Commercial Operations',
            coverSubtitle: 'Soporte comercial estructurado para equipos internacionales y remotos.',
            coverIntro: 'Andrej Kneisl apoya a equipos comerciales y empresas en crecimiento a través de ejecución estructurada, insights de mercado, disciplina CRM y comunicación multilingüe. Su mayor valor reside en el lado analítico y operativo del desarrollo de negocios — especialmente soporte GTM, segmentación de mercado, visibilidad de pipeline, reporting y soporte de flujo de trabajo asistido por IA.',
            positioningTitle: 'Posicionamiento profesional',
            positioningText: 'Apoyo a equipos comerciales y empresas en crecimiento a través de ejecución estructurada, insights de mercado y disciplina de pipeline. Mi mayor valor reside en el lado analítico y operativo del desarrollo de negocios — especialmente segmentación de mercado, lógica de mensajes, sistemas de seguimiento, visibilidad CRM, reporting y soporte de procesos en mercados internacionales.',
            whatIBringTitle: 'Lo que aporto',
            coreStrengthsTitle: 'Fortalezas clave',
            workStyleTitle: 'Estilo de trabajo',
            idealRoleTitle: 'Encaje de rol ideal',
            internationalTitle: 'Ventaja internacional',
            internationalText: 'Perfil multilingüe con capacidad de comunicación profesional en contextos alemanes, eslovacos, ingleses y españoles. Cómodo apoyando actividades comerciales en mercados internacionales y entornos multiculturales.',
            contactTitle: 'Contacto',
            timestamp: 'Generado: '
        },
        coverLetter: {
            generate: 'Generar carta',
            reset: 'Restablecer',
            copy: 'Copiar texto',
            exportPDF: 'Exportar a PDF',
            companyName: 'Nombre de la empresa',
            companyPlaceholder: 'ej. TechCorp GmbH',
            roleTitle: 'Título del puesto',
            rolePlaceholder: 'ej. Business Development Analyst',
            hiringManager: 'Nombre del responsable de contratación',
            managerPlaceholder: 'ej. Sr. Schmidt',
            jobSource: 'Fuente de empleo',
            sourcePlaceholder: 'ej. LinkedIn',
            mainFocus: 'Enfoque principal del rol',
            focusPlaceholder: 'ej. Investigación de mercado y gestión de pipeline',
            keySkills: 'Habilidades clave a enfatizar',
            skillsPlaceholder: 'ej. Disciplina CRM, reporting, soporte GTM',
            language: 'Idioma',
            langEnglish: 'Inglés',
            langGerman: 'Alemán',
            langSlovak: 'Eslovaco',
            langSpanish: 'Español',
            tone: 'Tono',
            toneProfessional: 'Profesional',
            toneWarm: 'Profesional cálido',
            toneDirect: 'Más directo / Ejecutivo',
            preview: 'Vista previa',
            timestamp: 'Fecha: '
        },
        settings: {
            title: 'Configuración',
            personalInfo: 'Información personal',
            labelFullName: 'Nombre completo',
            labelPrimaryEmail: 'Correo principal',
            labelSecondaryEmail: 'Correo secundario',
            labelPhone: 'Teléfono',
            labelWebsite: 'Sitio web',
            labelLocation: 'Ubicación',
            labelLinkedIn: 'LinkedIn',
            labelPhoto: 'Ruta de foto de perfil',
            photoHint: 'Recomendado: 400×400px JPG, foto profesional',
            savePersonalInfo: 'Guardar información personal',
            appearance: 'Apariencia',
            profileMode: 'Modo de perfil',
            modeATS: 'Modo ATS (Documento)',
            modePremium: 'Modo perfil premium',
            language: 'Idioma',
            fontSize: 'Tamaño de fuente',
            fontSizeSmall: 'Pequeño',
            fontSizeMedium: 'Mediano',
            fontSizeLarge: 'Grande',
            defaultTab: 'Pestaña de inicio predeterminada',
            compactCV: 'Vista compacta de CV',
            showContact: 'Mostrar detalles de contacto',
            showPhoto: 'Mostrar foto de perfil',
            dateTime: 'Fecha y hora',
            showDate: 'Mostrar fecha',
            showTime: 'Mostrar hora',
            dateFormat: 'Formato de fecha',
            timeFormat: 'Formato de hora',
            timeFormat12h: '12 horas (AM/PM)',
            timeFormat24h: '24 horas',
            docTimestamp: 'Marca de tiempo en PDFs',
            pitchDeck: 'Presentación',
            transitionSpeed: 'Velocidad de transición',
            speedFast: 'Rápido',
            speedNormal: 'Normal',
            speedSlow: 'Lento',
            publicLink: 'Enlace público compartible',
            publicLinkDesc: 'Enlace amigable para reclutadores con idioma seleccionado',
            generateLink: 'Generar enlace',
            copyLink: 'Copiar enlace',
            publicLinkNote: 'Formato: ?view=public&lang=es — abre directamente en modo público con el idioma seleccionado.',
            linkCopied: '¡Enlace copiado al portapapeles!',
            print: 'Imprimir y exportar',
            printOptimized: 'Optimizado para impresión',
            data: 'Gestión de datos',
            resetPreferences: 'Restablecer todas las preferencias',
            resetButton: 'Restablecer'
        },
        publicMode: {
            exitPublic: 'Salir de vista pública'
        },
        alerts: {
            personalSaved: 'Información personal guardada correctamente.',
            noLetter: 'Por favor, genera una carta de presentación primero.',
            copiedSummary: '¡Resumen copiado al portapapeles!',
            copiedLetter: '¡Carta de presentación copiada al portapapeles!',
            confirmReset: '¿Está seguro de que desea restablecer todas las configuraciones e información personal?'
        }
    }
};

// ========================================
// CV DATA — Content rendered dynamically into CV sections
// ========================================
const cvData = {
    strengths: [
        'Business Development Support',
        'GTM Support',
        'Commercial Operations',
        'Sales Operations Support',
        'Market Research',
        'Market Segmentation',
        'Pipeline Management',
        'CRM Discipline',
        'Deal Tracking & Deal Notes',
        'Follow-Up Process Logic',
        'Reporting & KPI Visibility',
        'Messaging Structure',
        'Process Improvement',
        'Commercial Insight',
        'Multilingual Communication',
        'AI-assisted Research and Drafting'
    ],
    experience: [
        {
            title: 'Sales Manager, Business Developer & Strategy Consultant (Self-Employed)',
            company: '',
            period: 'March 2025 – Present',
            description: [
                'Supported business development and commercial execution activities across multiple projects and industries',
                'Managed structured outreach workflows, follow-up logic, and CRM discipline to maintain pipeline visibility and next-step accuracy',
                'Conducted market segmentation and target account research to improve outreach relevance and support commercial planning',
                'Produced structured deal notes, progress updates, and reporting inputs to support decision-making and execution consistency',
                'Helped refine messaging, commercial positioning, and outreach structure based on market response and prospect feedback',
                'Contributed to commercial strategy support by translating operational activity into actionable insights and next-step recommendations',
                'Used OpenAI tools to support research, structured drafting, documentation quality, and workflow efficiency'
            ]
        },
        {
            title: 'Restaurant Manager',
            company: 'Hideout, Dubai',
            period: 'Jul 2021 – Jul 2022',
            description: [
                'Developed and implemented operating procedures to improve service consistency and execution standards',
                'Coordinated shift-level team performance and daily operations in a fast-paced environment',
                'Designed and delivered staff training to strengthen service quality, process adherence, and team effectiveness',
                'Maintained operational oversight across service execution, compliance, and workflow coordination'
            ]
        },
        {
            title: 'Operational Supervisor on Board',
            company: 'Don Rail Catering, Vienna',
            period: 'Mar 2018 – Mar 2019',
            description: [
                'Supervised day-to-day operational delivery across a large service team in a high-volume environment',
                'Ensured compliance with hygiene and process standards through structured oversight and control',
                'Prepared daily, weekly, and monthly reports to support operational visibility and performance tracking',
                'Coordinated execution quality across multiple workflow areas while maintaining consistency under time pressure'
            ]
        },
        {
            title: 'Operations Manager',
            company: 'Love Hotel, Aruba',
            period: 'May 2016 – May 2017',
            description: [
                'Coordinated operational execution across a multi-function team, including service and housekeeping workflows',
                'Supported performance improvement through staff training, service oversight, and execution discipline',
                'Contributed to revenue performance through team enablement and operational consistency',
                'Delivered compliance and health & safety training aligned with inspection and quality requirements'
            ]
        },
        {
            title: 'Assistant Restaurant Manager',
            company: 'Park Café, Munich',
            period: 'May 2014 – May 2016',
            description: [
                'Coordinated large-team operations in a high-volume customer environment with strong focus on workflow structure and service continuity',
                'Improved stock and ordering processes to reduce waste and strengthen inventory control',
                'Supported event execution, operational planning, and service delivery across large-scale customer volumes',
                'Contributed to commercial performance through product focus, team coordination, and structured service execution'
            ]
        },
        {
            title: 'Restaurant Manager',
            company: 'Suite Lounge Bar, Zurich',
            period: 'Dec 2013 – Dec 2014',
            description: [
                'Managed team coordination, staff performance support, and service operations in a premium hospitality setting',
                'Improved retention and team stability through structured management routines and regular performance reviews',
                'Contributed to revenue growth through menu positioning, commercial awareness, and service quality execution'
            ]
        }
    ],
    education: [
        {
            school: 'University of Zurich, Switzerland',
            details: 'Studies in Hospitality Management and Business Administration (2012–2015)'
        },
        {
            school: 'Hotel Academy, Banská Štiavnica, Slovakia',
            details: 'Hotel Management, Customer Service, and Event Planning (2010–2012)'
        },
        {
            school: 'School of Gastronomy, Zvolen, Slovakia',
            details: 'Culinary Arts, Kitchen Management, and Food Safety (2007–2010)'
        }
    ],
    tools: [
        'Pipedrive — CRM workflow management',
        'Microsoft Excel, Word, PowerPoint',
        'Reporting and documentation tools',
        'Pipeline management systems',
        'OpenAI / ChatGPT',
        'AI-assisted research, drafting, information synthesis',
        'AI-supported market mapping and messaging refinement'
    ],
    languages: [
        { language: 'German',  level: 'Native / C2' },
        { language: 'Slovak',  level: 'Native / C2' },
        { language: 'English', level: 'Fluent / C1' },
        { language: 'Spanish', level: 'Advanced / B2' }
    ]
};

// ========================================
// PITCH DECK DATA — Content rendered dynamically
// ========================================
const deckData = {
    whatIBring: [
        'Research-driven commercial support and insight',
        'GTM and outreach workflow coordination',
        'Pipeline visibility and CRM discipline',
        'Structured follow-up systems',
        'Reporting and deal-note consistency',
        'Multilingual written communication',
        'AI-assisted workflow and drafting support'
    ],
    coreStrengths: [
        'Market Segmentation',
        'Pipeline Management',
        'CRM Discipline',
        'Deal Tracking',
        'Reporting & KPI Visibility',
        'Messaging Structure',
        'Process Improvement',
        'Multilingual Communication'
    ],
    workStyle: [
        'Analytical and process-oriented',
        'Strong in structured execution and written communication',
        'Comfortable with research-heavy and coordination-focused tasks',
        'Best suited to roles with clear ownership, workflow visibility, and remote autonomy'
    ],
    idealRole: [
        'Business Development Analyst',
        'GTM Support Specialist',
        'Commercial Operations Specialist',
        'Sales Operations Support',
        'Market Research / Commercial Insight Support'
    ]
};

// ========================================
// STATE
// ========================================
let currentLanguage = 'en';
let currentSlide    = 0;
let isPresentationMode = false;
let isPublicMode    = false;   // Public/recruiter-facing mode

// Runtime personal info (loaded from localStorage or defaults)
let personalInfo = { ...defaultPersonalInfo };

// App settings (loaded from localStorage)
let settings = {
    language:        'en',
    fontSize:        'medium',
    defaultTab:      'cv',
    compactCV:       false,
    showContact:     true,
    showPhoto:       false,
    profileMode:     'ats',        // 'ats' | 'premium'
    transitionSpeed: 'normal',
    printOptimized:  true,
    // Date & Time settings
    dateTime: {
        showDate:    false,
        showTime:    false,
        dateFormat:  'YYYY-MM-DD',
        timeFormat:  '24',         // '12' | '24'
        docTimestamp: false
    }
};

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    loadPersonalInfo();
    initializeTabs();
    initializeLanguageSwitchers();
    initializeSettings();
    renderCV();
    renderDeck();
    initializeDeckNavigation();
    loadCoverLetter();
    applySettings();
    updatePersonalInfoDisplay();
    updateTimestamps();
    checkURLParams();           // PUBLIC MODE: check for ?view=public&lang=xx
});

// ========================================
// PUBLIC MODE — URL-based state
// Reads ?view=public&lang=XX from the URL on page load.
// When active: hides Settings tab, shows recruiter-facing layout.
// ========================================
function checkURLParams() {
    const params = new URLSearchParams(window.location.search);

    if (params.get('view') === 'public') {
        const lang = params.get('lang') || settings.language || 'en';

        isPublicMode = true;
        document.body.classList.add('public-mode');

        // Hide settings tab
        const settingsTab = document.getElementById('settings-tab-btn');
        if (settingsTab) settingsTab.style.display = 'none';

        // Activate toggle button appearance
        const toggleBtn = document.getElementById('public-mode-toggle');
        if (toggleBtn) {
            toggleBtn.classList.add('active');
            toggleBtn.title = translations[lang]?.publicMode?.exitPublic || 'Exit Public View';
        }

        // Apply language from URL param
        if (lang !== currentLanguage) {
            updateLanguage(lang);
            document.getElementById('header-language-select').value = lang;
        }

        // Land on CV tab
        switchTab('cv');
    }
}

/** Toggle public/edit mode manually via the eye button in the header. */
function togglePublicMode() {
    isPublicMode = !isPublicMode;
    document.body.classList.toggle('public-mode', isPublicMode);

    const settingsTab = document.getElementById('settings-tab-btn');
    if (settingsTab) settingsTab.style.display = isPublicMode ? 'none' : '';

    const toggleBtn = document.getElementById('public-mode-toggle');
    if (toggleBtn) {
        toggleBtn.classList.toggle('active', isPublicMode);
        toggleBtn.title = isPublicMode
            ? translations[currentLanguage].publicMode.exitPublic
            : 'Toggle public view';
    }

    if (isPublicMode) switchTab('cv');
}

// ========================================
// GENERATE & COPY PUBLIC LINK
// Settings → Shareable Public Link
// Produces: currentURL?view=public&lang=XX
// ========================================
function generatePublicLink() {
    const base  = window.location.origin + window.location.pathname;
    const link  = `${base}?view=public&lang=${currentLanguage}`;

    const display = document.getElementById('public-link-display');
    const input   = document.getElementById('public-link-input');

    if (display && input) {
        display.style.display = 'flex';
        input.value = link;
        try { input.select(); } catch(e) {}
    }

    return link;
}

function copyPublicLink() {
    const input = document.getElementById('public-link-input');
    const link  = (input && input.value) ? input.value : generatePublicLink();

    navigator.clipboard.writeText(link).then(() => {
        const msg = translations[currentLanguage]?.settings?.linkCopied || 'Link copied!';
        showToast(msg);
    }).catch(() => {
        // Fallback: select + copy command
        if (input) { input.select(); document.execCommand('copy'); }
    });
}

// ========================================
// PERSONAL INFORMATION
// Loaded from / saved to localStorage ('careerAppPersonalInfo')
// ========================================
function loadPersonalInfo() {
    const saved = localStorage.getItem('careerAppPersonalInfo');
    if (saved) {
        try {
            personalInfo = { ...defaultPersonalInfo, ...JSON.parse(saved) };
        } catch (e) {
            console.warn('Could not load personal info:', e);
            personalInfo = { ...defaultPersonalInfo };
        }
    }
}

function savePersonalInfo() {
    personalInfo.fullName       = document.getElementById('settings-full-name').value       || defaultPersonalInfo.fullName;
    personalInfo.primaryEmail   = document.getElementById('settings-primary-email').value   || defaultPersonalInfo.primaryEmail;
    personalInfo.secondaryEmail = document.getElementById('settings-secondary-email').value || defaultPersonalInfo.secondaryEmail;
    personalInfo.phone          = document.getElementById('settings-phone').value           || defaultPersonalInfo.phone;
    personalInfo.website        = document.getElementById('settings-website').value         || defaultPersonalInfo.website;
    personalInfo.location       = document.getElementById('settings-location').value        || defaultPersonalInfo.location;
    personalInfo.linkedin       = document.getElementById('settings-linkedin').value        || defaultPersonalInfo.linkedin;
    personalInfo.profilePhoto   = document.getElementById('settings-profile-photo').value   || defaultPersonalInfo.profilePhoto;

    localStorage.setItem('careerAppPersonalInfo', JSON.stringify(personalInfo));
    updatePersonalInfoDisplay();

    showToast(translations[currentLanguage]?.alerts?.personalSaved || 'Saved.');
}

function updatePersonalInfoDisplay() {
    // Header name
    const headerName = document.getElementById('header-name');
    if (headerName) headerName.textContent = personalInfo.fullName;

    // CV header
    const cvName = document.getElementById('cv-name');
    if (cvName) cvName.textContent = personalInfo.fullName;

    // Contact items
    setEl('contact-email-primary', { text: personalInfo.primaryEmail, href: `mailto:${personalInfo.primaryEmail}` });
    setEl('contact-email-secondary', { text: personalInfo.secondaryEmail, href: `mailto:${personalInfo.secondaryEmail}` });
    setEl('contact-phone', { text: personalInfo.phone, href: `tel:${personalInfo.phone.replace(/\s/g, '')}` });
    setEl('contact-website', { text: personalInfo.website, href: `https://${personalInfo.website.replace(/^https?:\/\//, '')}` });
    setElText('contact-location', personalInfo.location);

    // Deck contact slide
    setElText('contact-name-deck', personalInfo.fullName);
    setEl('deck-contact-email',    { text: personalInfo.primaryEmail, href: `mailto:${personalInfo.primaryEmail}` });
    setEl('deck-contact-phone',    { text: personalInfo.phone,        href: `tel:${personalInfo.phone.replace(/\s/g, '')}` });
    setEl('deck-contact-website',  { text: personalInfo.website,      href: `https://${personalInfo.website.replace(/^https?:\/\//, '')}` });
    setElText('deck-contact-location', personalInfo.location);
    setElText('deck-cover-name', personalInfo.fullName);

    // Profile photos
    const photoIds = ['cv-profile-photo', 'cover-profile-photo', 'contact-profile-photo'];
    const shouldShow = settings.showPhoto && settings.profileMode === 'premium';
    photoIds.forEach(id => {
        const img = document.getElementById(id);
        if (img) {
            img.src = personalInfo.profilePhoto;
            img.style.display = shouldShow ? 'block' : 'none';
        }
    });

    // Settings form
    setValue('settings-full-name',       personalInfo.fullName);
    setValue('settings-primary-email',   personalInfo.primaryEmail);
    setValue('settings-secondary-email', personalInfo.secondaryEmail);
    setValue('settings-phone',           personalInfo.phone);
    setValue('settings-website',         personalInfo.website);
    setValue('settings-location',        personalInfo.location);
    setValue('settings-linkedin',        personalInfo.linkedin);
    setValue('settings-profile-photo',   personalInfo.profilePhoto);
}

// ========================================
// SETTINGS
// ========================================
function loadSettings() {
    const saved = localStorage.getItem('careerAppSettings');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            settings = { ...settings, ...parsed };
            // Ensure nested dateTime always exists
            if (!settings.dateTime) {
                settings.dateTime = { showDate: false, showTime: false, dateFormat: 'YYYY-MM-DD', timeFormat: '24', docTimestamp: false };
            }
        } catch (e) {
            console.warn('Could not load settings:', e);
        }
    }
    currentLanguage = settings.language;
}

function saveSettings() {
    localStorage.setItem('careerAppSettings', JSON.stringify(settings));
}

function applySettings() {
    // Font size class on body
    document.body.className = document.body.className
        .replace(/font-(small|medium|large)/g, '')
        .trim() + ` font-${settings.fontSize}`;

    // Profile mode class
    document.body.classList.remove('ats-mode', 'premium-mode');
    document.body.classList.add(`${settings.profileMode}-mode`);

    // Compact CV toggle
    const cvContainer = document.querySelector('.cv-container');
    if (cvContainer) cvContainer.classList.toggle('compact', settings.compactCV);
    const toggleText = document.getElementById('cv-view-toggle-text');
    if (toggleText) toggleText.textContent =
        settings.compactCV ? translations[currentLanguage].cv.fullWidthView : translations[currentLanguage].cv.compactView;

    // Contact visibility
    const cvContact = document.querySelector('.cv-contact');
    if (cvContact) cvContact.style.display = settings.showContact ? '' : 'none';

    // Transition speed
    const speedMap = { fast: '120ms', normal: '240ms', slow: '380ms' };
    document.documentElement.style.setProperty('--transition-normal', speedMap[settings.transitionSpeed] || '240ms');

    // Sync settings UI controls
    setValue('settings-language',         settings.language);
    setValue('settings-font-size',        settings.fontSize);
    setValue('settings-startup-tab',      settings.defaultTab);
    setValue('settings-profile-mode',     settings.profileMode);
    setValue('settings-transition-speed', settings.transitionSpeed);
    setChecked('settings-compact-cv',     settings.compactCV);
    setChecked('settings-show-contact',   settings.showContact);
    setChecked('settings-show-photo',     settings.showPhoto);
    setChecked('settings-print-optimized', settings.printOptimized);

    // Date & Time controls
    setChecked('settings-show-date',   settings.dateTime.showDate);
    setChecked('settings-show-time',   settings.dateTime.showTime);
    setValue('settings-date-format',   settings.dateTime.dateFormat);
    setValue('settings-time-format',   settings.dateTime.timeFormat);
    setChecked('settings-doc-timestamp', settings.dateTime.docTimestamp);

    // Sync header language selector
    setValue('header-language-select', settings.language);

    // Switch to default startup tab
    switchTab(settings.defaultTab);

    // Apply language
    updateLanguage(settings.language);

    updatePersonalInfoDisplay();
    updateTimestamps();
}

function resetAllSettings() {
    const msg = translations[currentLanguage]?.alerts?.confirmReset || 'Reset all settings?';
    if (!confirm(msg)) return;

    localStorage.removeItem('careerAppSettings');
    localStorage.removeItem('careerAppPersonalInfo');
    settings = {
        language: 'en', fontSize: 'medium', defaultTab: 'cv',
        compactCV: false, showContact: true, showPhoto: false,
        profileMode: 'ats', transitionSpeed: 'normal', printOptimized: true,
        dateTime: { showDate: false, showTime: false, dateFormat: 'YYYY-MM-DD', timeFormat: '24', docTimestamp: false }
    };
    personalInfo = { ...defaultPersonalInfo };
    currentLanguage = 'en';
    applySettings();
    updatePersonalInfoDisplay();
}

// ========================================
// SETTINGS CHANGE HANDLERS
// ========================================
function initializeSettings() {
    const handlers = {
        'settings-language':        (v) => { settings.language = v; updateLanguage(v); },
        'settings-font-size':       (v) => { settings.fontSize = v; },
        'settings-startup-tab':     (v) => { settings.defaultTab = v; },
        'settings-compact-cv':      (v) => { settings.compactCV = v; },
        'settings-show-contact':    (v) => { settings.showContact = v; },
        'settings-show-photo':      (v) => { settings.showPhoto = v; updatePersonalInfoDisplay(); },
        'settings-profile-mode':    (v) => { settings.profileMode = v; updatePersonalInfoDisplay(); },
        'settings-transition-speed':(v) => { settings.transitionSpeed = v; },
        'settings-print-optimized': (v) => { settings.printOptimized = v; },
        'settings-show-date':       (v) => { settings.dateTime.showDate = v; updateTimestamps(); },
        'settings-show-time':       (v) => { settings.dateTime.showTime = v; updateTimestamps(); },
        'settings-date-format':     (v) => { settings.dateTime.dateFormat = v; updateTimestamps(); },
        'settings-time-format':     (v) => { settings.dateTime.timeFormat = v; updateTimestamps(); },
        'settings-doc-timestamp':   (v) => { settings.dateTime.docTimestamp = v; updateTimestamps(); }
    };

    Object.entries(handlers).forEach(([id, fn]) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('change', (e) => {
            fn(e.target.type === 'checkbox' ? e.target.checked : e.target.value);
            saveSettings();
            applySettings();
        });
    });
}

// ========================================
// TAB NAVIGATION
// ========================================
function initializeTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabId);
    });
    document.querySelectorAll('.tab-content').forEach(sec => {
        sec.classList.toggle('active', sec.id === tabId);
    });
    if (isPresentationMode) exitPresentationMode();
}

// ========================================
// LANGUAGE SWITCHING
// updateLanguage(lang) applies translations to every [data-i18n] element
// and re-renders all dynamic content in the selected language.
// ========================================
function initializeLanguageSwitchers() {
    const headerSel   = document.getElementById('header-language-select');
    const settingsSel = document.getElementById('settings-language');

    [headerSel, settingsSel].forEach(sel => {
        if (!sel) return;
        sel.addEventListener('change', (e) => {
            const lang = e.target.value;
            updateLanguage(lang);
            if (headerSel)   headerSel.value   = lang;
            if (settingsSel) settingsSel.value = lang;
        });
    });
}

function updateLanguage(lang) {
    if (!translations[lang]) return;

    currentLanguage     = lang;
    settings.language   = lang;
    saveSettings();

    // Apply all data-i18n text nodes
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const value = resolvePath(translations[lang], el.dataset.i18n);
        if (value !== undefined) el.textContent = value;
    });

    // Apply all data-i18n-placeholder attributes
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const value = resolvePath(translations[lang], el.dataset.i18nPlaceholder);
        if (value !== undefined) el.setAttribute('placeholder', value);
    });

    // Re-render dynamic content
    renderCV();
    renderDeck();

    // Sync cover letter language selector
    const clLang = document.getElementById('cl-language');
    if (clLang) clLang.value = lang;

    updateTimestamps();
}

// ========================================
// DATE & TIME
// formatDateTime() respects settings.dateTime for format and 12/24h
// updateTimestamps() writes the result to CV and Deck timestamp elements
// ========================================
function formatDateTime() {
    const { showDate, showTime, dateFormat, timeFormat } = settings.dateTime;
    if (!showDate && !showTime) return '';

    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const monthName = now.toLocaleString(currentLanguage, { month: 'short' });

    let dateStr = '';
    if (showDate) {
        switch (dateFormat) {
            case 'YYYY-MM-DD': dateStr = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`; break;
            case 'DD.MM.YYYY': dateStr = `${pad(now.getDate())}.${pad(now.getMonth()+1)}.${now.getFullYear()}`; break;
            case 'MM/DD/YYYY': dateStr = `${pad(now.getMonth()+1)}/${pad(now.getDate())}/${now.getFullYear()}`; break;
            case 'DD MMM YYYY': dateStr = `${pad(now.getDate())} ${monthName} ${now.getFullYear()}`; break;
            default: dateStr = now.toLocaleDateString();
        }
    }

    let timeStr = '';
    if (showTime) {
        if (timeFormat === '12') {
            const h = now.getHours();
            const ampm = h >= 12 ? 'PM' : 'AM';
            timeStr = `${h % 12 || 12}:${pad(now.getMinutes())} ${ampm}`;
        } else {
            timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
        }
    }

    return [dateStr, timeStr].filter(Boolean).join(' ');
}

function updateTimestamps() {
    const str = formatDateTime();
    const show = settings.dateTime.docTimestamp && str;

    const cvTs = document.getElementById('cv-timestamp');
    if (cvTs) {
        cvTs.style.display = show ? '' : 'none';
        if (show) cvTs.textContent = (translations[currentLanguage].cv.timestamp || '') + str;
    }

    const deckTs = document.getElementById('deck-timestamp');
    if (deckTs) {
        deckTs.style.display = show ? '' : 'none';
        if (show) deckTs.textContent = (translations[currentLanguage].deck.timestamp || '') + str;
    }
}

// ========================================
// CV RENDERING
// ========================================
function renderCV() {
    // Strengths
    const sl = document.getElementById('strengths-list');
    if (sl) sl.innerHTML = cvData.strengths.map(s => `<li>${s}</li>`).join('');

    // Experience
    const el = document.getElementById('experience-list');
    if (el) el.innerHTML = cvData.experience.map(exp => `
        <div class="experience-item">
            <div class="experience-header">
                <span class="experience-title">${exp.title}</span>
                <span class="experience-period">${exp.period}</span>
            </div>
            ${exp.company ? `<div class="experience-company">${exp.company}</div>` : ''}
            <ul class="experience-description">
                ${exp.description.map(d => `<li>${d}</li>`).join('')}
            </ul>
        </div>
    `).join('');

    // Education
    const edl = document.getElementById('education-list');
    if (edl) edl.innerHTML = cvData.education.map(e => `
        <div class="education-item">
            <span class="education-school">${e.school}</span>
            <span class="education-details">${e.details}</span>
        </div>
    `).join('');

    // Tools
    const tl = document.getElementById('tools-list');
    if (tl) tl.innerHTML = cvData.tools.map(t => `<li>${t}</li>`).join('');

    // Languages
    const ll = document.getElementById('languages-list');
    if (ll) ll.innerHTML = cvData.languages.map(l => `<li><strong>${l.language}:</strong> ${l.level}</li>`).join('');
}

// CV actions
function toggleCVView() {
    const cvc = document.querySelector('.cv-container');
    cvc.classList.toggle('compact');
    settings.compactCV = cvc.classList.contains('compact');
    saveSettings();
    const toggleText = document.getElementById('cv-view-toggle-text');
    if (toggleText) toggleText.textContent =
        settings.compactCV ? translations[currentLanguage].cv.fullWidthView : translations[currentLanguage].cv.compactView;
}

function copyCVSummary() {
    const text = translations[currentLanguage]?.cv?.summaryText || '';
    navigator.clipboard.writeText(text).then(() => {
        showToast(translations[currentLanguage]?.alerts?.copiedSummary || 'Copied!');
    });
}

// ========================================
// EXPORT — CV
// Exports the active CV tab via window.print().
// Print CSS strips glass, hides chrome, renders clean A4 document.
// ========================================
function exportCV() {
    switchTab('cv');
    setTimeout(() => window.print(), 80);
}

// ========================================
// PITCH DECK RENDERING
// ========================================
function renderDeck() {
    const lists = {
        'what-i-bring-list':    deckData.whatIBring,
        'deck-strengths-list':  deckData.coreStrengths,
        'work-style-list':      deckData.workStyle,
        'ideal-role-list':      deckData.idealRole
    };
    Object.entries(lists).forEach(([id, data]) => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = data.map(item => `<li>${item}</li>`).join('');
    });
    updateDeckIndicators();
}

function initializeDeckNavigation() {
    const container = document.getElementById('deck-indicators');
    const total     = document.querySelectorAll('.deck-slide').length;

    if (container) {
        container.innerHTML = Array.from({ length: total }, (_, i) =>
            `<div class="deck-indicator${i === 0 ? ' active' : ''}" data-slide="${i}"></div>`
        ).join('');

        container.querySelectorAll('.deck-indicator').forEach(ind => {
            ind.addEventListener('click', () => goToSlide(+ind.dataset.slide));
        });
    }

    document.addEventListener('keydown', (e) => {
        if (!document.getElementById('deck').classList.contains('active')) return;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nextSlide();
        if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   prevSlide();
    });
}

function updateDeckIndicators() {
    document.querySelectorAll('.deck-indicator').forEach((ind, i) => {
        ind.classList.toggle('active', i === currentSlide);
    });
}

function goToSlide(index) {
    const slides = document.querySelectorAll('.deck-slide');
    currentSlide = Math.max(0, Math.min(index, slides.length - 1));
    slides.forEach((s, i) => s.classList.toggle('active', i === currentSlide));
    updateDeckIndicators();
}

function nextSlide() { goToSlide(currentSlide + 1); }
function prevSlide() { goToSlide(currentSlide - 1); }

function togglePresentationMode() {
    const dc  = document.querySelector('.deck-container');
    const btn = document.getElementById('deck-pres-btn');
    if (!isPresentationMode) {
        dc.classList.add('presentation-mode');
        if (btn) btn.querySelector('[data-i18n]').textContent = translations[currentLanguage].deck.exitPresentation;
        isPresentationMode = true;
    } else {
        exitPresentationMode();
    }
}

function exitPresentationMode() {
    const dc  = document.querySelector('.deck-container');
    const btn = document.getElementById('deck-pres-btn');
    dc.classList.remove('presentation-mode');
    if (btn) btn.querySelector('[data-i18n]').textContent = translations[currentLanguage].deck.presentationMode;
    isPresentationMode = false;
}

// ========================================
// EXPORT — DECK (FULL CONTENT)
// Adds class 'printing-deck' to body → CSS reveals ALL slides,
// one per page. Class is removed after print via afterprint event.
// ========================================
function exportDeck() {
    switchTab('deck');
    goToSlide(0);
    document.body.classList.add('printing-deck');

    const cleanup = () => {
        document.body.classList.remove('printing-deck');
        window.removeEventListener('afterprint', cleanup);
    };
    window.addEventListener('afterprint', cleanup);
    setTimeout(() => window.print(), 120);
}

// ========================================
// COVER LETTER
// Generates from coverLetterTemplates[lang][tone] with placeholder substitution.
// ========================================
const coverLetterTemplates = {
    en: {
        professional: {
            opening: 'Dear {manager},',
            intro:   'I am writing to express my interest in the {role} position at {company}, as advertised on {source}. With my background in business development support, commercial operations, and market research, I am confident in my ability to contribute to your team\'s success.',
            body1:   'Throughout my career, I have developed strong capabilities in {focus}. My approach is rooted in structured execution, analytical thinking, and disciplined follow-through — whether managing pipeline visibility, refining messaging logic, or supporting commercial decision-making with clear, actionable insights.',
            body2:   'My core strengths include {skills}, all of which I have applied across international markets and multicultural environments. I am comfortable working with OpenAI tools to support research, structured drafting, and workflow efficiency, and I bring a disciplined, research-driven approach to every commercial activity I support.',
            closing: 'I would welcome the opportunity to discuss how my analytical and operational background aligns with the needs of your team. Thank you for considering my application.',
            signoff: 'Sincerely,'
        },
        warm: {
            opening: 'Dear {manager},',
            intro:   'I\'m excited to apply for the {role} position at {company}. I came across this opportunity on {source} and was immediately drawn to the chance to contribute my business development and commercial operations experience to your team.',
            body1:   'In my work, I focus on {focus} — bringing structure, clarity, and actionable insight to commercial activities. I believe in building strong foundations: clear follow-up logic, disciplined CRM practices, and messaging that resonates because it\'s grounded in real market feedback.',
            body2:   'Some of my key strengths include {skills}. I\'ve had the opportunity to apply these across international markets, and I\'m comfortable leveraging OpenAI tools to enhance research quality, drafting efficiency, and information synthesis. I thrive in environments where ownership, visibility, and remote autonomy are valued.',
            closing: 'I\'d love to chat about how my background could support your team\'s goals. Thanks so much for taking the time to review my application.',
            signoff: 'Warm regards,'
        },
        direct: {
            opening: 'Dear {manager},',
            intro:   'I am applying for the {role} position at {company} (posted on {source}). My background in business development operations, commercial support, and market research positions me to deliver immediate value to your team.',
            body1:   'My focus: {focus}. I execute with discipline, structure, and analytical rigour. My value lies in pipeline visibility, messaging logic, follow-up systems, and commercial insight that drives decision-making.',
            body2:   'Core capabilities: {skills}. Applied across international markets. Proficient with OpenAI tools for research, drafting, and workflow efficiency. Best suited for roles with clear ownership and remote autonomy.',
            closing: 'Available to discuss fit and next steps at your convenience.',
            signoff: 'Regards,'
        }
    },
    de: {
        professional: {
            opening: 'Sehr geehrte(r) {manager},',
            intro:   'hiermit bewerbe ich mich auf die Position als {role} bei {company}, wie auf {source} ausgeschrieben. Mit meinem Hintergrund in Business Development Support, kommerziellen Operationen und Marktforschung bin ich überzeugt, einen wertvollen Beitrag zum Erfolg Ihres Teams leisten zu können.',
            body1:   'Während meiner Karriere habe ich starke Fähigkeiten in {focus} entwickelt. Mein Ansatz basiert auf strukturierter Ausführung, analytischem Denken und disziplinierter Nachverfolgung — sei es bei der Verwaltung von Pipeline-Sichtbarkeit, der Verfeinerung von Messaging-Logik oder der Unterstützung kommerzieller Entscheidungsfindung mit klaren, umsetzbaren Erkenntnissen.',
            body2:   'Zu meinen Kernkompetenzen gehören {skills}, die ich in internationalen Märkten und multikulturellen Umgebungen angewendet habe. Ich arbeite sicher mit OpenAI-Tools zur Unterstützung von Recherche, strukturiertem Entwurf und Workflow-Effizienz und bringe einen disziplinierten, forschungsbasierten Ansatz in jede kommerzielle Aktivität ein, die ich unterstütze.',
            closing: 'Ich würde mich über die Gelegenheit freuen, zu besprechen, wie mein analytischer und operativer Hintergrund mit den Anforderungen Ihres Teams übereinstimmt. Vielen Dank für Ihre Berücksichtigung meiner Bewerbung.',
            signoff: 'Mit freundlichen Grüßen,'
        },
        warm: {
            opening: 'Liebe(r) {manager},',
            intro:   'ich freue mich sehr, mich auf die Position als {role} bei {company} zu bewerben. Ich bin auf diese Möglichkeit über {source} gestoßen und war sofort begeistert, meine Erfahrungen in Business Development und kommerziellen Operationen in Ihr Team einzubringen.',
            body1:   'In meiner Arbeit konzentriere ich mich auf {focus} — und bringe Struktur, Klarheit und umsetzbare Erkenntnisse in kommerzielle Aktivitäten. Ich glaube an den Aufbau solider Grundlagen: klare Follow-up-Logik, disziplinierte CRM-Praktiken und Messaging, das auf echtem Marktfeedback basiert.',
            body2:   'Einige meiner wichtigsten Stärken sind {skills}. Ich nutze OpenAI-Tools gerne zur Verbesserung der Forschungsqualität, Entwurfseffizienz und Informationssynthese. Ich gedeihe in Umgebungen, in denen Eigenverantwortung, Sichtbarkeit und remote Autonomie geschätzt werden.',
            closing: 'Ich würde mich freuen, darüber zu sprechen, wie mein Hintergrund die Ziele Ihres Teams unterstützen könnte. Vielen Dank für Ihre Zeit.',
            signoff: 'Herzliche Grüße,'
        },
        direct: {
            opening: 'Sehr geehrte(r) {manager},',
            intro:   'ich bewerbe mich auf die Position als {role} bei {company} (veröffentlicht auf {source}). Mein Hintergrund in Business Development Operations, kommerzieller Unterstützung und Marktforschung positioniert mich, sofortigen Mehrwert für Ihr Team zu liefern.',
            body1:   'Mein Fokus: {focus}. Ich exekutiere mit Disziplin, Struktur und analytischer Strenge. Mein Wert liegt in Pipeline-Sichtbarkeit, Messaging-Logik, Follow-up-Systemen und kommerziellen Erkenntnissen.',
            body2:   'Kernkompetenzen: {skills}. Angewendet in internationalen Märkten. Versiert mit OpenAI-Tools für Recherche, Entwurf und Workflow-Effizienz. Ideal für Rollen mit klarer Eigenverantwortung und remote Autonomie.',
            closing: 'Für Gespräche über Passung und nächste Schritte stehe ich jederzeit zur Verfügung.',
            signoff: 'Mit freundlichen Grüßen,'
        }
    },
    sk: {
        professional: {
            opening: 'Vážený/á {manager},',
            intro:   'touto žiadosťou sa uchádzam o pozíciu {role} v spoločnosti {company}, zverejnenú na {source}. S mojím backgroundom v business development podpore, komerčných operáciách a prieskume trhu som presvedčený, že dokážem prispieť k úspechu vášho tímu.',
            body1:   'Počas mojej kariéry som si vybudoval silné schopnosti v {focus}. Môj prístup je založený na štruktúrovanej exekúcii, analytickom myslení a disciplinovanom follow-through — či už ide o manažment pipeline viditeľnosti, vylepšovanie messaging logiky alebo podporu komerčného rozhodovania jasnými, akčnými insightmi.',
            body2:   'Medzi moje kľúčové kompetencie patria {skills}, ktoré som aplikoval na medzinárodných trhoch a v multikultúrnych prostrediach. Komfortne pracujem s OpenAI nástrojmi a do každej komerčnej aktivity, ktorú podporujem, prinášam disciplinovaný, výskumom podložený prístup.',
            closing: 'Privítal by som príležitosť diskutovať o tom, ako môj analytický a operačný background zodpovedá potrebám vášho tímu. Ďakujem za zváženie mojej žiadosti.',
            signoff: 'S pozdravom,'
        },
        warm: {
            opening: 'Milý/á {manager},',
            intro:   's nadšením sa uchádzam o pozíciu {role} v spoločnosti {company}. Narazil som na túto príležitosť na {source} a okamžite ma zaujala možnosť prispieť svojimi skúsenosťami v business developmente do vášho tímu.',
            body1:   'V mojej práci sa zameriavam na {focus} — prinášam štruktúru, jasnosť a akčné insighty do komerčných aktivít. Verím v budovanie pevných základov: jasná follow-up logika, disciplinované CRM praktiky a messaging, ktorý rezonuje, pretože je založený na reálnej spätnej väzbe z trhu.',
            body2:   'Niektoré z mojich kľúčových silných stránok zahŕňajú {skills}. Rád využívam OpenAI nástroje na zlepšenie kvality výskumu a efektivity tvorby konceptov. Darí sa mi v prostrediach, kde sa cení vlastná zodpovednosť, viditeľnosť a remote autonómia.',
            closing: 'Rád by som sa porozprával o tom, ako môj background môže podporiť ciele vášho tímu. Ďakujem za čas venovaný mojej žiadosti.',
            signoff: 'S teplým pozdravom,'
        },
        direct: {
            opening: 'Vážený/á {manager},',
            intro:   'uchádzam sa o pozíciu {role} v spoločnosti {company} (zverejnené na {source}). Môj background v business development operations a prieskume trhu ma positionuje na okamžité doručenie hodnoty pre váš tím.',
            body1:   'Môj fokus: {focus}. Exekutujem s disciplínou, štruktúrou a analytickou rigoróznosťou. Moja hodnota leží v pipeline viditeľnosti, messaging logike, follow-up systémoch a komerčných insightoch.',
            body2:   'Core kompetencie: {skills}. Aplikované na medzinárodných trhoch. Proficientný s OpenAI nástrojmi pre výskum a workflow efektivitu. Najviac vhodný pre role s jasnou zodpovednosťou a remote autonómiou.',
            closing: 'Dostupný na diskusiu o ďalších krokoch podľa vašej convenience.',
            signoff: 'S pozdravom,'
        }
    },
    es: {
        professional: {
            opening: 'Estimado/a {manager},',
            intro:   'Le escribo para expresar mi interés en la posición de {role} en {company}, anunciada en {source}. Con mi experiencia en soporte de desarrollo de negocios, operaciones comerciales e investigación de mercado, estoy seguro de mi capacidad para contribuir al éxito de su equipo.',
            body1:   'A lo largo de mi carrera, he desarrollado fuertes capacidades en {focus}. Mi enfoque se basa en ejecución estructurada, pensamiento analítico y seguimiento disciplinado — ya sea gestionando visibilidad de pipeline, refinando lógica de mensajes o apoyando la toma de decisiones comerciales con insights claros y accionables.',
            body2:   'Mis fortalezas clave incluyen {skills}, todas las cuales he aplicado en mercados internacionales y entornos multiculturales. Me siento cómodo trabajando con herramientas OpenAI para apoyar investigación, redacción estructurada y eficiencia de flujos de trabajo.',
            closing: 'Agradecería la oportunidad de discutir cómo mi background analítico y operacional se alinea con las necesidades de su equipo. Gracias por considerar mi solicitud.',
            signoff: 'Atentamente,'
        },
        warm: {
            opening: 'Querido/a {manager},',
            intro:   'Estoy emocionado de aplicar a la posición de {role} en {company}. Me encontré con esta oportunidad en {source} y me sentí inmediatamente atraído por la chance de contribuir con mi experiencia en desarrollo de negocios a su equipo.',
            body1:   'En mi trabajo, me enfoco en {focus} — aportando estructura, claridad e insights accionables a actividades comerciales. Creo en construir fundamentos sólidos: lógica de seguimiento clara, prácticas de CRM disciplinadas y mensajes que resuenan por estar basados en feedback real del mercado.',
            body2:   'Algunas de mis fortalezas clave incluyen {skills}. Me siento cómodo aprovechando herramientas OpenAI para mejorar la calidad de investigación y eficiencia de redacción. Prospero en entornos donde se valora la propiedad, visibilidad y autonomía remota.',
            closing: 'Me encantaría charlar sobre cómo mi background podría apoyar los objetivos de su equipo. Muchas gracias por tomarse el tiempo de revisar mi solicitud.',
            signoff: 'Saludos cordiales,'
        },
        direct: {
            opening: 'Estimado/a {manager},',
            intro:   'Estoy aplicando a la posición de {role} en {company} (publicada en {source}). Mi background en operaciones de desarrollo de negocios y investigación de mercado me posiciona para entregar valor inmediato a su equipo.',
            body1:   'Mi foco: {focus}. Ejecuto con disciplina, estructura y rigor analítico. Mi valor reside en visibilidad de pipeline, lógica de mensajes, sistemas de seguimiento e insights comerciales que impulsan la toma de decisiones.',
            body2:   'Capacidades clave: {skills}. Aplicadas en mercados internacionales. Competente con herramientas OpenAI para investigación y eficiencia de flujos de trabajo. Más adecuado para roles con propiedad clara y autonomía remota.',
            closing: 'Disponible para discutir encaje y próximos pasos a su conveniencia.',
            signoff: 'Saludos,'
        }
    }
};

function generateCoverLetter() {
    const company  = document.getElementById('cl-company').value  || '[Company]';
    const role     = document.getElementById('cl-role').value     || '[Role]';
    const manager  = document.getElementById('cl-manager').value  || '[Hiring Manager]';
    const source   = document.getElementById('cl-source').value   || '[Source]';
    const focus    = document.getElementById('cl-focus').value    || 'market segmentation, pipeline management, and commercial operations support';
    const skills   = document.getElementById('cl-skills').value   || 'CRM discipline, reporting, GTM support, and multilingual communication';
    const language = document.getElementById('cl-language').value;
    const tone     = document.getElementById('cl-tone').value;

    const tpl = coverLetterTemplates[language]?.[tone] || coverLetterTemplates.en.professional;

    const fill = (str) => str
        .replace('{manager}', manager)
        .replace('{role}', role)
        .replace('{company}', company)
        .replace('{source}', source)
        .replace('{focus}', focus)
        .replace('{skills}', skills);

    let letter = '';
    // Date line at top if timestamp enabled
    if (settings.dateTime.docTimestamp) {
        const dateStr = formatDateTime();
        if (dateStr) letter += (translations[language]?.coverLetter?.timestamp || 'Date: ') + dateStr + '\n\n';
    }
    letter += fill(tpl.opening) + '\n\n';
    letter += fill(tpl.intro)   + '\n\n';
    letter += fill(tpl.body1)   + '\n\n';
    letter += fill(tpl.body2)   + '\n\n';
    letter += fill(tpl.closing) + '\n\n';
    letter += tpl.signoff       + '\n';
    letter += personalInfo.fullName;

    document.getElementById('cl-preview').value = letter;
    saveCoverLetter(letter);
}

function resetCoverLetter() {
    ['cl-company','cl-role','cl-manager','cl-source','cl-focus','cl-skills'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    document.getElementById('cl-preview').value = '';
    localStorage.removeItem('coverLetterContent');
    localStorage.removeItem('coverLetterFormData');
}

function copyCoverLetter() {
    const text = document.getElementById('cl-preview').value;
    if (!text) { showToast(translations[currentLanguage]?.alerts?.noLetter || 'Generate a cover letter first.'); return; }
    navigator.clipboard.writeText(text).then(() => {
        showToast(translations[currentLanguage]?.alerts?.copiedLetter || 'Copied!');
    });
}

// ========================================
// EXPORT — COVER LETTER (FULL CONTENT)
// Renders the textarea content into a hidden #cl-print-output div
// with proper paragraphs, then adds body.printing-cl so CSS
// shows the div and hides the textarea in @media print.
// ========================================
function exportCoverLetter() {
    const text = document.getElementById('cl-preview').value;
    if (!text) {
        showToast(translations[currentLanguage]?.alerts?.noLetter || 'Generate a cover letter first.');
        return;
    }

    switchTab('cover-letter');

    // Build a clean print-ready version from the textarea
    const printDiv = document.getElementById('cl-print-output');
    if (printDiv) {
        printDiv.innerHTML = text
            .split('\n')
            .map(line => `<p>${line || '\u00A0'}</p>`)
            .join('');
    }

    document.body.classList.add('printing-cl');

    const cleanup = () => {
        document.body.classList.remove('printing-cl');
        window.removeEventListener('afterprint', cleanup);
    };
    window.addEventListener('afterprint', cleanup);
    setTimeout(() => window.print(), 120);
}

function saveCoverLetter(content) {
    localStorage.setItem('coverLetterContent', content);
}

function loadCoverLetter() {
    const saved = localStorage.getItem('coverLetterContent');
    if (saved) {
        const el = document.getElementById('cl-preview');
        if (el) el.value = saved;
    }

    const formData = localStorage.getItem('coverLetterFormData');
    if (formData) {
        try {
            const d = JSON.parse(formData);
            ['company','role','manager','source','focus','skills','language','tone'].forEach(key => {
                const el = document.getElementById(`cl-${key}`);
                if (el && d[key]) el.value = d[key];
            });
        } catch (e) {}
    }
}

// Auto-save cover letter form
document.addEventListener('DOMContentLoaded', () => {
    const formFields = ['cl-company','cl-role','cl-manager','cl-source','cl-focus','cl-skills','cl-language','cl-tone'];
    formFields.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('change', () => {
            const data = {};
            formFields.forEach(fid => {
                const fel = document.getElementById(fid);
                if (fel) data[fid.replace('cl-', '')] = fel.value;
            });
            localStorage.setItem('coverLetterFormData', JSON.stringify(data));
        });
    });
});

// ========================================
// TOAST NOTIFICATION — replaces alert()
// Shows a brief bottom-of-screen message
// ========================================
function showToast(message) {
    let toast = document.getElementById('app-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'app-toast';
        toast.style.cssText = `
            position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%) translateY(20px);
            background: #0a0a0a; color: #fff; padding: 10px 22px;
            border-radius: 6px; font-size: 13px; font-family: 'DM Sans', sans-serif;
            font-weight: 400; z-index: 9999; opacity: 0;
            transition: opacity 0.22s ease, transform 0.22s ease;
            white-space: nowrap; pointer-events: none;
        `;
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    // Animate in
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
    });
    // Animate out after 2.4s
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(10px)';
    }, 2400);
}

// ========================================
// HELPERS
// ========================================
function resolvePath(obj, path) {
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
}
function setEl(id, { text, href }) {
    const el = document.getElementById(id);
    if (!el) return;
    if (text !== undefined) el.textContent = text;
    if (href !== undefined) el.href = href;
}
function setElText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}
function setValue(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val;
}
function setChecked(id, val) {
    const el = document.getElementById(id);
    if (el) el.checked = val;
}

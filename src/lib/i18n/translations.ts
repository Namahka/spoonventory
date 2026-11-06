export type Language = "sv" | "en" | "es";

export const LANGUAGE_NAMES: Record<Language, string> = {
  sv: "Svenska",
  en: "English",
  es: "Español",
};

const sv = {
  // common
  "common.cancel": "Avbryt",
  "common.save": "Spara",
  "common.add": "Lägg till",
  "common.logout": "Logga ut",
  "common.clear": "Rensa",
  "common.password": "Lösenord",
  "common.name": "Namn",
  "common.close": "Stäng",

  // tabs
  "tabs.home": "Hem",
  "tabs.wellness": "Mående",
  "tabs.remember": "Kom ihåg",
  "tabs.settings": "Inställningar",

  // home
  "home.logActivity": "Logga aktivitet",
  "home.spoonsLeftToday": "skedar kvar idag",
  "home.used": "{count} använda",
  "home.carryover": "{value} imorgon",
  "home.back": "← Tillbaka",
  "home.newActivity": "Ny aktivitet",
  "home.namePlaceholder": "T.ex. Handla mat",
  "home.takesSpoons": "Tar skedar",
  "home.givesSpoons": "Ger skedar",
  "home.takes": "Tar:",
  "home.gives": "Ger:",

  // wellness
  "wellness.title": "Mående",
  "wellness.howAreYouToday": "Hur mår du idag?",
  "wellness.noneSelectedToday": "Inget valt idag",
  "wellness.daysLoggedThisMonth": "{count} dagar loggade denna månad",
  "wellness.mood1": "Jobbig",
  "wellness.mood2": "Mindre bra",
  "wellness.mood3": "Okej",
  "wellness.mood4": "Bra",
  "wellness.mood5": "Toppen",
  "wellness.symptoms": "Symtom",
  "wellness.addSymptom": "Lägg till symtom",
  "wellness.symptomPlaceholder": "T.ex. Huvudvärk",
  "wellness.symptomPain": "Smärta",
  "wellness.symptomFatigue": "Trötthet",
  "wellness.symptomDizziness": "Yrsel",
  "wellness.symptomBrainFog": "Hjärndimma",
  "wellness.symptomNausea": "Illamående",
  "wellness.medications": "Mediciner",
  "wellness.addMedication": "Lägg till medicin",
  "wellness.medicationNamePlaceholder": "Namn",
  "wellness.medicationDosagePlaceholder": "Dos (valfritt)",
  "wellness.note": "Anteckning för idag (valfritt)",
  "wellness.notePlaceholder": "Hur har dagen varit?",
  "wellness.trend": "Senaste 7 dagarna",
  "wellness.crashWarning":
    "Du har spenderat fler skedar än din dagsranson {count} dagar i rad. Överväg att vila idag.",
  "wellness.moodLabel": "Mående",
  "wellness.medicationsTaken": "Mediciner tagna",
  "wellness.noteLabel": "Anteckning",
  "wellness.noDataForDay": "Inget loggat denna dag",

  // remember
  "remember.title": "Kom ihåg",
  "remember.empty": "Inget att komma ihåg just nu ✓",
  "remember.newReminder": "Ny påminnelse",
  "remember.placeholder": "Vad vill du komma ihåg?",

  // settings
  "settings.title": "Inställningar",
  "settings.account": "Konto",
  "settings.username": "Användarnamn",
  "settings.changePassword": "Byt lösenord",
  "settings.security": "Säkerhet",
  "settings.requireCodeOnOpen": "Kod vid appöppning",
  "settings.changeCode": "Byt kod",
  "settings.on": "På",
  "settings.off": "Av",
  "settings.reminders": "Påminnelser",
  "settings.dailyReminder": "Daglig påminnelse",
  "settings.time": "Tid",
  "settings.done": "Klar",
  "settings.backup": "Backup",
  "settings.exportData": "Exportera data",
  "settings.importData": "Importera data",
  "settings.exporting": "Exporterar…",
  "settings.importing": "Importerar…",
  "settings.backupFooter":
    "Exportera all data till en fil, eller importera en tidigare backup. Praktiskt om du byter telefon.",
  "settings.clearAllData": "Rensa all data",
  "settings.language": "Språk",
  "settings.chooseLanguage": "Välj språk",

  // settings modals
  "settings.changeUsernameTitle": "Byt användarnamn",
  "settings.nameError": "Ange ett namn",
  "settings.currentPassword": "Nuvarande lösenord",
  "settings.newPassword": "Nytt lösenord",
  "settings.confirmNewPassword": "Bekräfta nytt lösenord",
  "settings.passwordFieldsError": "Fyll i alla fält",
  "settings.passwordMismatch": "Lösenorden matchar inte",
  "settings.wrongCurrentPassword": "Fel nuvarande lösenord",
  "settings.setPinTitle": "Ange en 4-siffrig kod",
  "settings.code": "Kod",
  "settings.confirmCode": "Bekräfta kod",
  "settings.codeLengthError": "Koden måste ha 4 siffror",
  "settings.codeMismatch": "Koderna matchar inte",
  "settings.currentCode": "Nuvarande kod",
  "settings.newCode": "Ny kod",
  "settings.confirmNewCode": "Bekräfta ny kod",
  "settings.wrongCurrentCode": "Fel nuvarande kod",

  // settings alerts
  "settings.logoutConfirmTitle": "Logga ut?",
  "settings.logoutConfirmBody":
    "Du måste logga in igen med ditt lösenord nästa gång.",
  "settings.resetConfirmBody":
    "Detta tar bort kontot, sparat skedsaldo, aktiviteter, mående och påminnelser. Är du säker?",
  "settings.notificationsOffTitle": "Aviseringar är avstängda",
  "settings.notificationsOffBody":
    "Tillåt aviseringar för Spoonventory i telefonens inställningar för att få påminnelsen.",
  "settings.importConfirmTitle": "Importera data?",
  "settings.importConfirmBody":
    "Detta skriver över all nuvarande data (konto, lösenordskod, skedsaldo, aktiviteter, mående och påminnelser) med innehållet i filen. Är du säker?",
  "settings.importConfirmAction": "Importera",
  "settings.importErrorTitle": "Kunde inte importera",
  "settings.importErrorBody": "Filen verkar inte vara en giltig backup.",
  "settings.exportErrorTitle": "Kunde inte exportera",
  "settings.exportErrorBody": "Något gick fel vid exporten.",

  // login
  "login.title": "Logga in",
  "login.welcomeBack": "Välkommen tillbaka, {name}",
  "login.wrongPassword": "Fel lösenord",
  "login.submit": "Logga in",
  "login.submitting": "Loggar in...",
  "login.forgotPassword": "Glömt lösenordet? Rensa all data",
  "login.resetConfirmBody":
    "Detta tar bort kontot och all sparad data permanent. Är du säker?",

  // create account
  "createAccount.title": "Skapa konto",
  "createAccount.welcome": "Välkommen till spoonventory",
  "createAccount.namePlaceholder": "Ditt namn",
  "createAccount.confirmPassword": "Bekräfta lösenord",
  "createAccount.nameError": "Ange ett namn",
  "createAccount.passwordError": "Ange ett lösenord",
  "createAccount.passwordMismatch": "Lösenorden matchar inte",
  "createAccount.submit": "Skapa konto",
  "createAccount.submitting": "Skapar konto...",

  // unlock
  "unlock.title": "Ange kod",
  "unlock.subtitle": "Skriv din 4-siffriga kod för att låsa upp",
  "unlock.wrongCode": "Fel kod",
  "unlock.logoutInstead": "Logga ut istället",
  "unlock.logoutConfirmBody":
    "Du loggas ut och måste logga in igen med lösenord.",
} as const;

const en: Record<keyof typeof sv, string> = {
  // common
  "common.cancel": "Cancel",
  "common.save": "Save",
  "common.add": "Add",
  "common.logout": "Log out",
  "common.clear": "Clear",
  "common.password": "Password",
  "common.name": "Name",
  "common.close": "Close",

  // tabs
  "tabs.home": "Home",
  "tabs.wellness": "Wellness",
  "tabs.remember": "Remember",
  "tabs.settings": "Settings",

  // home
  "home.logActivity": "Log activity",
  "home.spoonsLeftToday": "spoons left today",
  "home.used": "{count} used",
  "home.carryover": "{value} tomorrow",
  "home.back": "← Back",
  "home.newActivity": "New activity",
  "home.namePlaceholder": "E.g. Grocery shopping",
  "home.takesSpoons": "Takes spoons",
  "home.givesSpoons": "Gives spoons",
  "home.takes": "Takes:",
  "home.gives": "Gives:",

  // wellness
  "wellness.title": "Wellness",
  "wellness.howAreYouToday": "How are you feeling today?",
  "wellness.noneSelectedToday": "Nothing selected today",
  "wellness.daysLoggedThisMonth": "{count} days logged this month",
  "wellness.mood1": "Tough",
  "wellness.mood2": "Not great",
  "wellness.mood3": "Okay",
  "wellness.mood4": "Good",
  "wellness.mood5": "Great",
  "wellness.symptoms": "Symptoms",
  "wellness.addSymptom": "Add symptom",
  "wellness.symptomPlaceholder": "E.g. Headache",
  "wellness.symptomPain": "Pain",
  "wellness.symptomFatigue": "Fatigue",
  "wellness.symptomDizziness": "Dizziness",
  "wellness.symptomBrainFog": "Brain fog",
  "wellness.symptomNausea": "Nausea",
  "wellness.medications": "Medications",
  "wellness.addMedication": "Add medication",
  "wellness.medicationNamePlaceholder": "Name",
  "wellness.medicationDosagePlaceholder": "Dosage (optional)",
  "wellness.note": "Note for today (optional)",
  "wellness.notePlaceholder": "How has the day been?",
  "wellness.trend": "Last 7 days",
  "wellness.crashWarning":
    "You've spent more spoons than your daily allowance {count} days in a row. Consider resting today.",
  "wellness.moodLabel": "Mood",
  "wellness.medicationsTaken": "Medications taken",
  "wellness.noteLabel": "Note",
  "wellness.noDataForDay": "Nothing logged for this day",

  // remember
  "remember.title": "Remember",
  "remember.empty": "Nothing to remember right now ✓",
  "remember.newReminder": "New reminder",
  "remember.placeholder": "What do you want to remember?",

  // settings
  "settings.title": "Settings",
  "settings.account": "Account",
  "settings.username": "Username",
  "settings.changePassword": "Change password",
  "settings.security": "Security",
  "settings.requireCodeOnOpen": "Code on app open",
  "settings.changeCode": "Change code",
  "settings.on": "On",
  "settings.off": "Off",
  "settings.reminders": "Reminders",
  "settings.dailyReminder": "Daily reminder",
  "settings.time": "Time",
  "settings.done": "Done",
  "settings.backup": "Backup",
  "settings.exportData": "Export data",
  "settings.importData": "Import data",
  "settings.exporting": "Exporting…",
  "settings.importing": "Importing…",
  "settings.backupFooter":
    "Export all your data to a file, or import a previous backup. Handy if you switch phones.",
  "settings.clearAllData": "Clear all data",
  "settings.language": "Language",
  "settings.chooseLanguage": "Choose language",

  // settings modals
  "settings.changeUsernameTitle": "Change username",
  "settings.nameError": "Enter a name",
  "settings.currentPassword": "Current password",
  "settings.newPassword": "New password",
  "settings.confirmNewPassword": "Confirm new password",
  "settings.passwordFieldsError": "Fill in all fields",
  "settings.passwordMismatch": "Passwords don't match",
  "settings.wrongCurrentPassword": "Wrong current password",
  "settings.setPinTitle": "Enter a 4-digit code",
  "settings.code": "Code",
  "settings.confirmCode": "Confirm code",
  "settings.codeLengthError": "The code must have 4 digits",
  "settings.codeMismatch": "The codes don't match",
  "settings.currentCode": "Current code",
  "settings.newCode": "New code",
  "settings.confirmNewCode": "Confirm new code",
  "settings.wrongCurrentCode": "Wrong current code",

  // settings alerts
  "settings.logoutConfirmTitle": "Log out?",
  "settings.logoutConfirmBody":
    "You'll need to log in again with your password next time.",
  "settings.resetConfirmBody":
    "This removes the account, saved spoon balance, activities, wellness logs, and reminders. Are you sure?",
  "settings.notificationsOffTitle": "Notifications are off",
  "settings.notificationsOffBody":
    "Allow notifications for Spoonventory in your phone settings to get the reminder.",
  "settings.importConfirmTitle": "Import data?",
  "settings.importConfirmBody":
    "This overwrites all current data (account, passcode, spoon balance, activities, wellness logs, and reminders) with the contents of the file. Are you sure?",
  "settings.importConfirmAction": "Import",
  "settings.importErrorTitle": "Couldn't import",
  "settings.importErrorBody": "The file doesn't seem to be a valid backup.",
  "settings.exportErrorTitle": "Couldn't export",
  "settings.exportErrorBody": "Something went wrong during the export.",

  // login
  "login.title": "Log in",
  "login.welcomeBack": "Welcome back, {name}",
  "login.wrongPassword": "Wrong password",
  "login.submit": "Log in",
  "login.submitting": "Logging in...",
  "login.forgotPassword": "Forgot your password? Clear all data",
  "login.resetConfirmBody":
    "This permanently removes the account and all saved data. Are you sure?",

  // create account
  "createAccount.title": "Create account",
  "createAccount.welcome": "Welcome to spoonventory",
  "createAccount.namePlaceholder": "Your name",
  "createAccount.confirmPassword": "Confirm password",
  "createAccount.nameError": "Enter a name",
  "createAccount.passwordError": "Enter a password",
  "createAccount.passwordMismatch": "Passwords don't match",
  "createAccount.submit": "Create account",
  "createAccount.submitting": "Creating account...",

  // unlock
  "unlock.title": "Enter code",
  "unlock.subtitle": "Enter your 4-digit code to unlock",
  "unlock.wrongCode": "Wrong code",
  "unlock.logoutInstead": "Log out instead",
  "unlock.logoutConfirmBody":
    "You'll be logged out and need to log in again with your password.",
};

const es: Record<keyof typeof sv, string> = {
  // common
  "common.cancel": "Cancelar",
  "common.save": "Guardar",
  "common.add": "Añadir",
  "common.logout": "Cerrar sesión",
  "common.clear": "Borrar",
  "common.password": "Contraseña",
  "common.name": "Nombre",
  "common.close": "Cerrar",

  // tabs
  "tabs.home": "Inicio",
  "tabs.wellness": "Bienestar",
  "tabs.remember": "Recordatorios",
  "tabs.settings": "Ajustes",

  // home
  "home.logActivity": "Registrar actividad",
  "home.spoonsLeftToday": "cucharas restantes hoy",
  "home.used": "{count} usadas",
  "home.carryover": "{value} mañana",
  "home.back": "← Atrás",
  "home.newActivity": "Nueva actividad",
  "home.namePlaceholder": "Ej. Hacer la compra",
  "home.takesSpoons": "Quita cucharas",
  "home.givesSpoons": "Da cucharas",
  "home.takes": "Quita:",
  "home.gives": "Da:",

  // wellness
  "wellness.title": "Bienestar",
  "wellness.howAreYouToday": "¿Cómo te sientes hoy?",
  "wellness.noneSelectedToday": "Nada seleccionado hoy",
  "wellness.daysLoggedThisMonth": "{count} días registrados este mes",
  "wellness.mood1": "Difícil",
  "wellness.mood2": "No muy bien",
  "wellness.mood3": "Normal",
  "wellness.mood4": "Bien",
  "wellness.mood5": "Genial",
  "wellness.symptoms": "Síntomas",
  "wellness.addSymptom": "Añadir síntoma",
  "wellness.symptomPlaceholder": "Ej. Dolor de cabeza",
  "wellness.symptomPain": "Dolor",
  "wellness.symptomFatigue": "Fatiga",
  "wellness.symptomDizziness": "Mareo",
  "wellness.symptomBrainFog": "Niebla mental",
  "wellness.symptomNausea": "Náuseas",
  "wellness.medications": "Medicamentos",
  "wellness.addMedication": "Añadir medicamento",
  "wellness.medicationNamePlaceholder": "Nombre",
  "wellness.medicationDosagePlaceholder": "Dosis (opcional)",
  "wellness.note": "Nota de hoy (opcional)",
  "wellness.notePlaceholder": "¿Cómo ha ido el día?",
  "wellness.trend": "Últimos 7 días",
  "wellness.crashWarning":
    "Has gastado más cucharas que tu ración diaria {count} días seguidos. Considera descansar hoy.",
  "wellness.moodLabel": "Estado de ánimo",
  "wellness.medicationsTaken": "Medicamentos tomados",
  "wellness.noteLabel": "Nota",
  "wellness.noDataForDay": "Nada registrado este día",

  // remember
  "remember.title": "Recordatorios",
  "remember.empty": "Nada que recordar por ahora ✓",
  "remember.newReminder": "Nuevo recordatorio",
  "remember.placeholder": "¿Qué quieres recordar?",

  // settings
  "settings.title": "Ajustes",
  "settings.account": "Cuenta",
  "settings.username": "Nombre de usuario",
  "settings.changePassword": "Cambiar contraseña",
  "settings.security": "Seguridad",
  "settings.requireCodeOnOpen": "Código al abrir la app",
  "settings.changeCode": "Cambiar código",
  "settings.on": "Activado",
  "settings.off": "Desactivado",
  "settings.reminders": "Recordatorios",
  "settings.dailyReminder": "Recordatorio diario",
  "settings.time": "Hora",
  "settings.done": "Listo",
  "settings.backup": "Copia de seguridad",
  "settings.exportData": "Exportar datos",
  "settings.importData": "Importar datos",
  "settings.exporting": "Exportando…",
  "settings.importing": "Importando…",
  "settings.backupFooter":
    "Exporta todos tus datos a un archivo, o importa una copia de seguridad anterior. Útil si cambias de teléfono.",
  "settings.clearAllData": "Borrar todos los datos",
  "settings.language": "Idioma",
  "settings.chooseLanguage": "Elige idioma",

  // settings modals
  "settings.changeUsernameTitle": "Cambiar nombre de usuario",
  "settings.nameError": "Introduce un nombre",
  "settings.currentPassword": "Contraseña actual",
  "settings.newPassword": "Nueva contraseña",
  "settings.confirmNewPassword": "Confirmar nueva contraseña",
  "settings.passwordFieldsError": "Completa todos los campos",
  "settings.passwordMismatch": "Las contraseñas no coinciden",
  "settings.wrongCurrentPassword": "Contraseña actual incorrecta",
  "settings.setPinTitle": "Introduce un código de 4 dígitos",
  "settings.code": "Código",
  "settings.confirmCode": "Confirmar código",
  "settings.codeLengthError": "El código debe tener 4 dígitos",
  "settings.codeMismatch": "Los códigos no coinciden",
  "settings.currentCode": "Código actual",
  "settings.newCode": "Nuevo código",
  "settings.confirmNewCode": "Confirmar nuevo código",
  "settings.wrongCurrentCode": "Código actual incorrecto",

  // settings alerts
  "settings.logoutConfirmTitle": "¿Cerrar sesión?",
  "settings.logoutConfirmBody":
    "Tendrás que iniciar sesión de nuevo con tu contraseña la próxima vez.",
  "settings.resetConfirmBody":
    "Esto elimina la cuenta, el saldo de cucharas guardado, las actividades, los registros de bienestar y los recordatorios. ¿Estás seguro?",
  "settings.notificationsOffTitle": "Las notificaciones están desactivadas",
  "settings.notificationsOffBody":
    "Permite las notificaciones de Spoonventory en la configuración del teléfono para recibir el recordatorio.",
  "settings.importConfirmTitle": "¿Importar datos?",
  "settings.importConfirmBody":
    "Esto sobrescribirá todos los datos actuales (cuenta, código, saldo de cucharas, actividades, registros de bienestar y recordatorios) con el contenido del archivo. ¿Estás seguro?",
  "settings.importConfirmAction": "Importar",
  "settings.importErrorTitle": "No se pudo importar",
  "settings.importErrorBody":
    "El archivo no parece ser una copia de seguridad válida.",
  "settings.exportErrorTitle": "No se pudo exportar",
  "settings.exportErrorBody": "Algo salió mal durante la exportación.",

  // login
  "login.title": "Iniciar sesión",
  "login.welcomeBack": "Bienvenido/a de nuevo, {name}",
  "login.wrongPassword": "Contraseña incorrecta",
  "login.submit": "Iniciar sesión",
  "login.submitting": "Iniciando sesión...",
  "login.forgotPassword": "¿Olvidaste tu contraseña? Borrar todos los datos",
  "login.resetConfirmBody":
    "Esto eliminará la cuenta y todos los datos guardados de forma permanente. ¿Estás seguro?",

  // create account
  "createAccount.title": "Crear cuenta",
  "createAccount.welcome": "Bienvenido/a a spoonventory",
  "createAccount.namePlaceholder": "Tu nombre",
  "createAccount.confirmPassword": "Confirmar contraseña",
  "createAccount.nameError": "Introduce un nombre",
  "createAccount.passwordError": "Introduce una contraseña",
  "createAccount.passwordMismatch": "Las contraseñas no coinciden",
  "createAccount.submit": "Crear cuenta",
  "createAccount.submitting": "Creando cuenta...",

  // unlock
  "unlock.title": "Introduce el código",
  "unlock.subtitle": "Escribe tu código de 4 dígitos para desbloquear",
  "unlock.wrongCode": "Código incorrecto",
  "unlock.logoutInstead": "Cerrar sesión en su lugar",
  "unlock.logoutConfirmBody":
    "Se cerrará tu sesión y deberás iniciar sesión de nuevo con tu contraseña.",
};

export const translations: Record<Language, Record<keyof typeof sv, string>> = {
  sv,
  en,
  es,
};

export type TranslationKey = keyof typeof sv;

export function interpolate(
  template: string,
  vars?: Record<string, string | number>,
): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? ""));
}

export const MONTH_NAMES: Record<Language, string[]> = {
  sv: [
    "Januari",
    "Februari",
    "Mars",
    "April",
    "Maj",
    "Juni",
    "Juli",
    "Augusti",
    "September",
    "Oktober",
    "November",
    "December",
  ],
  en: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  es: [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ],
};

export const WEEKDAY_LABELS: Record<Language, string[]> = {
  sv: ["M", "T", "O", "T", "F", "L", "S"],
  en: ["M", "T", "W", "T", "F", "S", "S"],
  es: ["L", "M", "X", "J", "V", "S", "D"],
};

// Authentication & Users
export interface LoginCredentials {
  username: string;
  password: string;
  companyId?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  companyId?: string;
  company?: Company;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

export interface Company {
  id: string;
  name: string;
  address?: string;
  city?: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  website?: string;
  settings?: any;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Core Business Types
export interface PersonData {
  vorname: string;
  nachname: string;
  geburtsdatum?: Date;
  geburtsort?: string;
  sterbedatum?: Date;
  sterbeort?: string;
  sterbezeit?: string;
  todesursache?: string;
  familienstand?: string;
  religion?: string;
  staatsangehoerigkeit?: string;
  beruf?: string;
  strasse?: string;
  hausnummer?: string;
  plz?: string;
  ort?: string;
  telefon?: string;
  email?: string;
  besonderheiten?: string;
}

export interface AngehoerigeData {
  beziehung: string;
  person: PersonData;
  istKontaktperson: boolean;
  istBestattungspflichtig: boolean;
}

export interface TrauerfeierData {
  datum?: Date;
  uhrzeit?: string;
  ort?: string;
  art?: 'kirchlich' | 'weltlich' | 'keine';
  redner?: string;
  musik?: string[];
  besonderheiten?: string;
  teilnehmerAnzahl?: number;
  kosten?: number;
}

export interface DokumentData {
  id: string;
  typ: DokumentTyp;
  titel: string;
  inhalt?: string;
  dateiPfad?: string;
  erstellt: Date;
  autor: string;
  status: 'entwurf' | 'fertig' | 'versendet';
}

export interface BehoerdenData {
  standesamt?: {
    name: string;
    kontakt: string;
    angemeldet: boolean;
    datum?: Date;
  };
  friedhofsamt?: {
    name: string;
    kontakt: string;
    angemeldet: boolean;
    datum?: Date;
  };
  krankenkasse?: {
    name: string;
    kontakt: string;
    informiert: boolean;
    datum?: Date;
  };
  rentenversicherung?: {
    informiert: boolean;
    datum?: Date;
  };
  weitere?: Array<{
    behoerde: string;
    kontakt: string;
    status: boolean;
    datum?: Date;
  }>;
}

export interface FinanzierungData {
  typ: 'einmalzahlung' | 'ratenzahlung' | 'versicherung';
  versicherung?: {
    gesellschaft: string;
    policenNummer: string;
    deckungssumme: number;
  };
  ratenzahlung?: {
    anzahlRaten: number;
    ratenHoehe: number;
    beginn: Date;
  };
}

// KI Generated Content
export interface KIGeneratedContent {
  trauerrede?: {
    titel: string;
    inhalt: string;
    stil: 'formell' | 'persoenlich' | 'religioes';
    dauer: number; // in Minuten
    generiert: Date;
  };
  traueranzeige?: {
    titel: string;
    text: string;
    layout: string;
    generiert: Date;
  };
  danksagung?: {
    text: string;
    empfaenger: string[];
    generiert: Date;
  };
  nachruf?: {
    titel: string;
    text: string;
    generiert: Date;
  };
}

// Enums
export enum UserRole {
  ADMIN = 'ADMIN',
  GESCHAEFTSFUEHRUNG = 'GESCHAEFTSFUEHRUNG',
  MANAGER = 'MANAGER',
  MITARBEITER = 'MITARBEITER',
  AUSHILFE = 'AUSHILFE'
}

export enum SterbefallStatus {
  ERFASSUNG = 'ERFASSUNG',
  BEARBEITUNG = 'BEARBEITUNG',
  BEHOERDEN = 'BEHOERDEN',
  PLANUNG = 'PLANUNG',
  TRAUERFEIER = 'TRAUERFEIER',
  ABGESCHLOSSEN = 'ABGESCHLOSSEN'
}

export enum VorsorgeStatus {
  INTERESSENT = 'INTERESSENT',
  BERATUNG = 'BERATUNG',
  VERTRAGSABSCHLUSS = 'VERTRAGSABSCHLUSS',
  AKTIV = 'AKTIV',
  ABGESCHLOSSEN = 'ABGESCHLOSSEN'
}

export enum Bestattungsart {
  ERDBESTATTUNG = 'ERDBESTATTUNG',
  FEUERBESTATTUNG = 'FEUERBESTATTUNG',
  SEEBESTATTUNG = 'SEEBESTATTUNG',
  BAUMBESTATTUNG = 'BAUMBESTATTUNG',
  DIAMANTBESTATTUNG = 'DIAMANTBESTATTUNG'
}

export enum DokumentTyp {
  TRAUERREDE = 'TRAUERREDE',
  TRAUERANZEIGE = 'TRAUERANZEIGE',
  DANKSAGUNG = 'DANKSAGUNG',
  NACHRUF = 'NACHRUF',
  STERBEURKUNDE = 'STERBEURKUNDE',
  KOSTENVORANSCHLAG = 'KOSTENVORANSCHLAG',
  RECHNUNG = 'RECHNUNG',
  VERTRAG = 'VERTRAG',
  SONSTIGES = 'SONSTIGES'
}

export enum ActivityType {
  STERBEFALL_ERSTELLT = 'STERBEFALL_ERSTELLT',
  STERBEFALL_BEARBEITET = 'STERBEFALL_BEARBEITET',
  STERBEFALL_ABGESCHLOSSEN = 'STERBEFALL_ABGESCHLOSSEN',
  VORSORGE_ERSTELLT = 'VORSORGE_ERSTELLT',
  VORSORGE_BEARBEITET = 'VORSORGE_BEARBEITET',
  DOKUMENT_ERSTELLT = 'DOKUMENT_ERSTELLT',
  KI_VERWENDET = 'KI_VERWENDET',
  BEHOERDE_KONTAKTIERT = 'BEHOERDE_KONTAKTIERT',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT'
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Form Types
export interface SterbefallFormData {
  verstorbener: PersonData;
  angehoerige: AngehoerigeData[];
  bestattungsart?: Bestattungsart;
  bestattungsdatum?: Date;
  friedhof?: string;
  grabstelle?: string;
  trauerfeier?: TrauerfeierData;
  besonderheiten?: string;
}

export interface VorsorgeFormData {
  person: PersonData;
  bestattungsart?: Bestattungsart;
  friedhofswunsch?: string;
  besondereWuensche?: any;
  finanzierung?: FinanzierungData;
  betrag?: number;
}

// Dashboard & Analytics
export interface DashboardStats {
  totalSterbefaelle: number;
  aktiveSterbefaelle: number;
  abgeschlosseneSterbefaelle: number;
  totalVorsorgen: number;
  aktiveVorsorgen: number;
  umsatzMonat: number;
  umsatzJahr: number;
  durchschnittlicheBearbeitungszeit: number; // in Stunden
}

export interface ActivityLog {
  id: string;
  type: ActivityType;
  description: string;
  details?: any;
  userId: string;
  user?: User;
  sterbefallId?: string;
  vorsorgeId?: string;
  createdAt: Date;
}

// Test Mode Types (nur für localhost)
export interface TestUser {
  username: string;
  role: UserRole;
  company: string;
} 
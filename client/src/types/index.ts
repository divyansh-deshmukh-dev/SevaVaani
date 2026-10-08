export type LanguageCode = 'hi' | 'mr' | 'en';

export type SessionState =
  | 'WELCOME'
  | 'SERVICE_DISCOVERY'
  | 'NEED_DISCOVERY'
  | 'ELIGIBILITY_QUESTIONS'
  | 'SERVICE_RECOMMENDATION'
  | 'SERVICE_CONFIRM'
  | 'ASK_FIELD'
  | 'AWAIT_ANSWER'
  | 'CONFIRM_FIELD'
  | 'FALLBACK_INPUT'
  | 'FINAL_REVIEW'
  | 'SUBMITTING'
  | 'DONE'
  | 'HANDOFF'
  | 'GUIDANCE'
  | 'ERROR';

export type VoiceState = 'IDLE' | 'LISTENING' | 'PROCESSING' | 'SPEAKING' | 'ERROR';

export type FieldType =
  | 'text'
  | 'digits'
  | 'number'
  | 'number_unit'
  | 'date'
  | 'place'
  | 'select'
  | 'yes_no';

export type FieldStatus = 'pending' | 'captured' | 'confirmed' | 'unverified';

export interface LocalizedString {
  en: string;
  hi: string;
  mr: string;
}

export interface ServiceDefinition {
  serviceId: string;
  name: LocalizedString;
  category: string;
  aliases: string[];
  directApplicationSupported: boolean;
  guidanceAvailable: boolean;
  description: LocalizedString;
  formSchemaId?: string;
  eligibilityRuleId?: string;
  apiAdapter?: string;
  requiredDocuments: LocalizedString[];
  officialSource?: string;
  isDemo: boolean;
}

export interface FormFieldDefinition {
  id: string;
  label: LocalizedString;
  prompt: LocalizedString;
  type: FieldType;
  required: boolean;
  helpText?: LocalizedString;
  grouping?: number;
  unitOptions?: string[];
  options?: LocalizedString[];
  placeholder?: LocalizedString;
}

export interface FormSchema {
  formId: string;
  serviceId: string;
  title: LocalizedString;
  fields: FormFieldDefinition[];
}

export interface TurnRequest {
  text?: string;
  audioBase64?: string;
  mimeType?: string;
  language: LanguageCode;
  action?: string;
  fieldId?: string;
  value?: unknown;
}

export interface TurnResponse {
  sessionId: string;
  state: SessionState;
  assistantMessage: LocalizedString;
  currentField?: FormFieldDefinition;
  fieldIndex: number;
  totalFields: number;
  formData: Record<string, unknown>;
  fieldStatuses: Record<string, FieldStatus>;
  confidence: number;
  fallbackLevel: number;
  service?: ServiceDefinition;
  recommendedServices: ServiceDefinition[];
  guidanceInfo?: Record<string, unknown>;
  submissionResult?: {
    success: boolean;
    applicationId: string;
    status: string;
    message: string;
    timestamp: string;
  };
  transcript?: string;
  detectedIntent?: string;
}

export interface CitizenUser {
  name: string;
  mobile: string;
  maskedAadhaar: string;
  state: string;
  district: string;
  village: string;
  isGuest: boolean;
  isAuthenticated: boolean;
}

export interface ApplicationRecord {
  applicationId: string;
  serviceId: string;
  serviceName: string;
  date: string;
  status: 'SUBMITTED (DEMO)' | 'IN_PROGRESS' | 'UNDER_REVIEW (DEMO)' | 'APPROVED (DEMO)';
  step: number;
  totalSteps: number;
  isDemo: boolean;
  formData: Record<string, unknown>;
  lastUpdated: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'demo';
  read: boolean;
  link?: string;
}

export interface AccessibilitySettings {
  textSize: 'normal' | 'large' | 'xlarge';
  highContrast: boolean;
  reducedMotion: boolean;
  voiceSpeed: 'normal' | 'slow' | 'fast';
}

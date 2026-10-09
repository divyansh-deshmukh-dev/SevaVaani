import type { LanguageCode } from '../types';

export interface SpeechRecognitionResult {
  transcript: string;
  isFinal: boolean;
  confidence?: number;
}

export type SpeechErrorCode =
  | 'not-supported'
  | 'not-allowed'
  | 'no-speech'
  | 'network'
  | 'audio-capture'
  | 'aborted'
  | 'unknown';

export interface SpeechRecognitionError {
  code: SpeechErrorCode;
  message: string;
  rawError?: unknown;
}

export interface VoiceInfo {
  id: string;
  name: string;
  lang: string;
  isLocalService?: boolean;
}

export interface TTSResult {
  spoken: boolean;
  voiceUsed?: string;
  reason?: 'no_voice' | 'unsupported' | 'cancelled' | 'error';
  errorMessage?: string;
}

export interface ISTTProvider {
  name: string;
  isSupported(): boolean;
  startListening(
    lang: LanguageCode,
    onResult: (res: SpeechRecognitionResult) => void,
    onError: (err: SpeechRecognitionError) => void,
    onEnd: () => void
  ): void;
  stopListening(): void;
  abort(): void;
}

export interface ITTSProvider {
  name: string;
  isSupported(): boolean;
  getAvailableVoices(): Promise<VoiceInfo[]>;
  hasVoiceForLanguage(lang: LanguageCode): boolean;
  speak(
    text: string,
    lang: LanguageCode,
    onEnd?: () => void,
    onError?: (err: Error) => void
  ): Promise<TTSResult>;
  cancel(): void;
}

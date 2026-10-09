import type { LanguageCode } from '../types';
import { BrowserSTTAdapter, BrowserTTSAdapter } from './browserSpeech';
import type {
  ISTTProvider,
  ITTSProvider,
  SpeechRecognitionResult,
  SpeechRecognitionError,
  VoiceInfo,
  TTSResult
} from './types';

export * from './types';
export { BrowserSTTAdapter, BrowserTTSAdapter };

export class SpeechService {
  private sttProvider: ISTTProvider;
  private ttsProvider: ITTSProvider;

  constructor(
    sttProvider?: ISTTProvider,
    ttsProvider?: ITTSProvider
  ) {
    this.sttProvider = sttProvider || new BrowserSTTAdapter();
    this.ttsProvider = ttsProvider || new BrowserTTSAdapter();
  }

  public setSTTProvider(provider: ISTTProvider) {
    this.sttProvider = provider;
  }

  public setTTSProvider(provider: ITTSProvider) {
    this.ttsProvider = provider;
  }

  public isSupported(): boolean {
    return this.sttProvider.isSupported();
  }

  public isRecognitionSupported(): boolean {
    return this.sttProvider.isSupported();
  }

  public isSynthesisSupported(): boolean {
    return this.ttsProvider.isSupported();
  }

  public hasVoiceForLanguage(lang: LanguageCode): boolean {
    return this.ttsProvider.hasVoiceForLanguage(lang);
  }

  public async getAvailableVoices(): Promise<VoiceInfo[]> {
    return this.ttsProvider.getAvailableVoices();
  }

  public startListening(
    lang: LanguageCode,
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (error: SpeechRecognitionError) => void,
    onEnd: () => void
  ) {
    this.sttProvider.startListening(
      lang,
      (res: SpeechRecognitionResult) => {
        onResult(res.transcript, res.isFinal);
      },
      (err: SpeechRecognitionError) => {
        onError(err);
      },
      onEnd
    );
  }

  public stopListening() {
    this.sttProvider.stopListening();
  }

  public async speak(
    text: string,
    lang: LanguageCode,
    onEnd?: () => void,
    onError?: (err: Error) => void
  ): Promise<TTSResult> {
    return this.ttsProvider.speak(text, lang, onEnd, onError);
  }

  public cancelSpeech() {
    this.ttsProvider.cancel();
  }
}

export const speechService = new SpeechService();

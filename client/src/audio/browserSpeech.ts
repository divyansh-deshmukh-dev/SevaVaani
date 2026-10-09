import type { LanguageCode } from '../types';
import type {
  ISTTProvider,
  ITTSProvider,
  SpeechRecognitionResult,
  SpeechRecognitionError,
  SpeechErrorCode,
  VoiceInfo,
  TTSResult
} from './types';

const LANG_MAP: Record<LanguageCode, string> = {
  hi: 'hi-IN',
  mr: 'mr-IN',
  en: 'en-IN'
};

export class BrowserSTTAdapter implements ISTTProvider {
  public readonly name = 'Browser Web Speech Recognition';
  private recognition: any = null;
  private isListening = false;
  private deliveredFinal = false;

  constructor() {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 1;
      } catch (err) {
        console.warn('Failed to initialize SpeechRecognition:', err);
        this.recognition = null;
      }
    }
  }

  public isSupported(): boolean {
    return this.recognition !== null;
  }

  public startListening(
    lang: LanguageCode,
    onResult: (res: SpeechRecognitionResult) => void,
    onError: (err: SpeechRecognitionError) => void,
    onEnd: () => void
  ): void {
    if (!this.recognition) {
      onError({
        code: 'not-supported',
        message: 'Speech recognition is not supported in this browser.'
      });
      return;
    }

    if (this.isListening) {
      try {
        this.recognition.abort();
      } catch {}
      this.isListening = false;
    }

    this.deliveredFinal = false;
    this.recognition.lang = LANG_MAP[lang] || 'hi-IN';

    this.recognition.onstart = () => {
      this.isListening = true;
    };

    this.recognition.onresult = (event: any) => {
      let interim = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const item = event.results[i];
        if (item.isFinal) {
          finalTranscript += item[0].transcript;
        } else {
          interim += item[0].transcript;
        }
      }

      if (finalTranscript.trim()) {
        if (!this.deliveredFinal) {
          this.deliveredFinal = true;
          onResult({
            transcript: finalTranscript.trim(),
            isFinal: true,
            confidence: event.results[event.results.length - 1]?.[0]?.confidence
          });
        }
      } else if (interim.trim() && !this.deliveredFinal) {
        onResult({
          transcript: interim.trim(),
          isFinal: false
        });
      }
    };

    this.recognition.onerror = (event: any) => {
      this.isListening = false;
      const rawCode = event.error || 'unknown';
      let code: SpeechErrorCode = 'unknown';

      switch (rawCode) {
        case 'not-allowed':
        case 'service-not-allowed':
          code = 'not-allowed';
          break;
        case 'no-speech':
          code = 'no-speech';
          break;
        case 'network':
          code = 'network';
          break;
        case 'audio-capture':
          code = 'audio-capture';
          break;
        case 'aborted':
          code = 'aborted';
          break;
        default:
          code = 'unknown';
      }

      onError({
        code,
        message: event.message || rawCode,
        rawError: event
      });
    };

    this.recognition.onend = () => {
      this.isListening = false;
      onEnd();
    };

    try {
      this.recognition.start();
    } catch (err: any) {
      this.isListening = false;
      onError({
        code: 'audio-capture',
        message: err?.message || 'Could not access microphone.',
        rawError: err
      });
    }
  }

  public stopListening(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch {}
      this.isListening = false;
    }
  }

  public abort(): void {
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch {}
      this.isListening = false;
    }
  }
}

export class BrowserTTSAdapter implements ITTSProvider {
  public readonly name = 'Browser Web Speech Synthesis';
  private voices: SpeechSynthesisVoice[] = [];
  private voicesLoaded = false;
  private voicesPromise: Promise<SpeechSynthesisVoice[]> | null = null;

  constructor() {
    if (this.isSupported()) {
      this.initVoices();
    }
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  private initVoices(): Promise<SpeechSynthesisVoice[]> {
    if (!this.isSupported()) return Promise.resolve([]);
    if (this.voicesLoaded && this.voices.length > 0) return Promise.resolve(this.voices);

    if (this.voicesPromise) return this.voicesPromise;

    this.voicesPromise = new Promise((resolve) => {
      const existing = window.speechSynthesis.getVoices();
      if (existing && existing.length > 0) {
        this.voices = existing;
        this.voicesLoaded = true;
        resolve(existing);
        return;
      }

      // Listen for voiceschanged event (common in Chrome/Edge)
      const onVoicesChanged = () => {
        const loaded = window.speechSynthesis.getVoices();
        if (loaded && loaded.length > 0) {
          this.voices = loaded;
          this.voicesLoaded = true;
          window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
          resolve(loaded);
        }
      };

      window.speechSynthesis.addEventListener('voiceschanged', onVoicesChanged);

      // Fallback timeout in case voiceschanged never fires (e.g., Safari or empty OS list)
      setTimeout(() => {
        const finalCheck = window.speechSynthesis.getVoices();
        this.voices = finalCheck || [];
        this.voicesLoaded = true;
        resolve(this.voices);
      }, 500);
    });

    return this.voicesPromise;
  }

  public async getAvailableVoices(): Promise<VoiceInfo[]> {
    const list = await this.initVoices();
    return list.map((v) => ({
      id: v.voiceURI,
      name: v.name,
      lang: v.lang,
      isLocalService: v.localService
    }));
  }

  private matchVoiceForLang(lang: LanguageCode, voicesList: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
    if (!voicesList || voicesList.length === 0) return null;

    if (lang === 'hi') {
      // 1. Exact hi-IN match
      const hiExact = voicesList.find((v) => v.lang.toLowerCase().replace('_', '-') === 'hi-in');
      if (hiExact) return hiExact;

      // 2. Any hi prefix
      const hiPrefix = voicesList.find((v) => v.lang.toLowerCase().startsWith('hi'));
      if (hiPrefix) return hiPrefix;

      // 3. Name matches Hindi or हिन्दी
      const hiName = voicesList.find((v) =>
        /hindi|हिन्दी/i.test(v.name)
      );
      if (hiName) return hiName;

      // Strict requirement: Never use an English voice for Hindi!
      return null;
    }

    if (lang === 'mr') {
      // 1. Exact mr-IN match
      const mrExact = voicesList.find((v) => v.lang.toLowerCase().replace('_', '-') === 'mr-in');
      if (mrExact) return mrExact;

      // 2. Any mr prefix
      const mrPrefix = voicesList.find((v) => v.lang.toLowerCase().startsWith('mr'));
      if (mrPrefix) return mrPrefix;

      // 3. Name matches Marathi or मराठी
      const mrName = voicesList.find((v) =>
        /marathi|मराठी/i.test(v.name)
      );
      if (mrName) return mrName;

      // Strict requirement: Never use an English voice for Marathi!
      return null;
    }

    if (lang === 'en') {
      // 1. Indian English voice preferred
      const enIn = voicesList.find((v) => {
        const tag = v.lang.toLowerCase().replace('_', '-');
        return tag === 'en-in' || (tag.startsWith('en') && /india|indian/i.test(v.name));
      });
      if (enIn) return enIn;

      // 2. Any English voice
      const anyEn = voicesList.find((v) => v.lang.toLowerCase().startsWith('en'));
      if (anyEn) return anyEn;

      return voicesList[0] || null;
    }

    return null;
  }

  public hasVoiceForLanguage(lang: LanguageCode): boolean {
    if (!this.isSupported()) return false;
    const currentVoices = window.speechSynthesis.getVoices();
    const list = currentVoices && currentVoices.length > 0 ? currentVoices : this.voices;
    return this.matchVoiceForLang(lang, list) !== null;
  }

  public async speak(
    text: string,
    lang: LanguageCode,
    onEnd?: () => void,
    onError?: (err: Error) => void
  ): Promise<TTSResult> {
    if (!this.isSupported() || !text.trim()) {
      onEnd?.();
      return { spoken: false, reason: 'unsupported' };
    }

    this.cancel();

    const voicesList = await this.initVoices();
    const matchedVoice = this.matchVoiceForLang(lang, voicesList);

    // Strict rule: if no matching native voice exists for Hindi or Marathi, DO NOT speak with English voice!
    if (!matchedVoice && (lang === 'hi' || lang === 'mr')) {
      onEnd?.();
      return {
        spoken: false,
        reason: 'no_voice',
        errorMessage: `No native ${lang === 'hi' ? 'Hindi' : 'Marathi'} voice installed on this device.`
      };
    }

    return new Promise((resolve) => {
      try {
        const utterance = new SpeechSynthesisUtterance(text);
        if (matchedVoice) {
          utterance.voice = matchedVoice;
          utterance.lang = matchedVoice.lang;
        } else {
          utterance.lang = LANG_MAP[lang] || 'en-IN';
        }

        // Accessibility standard rate for public service clarity
        utterance.rate = 0.92;
        utterance.pitch = 1.0;

        let finished = false;
        const markDone = () => {
          if (!finished) {
            finished = true;
            onEnd?.();
          }
        };

        utterance.onend = () => {
          markDone();
          resolve({ spoken: true, voiceUsed: matchedVoice?.name || utterance.lang });
        };

        utterance.onerror = (e) => {
          markDone();
          onError?.(new Error(e.error || 'TTS playback error'));
          resolve({ spoken: false, reason: 'error', errorMessage: e.error });
        };

        window.speechSynthesis.speak(utterance);
      } catch (err: any) {
        onEnd?.();
        onError?.(err);
        resolve({ spoken: false, reason: 'error', errorMessage: err?.message });
      }
    });
  }

  public cancel(): void {
    if (this.isSupported()) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
  }
}

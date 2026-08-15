import { soundEffects } from './sound.service';

export interface VoiceState {
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  isSupported: boolean;
  audioLevel: number;
}

export class VoiceEngine {
  private recognition: any = null;
  private isListening: boolean = false;
  private isSpeaking: boolean = false;
  private ttsEnabled: boolean = true;
  private onStateChangeCallback: ((state: VoiceState) => void) | null = null;
  private onTranscriptFinalCallback: ((text: string) => void) | null = null;

  constructor() {
    this.initRecognition();
  }

  private initRecognition() {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        this.isListening = true;
        soundEffects.playActivate();
        this.notifyState();
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.notifyState();
      };

      this.recognition.onerror = (e: any) => {
        console.warn('Speech recognition error:', e.error);
        this.isListening = false;
        this.notifyState();
      };

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcriptPiece = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPiece;
          } else {
            interimTranscript += transcriptPiece;
          }
        }

        if (finalTranscript.trim() && this.onTranscriptFinalCallback) {
          soundEffects.playConfirm();
          this.onTranscriptFinalCallback(finalTranscript.trim());
        }

        this.notifyState(interimTranscript || finalTranscript);
      };
    }
  }

  public isSupported(): boolean {
    return Boolean(this.recognition && 'speechSynthesis' in window);
  }

  public toggleListening(): boolean {
    if (!this.recognition) return false;

    if (this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    } else {
      try {
        this.recognition.start();
        this.isListening = true;
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
      }
    }
    this.notifyState();
    return this.isListening;
  }

  public speak(text: string) {
    if (!this.ttsEnabled || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    // Clean markdown formatting before speaking
    const cleanText = text
      .replace(/[#*_`~>-]/g, '')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/```[\s\S]*?```/g, 'Code block executed.')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 0.95;

    // Pick best available English voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice =
      voices.find((v) => v.name.includes('David') || v.name.includes('George') || v.name.includes('Natural')) ||
      voices.find((v) => v.lang.startsWith('en')) ||
      voices[0];

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.notifyState();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.notifyState();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      this.notifyState();
    };

    window.speechSynthesis.speak(utterance);
  }

  public stopSpeaking() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
      this.notifyState();
    }
  }

  public setTTSEnabled(enabled: boolean) {
    this.ttsEnabled = enabled;
    if (!enabled) this.stopSpeaking();
  }

  public isTTSEnabled(): boolean {
    return this.ttsEnabled;
  }

  public onStateChange(callback: (state: VoiceState) => void) {
    this.onStateChangeCallback = callback;
  }

  public onTranscript(callback: (text: string) => void) {
    this.onTranscriptFinalCallback = callback;
  }

  private notifyState(transcript: string = '') {
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback({
        isListening: this.isListening,
        isSpeaking: this.isSpeaking,
        transcript,
        isSupported: this.isSupported(),
        audioLevel: this.isListening || this.isSpeaking ? 0.75 : 0,
      });
    }
  }
}

export const voiceEngine = new VoiceEngine();

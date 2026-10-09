import type { TurnRequest, TurnResponse, LanguageCode } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export class ApiClient {
  public simulate2G: boolean = false;

  private async delayIfSimulated() {
    // No artificial network latency
  }

  public async createSession(lang: LanguageCode = 'hi'): Promise<TurnResponse> {
    await this.delayIfSimulated();
    const res = await fetch(`${API_BASE}/api/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language: lang })
    });
    if (!res.ok) throw new Error(`Failed to create session: ${res.statusText}`);
    return res.json();
  }

  public async sendTurn(sessionId: string, req: TurnRequest): Promise<TurnResponse> {
    await this.delayIfSimulated();
    const res = await fetch(`${API_BASE}/api/session/${sessionId}/turn`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req)
    });
    if (!res.ok) throw new Error(`Turn failed: ${res.statusText}`);
    return res.json();
  }

  public async sendAction(sessionId: string, req: TurnRequest): Promise<TurnResponse> {
    await this.delayIfSimulated();
    const res = await fetch(`${API_BASE}/api/session/${sessionId}/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req)
    });
    if (!res.ok) throw new Error(`Action failed: ${res.statusText}`);
    return res.json();
  }

  public async getSummary(sessionId: string, lang: LanguageCode) {
    await this.delayIfSimulated();
    const res = await fetch(`${API_BASE}/api/session/${sessionId}/summary?language=${lang}`);
    if (!res.ok) throw new Error('Failed to load summary');
    return res.json();
  }

  public async getHandoff(sessionId: string) {
    const res = await fetch(`${API_BASE}/api/session/${sessionId}/handoff`);
    if (!res.ok) return null;
    return res.json();
  }

  public async getServices() {
    await this.delayIfSimulated();
    const res = await fetch(`${API_BASE}/api/services`);
    if (!res.ok) throw new Error('Failed to load services catalog');
    return res.json();
  }

  public async getService(serviceId: string) {
    await this.delayIfSimulated();
    const res = await fetch(`${API_BASE}/api/services/${serviceId}`);
    if (!res.ok) throw new Error(`Failed to load service '${serviceId}'`);
    return res.json();
  }

  public async searchServices(query: string, language: LanguageCode = 'hi') {
    await this.delayIfSimulated();
    const res = await fetch(`${API_BASE}/api/services/search?q=${encodeURIComponent(query)}&language=${language}`);
    if (!res.ok) throw new Error('Failed to search services');
    return res.json();
  }

  public async getServiceGuidance(serviceId: string, language: LanguageCode = 'hi') {
    await this.delayIfSimulated();
    const res = await fetch(`${API_BASE}/api/services/${serviceId}/guidance?language=${language}`);
    if (!res.ok) throw new Error(`Failed to load guidance for service '${serviceId}'`);
    return res.json();
  }

  public async getServiceForm(serviceId: string) {
    await this.delayIfSimulated();
    const res = await fetch(`${API_BASE}/api/services/${serviceId}/form`);
    if (!res.ok) throw new Error(`Failed to load form for service '${serviceId}'`);
    return res.json();
  }

  public async getServiceEligibility(serviceId: string) {
    await this.delayIfSimulated();
    const res = await fetch(`${API_BASE}/api/services/${serviceId}/eligibility`);
    if (!res.ok) throw new Error(`Failed to load eligibility for service '${serviceId}'`);
    return res.json();
  }


  public async getMetrics() {
    const res = await fetch(`${API_BASE}/api/metrics`);
    if (!res.ok) throw new Error('Failed to load metrics');
    return res.json();
  }

  public async checkStatus(serviceId: string, appId: string) {
    await this.delayIfSimulated();
    const res = await fetch(`${API_BASE}/api/services/${serviceId}/status/${appId}`);
    if (!res.ok) throw new Error('Application ID not found');
    return res.json();
  }

  public async calculateWer(reference: string, hypothesis: string, language: LanguageCode) {
    const res = await fetch(`${API_BASE}/api/eval/wer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reference, hypothesis, language })
    });
    if (!res.ok) throw new Error('Failed to calculate WER');
    return res.json();
  }

  public async getSpeechStatus() {
    const res = await fetch(`${API_BASE}/api/speech/status`);
    if (!res.ok) throw new Error('Failed to load speech provider status');
    return res.json();
  }
}

export const apiClient = new ApiClient();

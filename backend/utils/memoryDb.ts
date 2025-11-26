interface CaseTemplate {
  id: string;
  name: string;
  description?: string;
  required_documents: any[];
  reminder_interval_days: number;
  administrative_silence_days: number;
  created_at: string;
  updated_at: string;
}

interface Client {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  case_template_id?: string;
  case_type?: string;
  required_documents: any[];
  reminder_interval_days: number;
  administrative_silence_days: number;
  payment: any;
  submitted_to_immigration: boolean;
  application_date?: string;
  notifications: any[];
  additional_docs_required: boolean;
  created_at: string;
  updated_at: string;
}

class MemoryDB {
  private templates = new Map<string, CaseTemplate>();
  private clients = new Map<string, Client>();
  private templateCounter = 0;
  private clientCounter = 0;

  // Templates
  async insertTemplate(data: Omit<CaseTemplate, 'id' | 'created_at' | 'updated_at'>): Promise<CaseTemplate> {
    const id = `template_${++this.templateCounter}_${Date.now()}`;
    const now = new Date().toISOString();
    const template: CaseTemplate = {
      ...data,
      id,
      created_at: now,
      updated_at: now,
    };
    this.templates.set(id, template);
    return template;
  }

  async getTemplates(): Promise<CaseTemplate[]> {
    return Array.from(this.templates.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  async getTemplate(id: string): Promise<CaseTemplate | null> {
    return this.templates.get(id) || null;
  }

  async updateTemplate(id: string, data: Partial<CaseTemplate>): Promise<CaseTemplate | null> {
    const template = this.templates.get(id);
    if (!template) return null;
    const updated = { ...template, ...data, updated_at: new Date().toISOString() };
    this.templates.set(id, updated);
    return updated;
  }

  async deleteTemplate(id: string): Promise<boolean> {
    return this.templates.delete(id);
  }

  // Clients
  async insertClient(data: Omit<Client, 'id' | 'created_at' | 'updated_at'>): Promise<Client> {
    const id = `client_${++this.clientCounter}_${Date.now()}`;
    const now = new Date().toISOString();
    const client: Client = {
      ...data,
      id,
      created_at: now,
      updated_at: now,
    };
    this.clients.set(id, client);
    return client;
  }

  async getClients(): Promise<Client[]> {
    return Array.from(this.clients.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  async getClient(id: string): Promise<Client | null> {
    return this.clients.get(id) || null;
  }

  async updateClient(id: string, data: Partial<Client>): Promise<Client | null> {
    const client = this.clients.get(id);
    if (!client) return null;
    const updated = { ...client, ...data, updated_at: new Date().toISOString() };
    this.clients.set(id, updated);
    return updated;
  }

  async deleteClient(id: string): Promise<boolean> {
    return this.clients.delete(id);
  }
}

export const memoryDb = new MemoryDB();


// Use environment variable in production, relative path in development
const API_URL = import.meta.env.VITE_API_URL || '/api';

export const api = {
  async getCaseTemplates() {
    const response = await fetch(`${API_URL}/case-templates`);
    if (!response.ok) throw new Error('Failed to fetch templates');
    return response.json();
  },

  async createCaseTemplate(data: any) {
    const response = await fetch(`${API_URL}/case-templates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to create template' }));
      throw new Error(error.error || error.details || 'Failed to create template');
    }
    return response.json();
  },

  async updateCaseTemplate(id: string, data: any) {
    const response = await fetch(`${API_URL}/case-templates/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update template');
    return response.json();
  },

  async deleteCaseTemplate(id: string) {
    const response = await fetch(`${API_URL}/case-templates/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete template');
    return response.json();
  },

  async getClients() {
    const response = await fetch(`${API_URL}/clients`);
    if (!response.ok) throw new Error('Failed to fetch clients');
    return response.json();
  },

  async getClient(id: string) {
    const response = await fetch(`${API_URL}/clients/${id}`);
    if (!response.ok) throw new Error('Failed to fetch client');
    return response.json();
  },

  async createClient(data: any) {
    const response = await fetch(`${API_URL}/clients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create client');
    return response.json();
  },

  async updateClient(id: string, data: any) {
    const response = await fetch(`${API_URL}/clients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update client');
    return response.json();
  },

  async uploadDocument(clientId: string, documentCode: string, file: File) {
    // For now, we'll simulate file upload by creating a file URL
    // In a real app, you'd upload to a file storage service
    const fileUrl = URL.createObjectURL(file);
    const client = await this.getClient(clientId);
    
    const updatedDocuments = client.required_documents.map((doc: any) => {
      if (doc.code === documentCode) {
        return {
          ...doc,
          submitted: true,
          fileUrl: fileUrl,
          uploadedAt: new Date().toISOString(),
          fileName: file.name,
          fileSize: file.size,
        };
      }
      return doc;
    });

    return this.updateClient(clientId, {
      required_documents: updatedDocuments,
    });
  },

  async addPayment(clientId: string, amount: number, method: string, note?: string) {
    const client = await this.getClient(clientId);
    const newPayment = {
      amount,
      date: new Date().toISOString(),
      method,
      note: note || undefined,
    };
    
    const updatedPayments = [...(client.payment.payments || []), newPayment];
    const newPaidAmount = (client.payment.paidAmount || 0) + amount;

    return this.updateClient(clientId, {
      payment: {
        ...client.payment,
        paidAmount: newPaidAmount,
        payments: updatedPayments,
      },
    });
  },

  async updateNotes(clientId: string, notes: string) {
    return this.updateClient(clientId, { notes });
  },

  async uploadAdditionalDocument(clientId: string, name: string, description: string, file: File) {
    const fileUrl = URL.createObjectURL(file);
    const client = await this.getClient(clientId);
    
    const newDocument = {
      id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      description: description || undefined,
      fileUrl,
      fileName: file.name,
      fileSize: file.size,
      uploadedAt: new Date().toISOString(),
    };

    const updatedAdditionalDocs = [...(client.additional_documents || []), newDocument];

    return this.updateClient(clientId, {
      additional_documents: updatedAdditionalDocs,
    });
  },

  async removeAdditionalDocument(clientId: string, documentId: string) {
    const client = await this.getClient(clientId);
    const updatedAdditionalDocs = (client.additional_documents || []).filter(
      (doc: any) => doc.id !== documentId
    );

    return this.updateClient(clientId, {
      additional_documents: updatedAdditionalDocs,
    });
  },

  async submitToAdministrative(clientId: string) {
    return this.updateClient(clientId, {
      submitted_to_immigration: true,
      application_date: new Date().toISOString(),
    });
  },

  async deleteClient(id: string) {
    const response = await fetch(`${API_URL}/clients/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete client');
    return response.json();
  },
};


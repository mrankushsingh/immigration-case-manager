import { Router } from 'express';
import { memoryDb } from '../utils/memoryDb.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, caseTemplateId, totalFee } = req.body;
    
    if (!firstName || !lastName) {
      return res.status(400).json({ error: 'First name and last name are required' });
    }

    let requiredDocs: any[] = [];
    let caseType = '';
    let reminderInterval = 10;
    let adminSilenceDays = 60;

    if (caseTemplateId) {
      const template = await memoryDb.getTemplate(caseTemplateId);
      if (template) {
        caseType = template.name;
        reminderInterval = template.reminder_interval_days;
        adminSilenceDays = template.administrative_silence_days;
        if (Array.isArray(template.required_documents)) {
          requiredDocs = template.required_documents.map((doc: any) => ({
            code: doc.code,
            name: doc.name,
            description: doc.description || '',
            submitted: false,
            fileUrl: null,
            uploadedAt: null,
          }));
        }
      }
    }

    const client = await memoryDb.insertClient({
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      case_template_id: caseTemplateId || null,
      case_type: caseType,
      required_documents: requiredDocs,
      reminder_interval_days: reminderInterval,
      administrative_silence_days: adminSilenceDays,
      payment: {
        totalFee: totalFee || 0,
        paidAmount: 0,
        payments: [],
      },
      submitted_to_immigration: false,
      notifications: [],
      additional_docs_required: false,
      notes: '',
      additional_documents: [],
    });

    res.status(201).json(client);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to create client' });
  }
});

router.get('/', async (req, res) => {
  try {
    const clients = await memoryDb.getClients();
    res.json(clients);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch clients' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const client = await memoryDb.getClient(req.params.id);
    if (!client) return res.status(404).json({ error: 'Client not found' });
    res.json(client);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch client' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const client = await memoryDb.updateClient(req.params.id, req.body);
    if (!client) return res.status(404).json({ error: 'Client not found' });
    res.json(client);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update client' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await memoryDb.deleteClient(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Client not found' });
    res.json({ message: 'Client deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete client' });
  }
});

export default router;


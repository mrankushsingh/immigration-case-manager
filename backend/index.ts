import express from 'express';
import cors from 'cors';
import caseTemplatesRoutes from './routes/caseTemplates.js';
import clientsRoutes from './routes/clients.js';

const app = express();
const PORT = Number(process.env.PORT) || 4000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/case-templates', caseTemplatesRoutes);
app.use('/api/clients', clientsRoutes);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🌐 Server accessible on all network interfaces`);
});


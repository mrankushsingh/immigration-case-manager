import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, FileText } from 'lucide-react';
import { api } from '../utils/api';
import { CaseTemplate } from '../types';
import CreateTemplateModal from './CreateTemplateModal';

export default function Templates() {
  const [templates, setTemplates] = useState<CaseTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<CaseTemplate | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const data = await api.getCaseTemplates();
      setTemplates(data);
    } catch (error) {
      console.error('Failed to load templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;
    try {
      await api.deleteCaseTemplate(id);
      await loadTemplates();
    } catch (error) {
      alert('Failed to delete template');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-slate-700"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center border-b border-gray-200 pb-6">
        <div>
          <h2 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">Case Templates</h2>
          <p className="text-slate-600 text-lg">Create and manage case templates</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold professional-shadow-lg hover:bg-slate-800 hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>New Template</span>
        </button>
      </div>

      {templates.length === 0 ? (
        <div className="bg-white rounded-2xl professional-shadow-lg border border-gray-100 p-16 text-center animate-scale-in">
          <div className="bg-slate-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">No templates yet</h3>
          <p className="text-slate-500 mb-8 text-lg">Create your first template to get started</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-slate-900 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-slate-800 transition-all professional-shadow-lg hover:shadow-xl"
          >
            Create Template
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template, index) => (
            <div
              key={template.id}
              className="bg-white rounded-2xl professional-shadow-lg border border-gray-100 p-6 card-hover animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{template.name}</h3>
                  {template.description && (
                    <p className="text-sm text-slate-500 line-clamp-2">{template.description}</p>
                  )}
                </div>
                <div className="flex space-x-1 ml-2">
                  <button
                    onClick={() => setEditingTemplate(template)}
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Edit template"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(template.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-600">Documents</span>
                  <span className="text-sm font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">
                    {template.required_documents.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-600">Reminder Interval</span>
                  <span className="text-sm font-semibold text-slate-700">
                    {template.reminder_interval_days} days
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-600">Admin Silence</span>
                  <span className="text-sm font-semibold text-slate-700">
                    {template.administrative_silence_days} days
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateTemplateModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            loadTemplates();
          }}
        />
      )}

      {editingTemplate && (
        <CreateTemplateModal
          template={editingTemplate}
          onClose={() => setEditingTemplate(null)}
          onSuccess={() => {
            setEditingTemplate(null);
            loadTemplates();
          }}
        />
      )}
    </div>
  );
}


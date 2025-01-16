import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { casesService } from '../../services/cases.service';
import { useAuthStore } from '../../store/authStore';
import type { Image } from '../../types';

export default function CaseForm() {
  const [formData, setFormData] = useState({
    patientId: '',
    summary: '',
    clinicalFindings: '',
    tags: [] as string[],
  });
  const [newTag, setNewTag] = useState('');
  const [mediaLinks, setMediaLinks] = useState<Image[]>([]);
  const [newMediaLink, setNewMediaLink] = useState({ url: '', type: 'image' as 'image' | 'video' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);

  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Enter detailed case description here...</p>',
  });

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAddMediaLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMediaLink.url.trim()) {
      setMediaLinks(prev => [...prev, { ...newMediaLink }]);
      setNewMediaLink({ url: '', type: 'image' });
    }
  };

  const removeMediaLink = (index: number) => {
    setMediaLinks(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to create a case');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const newCase = await casesService.addCase({
        ...formData,
        clinicalFindings: editor?.getHTML() || '',
        created_by: user.id,
        images: mediaLinks,
        external_links: []
      });

      navigate(`/cases/${newCase.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create case');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-8 divide-y divide-gray-200" onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="space-y-8 divide-y divide-gray-200">
        <div>
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">New Case</h3>
            <p className="mt-1 text-sm text-gray-500">
              Please provide all relevant information about the case.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="patientId" className="block text-sm font-medium text-gray-700">
                Patient ID
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="patientId"
                  id="patientId"
                  required
                  value={formData.patientId}
                  onChange={(e) => setFormData(prev => ({ ...prev, patientId: e.target.value }))}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
                Summary
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="summary"
                  id="summary"
                  required
                  value={formData.summary}
                  onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label className="block text-sm font-medium text-gray-700">Clinical Findings</label>
              <div className="mt-1 prose max-w-none">
                <EditorContent editor={editor} className="min-h-[200px] border border-gray-300 rounded-md p-4" />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label className="block text-sm font-medium text-gray-700">Media Links</label>
              <div className="mt-1 space-y-4">
                <div className="flex gap-4">
                  <input
                    type="url"
                    value={newMediaLink.url}
                    onChange={(e) => setNewMediaLink(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="Enter image or video URL"
                    className="flex-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                  <select
                    value={newMediaLink.type}
                    onChange={(e) => setNewMediaLink(prev => ({ ...prev, type: e.target.value as 'image' | 'video' }))}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleAddMediaLink}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {mediaLinks.map((link, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex-1 truncate">
                        <p className="text-sm font-medium text-gray-900">{link.type}</p>
                        <p className="text-sm text-gray-500 truncate">{link.url}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMediaLink(index)}
                        className="ml-2 p-1 text-gray-400 hover:text-gray-500"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="sm:col-span-6">
              <label className="block text-sm font-medium text-gray-700">Tags</label>
              <div className="mt-1">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Type and press Enter to add tags"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 inline-flex items-center p-0.5 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate('/cases')}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Case'}
          </button>
        </div>
      </div>
    </form>
  );
}
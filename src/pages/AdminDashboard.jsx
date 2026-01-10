// src/pages/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/superbaseClient';
import { nanoid } from 'nanoid';

export default function AdminDashboard() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: '',
    relationship: '',
    thoughts: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadEntries();
  }, []);

  async function loadEntries() {
    const { data, error } = await supabase
      .from('people_thoughts')
      .select('id, name, relationship, thoughts, created_at, secret_token')
      .order('created_at', { ascending: false });

    if (error) console.error('Error loading entries:', error);
    else setEntries(data || []);
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (isEditing) {
      const { error } = await supabase
        .from('people_thoughts')
        .update({
          name: form.name.trim(),
          relationship: form.relationship.trim(),
          thoughts: form.thoughts.trim(),
        })
        .eq('id', form.id);

      if (error) setMessage('Error updating: ' + error.message);
      else {
        setMessage('Entry updated successfully! ✨');
        resetForm();
      }
    } else {
      const secretToken = nanoid(10);
      const { error } = await supabase.from('people_thoughts').insert({
        name: form.name.trim(),
        relationship: form.relationship.trim(),
        thoughts: form.thoughts.trim(),
        secret_token: secretToken,
      });

      if (error) setMessage('Error saving: ' + error.message);
      else {
        setMessage('New entry created! 🎉');
        resetForm();
      }
    }

    setLoading(false);
    loadEntries();
  };

  const startEdit = (entry) => {
    setForm({
      id: entry.id,
      name: entry.name,
      relationship: entry.relationship || '',
      thoughts: entry.thoughts,
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this entry? This cannot be undone.')) {
      return;
    }

    setLoading(true);
    const { error } = await supabase.from('people_thoughts').delete().eq('id', id);

    if (error) {
      setMessage('Error deleting entry: ' + error.message);
    } else {
      setMessage('Entry deleted successfully');
      loadEntries();
    }
    setLoading(false);
  };

  const resetForm = () => {
    setForm({ id: null, name: '', relationship: '', thoughts: '' });
    setIsEditing(false);
  };

  const copyLink = (token) => {
    const link = `${window.location.origin}/s/${token}`;
    navigator.clipboard.writeText(link);
    setMessage('Link copied to clipboard! 🔗');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Main container - full viewport height usage */}
      <div className="min-h-screen flex flex-col">
        {/* Header - sticky on scroll */}
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-indigo-100 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Secret Diary
            </h1>
            <button
              onClick={handleLogout}
              className="px-5 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-full font-medium hover:from-red-600 hover:to-rose-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto space-y-10">
            {/* Message toast */}
            {message && (
              <div
                className={`p-4 rounded-xl text-center font-medium shadow-md animate-fade-in ${
                  message.includes('Error')
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                {message}
              </div>
            )}

            {/* Form Card - elevated with glass effect */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30 overflow-hidden">
              <div className="p-6 sm:p-8 lg:p-10">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {isEditing ? 'Edit Memory' : 'New Secret Thought'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <input
                    name="name"
                    placeholder="Who is this about?"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 bg-white/60 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none transition-all text-lg placeholder-gray-500"
                  />

                  <input
                    name="relationship"
                    placeholder="Your relationship (optional)"
                    value={form.relationship}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-white/60 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none transition-all text-lg placeholder-gray-500"
                  />

                  <textarea
                    name="thoughts"
                    placeholder="Write everything you feel..."
                    value={form.thoughts}
                    onChange={handleChange}
                    rows={7}
                    required
                    className="w-full px-5 py-4 bg-white/60 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none transition-all text-lg placeholder-gray-500 resize-y"
                  />

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`flex-1 py-4 px-8 rounded-xl font-semibold text-white text-lg transition-all transform ${
                        loading
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl hover:-translate-y-1'
                      }`}
                    >
                      {loading
                        ? 'Saving...'
                        : isEditing
                        ? 'Update Memory'
                        : 'Create Secret Entry'}
                    </button>

                    {isEditing && (
                      <button
                        type="button"
                        onClick={resetForm}
                        className="flex-1 py-4 px-8 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* Entries Section */}
            <section>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8 text-center sm:text-left">
                Your Hidden Thoughts ({entries.length})
              </h3>

              {entries.length === 0 ? (
                <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-12 text-center border border-white/30">
                  <p className="text-xl text-gray-600">Nothing here yet... Start writing your secrets! ✍️</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {entries.map((entry) => (
                    <div
                      key={entry.id}
                      className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/30 p-6 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-xl font-bold text-indigo-800">{entry.name}</h4>
                          {entry.relationship && (
                            <p className="text-sm text-indigo-600 mt-1">{entry.relationship}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEdit(entry)}
                            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(entry.id)}
                            disabled={loading}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium disabled:opacity-60"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-6 whitespace-pre-wrap leading-relaxed">
                        {entry.thoughts}
                      </p>

                      <div className="flex flex-wrap gap-3 items-center text-sm">
                        <button
                          onClick={() => copyLink(entry.secret_token)}
                          className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          Copy Secret Link
                        </button>
                        <span className="text-gray-500">
                          {new Date(entry.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import LanguageToggle from '../components/LanguageToggle';

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      // Mock login for now
      login('mock_token', { id: '1', email, fullName: 'Test User', artistType: 'musician' });
      navigate('/');
    } else {
      toast.error(t('common.error'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="absolute top-4 right-4">
        <LanguageToggle />
      </div>
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-blue mb-2">{t('app.name')}</h1>
          <p className="text-slate-500">{t('app.tagline')}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('auth.email')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('auth.password')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none"
              required
            />
          </div>
          <button type="submit" className="w-full py-2 bg-brand-blue text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
            {t('auth.login')}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-600">
          Don't have an account? <Link to="/register" className="text-brand-blue hover:underline">{t('auth.register')}</Link>
        </p>
      </div>
    </div>
  );
}

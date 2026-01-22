'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import styles from './page.module.css';

// Google Icon SVG component
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { loginWithGoogle, login, isLoading } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGoogleLogin = async () => {
    setError('');
    const result = await loginWithGoogle();
    
    if (result.success) {
      router.push('/');
    } else {
      setError(result.error || 'Erreur de connexion Google');
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      setIsSubmitting(false);
      return;
    }
    
    const result = await login(email, password);
    
    if (result.success) {
      router.push('/');
    } else {
      setError(result.error || 'Identifiants incorrects');
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className={styles.container}>
      {/* Background Effects */}
      <div className={styles.backgroundEffects}>
        <div className={styles.gradientOrb1} />
        <div className={styles.gradientOrb2} />
        <div className={styles.gridOverlay} />
      </div>

      {/* Login Card */}
      <div className={styles.card}>
        {/* Logo */}
        <div className={styles.logoSection}>
          <div className={styles.logoIcon}>
            <Zap size={32} />
          </div>
          <h1 className={styles.logoText}>
            <span className="text-gradient">SEO Autonome</span>
          </h1>
          <p className={styles.tagline}>Plateforme SEO alimentée par l'IA</p>
        </div>

        {/* Google Login Button */}
        <button 
          className={styles.googleBtn}
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 size={20} className={styles.spinner} />
          ) : (
            <GoogleIcon />
          )}
          <span>Continuer avec Google</span>
        </button>

        {/* Divider */}
        <div className={styles.divider}>
          <span>ou</span>
        </div>

        {/* Email/Password Form */}
        <form className={styles.form} onSubmit={handleEmailLogin}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <div className={styles.inputWrapper}>
              <Mail size={18} className={styles.inputIcon} />
              <input
                id="email"
                type="email"
                className={styles.input}
                placeholder="vous@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Mot de passe</label>
            <div className={styles.inputWrapper}>
              <Lock size={18} className={styles.inputIcon} />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className={styles.input}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className={styles.submitBtn}
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting ? (
              <Loader2 size={18} className={styles.spinner} />
            ) : (
              <>
                <span>Se connecter</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className={styles.footer}>
          Pas encore de compte ?{' '}
          <a href="#" onClick={(e) => { e.preventDefault(); console.log('Sign up clicked'); }}>
            Demander un accès
          </a>
        </p>
      </div>

      {/* Version */}
      <p className={styles.version}>v1.0.0 • Powered by GCP & Vertex AI</p>
    </div>
  );
}

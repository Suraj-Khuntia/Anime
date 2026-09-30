import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { openAuthModal, isUserLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isUserLoggedIn) {
      navigate('/');
    } else {
      openAuthModal('signin');
    }
  }, [isUserLoggedIn, openAuthModal, navigate]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4" />
      <p className="text-slate-400 text-sm">Opening AniPulse Sign In...</p>
    </div>
  );
}

export function SignUpPage() {
  const { openAuthModal, isUserLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isUserLoggedIn) {
      navigate('/');
    } else {
      openAuthModal('signup');
    }
  }, [isUserLoggedIn, openAuthModal, navigate]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4" />
      <p className="text-slate-400 text-sm">Opening AniPulse Registration...</p>
    </div>
  );
}

export function ForgotPasswordPage() {
  const { openAuthModal, isUserLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isUserLoggedIn) {
      navigate('/');
    } else {
      openAuthModal('forgot');
    }
  }, [isUserLoggedIn, openAuthModal, navigate]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4" />
      <p className="text-slate-400 text-sm">Opening Password Reset...</p>
    </div>
  );
}

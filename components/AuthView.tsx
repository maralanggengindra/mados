// FIX: Removed extraneous file markers.
import React, { useState } from 'react';
import { MOCK_USERS } from '../constants';
import { User } from '../types';

interface AuthViewProps {
    onLogin: (user: User) => void;
    onSignUp: (userInfo: { name: string; email: string }) => void;
}

const GoogleIcon = () => (
    <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
        <path fill="#4285F4" d="M24 9.5c3.21 0 6.14 1.11 8.4 3.29l6.5-6.5C34.64 2.33 29.7 0 24 0 14.52 0 6.44 5.23 2.59 12.86l7.98 6.19C12.44 13.23 17.76 9.5 24 9.5z"></path>
        <path fill="#34A853" d="M46.2 25.04c0-1.66-.15-3.26-.42-4.8H24v9.09h12.47c-.54 2.94-2.12 5.45-4.51 7.15l7.63 5.89c4.47-4.13 7.03-10.21 7.03-17.33z"></path>
        <path fill="#FBBC05" d="M10.57 28.05C9.97 26.39 9.6 24.6 9.6 22.75s.37-3.64.97-5.3l-7.98-6.19C.9 14.12 0 18.27 0 22.75s.9 8.63 2.59 11.44l7.98-6.14z"></path>
        <path fill="#EA4335" d="M24 45.5c6.24 0 11.56-2.08 15.4-5.52l-7.63-5.89c-2.07 1.39-4.73 2.22-7.77 2.22-6.24 0-11.56-3.73-13.41-8.81l-7.98 6.19C6.44 40.27 14.52 45.5 24 45.5z"></path>
        <path fill="none" d="M0 0h48v48H0z"></path>
    </svg>
);

const FacebookIcon = () => (
    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="white">
        <path d="M22.675 0h-21.35C.59 0 0 .59 0 1.325v21.35C0 23.41.59 24 1.325 24H12.82v-9.29h-3.128v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h5.713c.735 0 1.325-.59 1.325-1.325V1.325C24 .59 23.41 0 22.675 0z" />
    </svg>
);


export const AuthView: React.FC<AuthViewProps> = ({ onLogin, onSignUp }) => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const resetForm = () => {
        setName('');
        setEmail('');
        setPassword('');
        setError('');
    };

    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (user) {
            onLogin(user);
        } else {
            setError('Email tidak ditemukan. Silakan coba lagi atau daftar.');
        }
    };

    const handleSignUpSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const userExists = MOCK_USERS.some(u => u.email.toLowerCase() === email.toLowerCase());
        if (userExists) {
            setError('Email sudah terdaftar. Silakan masuk.');
            return;
        }
        if (password.length < 6) {
            setError('Password minimal harus 6 karakter.');
            return;
        }
        onSignUp({ name, email });
    };

    const handleGoogleLogin = () => {
        // Simulate login with the first mock user
        onLogin(MOCK_USERS[0]);
    };

    const handleFacebookLogin = () => {
        // Simulate login with the second mock user
        onLogin(MOCK_USERS[1]);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold text-teal-500 mb-2">Mados</h1>
                    <p className="text-gray-600 dark:text-gray-300">Marketplace & Direktori Online Sekitar</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                    {isSignUp ? (
                        <>
                            <h2 className="text-2xl font-semibold text-center mb-6">Buat Akun Baru</h2>
                            <form onSubmit={handleSignUpSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Lengkap</label>
                                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" placeholder="Nama Anda" />
                                </div>
                                <div>
                                    <label htmlFor="email-signup" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                                    <input type="email" id="email-signup" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" placeholder="anda@email.com" />
                                </div>
                                <div>
                                    <label htmlFor="password-signup" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                                    <input type="password" id="password-signup" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" placeholder="Minimal 6 karakter" />
                                </div>
                                {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                                <div>
                                    <button type="submit" className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700">Daftar</button>
                                </div>
                            </form>
                             <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                                Sudah punya akun?{' '}
                                <button onClick={() => { setIsSignUp(false); resetForm(); }} className="font-medium text-teal-600 hover:text-teal-500">Masuk</button>
                            </p>
                        </>
                    ) : (
                        <>
                            <h2 className="text-2xl font-semibold text-center mb-6">Masuk ke Akun Anda</h2>
                            <form onSubmit={handleLoginSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" placeholder="anda@email.com" />
                                </div>
                                <div>
                                    <label htmlFor="password"className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" placeholder="********" />
                                </div>
                                {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                                <div>
                                    <button type="submit" className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700">Masuk</button>
                                </div>
                            </form>

                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300 dark:border-gray-600" /></div>
                                <div className="relative flex justify-center text-sm"><span className="px-2 bg-white dark:bg-gray-800 text-gray-500">atau</span></div>
                            </div>

                            <div className="space-y-3">
                                <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <GoogleIcon />
                                    <span>Masuk dengan Google</span>
                                </button>
                                <button onClick={handleFacebookLogin} className="w-full flex items-center justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm bg-[#1877F2] text-sm font-medium text-white hover:bg-[#166fe5]">
                                    <FacebookIcon />
                                    <span>Masuk dengan Facebook</span>
                                </button>
                            </div>

                            <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                                Belum punya akun?{' '}
                                <button onClick={() => { setIsSignUp(true); resetForm(); }} className="font-medium text-teal-600 hover:text-teal-500">Daftar</button>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
import React, { useEffect } from 'react';

interface ToastProps {
    toast: { message: string; type: 'success' | 'error' } | null;
    onClose: () => void;
}

const SuccessIcon = () => (
    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

const ErrorIcon = () => (
    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
);


export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
    const [visible, setVisible] = React.useState(false);

    useEffect(() => {
        if (toast) {
            setVisible(true);
            const timer = setTimeout(() => {
                // Start fade out animation
                 setVisible(false);
                 // Allow time for fade out before removing from DOM
                 setTimeout(onClose, 300);
            }, 2700);
            return () => clearTimeout(timer);
        } else {
             setVisible(false);
        }
    }, [toast, onClose]);

    if (!toast) return null;

    const isSuccess = toast.type === 'success';

    return (
        <div
            className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 w-full max-w-xs p-4 rounded-lg shadow-lg bg-white dark:bg-gray-800 border-l-4 ${isSuccess ? 'border-green-500' : 'border-red-500'} transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'}`}
            role="alert"
        >
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    {isSuccess ? <SuccessIcon /> : <ErrorIcon />}
                </div>
                <div className="ml-3 text-sm font-normal text-gray-700 dark:text-gray-200">{toast.message}</div>
                <button
                    type="button"
                    className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
                    onClick={onClose}
                    aria-label="Close"
                >
                    <span className="sr-only">Close</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
    );
};
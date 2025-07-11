import { Appearance } from '@clerk/types';

export const clerkAppearance: Appearance = {
  baseTheme: undefined,
  variables: {
    colorPrimary: '#10b981', // emerald-500
    colorTextOnPrimaryBackground: '#ffffff',
    colorBackground: '#ffffff',
    colorInputBackground: '#ffffff',
    colorInputText: '#1e293b', // slate-800
    fontFamily: '"Poppins", "Helvetica Neue", Helvetica, Arial, sans-serif',
    borderRadius: '0.5rem',
    colorDanger: '#ef4444',
    colorSuccess: '#10b981',
    colorWarning: '#f59e0b',
    colorNeutral: '#64748b',
    colorTextSecondary: '#64748b',
    colorShimmer: '#f1f5f9',
    fontSize: '1rem',
    fontWeight: {
      normal: 400,
      medium: 500,
      bold: 600,
    }
  },
  elements: {
    rootBox: {
      width: '100%',
      height: '100%',
    },
    card: {
      backgroundColor: 'transparent',
      boxShadow: 'none',
      border: 'none',
      width: '100%',
    },
    headerTitle: {
      fontSize: '2rem',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '0.5rem',
    },
    headerSubtitle: {
      fontSize: '1rem',
      color: '#64748b',
      marginBottom: '2rem',
    },
    formButtonPrimary: {
      backgroundColor: '#10b981',
      backgroundImage: 'linear-gradient(to right, #059669, #10b981)',
      color: '#ffffff',
      fontSize: '1rem',
      fontWeight: '500',
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
      transition: 'all 200ms',
      '&:hover': {
        backgroundImage: 'linear-gradient(to right, #047857, #059669)',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      },
    },
    formFieldInput: {
      backgroundColor: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '0.5rem',
      fontSize: '1rem',
      padding: '0.5rem 0.75rem',
      color: '#1e293b',
      transition: 'all 200ms',
      '&:focus': {
        borderColor: '#10b981',
        boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.1)',
      },
    },
    formFieldLabel: {
      color: '#374151',
      fontSize: '0.875rem',
      fontWeight: '500',
      marginBottom: '0.25rem',
    },
    footerActionLink: {
      color: '#10b981',
      fontWeight: '500',
      '&:hover': {
        color: '#059669',
      },
    },
    socialButtonsIconButton: {
      backgroundColor: '#ffffff',
      border: '2px solid #e5e7eb',
      borderRadius: '0.5rem',
      '&:hover': {
        borderColor: '#d1d5db',
        backgroundColor: '#f9fafb',
      },
    },
    dividerLine: {
      backgroundColor: '#e5e7eb',
    },
    dividerText: {
      color: '#9ca3af',
      fontSize: '0.875rem',
    },
    identityPreviewText: {
      color: '#1e293b',
    },
    identityPreviewEditButton: {
      color: '#10b981',
      '&:hover': {
        color: '#059669',
      },
    },
    alert: {
      borderRadius: '0.5rem',
    },
    alertText: {
      fontSize: '0.875rem',
    },
  },
};
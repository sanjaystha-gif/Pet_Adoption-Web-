import React from 'react'
import Toast, { Toaster } from 'react-hot-toast'

export const showToast = {
  success: (message: string) => Toast.success(message),
  error: (message: string) => Toast.error(message),
  loading: (message: string) => Toast.loading(message),
  promise: (promise: Promise<any>, messages: any) => Toast.promise(promise, messages),
  custom: (message: any) => Toast.custom(message),
  dismiss: () => Toast.dismiss()
}

interface ToastProviderProps {
  children: React.ReactNode
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  return (
    <>
      {children}
      <Toaster position="bottom-right" toastOptions={{ duration: 3000 }} />
    </>
  )
}

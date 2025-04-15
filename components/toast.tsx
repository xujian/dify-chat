'use client'

import React, { ReactNode } from 'react'
import { toast as sonnerToast } from 'sonner'
import { CheckCircle, AlertCircle } from 'lucide-react'

export type ToastType = 'success' | 'error'

const iconsByType: Record<'success' | 'error', ReactNode> = {
  success: <CheckCircle />,
  error: <AlertCircle />,
};

export function toast(params: string | Omit<ToastProps, 'id'>) {
  const p = typeof params === 'string' ? {
    type: 'success' as ToastType,
    message: params
  } : params
  if (!p.type) {
    p.type = 'success' as ToastType
  }
  return sonnerToast.custom((id) => (
    <Toast id={id} type={p.type} message={p.message} />
  ));
}

function Toast(props: ToastProps) {
  const { id, type = 'success', message } = props;

  return (
    <div className="flex w-full justify-center">
      <div
        data-testid="toast"
        key={id}
        className="bg-white p-3 border rounded-lg w-full toast-mobile:w-fit flex flex-row gap-2 items-center">
        <div
          data-type={type}
          className="data-[type=error]:text-red-600 data-[type=success]:text-green-600">
          {iconsByType[type]}
        </div>
        <div className="text-zinc-950 text-sm">{message}</div>
      </div>
    </div>
  )
}

interface ToastProps {
  id: string | number
  type?: ToastType
  message: string
}

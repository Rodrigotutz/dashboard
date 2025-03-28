'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'

export default function NetworkStatus() {
  useEffect(() => {
    const handleOnline = () => {
      toast.dismiss('offline-toast')
      toast.success('Conexão restabelecida', {
        description: 'Você está online novamente',
      })
    }

    const handleOffline = () => {
      toast.error('Sem conexão com a internet', {
        description: 'Verifique sua conexão de rede',
        id: 'offline-toast',
        duration: Infinity,
      })
    }

    if (!navigator.onLine) {
      handleOffline()
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return null 
}
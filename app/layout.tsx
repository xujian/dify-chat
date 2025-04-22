import { Toaster } from 'sonner'
import { getLocaleOnServer } from '@/i18n/server'

import './styles/globals.css'
import './styles/chat.scss'
import './styles/markdown.scss'

const LocaleLayout = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  const locale = await getLocaleOnServer()
  return (
    <html lang={locale ?? 'en'} className="h-full">
      <body className="h-full">
        <div className="w-screen h-screen min-w-[300px]">
          {children}
          <Toaster position="top-right" />
        </div>
      </body>
    </html>
  )
}

export default LocaleLayout

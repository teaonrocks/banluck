import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-svh max-[900px]:flex-col">
      <Sidebar />
      <main className="min-w-0 flex-1 overflow-x-clip max-[900px]:ml-0 ml-[var(--sidebar-width)]">
        <div className="mx-auto w-full max-w-5xl overflow-visible px-4 sm:px-6 md:px-10 lg:px-12">
          {children}
        </div>
      </main>
    </div>
  )
}

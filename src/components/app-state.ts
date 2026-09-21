import { createContext, useContext } from 'react'
import type { DemoDocument } from '@/types'
export interface AppState { openSources: (docs: DemoDocument[]) => void; notify: (text: string) => void; completed: Set<string>; complete: (id: string) => void }
export const AppContext = createContext<AppState | null>(null)
export function useApp() { const value = useContext(AppContext); if (!value) throw new Error('AppProvider is required'); return value }

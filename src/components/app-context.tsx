import { useCallback, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Check, FileText, ShieldCheck, X } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from './shared'
import type { DemoDocument } from '@/types'
import { formatDate } from '@/data/cases'
import { AppContext } from './app-state'

export function AppProvider({ children }: { children: ReactNode }) {
  const [sources, setSources] = useState<DemoDocument[]>([])
  const [notice, setNotice] = useState('')
  const [completed, setCompleted] = useState(new Set(['DEMO-002', 'DEMO-005']))
  const complete = useCallback((id: string) => setCompleted(old => new Set(old).add(id)), [])
  useEffect(() => { if (!notice) return; const timer = setTimeout(() => setNotice(''), 5000); return () => clearTimeout(timer) }, [notice])
  return <AppContext.Provider value={{ openSources: setSources, notify: setNotice, completed, complete }}>{children}
    <Dialog open={sources.length > 0} onOpenChange={open => { if (!open) setSources([]) }}><DialogContent className="source-dialog" aria-describedby="source-description"><DialogHeader><div className="eyebrow"><FileText size={14} /> Проверяемый источник</div><DialogTitle>Документы, на которых основан вывод</DialogTitle><DialogDescription id="source-description">Вымышленные документы для демонстрации. Выделен подтверждающий фрагмент.</DialogDescription></DialogHeader><div className="source-scroll">{sources.map(document => <article className="document-preview" key={document.id}><div className="document-letterhead"><span className="document-cross">+</span><span>{document.organization}<small>ДЕМОНСТРАЦИОННЫЙ ДОКУМЕНТ</small></span><Badge>ДЕМО</Badge></div><h3>{document.title}</h3><dl className="document-meta"><div><dt>Дата документа</dt><dd>{formatDate(document.date)}</dd></div><div><dt>Автор</dt><dd>{document.doctor}</dd></div></dl><p>{document.text}</p><div className="excerpt"><span><ShieldCheck size={15} /> Подтверждающий фрагмент</span><blockquote>{document.excerpt}</blockquote></div><p className="document-footnote">Источник: локальный демо-комплект · {document.id.toUpperCase()}</p></article>)}</div></DialogContent></Dialog>
    <div className="toast-zone" role="status" aria-live="polite">{notice && <div className="toast"><Check size={18} /><span>{notice}</span><button aria-label="Закрыть уведомление" onClick={() => setNotice('')}><X size={16} /></button></div>}</div>
  </AppContext.Provider>
}

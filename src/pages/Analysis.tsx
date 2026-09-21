import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { motion } from 'motion/react'
import { Sparkles, Check, CircleCheck, CircleHelp, TriangleAlert, GitCompareArrows, FileCheck2, ArrowRight, ScanLine } from 'lucide-react'
import { usePatient } from '@/layouts/patient-context'
import { useApp } from '@/components/app-state'
import { AiLabel, Badge, HumanNote, SourceButton } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import type { Finding, Tone } from '@/types'

const groups: { key: Finding['group']; label: string; description: string; icon: typeof CircleCheck; tone: Tone }[] = [
  { key: 'confirmed', label: 'Подтверждено', description: 'Сведения с опорой на документы', icon: CircleCheck, tone: 'green' },
  { key: 'missing', label: 'Не хватает данных', description: 'Что нужно уточнить перед рассмотрением', icon: CircleHelp, tone: 'amber' },
  { key: 'conflict', label: 'Противоречия', description: 'Расхождения между источниками', icon: TriangleAlert, tone: 'red' },
  { key: 'changed', label: 'После предыдущей МСЭ', description: 'Новые сведения для комиссии', icon: GitCompareArrows, tone: 'blue' },
]
const phases = ['Сопоставляем документы', 'Восстанавливаем историю', 'Проверяем расхождения', 'Готовим сводку с источниками']
export function Analysis() {
  const { patient, data } = usePatient(), { completed, complete, openSources } = useApp()
  const [running, setRunning] = useState(false), [step, setStep] = useState(0)
  const ready = completed.has(patient.id)
  useEffect(() => { if (!running) return; const timers = [1, 2, 3].map(n => setTimeout(() => setStep(n), n * 650)); const finish = setTimeout(() => { complete(patient.id); setRunning(false) }, 2800); return () => { timers.forEach(clearTimeout); clearTimeout(finish) } }, [running, complete, patient.id])
  function run() { setStep(0); setRunning(true) }
  return <div><div className="analysis-banner"><div><AiLabel /><h2>{ready ? 'Важное найдено. Проверьте источники.' : 'От документов — к пониманию дела'}</h2><p>Помощник собирает факты, отмечает пробелы и показывает, что изменилось.</p></div><Button onClick={run} disabled={running}><Sparkles size={16} />{running ? 'Анализируем…' : ready ? 'Повторить анализ' : 'Провести AI-анализ'}</Button></div>
  <div className="demo-analysis-note"><ScanLine size={14} />Демонстрация: анализ имитируется локально. Медицинские данные никуда не отправляются.</div>
  {running ? <section className="analysis-progress" role="status" aria-live="polite"><div className="progress-orbit"><Sparkles size={30} /></div><h2>{phases[step]}</h2><p>Связываем каждый вывод с конкретным документом</p><div className="progress-track" role="progressbar" aria-label="Прогресс демонстрационного анализа" aria-valuenow={(step + 1) * 25} aria-valuemin={0} aria-valuemax={100}><motion.div animate={{ width: `${(step + 1) * 25}%` }} transition={{ duration: .4 }} /></div><div className="progress-stages">{phases.map((p, i) => <div className={i <= step ? 'done' : ''} key={p}><span>{i < step ? <Check size={13} /> : i + 1}</span>{p}</div>)}</div></section> : ready ? <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .25 }}><div className="analysis-complete"><CircleCheck size={17} /><span>Демо-анализ завершён</span><span>Проверено документов: {data.documents.length}</span><Badge>Версия демо · 21.09.2026</Badge></div><div className="analysis-results">{groups.map(({ key, label, description, icon: Icon, tone }) => { const findings = data.findings.filter(f => f.group === key); return <section key={key} className={`panel finding-panel finding-${tone}`}><div className="finding-heading"><span className={`finding-icon ${tone}`}><Icon size={19} /></span><div><h2>{label}</h2><p>{description}</p></div><Badge tone={tone}>{findings.length}</Badge></div>{findings.length ? <Accordion type="multiple" defaultValue={findings.map(f => f.id)}>{findings.map(f => <AccordionItem value={f.id} key={f.id} className="finding-item"><AccordionTrigger>{f.title}</AccordionTrigger><AccordionContent><p>{f.description}</p><SourceButton count={f.sourceIds.length} onClick={() => openSources(data.documents.filter(d => f.sourceIds.includes(d.id)))} /></AccordionContent></AccordionItem>)}</Accordion> : <div className="finding-empty">В текущем демо-комплекте нет результатов этой категории. Это не подтверждает отсутствие проблем.</div>}</section> })}</div><div className="analysis-next"><FileCheck2 size={25} /><div><h3>Материалы готовы к вашей проверке</h3><p>Сопоставьте периоды или откройте досье для комиссии.</p></div><Link className="button button-outline" to={`/patients/${patient.id}/comparison`}>Сравнить МСЭ<ArrowRight size={16} /></Link></div></motion.div> : <div className="analysis-intro"><div className="intro-emblem"><Sparkles size={33} /></div><h2>Сначала факты. Затем выводы.</h2><p>Запустите анализ, чтобы получить структурированную сводку<br className="desktop-only" /> по {data.documents.length} документам этого дела.</p><div className="intro-features">{groups.map(({ label, icon: Icon, tone }) => <div key={label}><span className={`finding-icon ${tone}`}><Icon size={20} /></span><strong>{label}</strong></div>)}</div><span className="muted">Около 3 секунд · Только локальная имитация</span></div>}<HumanNote /></div>
}

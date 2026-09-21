import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { ArrowRight, FileText, SearchX, Sparkles, ShieldCheck } from 'lucide-react'
import { motion } from 'motion/react'
import type { Tone } from '@/types'

export function Brand({ light = false }: { light?: boolean }) { return <Link to="/" className={`brand ${light ? 'brand-light' : ''}`} aria-label="Derek — на главную"><span className="brand-mark"><i /><i /></span><span>derek<span className="brand-period">.</span></span></Link> }
export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: Tone }) { return <span className={`badge badge-${tone}`}>{children}</span> }
export function PageTitle({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) { return <div className="page-heading"><div>{eyebrow && <div className="eyebrow">{eyebrow}</div>}<h1>{title}</h1>{description && <p>{description}</p>}</div>{action && <div className="heading-actions">{action}</div>}</div> }
export function Page({ children }: { children: ReactNode }) { return <motion.div className="page" initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .22 }}>{children}</motion.div> }
export function SourceButton({ onClick, count }: { onClick: () => void; count?: number }) { return <button className="source-button" onClick={onClick}><FileText size={14} />{count && count > 1 ? `${count} источника` : 'Посмотреть источник'}<ArrowRight size={13} /></button> }
export function EmptyState({ title = 'Ничего не найдено', description = 'Попробуйте изменить запрос или сбросить фильтры.', action }: { title?: string; description?: string; action?: ReactNode }) { return <div className="empty-state"><SearchX size={30} /><h3>{title}</h3><p>{description}</p>{action}</div> }
export function HumanNote() { return <div className="human-note"><ShieldCheck size={18} /><span>AI помогает увидеть полную картину. <strong>Решение всегда принимает комиссия.</strong></span></div> }
export function AiLabel() { return <span className="ai-label"><Sparkles size={13} /> AI-помощник</span> }
export function Avatar({ id, large = false }: { id: string; large?: boolean }) { return <span className={`avatar ${large ? 'avatar-large' : ''}`}>П<span>{Number(id.slice(-3))}</span></span> }
export function StatusBadge({ status }: { status: string }) { return <Badge tone={status === 'Требует внимания' ? 'amber' : status === 'На анализе' ? 'blue' : 'green'}>{status}</Badge> }

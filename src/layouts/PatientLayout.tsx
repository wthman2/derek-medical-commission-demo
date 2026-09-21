import { Link, NavLink, Outlet, useParams } from 'react-router'
import { ArrowLeft, ChevronRight, FileText, Sparkles } from 'lucide-react'
import { Page, Avatar, Badge, StatusBadge, EmptyState } from '@/components/shared'
import { patients, getCaseData } from '@/data/cases'
import type { PatientContext } from './patient-context'
export function PatientLayout() {
  const { id } = useParams(); const patient = patients.find(p => p.id === id)
  if (!patient) return <Page><EmptyState title="Дело не найдено" description="Проверьте номер дела или выберите пациента из демонстрационного реестра." action={<Link className="button button-primary" to="/patients"><ArrowLeft size={16} />Вернуться к делам</Link>} /></Page>
  const data = getCaseData(patient), base = `/patients/${patient.id}`
  return <Page><nav className="breadcrumbs" aria-label="Хлебные крошки"><Link to="/patients">Дела пациентов</Link><ChevronRight size={13} /><span>{patient.id}</span></nav><div className="patient-header"><div className="patient-identity"><Avatar id={patient.id} large /><div><div className="patient-title-line"><h1>{patient.label}</h1><Badge>Вымышленный кейс</Badge></div><p>{patient.sex} · {patient.age} лет<span>·</span>{patient.id}</p></div></div><div className="patient-header-actions"><Link to={`${base}/report`} className="button button-outline"><FileText size={16} />Досье</Link><Link to={`${base}/analysis`} className="button button-primary"><Sparkles size={16} />AI-анализ</Link></div></div><div className="patient-subline"><span>{patient.diagnosis}</span><Badge>{patient.code}</Badge><StatusBadge status={patient.status} /></div><nav className="patient-tabs" aria-label="Разделы дела">{[['', 'Обзор дела'], ['/timeline', 'История'], ['/analysis', 'AI-анализ'], ['/comparison', 'Сравнение МСЭ'], ['/documents', 'Документы'], ['/report', 'Досье комиссии']].map(([path, label]) => <NavLink key={path} to={`${base}${path}`} end className={({ isActive }) => isActive ? 'active' : ''}>{label}{path === '/documents' && <span>{data.documents.length}</span>}</NavLink>)}</nav><Outlet context={{ patient, data } satisfies PatientContext} /></Page>
}

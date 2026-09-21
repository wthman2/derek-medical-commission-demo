import { DEMO_DATE, formatDate } from '@/data/cases'
import type { CaseData, ComparisonRow, DemoDocument, Finding, Patient } from '@/types'

const DEMO_NOW = new Date('2026-09-21T12:00:00')

function uniqueDocuments(data: CaseData, ids: string[]) {
  return ids
    .map(id => data.documents.find(document => document.id === id))
    .filter((document): document is DemoDocument => Boolean(document))
}

export function getFlaggedFindings(data: CaseData) {
  return data.findings.filter(finding => finding.group === 'missing' || finding.group === 'conflict')
}

export function getChangedFindings(data: CaseData) {
  return data.findings.filter(finding => finding.group === 'changed')
}

export function getLatestMseEvent(data: CaseData) {
  return [...data.events]
    .filter(event => event.type === 'МСЭ')
    .sort((left, right) => right.date.localeCompare(left.date))[0]
}

export function getEventsAfterPreviousMse(data: CaseData) {
  const latestMse = getLatestMseEvent(data)
  if (!latestMse) return []
  return data.events.filter(event => event.date > latestMse.date)
}

export function getDocumentsAfterPreviousMse(data: CaseData) {
  const latestMse = getLatestMseEvent(data)
  if (!latestMse) return []
  return data.documents.filter(document => document.date > latestMse.date)
}

export function getDocumentAgeLabel(document: DemoDocument) {
  const diffMs = DEMO_NOW.getTime() - new Date(`${document.date}T12:00:00`).getTime()
  const diffDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)))

  if (diffDays < 45) return 'Свежий документ'
  if (diffDays < 180) return `${diffDays} дней назад`
  if (diffDays < 365) return `${Math.round(diffDays / 30)} мес. назад`
  return `${Math.round(diffDays / 365)} г. назад`
}

export function getOutdatedDocuments(data: CaseData) {
  return data.documents.filter(document => {
    const ageDays =
      (DEMO_NOW.getTime() - new Date(`${document.date}T12:00:00`).getTime()) /
      (1000 * 60 * 60 * 24)
    return ['Заключения', 'Анализы', 'Направления'].includes(document.category) && ageDays > 365
  })
}

export function getComparisonSummary(rows: ComparisonRow[]) {
  return {
    total: rows.length,
    worsened: rows.filter(row => row.state === 'Ухудшилось').length,
    improved: rows.filter(row => row.state === 'Улучшилось').length,
    unchanged: rows.filter(row => row.state === 'Без изменений').length,
    insufficient: rows.filter(row => row.state === 'Недостаточно данных').length,
  }
}

export function getCommissionChecklist(patient: Patient, data: CaseData) {
  const questions: { id: string; title: string; note: string; sourceIds: string[] }[] = []
  const flags = getFlaggedFindings(data)
  const changed = getChangedFindings(data)

  if (flags.some(flag => flag.id === 'f3')) {
    questions.push({
      id: 'fresh-specialist',
      title: 'Запросить актуальное заключение профильного специалиста',
      note: 'Последнее заключение старше 12 месяцев по дате демонстрации.',
      sourceIds: ['d3', 'd9'],
    })
  }

  if (flags.some(flag => flag.id === 'f4')) {
    questions.push({
      id: 'functional-status',
      title: 'Уточнить функциональные ограничения перед заседанием',
      note: 'В комплекте нет свежего описания самообслуживания, передвижения и повседневной активности.',
      sourceIds: ['d9'],
    })
  }

  if (flags.some(flag => flag.id === 'f5')) {
    questions.push({
      id: 'conflict-reconcile',
      title: 'Сверить сведения об осложнениях между выпиской и направлением',
      note: 'Комиссии нужно понять, подтверждена ли полинейропатия и как она влияет на состояние.',
      sourceIds: ['d6', 'd7'],
    })
  }

  if (changed.length) {
    questions.push({
      id: 'new-data-review',
      title: 'Сопоставить новые события после предыдущей МСЭ',
      note: 'Появились новые госпитализации и данные, которых не было в прошлой оценке.',
      sourceIds: [...new Set(changed.flatMap(item => item.sourceIds))],
    })
  }

  if (!questions.length) {
    questions.push({
      id: 'demo-review',
      title: `Проверить полноту демо-комплекта по делу ${patient.id}`,
      note: 'В сокращённом кейсе нет достаточного числа документов для полноценного сравнения периодов.',
      sourceIds: data.documents.slice(0, 1).map(document => document.id),
    })
  }

  return questions
}

export function getExecutiveSummary(patient: Patient, data: CaseData) {
  const changed = getChangedFindings(data)
  const flags = getFlaggedFindings(data)
  const latestMse = getLatestMseEvent(data)
  const afterPrevious = getEventsAfterPreviousMse(data)
  const latestDocument = [...data.documents].sort((left, right) => right.date.localeCompare(left.date))[0]

  if (patient.id !== 'DEMO-001') {
    return `По делу ${patient.id} доступна сокращённая демо-сводка. Для уверенного сопоставления истории, прошлой МСЭ и текущего статуса не хватает развернутого комплекта документов.`
  }

  return `После ${latestMse ? `МСЭ от ${formatDate(latestMse.date)}` : 'последней оценки'} в деле появились ${afterPrevious.length} новых события и ${changed.length} новых вывода для комиссии. При этом остаются ${flags.length} вопросов, которые нужно проверить по источникам до обсуждения на комиссии. Последний документ в комплекте датирован ${latestDocument ? formatDate(latestDocument.date) : DEMO_DATE}.`
}

export function getSourceCoverage(data: CaseData) {
  const allSourceIds = new Set<string>()

  data.findings.forEach(finding => {
    finding.sourceIds.forEach(id => allSourceIds.add(id))
  })

  data.comparison.forEach(row => {
    row.sources.forEach(id => allSourceIds.add(id))
  })

  data.events.forEach(event => {
    allSourceIds.add(event.sourceId)
  })

  return {
    linkedSources: allSourceIds.size,
    linkedDocuments: uniqueDocuments(data, [...allSourceIds]).length,
    totalDocuments: data.documents.length,
  }
}

export function getReportSections(data: CaseData) {
  const historyEvents = data.events.slice(0, 4)
  const changedFindings = data.findings.filter(finding => finding.group === 'changed' || finding.id === 'f2')
  const conflictFindings = data.findings.filter(finding => finding.group === 'conflict')
  const missingFindings = data.findings.filter(finding => finding.group === 'missing')

  return [
    {
      id: 'history',
      title: 'История заболевания',
      text: historyEvents
        .map(event => `${formatDate(event.date)} — ${event.title}. ${event.description}`)
        .join(' '),
      sources: [...new Set(historyEvents.map(event => event.sourceId))],
    },
    {
      id: 'changes',
      title: 'Что изменилось после предыдущей МСЭ',
      text:
        changedFindings.map(finding => `${finding.title}. ${finding.description}`).join(' ') ||
        'В сокращённом комплекте нет сведений о новых событиях после предыдущей оценки.',
      sources: changedFindings.flatMap(finding => finding.sourceIds),
    },
    {
      id: 'conflicts',
      title: 'Осложнения и противоречия',
      text:
        conflictFindings.map(finding => `${finding.title}. ${finding.description}`).join(' ') ||
        'Нет доступных сведений для проверки осложнений и противоречий.',
      sources: conflictFindings.flatMap(finding => finding.sourceIds),
    },
    {
      id: 'missing',
      title: 'Отсутствующие сведения',
      text:
        missingFindings.map(finding => `${finding.title}. ${finding.description}`).join(' ') ||
        'Полнота истории не оценивалась: представлен сокращённый демонстрационный комплект.',
      sources: missingFindings.flatMap(finding => finding.sourceIds),
    },
  ]
}

export function describeFindingSources(data: CaseData, finding: Finding | { sourceIds: string[] }) {
  return uniqueDocuments(data, [...new Set(finding.sourceIds)])
}

export function getTimelineSummary(data: CaseData) {
  const latestMse = getLatestMseEvent(data)
  const afterPreviousMse = getEventsAfterPreviousMse(data)
  const hospitalizations = afterPreviousMse.filter(event => event.type === 'Госпитализация')
  const complications = afterPreviousMse.filter(event => event.type === 'Осложнение')

  return {
    latestMse,
    afterPreviousMse,
    hospitalizations,
    complications,
  }
}

export function getDocumentSummary(documents: DemoDocument[]) {
  return {
    total: documents.length,
    requiresAttention: documents.filter(document => document.status === 'Требует уточнения').length,
    aiSources: documents.filter(document => document.usedByAI).length,
  }
}

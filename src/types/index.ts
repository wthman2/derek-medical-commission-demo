export type CaseStatus = 'Требует внимания' | 'Готово к рассмотрению' | 'На анализе'
export type EventType = 'Диагноз' | 'Госпитализация' | 'Анализы' | 'МСЭ' | 'Лечение' | 'Осложнение' | 'Операция'
export type Tone = 'green' | 'amber' | 'red' | 'blue' | 'neutral'
export interface Patient { id: string; label: string; age: number; sex: string; diagnosis: string; code: string; status: CaseStatus; updated: string; specialty: string; flags: number }
export interface DemoDocument { id: string; title: string; date: string; category: string; doctor: string; organization: string; text: string; excerpt: string; status: 'Проверен' | 'Требует уточнения'; usedByAI: boolean; event: string }
export interface MedicalEvent { id: string; date: string; type: EventType; title: string; description: string; sourceId: string }
export interface Finding { id: string; group: 'confirmed' | 'missing' | 'conflict' | 'changed'; title: string; description: string; sourceIds: string[] }
export interface ComparisonRow { label: string; previous: string; current: string; state: 'Ухудшилось' | 'Улучшилось' | 'Без изменений' | 'Недостаточно данных'; sources: string[] }
export interface CaseData { documents: DemoDocument[]; events: MedicalEvent[]; findings: Finding[]; comparison: ComparisonRow[] }

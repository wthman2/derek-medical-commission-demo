import { useOutletContext } from 'react-router'
import type { CaseData, Patient } from '@/types'
export interface PatientContext { patient: Patient; data: CaseData }
export function usePatient() { return useOutletContext<PatientContext>() }

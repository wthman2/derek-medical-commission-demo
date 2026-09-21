import { Link } from 'react-router'
import { EmptyState, Page } from '@/components/shared'
export function NotFound() { return <Page><EmptyState title="Страница не найдена" description="Возможно, адрес изменился. Вернитесь в рабочее пространство." action={<Link className="button button-primary" to="/dashboard">Открыть обзор работы</Link>} /></Page> }

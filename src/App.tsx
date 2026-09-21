import React, { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import { MotionConfig } from 'motion/react'
import { AppProvider } from '@/components/app-context'
import { AppLayout } from '@/layouts/AppLayout'
import { PatientLayout } from '@/layouts/PatientLayout'

const Landing = lazy(() => import('@/pages/Landing').then(m => ({ default: m.Landing })))
const Dashboard = lazy(() => import('@/pages/Dashboard').then(m => ({ default: m.Dashboard })))
const Patients = lazy(() => import('@/pages/Patients').then(m => ({ default: m.Patients })))
const PatientOverview = lazy(() =>
  import('@/pages/PatientOverview').then(m => ({ default: m.PatientOverview })),
)
const Timeline = lazy(() => import('@/pages/Timeline').then(m => ({ default: m.Timeline })))
const Analysis = lazy(() => import('@/pages/Analysis').then(m => ({ default: m.Analysis })))
const Comparison = lazy(() =>
  import('@/pages/Comparison').then(m => ({ default: m.Comparison })),
)
const Documents = lazy(() => import('@/pages/Documents').then(m => ({ default: m.Documents })))
const AllDocuments = lazy(() =>
  import('@/pages/Documents').then(m => ({ default: m.AllDocuments })),
)
const Report = lazy(() => import('@/pages/Report').then(m => ({ default: m.Report })))
const NotFound = lazy(() => import('@/pages/NotFound').then(m => ({ default: m.NotFound })))

export function App() {
  const redirectedPath = new URLSearchParams(window.location.search).get('p')
  if (redirectedPath) {
    window.history.replaceState(null, '', `${import.meta.env.BASE_URL}${redirectedPath.replace(/^\//, '')}`)
  }

  return (
    <React.StrictMode>
      <MotionConfig reducedMotion="user">
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <AppProvider>
            <Suspense
              fallback={
                <div className="route-loading" role="status">
                  <span />
                  Загружаем рабочее пространство…
                </div>
              }
            >
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route element={<AppLayout />}>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="patients" element={<Patients />} />
                  <Route path="documents" element={<AllDocuments />} />
                  <Route path="patients/:id" element={<PatientLayout />}>
                    <Route index element={<PatientOverview />} />
                    <Route path="timeline" element={<Timeline />} />
                    <Route path="analysis" element={<Analysis />} />
                    <Route path="comparison" element={<Comparison />} />
                    <Route path="documents" element={<Documents />} />
                    <Route path="report" element={<Report />} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </Suspense>
          </AppProvider>
        </BrowserRouter>
      </MotionConfig>
    </React.StrictMode>
  )
}

import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { DashboardLayout } from '../../components/DashboardLayout'
import { FileText, Upload } from 'lucide-react'

export const Route = createFileRoute('/_authenticated/workspace/')({
  component: WorkspaceIndexRoute,
})

function WorkspaceIndexRoute() {
  const navigate = useNavigate({ from: Route.fullPath })

  return (
    <DashboardLayout headerTitle="AI Workspace">
      <div className="flex-1 flex flex-col items-center justify-center h-full px-4 py-8 sm:p-8 pb-24 lg:pb-8">
        <div className="flex flex-col items-center text-center max-w-md">
          <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mb-6">
            <FileText className="h-10 w-10 text-orange-500" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--lf-text-primary)] mb-3">No Document Selected</h2>
          <p className="text-[15px] text-[var(--lf-text-secondary)] mb-8">
            Open a document from your library to start using AI-powered features like explanations, quizzes, notes, and more.
          </p>
          <button 
            onClick={() => navigate({ to: '/documents' })}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm shadow-lg shadow-orange-500/25 transition-all active:scale-95"
          >
            <Upload className="h-4 w-4" />
            Browse Documents
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}

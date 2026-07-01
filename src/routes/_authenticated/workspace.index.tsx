import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { DocumentAPI } from '../../lib/api'
import { DashboardLayout } from '../../components/DashboardLayout'
import { Loader2, FileText } from 'lucide-react'

export const Route = createFileRoute('/_authenticated/workspace/')({
  component: WorkspaceIndexRoute,
})

function WorkspaceIndexRoute() {
  const navigate = useNavigate({ from: Route.fullPath })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRecent() {
      try {
        const docs = await DocumentAPI.getDocuments()
        if (docs && docs.length > 0) {
          // Sort documents by createdAt (newest first) just in case
          const sortedDocs = docs.sort((a, b) => {
            if (!a.createdAt || !b.createdAt) return 0;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });
          
          navigate({ to: `/workspace/${sortedDocs[0].id}`, replace: true })
        } else {
          setLoading(false)
        }
      } catch (err) {
        console.error('Failed to fetch recent documents', err)
        setLoading(false)
      }
    }
    fetchRecent()
  }, [navigate])

  return (
    <DashboardLayout headerTitle="AI Workspace">
      <div className="flex-1 flex flex-col items-center justify-center h-full text-stone-500 bg-stone-50 dark:bg-black/20">
        {loading ? (
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        ) : (
          <div className="flex flex-col items-center text-center p-8 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm max-w-md">
            <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-orange-500" />
            </div>
            <h2 className="text-xl font-bold text-stone-900 dark:text-white mb-2">No Documents Yet</h2>
            <p className="text-sm text-stone-500 mb-6">
              You haven't uploaded any documents. Head over to the Documents section to upload your first PDF or presentation.
            </p>
            <button 
              onClick={() => navigate({ to: '/documents' })}
              className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
            >
              Go to Documents
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

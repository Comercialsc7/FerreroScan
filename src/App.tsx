import { useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { Toaster } from '@/components/ui/toaster'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ThemeProvider } from '@/components/theme-provider'
import Layout from './components/Layout'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'

const Index = lazy(() => import('./pages/Index'))
const AuthPage = lazy(() => import('./pages/Auth'))
const NotFound = lazy(() => import('./pages/NotFound'))
const SearchCustomerPage = lazy(() => import('./pages/SearchCustomer'))
const CustomerDetailsPage = lazy(() => import('./pages/CustomerDetails'))
const ScannerPage = lazy(() => import('./pages/Scanner'))
const ManualEntryPage = lazy(() => import('./pages/ManualEntry'))
const ProductDetailsPage = lazy(() => import('./pages/ProductDetails'))
const CustomerEvaluationPage = lazy(() => import('./pages/CustomerEvaluation'))

const RouteFallback = () => (
  <div className="flex h-screen w-full items-center justify-center bg-background">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
)

const App = () => {
  useEffect(() => {
    document.documentElement.lang = 'pt-BR'
  }, [])

  return (
    <BrowserRouter
      future={{ v7_startTransition: false, v7_relativeSplatPath: false }}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        storageKey="ferreroscan-ui-theme"
        disableTransitionOnChange
      >
        <AuthProvider>
          <TooltipProvider>
            <Toaster />

            <Suspense fallback={<RouteFallback />}>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/auth" element={<AuthPage />} />
                </Route>

                <Route element={<ProtectedRoute />}>
                  <Route path="/welcome" element={<Index />} />
                  <Route path="/search-customer" element={<SearchCustomerPage />} />
                  <Route path="/customer/:id" element={<CustomerDetailsPage />} />
                  <Route
                    path="/customer/:id/evaluation"
                    element={<CustomerEvaluationPage />}
                  />
                  <Route path="/scanner" element={<ScannerPage />} />
                  <Route path="/manual-entry" element={<ManualEntryPage />} />
                  <Route
                    path="/customer/:customerId/product/:barcode"
                    element={<ProductDetailsPage />}
                  />
                </Route>

                <Route path="/" element={<Navigate to="/auth" replace />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App

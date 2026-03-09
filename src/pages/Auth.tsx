import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { AuthForm } from '@/components/auth/AuthForm'
import { loginSchema, signupSchema } from '@/lib/schemas'
import { ThemeToggle } from '@/components/theme-toggle'
import { useAuth } from '@/contexts/AuthContext'

const AuthPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const mode = searchParams.get('mode')
  const [authMode, setAuthMode] = useState<'login' | 'signup'>(
    mode === 'signup' ? 'signup' : 'login',
  )

  useEffect(() => {
    if (user) {
      navigate('/welcome', { replace: true })
    }
  }, [user, navigate])

  useEffect(() => {
    const newMode = mode === 'signup' ? 'signup' : 'login'
    setAuthMode(newMode)
    document.title =
      newMode === 'login' ? 'Entrar - FerreroScan' : 'Cadastrar - FerreroScan'
  }, [mode])

  const handleModeChange = (newMode: 'login' | 'signup') => {
    setAuthMode(newMode)
    navigate(`/auth?mode=${newMode}`, { replace: true })
  }

  const schema = authMode === 'login' ? loginSchema : signupSchema

  return (
    <>
      <div className="absolute right-4 top-4 md:right-8 md:top-8">
        <ThemeToggle />
      </div>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white">
            FerreroScan
          </h1>
          <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
            Leitura Comercial Inteligente.
          </p>
        </div>

        <div className="relative flex h-12 items-center justify-center rounded-xl bg-slate-200 p-1 dark:bg-slate-800">
          <label className="z-10 flex h-full w-1/2 cursor-pointer items-center justify-center rounded-lg px-2 text-center transition-colors duration-200 ease-in-out">
            <input
              type="radio"
              name="auth-mode"
              value="login"
              className="peer sr-only"
              checked={authMode === 'login'}
              onChange={() => handleModeChange('login')}
            />
            <span
              className={cn(
                'text-sm font-medium text-slate-500 dark:text-slate-400',
                {
                  'text-checked-toggle-foreground': authMode === 'login',
                },
              )}
            >
              Entrar
            </span>
          </label>
          <label className="z-10 flex h-full w-1/2 cursor-pointer items-center justify-center rounded-lg px-2 text-center transition-colors duration-200 ease-in-out">
            <input
              type="radio"
              name="auth-mode"
              value="signup"
              className="peer sr-only"
              checked={authMode === 'signup'}
              onChange={() => handleModeChange('signup')}
            />
            <span
              className={cn(
                'text-sm font-medium text-slate-500 dark:text-slate-400',
                {
                  'text-checked-toggle-foreground': authMode === 'signup',
                },
              )}
            >
              Cadastrar
            </span>
          </label>
          <div
            className={cn(
              'absolute left-1 top-1 h-10 w-[calc(50%-0.25rem)] rounded-lg bg-checked-toggle-background shadow-sm transition-transform duration-200 ease-in-out',
              { 'translate-x-0': authMode === 'login' },
              { 'translate-x-full': authMode === 'signup' },
            )}
          />
        </div>

        <AuthForm authMode={authMode} schema={schema} />
      </div>
    </>
  )
}

export default AuthPage

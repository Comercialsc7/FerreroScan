import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { z } from 'zod'
import { Eye, EyeOff } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import type { LoginSchema, SignupSchema } from '@/lib/schemas'

type AuthFormProps = {
  authMode: 'login' | 'signup'
  schema: z.ZodType<LoginSchema> | z.ZodType<SignupSchema>
}

export const AuthForm = ({ authMode, schema }: AuthFormProps) => {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const { signIn, signUp } = useAuth()
  const { toast } = useToast()

  async function onSubmit(values: z.infer<typeof schema>) {
    try {
      if (authMode === 'login') {
        const { error } = await signIn(values.email, values.password)

        if (error) {
          toast({
            variant: "destructive",
            title: "Erro de autenticação",
            description: "Email ou senha incorretos.",
          })
          return
        }

        toast({
          title: "Login efetuado com sucesso",
          description: "Bem-vindo de volta!",
        })

        navigate('/welcome')
      } else {
        const { error } = await signUp(values.email, values.password)

        if (error) {
          toast({
            variant: "destructive",
            title: "Erro no cadastro",
            description: error.message || "Não foi possível criar sua conta.",
          })
          return
        }

        toast({
          title: "Conta criada com sucesso",
          description: "Bem-vindo ao FerreroScan!",
        })
        navigate('/welcome')
      }
    } catch (_error) {
      toast({
        variant: "destructive",
        title: "Erro inesperado",
        description: "Ocorreu um erro ao processar sua solicitação.",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-slate-800 dark:text-white">
                Endereço de E-mail
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Digite seu e-mail"
                  className="h-14 w-full rounded-lg border-slate-300 bg-white text-base placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-slate-800 dark:text-white">
                Senha
              </FormLabel>
              <div className="flex">
                <FormControl>
                  <Input
                    type={passwordVisible ? 'text' : 'password'}
                    placeholder="Digite sua senha"
                    className="h-14 w-full rounded-l-lg rounded-r-none border-r-0 border-slate-300 bg-white text-base placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
                    {...field}
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="h-14 w-auto rounded-l-none rounded-r-lg border border-slate-300 bg-white px-4 text-slate-500 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                >
                  {passwordVisible ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="h-14 w-full rounded-xl bg-primary px-6 text-base font-semibold text-white shadow-sm transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 dark:focus:ring-offset-background"
        >
          {authMode === 'login' ? 'Entrar' : 'Cadastrar'}
        </Button>
      </form>
    </Form>
  )
}

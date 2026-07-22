import { supabase } from '@/lib/supabase/client'

type EvaluationProduct = {
  id: string
  name: string
  categoryId: string
  categoryTitle: string
}

type EvaluationPayload = {
  generatedAt: string
  location: string
  notes: string
  selectedProducts: EvaluationProduct[]
  summary: {
    selectedCount: number
    totalCount: number
  }
  customerSnapshot: {
    id: string
    seqpessoa: number | null
    name: string
    cnpj: string | null
    cidade: string | null
    rede: string | null
    atividade: string | null
  }
}

type SaveCustomerEvaluationInput = {
  userId: string
  userEmail: string | null
  customerId: string
  customerName: string
  evaluation: EvaluationPayload
}

export const saveCustomerEvaluation = async ({
  userId,
  userEmail,
  customerId,
  customerName,
  evaluation,
}: SaveCustomerEvaluationInput) => {
  const { error } = await (supabase as unknown as {
    from: (table: string) => {
      insert: (values: Record<string, unknown>) => Promise<{ error: Error | null }>
    }
  })
    .from('customer_evaluations')
    .insert({
      user_id: userId,
      user_email: userEmail,
      customer_id: customerId,
      customer_name: customerName,
      evaluation,
    })

  if (error) {
    throw error
  }
}
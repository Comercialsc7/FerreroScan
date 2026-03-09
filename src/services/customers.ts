import { Database } from '@/lib/supabase/types'

export type Customer = Database['public']['Tables']['clientes']['Row']

const CACHE_KEY = 'ferreroscan_customers_cache'
const CACHE_DURATION = 1000 * 60 * 30 // 30 minutes

/**
 * Keeps only the fields the app actually uses, discarding unused columns
 * (dataproximavisita, diavisita, equipe, nroequipe, periodvisita,
 *  sequenciavisita, vend, created_at, etc.).
 * This prevents QuotaExceededError when saving large datasets to sessionStorage.
 */
const slimCustomer = (c: Customer): Customer => ({
  id: c.id,
  seqpessoa: c.seqpessoa,
  nomerazao: c.nomerazao,
  cnpj: c.cnpj,
  apelido: c.apelido,
  rede: c.rede,
  atividade: c.atividade,
  cidade: c.cidade,
  end: c.end,
  bairro: c.bairro,
  datageracaonf: c.datageracaonf,
  vlremaberto: c.vlremaberto,
  // Remaining fields set to null — not used anywhere in the UI
  dataproximavisita: null,
  diavisita: null,
  equipe: null,
  nroequipe: null,
  periodvisita: null,
  sequenciavisita: null,
  vend: null,
  created_at: c.created_at,
})

export const getCustomerById = async (id: string): Promise<Customer | null> => {
  // 1. Try to find the customer in the sessionStorage cache first
  // (populated by SearchCustomerPage — avoids an extra N8N request)
  try {
    const cached = sessionStorage.getItem(CACHE_KEY)
    if (cached) {
      const { data, timestamp } = JSON.parse(cached)
      const isExpired = Date.now() - timestamp > CACHE_DURATION

      if (!isExpired && Array.isArray(data)) {
        const found = (data as Customer[]).find(
          (c) => c.id === id || String(c.seqpessoa) === id || c.cnpj === id
        )
        if (found) {
          console.log('📦 Customer loaded from cache (no N8N request needed)')
          return found
        }
      }
    }
  } catch (e) {
    console.warn('Cache read failed in getCustomerById:', e)
  }

  // 2. Cache miss — fall back to N8N search
  try {
    const customers = await searchCustomers('')
    const found = customers.find(
      (c) => c.id === id || String(c.seqpessoa) === id || c.cnpj === id
    )
    return found || null
  } catch (error) {
    console.error('Error fetching customer by ID:', error)
    return null
  }
}

export const searchCustomers = async (term: string) => {
  const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL_CUSTOMERS

  if (!webhookUrl) {
    console.error('Missing VITE_N8N_WEBHOOK_URL_CUSTOMERS env var')
    return []
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'clientes',
        term
      }),
    })

    if (!response.ok) {
      throw new Error(`N8N Webhook error: ${response.status} ${response.statusText}`)
    }

    const data: Customer[] = await response.json()

    // Deduplicate by CNPJ, guarantee an id, and slim to only used fields
    const uniqueCustomers = data
      .filter(
        (customer, index, self) =>
          index === self.findIndex((c) => c.cnpj === customer.cnpj),
      )
      .map((customer) =>
        slimCustomer({
          ...customer,
          // Fallback: use seqpessoa or cnpj if id is missing
          id: customer.id || String(customer.seqpessoa) || customer.cnpj || crypto.randomUUID(),
        })
      )

    return uniqueCustomers
  } catch (error) {
    console.error('Error fetching customers from N8N:', error)
    // Return empty array to avoid crashing UI, or rethrow if preferred
    return []
  }
}

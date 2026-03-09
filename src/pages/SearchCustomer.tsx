import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Search,
  ChevronRight,
  ClipboardCheck,
  CheckCircle2,
  Loader2,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { searchCustomers, type Customer } from '@/services/customers'
import { useAuth } from '@/contexts/AuthContext'
const CACHE_KEY = 'ferreroscan_customers_cache'
const CACHE_DURATION = 1000 * 60 * 30 // 30 minutes

const SearchCustomerPage = () => {
  const [allCustomers, setAllCustomers] = useState<Customer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null,
  )
  const navigate = useNavigate()
  const { signOut } = useAuth()


  // Load customers with cache
  useEffect(() => {
    document.title = 'Buscar Cliente - FerreroScan'

    const loadCustomers = async () => {
      // Check cache first
      try {
        const cached = sessionStorage.getItem(CACHE_KEY)
        if (cached) {
          const { data, timestamp } = JSON.parse(cached)
          const isExpired = Date.now() - timestamp > CACHE_DURATION

          if (!isExpired) {
            console.log('📦 Loading customers from cache')
            setAllCustomers(data)
            setFilteredCustomers(data)
            return
          }
        }
      } catch (e) {
        console.warn('Cache read failed:', e)
      }

      // No cache or expired - fetch from API
      setIsLoading(true)
      setError(null)
      try {
        console.log('🌐 Fetching customers from API...')
        const data = await searchCustomers('') // Empty search = all customers
        setAllCustomers(data || [])
        setFilteredCustomers(data || [])

        // Save to cache
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({
            data,
            timestamp: Date.now()
          }))
        } catch (e) {
          console.warn('Cache write failed:', e)
        }
      } catch (err: any) {
        console.error('Error loading customers:', err)
        setError(err.message || 'Erro ao carregar clientes. Verifique sua conexão ou credenciais.')
      } finally {
        setIsLoading(false)
      }
    }

    loadCustomers()
  }, [])

  // Filter customers locally when search term changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCustomers(allCustomers)
      return
    }

    const term = searchTerm.toLowerCase().trim()

    // Only filter if term is at least 2 characters (performance)
    if (term.length < 2) {
      setFilteredCustomers(allCustomers)
      return
    }

    const filtered = allCustomers.filter((customer) => {
      return (
        customer.nomerazao?.toLowerCase().includes(term) ||
        customer.cnpj?.toLowerCase().includes(term) ||
        customer.apelido?.toLowerCase().includes(term) ||
        customer.rede?.toLowerCase().includes(term) ||
        customer.seqpessoa?.toString().includes(term) ||
        customer.cidade?.toLowerCase().includes(term)
      )
    })

    setFilteredCustomers(filtered)
  }, [searchTerm, allCustomers])

  const handleCustomerSelect = (customerId: string) => {
    setSelectedCustomerId((prev) => (prev === customerId ? null : customerId))
  }

  const handleScan = () => {
    if (selectedCustomerId) {
      navigate(`/customer/${selectedCustomerId}/evaluation`)
    }
  }

  const handleExit = async () => {
    await signOut()
    navigate('/auth')
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-background px-4">
        <Button variant="ghost" size="icon" onClick={handleExit}>
          <ArrowLeft className="h-6 w-6 text-zinc-900 dark:text-white" />
        </Button>
        <h1 className="flex-1 text-center text-lg font-semibold text-zinc-900 dark:text-white">
          Buscar Cliente
        </h1>
        <div className="w-10" />
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500 dark:text-zinc-400" />
          <Input
            type="text"
            placeholder="Buscar por nome, ID, CNPJ ou rede"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-14 rounded-xl border-none bg-zinc-200 pl-12 text-zinc-900 placeholder:text-zinc-500 dark:bg-zinc-800/50 dark:text-white dark:placeholder:text-zinc-400"
          />
        </div>

        <div className="space-y-3">
          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredCustomers.length > 0 ? (
            <>
              {filteredCustomers.slice(0, 100).map((customer) => (
                <div
                  key={customer.id}
                  className={cn(
                    'flex cursor-pointer items-center space-x-4 rounded-lg p-4 transition-all duration-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/50',
                    {
                      'bg-primary/10 ring-2 ring-primary dark:bg-primary/20':
                        selectedCustomerId === customer.id,
                    },
                  )}
                  onClick={() => handleCustomerSelect(customer.id)}
                >
                  <div className="flex-1 space-y-1">
                    <p className="font-semibold text-zinc-900 dark:text-white">
                      {customer.nomerazao}
                    </p>
                    <div className="grid grid-cols-1 gap-x-4 gap-y-0.5 text-xs text-zinc-500 dark:text-zinc-400 sm:grid-cols-2">
                      <p>
                        <span className="font-medium">ID:</span> {customer.seqpessoa || '-'}
                      </p>
                      <div className="space-y-0.5">
                        <p>
                          <span className="font-medium">CNPJ:</span> {customer.cnpj}
                        </p>
                        <p>
                          <span className="font-medium">Cidade:</span> {customer.cidade || '-'}
                        </p>
                      </div>
                      <p className="col-span-full sm:col-span-2">
                        <span className="font-medium">Rede:</span> {customer.rede}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {selectedCustomerId === customer.id && (
                      <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-primary" />
                    )}
                    <Link
                      to={`/customer/${customer.id}`}
                      className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700"
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Ver detalhes de ${customer.nomerazao}`}
                    >
                      <ChevronRight className="h-6 w-6 flex-shrink-0 text-zinc-400 dark:text-zinc-500" />
                    </Link>
                  </div>
                </div>
              ))
              }
              {filteredCustomers.length > 100 && (
                <div className="rounded-lg bg-zinc-100 p-4 text-center text-sm text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                  Mostrando 100 de {filteredCustomers.length.toLocaleString('pt-BR')} clientes. Continue digitando para refinar.
                </div>
              )}
            </>
          ) : (
            <div className="py-10 text-center">
              <p className="text-muted-foreground">
                Nenhum cliente encontrado.
              </p>
            </div>
          )}
        </div>
      </main>

      <footer className="sticky bottom-0 border-t bg-background p-4">
        <Button
          className="h-14 w-full rounded-xl bg-primary text-base font-semibold text-white hover:bg-primary/90"
          disabled={!selectedCustomerId}
          onClick={handleScan}
        >
          <ClipboardCheck className="mr-2 h-6 w-6" />
          Iniciar Avaliação
        </Button>
      </footer>
    </div>
  )
}

export default SearchCustomerPage

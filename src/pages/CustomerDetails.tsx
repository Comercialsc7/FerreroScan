import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Building,
  Hash,
  History,
  Info,
  MapPin,
  Users,
  Loader2,
  DollarSign,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getCustomerById, type Customer } from '@/services/customers'
import { format } from 'date-fns'

const CustomerDetailsPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCustomer = async () => {
      if (!id) return
      setIsLoading(true)
      try {
        const data = await getCustomerById(id)
        setCustomer(data)
      } catch (error) {
        console.error('Error fetching customer:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCustomer()
  }, [id])

  useEffect(() => {
    if (customer) {
      document.title = `${customer.nomerazao} - FerreroScan`
    } else if (!isLoading) {
      document.title = 'Cliente não encontrado - FerreroScan'
    }
  }, [customer, isLoading])

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    try {
      return format(new Date(dateString), 'dd/MM/yyyy')
    } catch {
      return dateString
    }
  }

  const formatCurrency = (value: number | null) => {
    if (value === null || value === undefined) return '-'
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-background text-center">
        <h1 className="text-2xl font-bold">Cliente não encontrado</h1>
        <p className="text-muted-foreground">
          O cliente que você está procurando não existe.
        </p>
        <Button asChild className="mt-4">
          <Link to="/search-customer">Voltar para a busca</Link>
        </Button>
      </div>
    )
  }

  const details = [
    { icon: Hash, label: 'ID', value: customer.seqpessoa || '-' },
    { icon: Info, label: 'CNPJ', value: customer.cnpj || '-' },
    { icon: Users, label: 'Rede', value: customer.rede || '-' },
    { icon: Building, label: 'Atividade', value: customer.atividade || '-' },
    { icon: MapPin, label: 'Cidade', value: customer.cidade || '-' },
    { icon: MapPin, label: 'Endereço', value: customer.end || '-' },
    { icon: Users, label: 'Vendedor Principal', value: customer.apelido || '-' },
    { icon: Info, label: 'Bairro', value: customer.bairro || '-' },
    {
      icon: History,
      label: 'Última Compra',
      value: formatDate(customer.datageracaonf),
    },
    {
      icon: DollarSign,
      label: 'Valor em Aberto',
      value: formatCurrency(customer.vlremaberto),
    },
  ]

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-background px-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-6 w-6 text-zinc-900 dark:text-white" />
        </Button>
        <h1 className="flex-1 truncate px-2 text-center text-lg font-semibold text-zinc-900 dark:text-white">
          {customer.nomerazao}
        </h1>
        <div className="w-10" />
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Detalhes do Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {details.map((detail) => (
                <li key={detail.label} className="flex items-start space-x-3">
                  <detail.icon className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {detail.label}
                    </p>
                    <p className="font-semibold text-foreground">
                      {detail.value}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default CustomerDetailsPage

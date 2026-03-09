import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { ProductStatsGrid } from '@/components/product/ProductStatsGrid'
import { SalesHistoryTable } from '@/components/product/SalesHistoryTable'
import {
  getProductAndSales,
  type ProductInfo,
  type Sale,
} from '@/services/sales'

const ProductDetailsPage = () => {
  const { customerId, barcode } = useParams<{
    customerId: string
    barcode: string
  }>()
  const navigate = useNavigate()

  const [product, setProduct] = useState<ProductInfo | null>(null)
  const [sales, setSales] = useState<Sale[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    document.title = 'Detalhes do Produto - FerreroScan'

    const fetchData = async () => {
      if (!customerId || !barcode) return

      setIsLoading(true)
      setError(null)
      try {
        const result = await getProductAndSales(barcode, customerId)
        setProduct(result.product)
        setSales(result.sales)
      } catch (err: any) {
        console.error('Error fetching product details:', err)
        setError(err.message || 'Erro ao carregar detalhes do produto.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [customerId, barcode])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-background p-4 text-center">
        <h1 className="text-2xl font-bold">Informação não encontrada</h1>
        <p className="text-muted-foreground mb-4">
          {error || 'Os detalhes do cliente ou do produto não foram encontrados.'}
        </p>
        <Button asChild>
          <button onClick={() => navigate(-1)}>Voltar</button>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-background px-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="flex-1 text-center text-lg font-semibold">
          Detalhes do Produto
        </h1>
        <div className="w-10" />
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        <Card>
          <CardHeader>
            <p className="break-all text-xs font-medium text-primary sm:text-sm">
              Cód. Barras: {product.codbarras || '-'}
            </p>
            <CardTitle className="break-words text-lg leading-snug sm:text-xl">
              {product.desccompleta || 'Produto sem descrição'}
            </CardTitle>
          </CardHeader>
        </Card>
        <ProductStatsGrid product={product} sales={sales} />
        <SalesHistoryTable sales={sales} />
      </main>
    </div>
  )
}

export default ProductDetailsPage

import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Camera,
  FileText,
  Loader2,
  ScanLine,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Checkbox } from '@/components/ui/checkbox'
import { getCustomerById, type Customer } from '@/services/customers'
import { toast } from '@/components/ui/use-toast'

type Category = {
  id: string
  title: string
  products: { id: string; name: string }[]
}

const categories: Category[] = [
  {
    id: 'myps',
    title: 'MIX MYPS',
    products: [
      { id: 'myps-1', name: 'nutella b-ready 22 gr' },
      { id: 'myps-2', name: 'nutella b-ready 22 gr' },
      { id: 'myps-3', name: 'kinder joy 20 gr c/16 jurrasic' },
      { id: 'myps-4', name: 'kinder joy 20 gr c/48 jurrasic' },
      { id: 'myps-5', name: 'tic tac 14,5 gr menta' },
      { id: 'myps-6', name: 'tic tac 14,5 gr laranja' },
    ],
  },
  {
    id: 'outros-produtos',
    title: 'Outros Produtos',
    products: [
      { id: 'outros-1', name: 'ferrero collection 134 gr c/12' },
      { id: 'outros-2', name: 'ferrero collection 77 gr c/7' },
      { id: 'outros-3', name: 'kinder bueno 117 gr white' },
      { id: 'outros-4', name: 'kinder bueno 129gr' },
      { id: 'outros-5', name: 'kinder bueno 39 gr white' },
      { id: 'outros-6', name: 'kinder bueno 39 white' },
      { id: 'outros-7', name: 'kinder bueno 43 gr' },
      { id: 'outros-8', name: 'kinder bueno 43 gr dark edicao limitada' },
      { id: 'outros-9', name: 'kinder joy 20 gr c/2' },
      { id: 'outros-10', name: 'kinder joy 20 gr jurassic' },
      { id: 'outros-11', name: 'kinder ovo 20 gr azul' },
      { id: 'outros-12', name: 'kinder ovo 20 gr c/2 azul' },
      { id: 'outros-13', name: 'kinder ovo 20 gr c/2 gabby dollhouse' },
      { id: 'outros-14', name: 'kinder ovo 20 gr c/2 natal' },
      { id: 'outros-15', name: 'kinder ovo 20 gr c/2 playmobil' },
      { id: 'outros-16', name: 'kinder ovo 20 gr c/2 rosa' },
      { id: 'outros-17', name: 'kinder ovo 20 gr patrulha canina' },
      { id: 'outros-18', name: 'kinder ovo 20 gr playmobil' },
      { id: 'outros-19', name: 'kinder ovo 20 gr rosa' },
      { id: 'outros-20', name: 'kinder tabl 12,5 gr c/24' },
      { id: 'outros-21', name: 'kinder tabl 50 gr c/4' },
      { id: 'outros-22', name: 'kinder tabl 75 gr c/6' },
      { id: 'outros-23', name: 'kinder tronky 18 gr' },
      { id: 'outros-24', name: 'kinder tronky 18 gr c/10' },
      { id: 'outros-25', name: 'nutella 140 gr' },
      { id: 'outros-26', name: 'nutella 350 gr' },
      { id: 'outros-27', name: 'nutella 375 gr' },
      { id: 'outros-28', name: 'nutella 650 gr' },
      { id: 'outros-29', name: 'nutella 700 gr' },
      { id: 'outros-30', name: 'nutella lv 400 gr - pg 350 gr rtd' },
      { id: 'outros-31', name: 'raffaello 150 gr c/15' },
      { id: 'outros-32', name: 'raffaello 30 gr c/3' },
      { id: 'outros-33', name: 'raffaello 90 gr c/9' },
      { id: 'outros-34', name: 'rocher 100 gr c/8' },
      { id: 'outros-35', name: 'rocher 150 gr c/12' },
      { id: 'outros-36', name: 'rocher 300 gr c/24 diamante' },
      { id: 'outros-37', name: 'rocher 37,5 gr c/3' },
      { id: 'outros-38', name: 'rocher 50 gr c/4' },
      { id: 'outros-39', name: 'tabl rocher 90 gr ao leite' },
      { id: 'outros-40', name: 'tabl rocher 90 gr branco' },
      { id: 'outros-41', name: 'tabl rocher 90 gr dark' },
      { id: 'outros-42', name: 'tic tac 14,5 gr citrus' },
      { id: 'outros-43', name: 'tic tac 14,5 gr fruta te gusta' },
      { id: 'outros-44', name: 'tic tac 14,5 gr menta fresh' },
      { id: 'outros-45', name: 'tic tac 14,5 gr morango' },
      { id: 'outros-46', name: 'tic tac 38,5 gr two limao e framb' },
      { id: 'outros-47', name: 'tic tac 38,5 gr two menta fresh' },
      { id: 'outros-48', name: 'tic tac 49 gr fruta te gusta' },
      { id: 'outros-49', name: 'tic tac 49 gr laranja' },
      { id: 'outros-50', name: 'tic tac 49 gr menta' },
    ],
  },
]

const CustomerEvaluationPage = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const [customer, setCustomer] = useState<Customer | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notes, setNotes] = useState('')
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
  const [checkedProducts, setCheckedProducts] = useState<Record<string, boolean>>(
    {
      'myps-1': true,
    },
  )
  const [images, setImages] = useState<string[]>([])

  useEffect(() => {
    document.title = 'Avaliação do Cliente - FerreroScan'

    const loadCustomer = async () => {
      if (!id) return
      setIsLoading(true)
      try {
        const data = await getCustomerById(id)
        setCustomer(data)
      } catch (error) {
        console.error('Error loading customer for evaluation:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCustomer()
  }, [id])

  const totalItems = useMemo(
    () => categories.reduce((acc, category) => acc + category.products.length, 0),
    [],
  )

  const handleToggleProduct = (productId: string, checked: boolean) => {
    setCheckedProducts((prev) => ({
      ...prev,
      [productId]: checked,
    }))
  }

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    if (files.length === 0) return

    const newImageUrls = files.map((file) => URL.createObjectURL(file))
    setImages((prev) => [...prev, ...newImageUrls].slice(0, 5))

    event.target.value = ''
  }

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove))
  }

  const getCurrentLocation = () =>
    new Promise<string>((resolve) => {
      if (!('geolocation' in navigator)) {
        resolve('Não disponível (navegador sem geolocalização)')
        return
      }

      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const lat = coords.latitude.toFixed(6)
          const lng = coords.longitude.toFixed(6)
          resolve(`${lat}, ${lng}`)
        },
        () => resolve('Não autorizada ou indisponível'),
        {
          enableHighAccuracy: true,
          timeout: 7000,
          maximumAge: 30000,
        },
      )
    })

  const imageUrlToDataUrl = (url: string, mimeType: 'image/png' | 'image/jpeg' = 'image/jpeg') =>
    new Promise<string>((resolve, reject) => {
      const image = new Image()
      image.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = image.naturalWidth
        canvas.height = image.naturalHeight

        const context = canvas.getContext('2d')
        if (!context) {
          reject(new Error('Não foi possível processar a imagem.'))
          return
        }

        context.drawImage(image, 0, 0)
        if (mimeType === 'image/png') {
          resolve(canvas.toDataURL('image/png'))
          return
        }

        resolve(canvas.toDataURL('image/jpeg', 0.92))
      }
      image.onerror = () => reject(new Error('Falha ao carregar imagem.'))
      image.src = url
    })

  const handleGeneratePdf = async () => {
    try {
      setIsGeneratingPdf(true)
      const { default: jsPDF } = await import('jspdf')

      const document = new jsPDF({ unit: 'mm', format: 'a4' })
      const pageWidth = document.internal.pageSize.getWidth()
      const pageHeight = document.internal.pageSize.getHeight()
      const marginX = 12
      const maxContentWidth = pageWidth - marginX * 2
      const timestamp = new Date()
      const location = await getCurrentLocation()
      let logoDataUrl: string | null = null

      const logoCandidates = ['/dmuller-sorriso.png', '/dmuller-logo.png', '/Scan.png']

      for (const logoPath of logoCandidates) {
        try {
          logoDataUrl = await imageUrlToDataUrl(logoPath, 'image/png')
          break
        } catch {
          continue
        }
      }

      const reportByCategory = categories.map((category) => ({
        title: category.title,
        products: category.products,
      }))

      let y = 14

      const ensureSpace = (heightNeeded: number) => {
        if (y + heightNeeded <= pageHeight - 12) return
        document.addPage()
        y = 14
      }

      const addSectionTitle = (title: string) => {
        ensureSpace(12)
        y += 2
        document.setFont('helvetica', 'bold')
        document.setFontSize(12)
        document.setTextColor(15, 23, 42)
        document.text(title, marginX, y)
        y += 2.5
        document.setDrawColor(200)
        document.line(marginX, y, pageWidth - marginX, y)
        y += 5
      }

      const addField = (label: string, value: string) => {
        ensureSpace(10)
        document.setFont('helvetica', 'bold')
        document.setFontSize(10)
        document.setTextColor(30, 41, 59)
        document.text(label, marginX, y)
        document.setFont('helvetica', 'normal')
        const wrapped = document.splitTextToSize(value || '-', maxContentWidth - 34)
        document.text(wrapped, marginX + 34, y)
        y += Math.max(6, wrapped.length * 5)
      }

      const headerHeight = 28
      document.setFillColor(245, 248, 252)
      document.roundedRect(marginX, y, maxContentWidth, headerHeight, 2, 2, 'F')

      if (logoDataUrl) {
        document.addImage(logoDataUrl, 'PNG', marginX + 3, y + 4, 18, 18)
      }

      document.setFont('helvetica', 'bold')
      document.setFontSize(16)
      document.setTextColor(15, 23, 42)
      document.text('Avaliação de Cliente', marginX + (logoDataUrl ? 24 : 4), y + 10)
      document.setFont('helvetica', 'normal')
      document.setFontSize(10)
      document.setTextColor(71, 85, 105)
      document.text(
        'Distribuidora Muller - 0800 747 2400',
        marginX + (logoDataUrl ? 24 : 4),
        y + 16,
      )

      document.setFont('helvetica', 'bold')
      document.setFontSize(10)
      document.setTextColor(30, 41, 59)
      document.text(
        `Emitido em: ${timestamp.toLocaleString('pt-BR')}`,
        pageWidth - marginX,
        y + 10,
        { align: 'right' },
      )

      document.setFont('helvetica', 'normal')
      document.setTextColor(71, 85, 105)
      document.text(`Localização: ${location}`, pageWidth - marginX, y + 16, {
        align: 'right',
      })

      y += headerHeight + 6

      addSectionTitle('Dados do Cliente')

      document.setDrawColor(220)
      document.roundedRect(marginX, y - 1.5, maxContentWidth, 42, 2, 2)
      y += 4

      addField('Nome:', customer.nomerazao || '-')
      addField('CNPJ:', customer.cnpj || '-')
      addField('Cidade:', customer.cidade || '-')
      addField('Rede:', customer.rede || '-')
      addField('Ramo:', customer.atividade || '-')
      y += 2

    
      reportByCategory.forEach((category) => {
        ensureSpace(12)

        document.setFillColor(248, 250, 252)
        document.roundedRect(marginX, y - 3, maxContentWidth, 8, 1.5, 1.5, 'F')
        document.setFont('helvetica', 'bold')
        document.setFontSize(11)
        document.setTextColor(30, 41, 59)
        document.text(category.title, marginX + 2, y + 2)
        y += 8

        document.setFont('helvetica', 'normal')
        document.setFontSize(10)
        document.setTextColor(51, 65, 85)

        if (category.products.length === 0) {
          ensureSpace(7)
          document.text('[ ] Sem itens cadastrados neste mix.', marginX + 2, y)
          y += 5
        } else {
          category.products.forEach((product) => {
            const checkedPrefix = checkedProducts[product.id] ? '[X]' : '[ ]'
            const wrapped = document.splitTextToSize(
              `${checkedPrefix} ${product.name}`,
              maxContentWidth - 2,
            )
            ensureSpace(wrapped.length * 5 + 2)
            document.text(wrapped, marginX + 2, y)
            y += wrapped.length * 5
          })
        }

        y += 2
      })

      if (notes.trim()) {
        addSectionTitle('Observações')

        document.setFont('helvetica', 'normal')
        document.setFontSize(10)
        document.setTextColor(51, 65, 85)
        const wrappedNotes = document.splitTextToSize(notes.trim(), maxContentWidth)
        ensureSpace(wrappedNotes.length * 5 + 8)
        document.setDrawColor(220)
        document.roundedRect(marginX, y - 1.5, maxContentWidth, wrappedNotes.length * 5 + 4, 2, 2)
        document.text(wrappedNotes, marginX + 2, y + 2)
        y += wrappedNotes.length * 5 + 6
      }

      if (images.length > 0) {
        const imageDataUrls = await Promise.all(images.map((url) => imageUrlToDataUrl(url)))

        imageDataUrls.forEach((dataUrl, index) => {
          const positionInPage = index % 2

          if (index === 0) {
            document.addPage()
          } else if (positionInPage === 0) {
            document.addPage()
          }

          if (positionInPage === 0) {
            document.setFillColor(245, 248, 252)
            document.roundedRect(marginX, 10, maxContentWidth, 12, 2, 2, 'F')
            document.setFont('helvetica', 'bold')
            document.setFontSize(12)
            document.setTextColor(15, 23, 42)
            document.text('Evidências Fotográficas', marginX + 2, 17)
            document.setDrawColor(205)
            document.line(marginX, 24, pageWidth - marginX, 24)
          }

          const boxTop = positionInPage === 0 ? 30 : 158
          const boxHeight = 120
          const boxWidth = maxContentWidth

          document.setDrawColor(210)
          document.rect(marginX, boxTop, boxWidth, boxHeight)
          document.addImage(dataUrl, 'JPEG', marginX + 1, boxTop + 1, boxWidth - 2, boxHeight - 2)
        })
      }

      const safeName = (customer.nomerazao || 'cliente')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .toLowerCase()

      document.save(`avaliacao-${safeName || 'cliente'}.pdf`)

      toast({
        title: 'PDF gerado com sucesso',
        description: 'O arquivo foi baixado no seu dispositivo.',
      })
    } catch (error) {
      console.error('Error generating evaluation PDF:', error)
      toast({
        title: 'Falha ao gerar PDF',
        description: 'Não foi possível gerar o arquivo de avaliação.',
        variant: 'destructive',
      })
    } finally {
      setIsGeneratingPdf(false)
    }
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
      <div className="flex h-screen flex-col items-center justify-center bg-background p-4 text-center">
        <h1 className="text-2xl font-bold">Cliente não encontrado</h1>
        <p className="mb-4 text-muted-foreground">
          Não foi possível carregar os dados para avaliação.
        </p>
        <Button onClick={() => navigate('/search-customer')}>Voltar</Button>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-lg font-bold">Distribuidora Muller</h2>
            <p className="text-xs text-muted-foreground">
            Avaliação de Clientes - 0800 747 2400
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate('/scanner', { state: { customerId: customer.id } })}
        >
          <ScanLine className="h-5 w-5" />
        </Button>
      </header>

      <main className="flex-1 overflow-y-auto">
        <section className="p-4 sm:p-6">
          <div className="rounded-xl border bg-card p-4 text-card-foreground">
            <div className="space-y-1">
              <p className="text-xl font-bold break-words">{customer.nomerazao}</p>
              <p className="text-sm font-medium text-primary break-words">
                {customer.atividade || 'Segmento não informado'}
              </p>
              <p className="text-xs text-muted-foreground break-words">
                CNPJ: {customer.cnpj || '-'}
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3 px-4 pb-6 sm:px-6">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Categorias de Produto
            </span>
            <span className="text-xs text-muted-foreground">
              {totalItems} itens encontrados
            </span>
          </div>

          <Accordion type="multiple" defaultValue={['myps']} className="space-y-3">
            {categories.map((category) => (
              <AccordionItem
                key={category.id}
                value={category.id}
                className="rounded-xl border bg-card px-4"
              >
                <AccordionTrigger className="py-4 no-underline hover:no-underline">
                  <div className="flex items-center gap-3 text-left">
                    <div className="h-8 w-1 rounded-full bg-primary/70" />
                    <span className="font-bold">{category.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-1">
                  {category.products.length === 0 ? (
                    <p className="py-2 text-sm italic text-muted-foreground">
                      Sem itens listados nesta categoria.
                    </p>
                  ) : (
                    <div className="space-y-3 border-t pt-3">
                      {category.products.map((product) => (
                        <label
                          key={product.id}
                          className="flex cursor-pointer items-center gap-3"
                        >
                          <Checkbox
                            checked={Boolean(checkedProducts[product.id])}
                            onCheckedChange={(checked) =>
                              handleToggleProduct(product.id, Boolean(checked))
                            }
                          />
                          <span className="text-sm">{product.name}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </main>

      <footer className="space-y-5 border-t bg-card p-4 sm:p-6">
        <div className="space-y-2">
          <label className="px-1 text-sm font-semibold text-muted-foreground">
            Observações da Avaliação
          </label>
          <Textarea
            placeholder="Descreva observações importantes aqui..."
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            className="min-h-[120px]"
          />
        </div>

        <div className="space-y-2">
          <label className="px-1 text-sm font-semibold text-muted-foreground">
            Fotos de Evidência
          </label>
          <div className="flex gap-3 overflow-x-auto pb-1">
            <label className="flex h-24 w-24 shrink-0 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 text-primary">
              <Camera className="h-6 w-6" />
              <span className="mt-1 text-[10px] font-bold">ADICIONAR</span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>

            {images.map((image, index) => (
              <div
                key={`${image}-${index}`}
                className="group relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border"
              >
                <img
                  src={image}
                  alt={`Evidência ${index + 1}`}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  className="absolute inset-0 hidden items-center justify-center bg-black/50 text-white group-hover:flex"
                  onClick={() => handleRemoveImage(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <Button
          className="h-14 w-full rounded-xl text-base font-semibold"
          onClick={handleGeneratePdf}
          disabled={isGeneratingPdf}
        >
          <FileText className="mr-2 h-5 w-5" />
          {isGeneratingPdf ? 'Gerando PDF...' : 'Gerar PDF da Avaliação'}
        </Button>
      </footer>
    </div>
  )
}

export default CustomerEvaluationPage

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
    id: 'mom7',
    title: 'MOM 7',
    products: [
      { id: 'mom7-1', name: 'Bauducco Choco Biscuit ao Leite 36 g' },
      { id: 'mom7-2', name: 'Bauducco Choco Biscuit ao Leite 80 g' },
      {
        id: 'mom7-3',
        name: 'Bauducco Cookies Tradicional 60 g (Cash & Carry)',
      },
      { id: 'mom7-4', name: 'Bauducco Cookies Tradicional 100 g' },
      { id: 'mom7-5', name: 'Bauducco Wafer Chocolate 140 g' },
      { id: 'mom7-6', name: 'Bauducco Pão de Forma Tradicional 390 g' },
      { id: 'mom7-7', name: 'Bauducco Bolinho Duplo Chocolate 40 g' },
      { id: 'mom7-8', name: 'Pão de Forma Integral Visconti 400 g' },
      { id: 'mom7-9', name: 'Bauducco Roll Chocolate 34 g' },
    ],
  },
  {
    id: 'mom16',
    title: 'MOM 16',
    products: [
      { id: 'mom16-1', name: 'Bauducco Wafer Morango 140 g' },
      { id: 'mom16-2', name: 'Bauducco Cookies Maxi 96 g' },
      { id: 'mom16-3', name: 'Bauducco Recheado Baunilha 108 g' },
      { id: 'mom16-4', name: 'Bauducco Cereal Castanha 170 g' },
      { id: 'mom16-5', name: 'Bauducco Pão de Forma Integral 390 g' },
      { id: 'mom16-6', name: 'Bauducco Bisnaguinha 260 g' },
      { id: 'mom16-7', name: 'Bauducco Torrada Tradicional 142 g' },
      { id: 'mom16-8', name: 'Bauducco Bolinho Laranja 40 g' },
      { id: 'mom16-9', name: 'Bauducco Duo Chocolate 27 g' },
    ],
  },
  {
    id: 'mom51',
    title: 'MOM 51',
    products: [
      { id: 'mom51-1', name: 'Bauducco Bolo Chocolate 200 g' },
      { id: 'mom51-2', name: 'PAO HOT DOG BAUD 200 GR' },
      { id: 'mom51-3', name: 'Bauducco Pão Multigrãos 390 g' },
      { id: 'mom51-4', name: 'Bauducco Pão de Mel Especial 180 g' },
      { id: 'mom51-5', name: 'Bauducco Toast Tradicional 128 g' },
      { id: 'mom51-6', name: 'Bauducco Torrada Integral 142 g' },
      { id: 'mom51-7', name: 'Bauducco Torrada Multigrãos 142 g' },
      { id: 'mom51-8', name: 'Bauducco Torrada Tradicional M.Pack 284 g' },
      { id: 'mom51-9', name: 'Torrada Tradicional Visconti 120 g' },
      { id: 'mom51-10', name: 'Torrada Integral Visconti 120 g' },
      { id: 'mom51-11', name: 'Pão de Forma Tradicional Visconti 400 g' },
      { id: 'mom51-12', name: 'BISC BAUD 84 GR SPECULOOS' },
      { id: 'mom51-13', name: 'Bauducco Cereal Maçã e Uva 141 g' },
      { id: 'mom51-14', name: 'Bauducco Biscoito Chocolate 335 g' },
      {
        id: 'mom51-15',
        name: 'Bauducco Biscoito Banana com Canela 354 g',
      },
      { id: 'mom51-16', name: 'Bauducco Biscoito Leite com Gotas 335 g' },
      { id: 'mom51-17', name: 'Bauducco Choco Biscuit Meio Amargo 80 g' },
      { id: 'mom51-18', name: 'Bauducco Cookies Chocolate 100 g' },
      { id: 'mom51-19', name: 'Bauducco Cookies Maxi Branco 96 g' },
      { id: 'mom51-20', name: 'Bauducco Biscoito Maizena 170 g' },
      { id: 'mom51-21', name: 'Bauducco Recheadinho Chocolate 104 g' },
      { id: 'mom51-22', name: 'Bauducco Recheadinho Goiaba 112 g' },
      {
        id: 'mom51-23',
        name: 'Bauducco Recheado Duplo Chocolate 108 g',
      },
      { id: 'mom51-24', name: 'Bauducco Recheado Morango 108 g' },
      { id: 'mom51-25', name: 'Bauducco Cream Cracker 165 g' },
      {
        id: 'mom51-26',
        name: 'Bauducco Wafer Chocolate c/ Avelã 140 g',
      },
      { id: 'mom51-27', name: 'Bauducco Triplo Chocolate 140 g' },
      { id: 'mom51-28', name: 'Bauducco Wafer Maxi Chocolate 104 g' },
      { id: 'mom51-29', name: 'PAO DE HAMBURGUER BAUD 200 GR' },
      { id: 'mom51-30', name: 'Bauducco Barrinha Goiaba 30 g' },
      {
        id: 'mom51-31',
        name: 'Bauducco Bolinho Chocolate com Baunilha 40 g',
      },
      { id: 'mom51-32', name: 'Bauducco Bolinho Morango 40 g' },
      { id: 'mom51-33', name: 'Bauducco Pão de Mel Display 30 g' },
    ],
  },
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
    id: 'mix2',
    title: 'MIX SCJ 2',
    products: [
      {
        id: 'mix2-1',
        name: 'Glade Aerossol Promo Oferta Especial 360Ml Lavanda',
      },
      { id: 'mix2-2', name: 'Raid Aero Multi 420Ml Base Água Lev+Pag-' },
    ],
  },
  {
    id: 'mix7',
    title: 'MIX SCJ 7',
    products: [
      { id: 'mix7-1', name: 'GLADE GOTAS 120 ML LAVANDA' },
      { id: 'mix7-2', name: 'Raid Aero Multi 420Ml Eucalipto Lev+Pag-' },
      { id: 'mix7-3', name: 'Lysoform Líquido 1L Original' },
      { id: 'mix7-4', name: 'Pato Pastilha 3 Un 20% Gts Lavanda' },
      {
        id: 'mix7-5',
        name: 'Glade Ped. Sanit. 25G Of. Especial Bouquet De Lavanda',
      },
    ],
  },
  {
    id: 'mix17',
    title: 'MIX SCJ 17',
    products: [
      {
        id: 'mix17-1',
        name: 'Glade Aerossol Promo Oferta Especial 360Ml Frutas E Flores Vibrantes',
      },
      {
        id: 'mix17-2',
        name: 'Glade Aerossol Promo Oferta Especial 360Ml Lembranças De Infância',
      },
      { id: 'mix17-3', name: 'GLADE GOTAS 120 ML T MACIEZ' },
      { id: 'mix17-4', name: 'Raid Liq Elétrico Oferta Especial Ap.' },
      {
        id: 'mix17-5',
        name: 'Raid Liq Elétrico Ref 2 un. Twinpack (45 Noites)',
      },
      {
        id: 'mix17-6',
        name: 'Raid Aero Multi Insetos 420Ml Água Purif. Lev+Pag-',
      },
      { id: 'mix17-7', name: 'OFF! Family Repelente Spray 100Ml' },
      { id: 'mix17-8', name: 'Lysoform Líquido 1L Lavanda' },
      { id: 'mix17-9', name: 'Pato Gel 6 Un Marine Promo Ap Gts' },
      {
        id: 'mix17-10',
        name: 'Pato Germinex Limpador Sanitário 500 Ml Marine',
      },
    ],
  },
  {
    id: 'mix28',
    title: 'MIX SCJ 28',
    products: [
      {
        id: 'mix28-1',
        name: 'Glade Automático RF Oferta Especial 269Ml Lavanda & Vanilla',
      },
      {
        id: 'mix28-2',
        name: 'Glade Contínuos Difusor 100Ml Lembranças De Infancia',
      },
      { id: 'mix28-3', name: 'Glade Contínuos Difusor 100ml Flores Vibrantes' },
      { id: 'mix28-4', name: 'Glade Contínuos Difusor 100Ml Lavanda' },
      { id: 'mix28-5', name: 'GLADE GOTAS 120 ML LEMBR INFANCIA' },
      { id: 'mix28-6', name: 'Raid Liq Elétrico Ref (45 noites)' },
      { id: 'mix28-7', name: 'OFF! Kids 200ml' },
      { id: 'mix28-8', name: 'Pato gel Marine 6 Un 38g Menor Preço' },
      {
        id: 'mix28-9',
        name: 'Mr. Músc. Deseng. Sachet 400Ml Laranja Menor Preço',
      },
      { id: 'mix28-10', name: 'Pato Pastilha 3 Un 20% Gts Citrus' },
      {
        id: 'mix28-11',
        name: 'Pato Ped. Sanit. Of. Especial 25G Marine',
      },
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
      'mom7-1': true,
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

          <Accordion type="multiple" defaultValue={['mom7']} className="space-y-3">
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

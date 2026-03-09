import { useEffect, useRef, useState, useCallback, ChangeEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { X, Zap, Image, VideoOff, Loader2, Keyboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCamera } from '@/hooks/useCamera'
import { cn } from '@/lib/utils'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { toast } from '@/components/ui/use-toast'

const ScannerPage = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const customerId = location.state?.customerId

  const {
    stream,
    permissionStatus,
    toggleFlashlight,
    getCameraPermission,
    isFlashlightOn,
  } = useCamera()

  useEffect(() => {
    if (!customerId) {
      toast({
        title: 'Cliente não selecionado',
        description: 'Por favor, selecione um cliente antes de escanear.',
        variant: 'destructive',
      })
      navigate('/search-customer')
    }
  }, [customerId, navigate])

  useEffect(() => {
    document.title = 'Escanear Código - FerreroScan'
  }, [])

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  const handleBarcodeDetected = useCallback(async (barcode: string) => {
    if (isProcessing) return

    setIsProcessing(true)
    try {
      // Navigate directly — ProductDetails handles "not found" via sales query
      navigate(`/customer/${customerId}/product/${barcode}`)
    } finally {
      setIsProcessing(false)
    }
  }, [isProcessing, customerId, navigate])

  useEffect(() => {
    if (permissionStatus !== 'granted' || !stream || !videoRef.current) return

    if (!('BarcodeDetector' in window)) {
      toast({
        title: 'Navegador incompatível',
        description:
          'A leitura de código de barras não é suportada neste navegador.',
        variant: 'destructive',
      })
      return
    }

    const barcodeDetector = new (window as any).BarcodeDetector({
      formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e'],
    })

    let intervalId: number
    let detectionInProgress = false

    const detectBarcode = async () => {
      if (
        videoRef.current &&
        videoRef.current.readyState === 4 &&
        !detectionInProgress
      ) {
        try {
          const barcodes = await barcodeDetector.detect(videoRef.current)
          if (barcodes.length > 0) {
            detectionInProgress = true
            clearInterval(intervalId)
            handleBarcodeDetected(barcodes[0].rawValue)
          }
        } catch (error) {
          console.error('Barcode detection failed:', error)
        }
      }
    }

    intervalId = window.setInterval(detectBarcode, 500)

    return () => {
      clearInterval(intervalId)
    }
  }, [permissionStatus, stream, handleBarcodeDetected])

  const handleGalleryClick = () => {
    if (isProcessing) return
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsProcessing(true)

    if (!('BarcodeDetector' in window)) {
      toast({
        title: 'Navegador incompatível',
        description:
          'A leitura de código de barras não é suportada neste navegador.',
        variant: 'destructive',
      })
      setIsProcessing(false)
      return
    }

    try {
      const barcodeDetector = new (window as any).BarcodeDetector({
        formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e'],
      })

      const imageBitmap = await createImageBitmap(file)
      const barcodes = await barcodeDetector.detect(imageBitmap)

      if (barcodes.length > 0) {
        handleBarcodeDetected(barcodes[0].rawValue)
      } else {
        toast({
          title: 'Nenhum código encontrado',
          description:
            'Não foi possível encontrar um código de barras na imagem selecionada.',
        })
      }
    } catch (error) {
      console.error('Barcode detection from image failed:', error)
      toast({
        title: 'Erro ao processar imagem',
        description:
          'Ocorreu um erro ao tentar ler o código de barras da imagem.',
        variant: 'destructive',
      })
    } finally {
      setIsProcessing(false)
      if (event.target) {
        event.target.value = ''
      }
    }
  }

  if (permissionStatus === 'pending') {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-foreground">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="mt-4 text-lg">Acessando a câmera...</p>
      </div>
    )
  }

  if (permissionStatus === 'denied') {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background p-4">
        <Alert variant="destructive" className="max-w-md">
          <VideoOff className="h-4 w-4" />
          <AlertTitle>Acesso à câmera negado</AlertTitle>
          <AlertDescription>
            Você precisa permitir o acesso à câmera para escanear códigos de
            barras.
          </AlertDescription>
        </Alert>
        <div className="mt-6 flex gap-4">
          <Button variant="outline" asChild>
            <Link to="/search-customer">Voltar</Link>
          </Button>
          <Button onClick={getCameraPermission}>Tentar Novamente</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-black font-display">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute left-0 top-0 z-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 z-0 bg-black/50" />

      <header className="absolute top-0 z-20 flex w-full items-center justify-between p-4 pt-8 sm:p-6">
        <Button
          asChild
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-full bg-black/20 text-white transition-colors hover:bg-black/40"
        >
          <Link to="/search-customer" aria-label="Fechar scanner">
            <X className="h-7 w-7" />
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'h-12 w-12 rounded-full bg-black/20 text-white transition-colors hover:bg-black/40',
            { 'text-yellow-400': isFlashlightOn },
          )}
          aria-label="Ativar lanterna"
          onClick={toggleFlashlight}
        >
          <Zap className="h-6 w-6" />
        </Button>
      </header>

      <main className="z-10 flex flex-1 flex-col items-center justify-center text-center">
        <h1 className="pb-6 text-2xl font-bold leading-tight tracking-tight text-white">
          Aponte para o código de barras
        </h1>
        <div className="relative aspect-square w-full max-w-[280px]">
          <div className="animate-pulse-border absolute -left-1 -top-1 h-12 w-12 rounded-tl-lg border-l-4 border-t-4 border-white" />
          <div className="animate-pulse-border absolute -right-1 -top-1 h-12 w-12 rounded-tr-lg border-r-4 border-t-4 border-white" />
          <div className="animate-pulse-border absolute -left-1 -bottom-1 h-12 w-12 rounded-bl-lg border-l-4 border-b-4 border-white" />
          <div className="animate-pulse-border absolute -right-1 -bottom-1 h-12 w-12 rounded-br-lg border-r-4 border-b-4 border-white" />
          <div className="absolute inset-0 overflow-hidden">
            <div className="animate-scan-line absolute -top-full h-1 w-full bg-primary shadow-[0_0_10px_2px_hsl(var(--primary))]"></div>
          </div>
        </div>
      </main>

      <footer className="z-10 w-full p-6 pb-12">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          aria-hidden="true"
        />
        <div className="flex items-center justify-around gap-4">
          <div className="flex flex-col items-center gap-2 text-center">
            <Button
              variant="ghost"
              className="h-12 w-12 rounded-full bg-black/40 p-0 text-white transition-colors hover:bg-black/50"
              onClick={handleGalleryClick}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <Image className="h-6 w-6" />
              )}
            </Button>
            <span className="text-sm font-medium text-white">
              Enviar da Galeria
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 text-center">
            <Button
              asChild
              variant="ghost"
              className="h-12 w-12 rounded-full bg-black/40 p-0 text-white transition-colors hover:bg-black/50"
              disabled={isProcessing}
            >
              <Link to="/manual-entry" state={{ customerId }}>
                <Keyboard className="h-6 w-6" />
              </Link>
            </Button>
            <span className="text-sm font-medium text-white">
              Digitar código
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default ScannerPage

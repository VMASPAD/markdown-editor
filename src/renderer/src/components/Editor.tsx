import React, { useState, useEffect, useRef } from 'react'
import '../assets/index.css'
import { Textarea } from './ui/textarea/Textarea'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import 'katex/dist/katex.min.css'
import Island from './ui/island/Island'
import { ImportIcon, SaveAll } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@renderer/components/ui/sheet/Sheet'
import { Button } from './ui/button/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@renderer/components/ui/drawner/Drawner'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@renderer/components/ui/carousel/Carousel'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@renderer/components/ui/dialog/Dialog'
import { Input } from './ui/input/Input'
import mermaid from 'mermaid'


interface Component {
  name: string
  description: string
}

interface ArchivesMd {
  name: string
  content: string
}
function Editor() {
  const [md, setMd] = useState('')
  const [componentName, setComponentName] = useState('')
  const [componentDescription, setComponentDescription] = useState('')
  const [archivesmd, setArchivesmd] = useState<ArchivesMd[]>([])
  const [components, setComponents] = useState<Component[]>([])
  const markdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const savedMd = localStorage.getItem('md') || ''
    setMd(savedMd)
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose'
    })
    // Load components from localStorage
    const savedComponents = JSON.parse(localStorage.getItem('components') || '[]')
    setComponents(savedComponents)
    if (markdownRef.current) {
      mermaid.init(undefined, markdownRef.current.querySelectorAll('.language-mermaid'))
    }
  }, [md])

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMd = event.target.value
    setMd(newMd)
    localStorage.setItem('md', newMd)
  }

  const saveToFile = () => {
    const blob = new Blob([md], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'file.md'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const saveComponent = () => {
    const newComponent = {
      name: componentName,
      description: componentDescription
    }

    // Retrieve existing components from localStorage
    const storedComponents = JSON.parse(localStorage.getItem('components') || '[]')

    // Add the new component to the array
    storedComponents.push(newComponent)

    // Save updated array back to localStorage
    localStorage.setItem('components', JSON.stringify(storedComponents))

    // Update state
    setComponents(storedComponents)

    // Clear input fields
    setComponentName('')
    setComponentDescription('')
  }

  const insertComponentIntoTextarea = (component) => {
    setMd((prevMd) => `${prevMd}\n\n${component.description}`)
    localStorage.setItem('md', `${md}\n\n${component.description}`)
  }
  const insertExteralMd = (component) => {
    setMd((prevMd) => `${prevMd}\n\n${component}`)
    localStorage.setItem('md', `${md}\n\n${component}`)
  }
  const editComponent = (index, updatedComponent) => {
    const updatedComponents = [...components]
    updatedComponents[index] = updatedComponent
    setComponents(updatedComponents)
    localStorage.setItem('components', JSON.stringify(updatedComponents))
  }
  const getTextCss = () => {
    const textId = document.getElementById('textId') as HTMLTextAreaElement
    const css = textId.value

    // Recupera el CSS guardado en localStorage, si no hay, devuelve una cadena vacía
    const storedCss = localStorage.getItem('css') || ''

    // Intenta obtener el elemento <style> del documento
    let style = document.getElementById('dynamic-style') as HTMLStyleElement

    // Si el elemento <style> no existe, créalo y añádelo al <head>
    if (!style) {
      style = document.createElement('style')
      style.id = 'dynamic-style'
      style.type = 'text/css'
      document.head.appendChild(style)
    }

    // Si se ha introducido nuevo CSS en el textarea, úsalo. Si no, usa el guardado en localStorage.
    style.innerHTML = css || storedCss

    // Si hay nuevo CSS, guárdalo en localStorage
    if (css) {
      localStorage.setItem('css', css)
    }
  }
  const importArchiveMd = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.md'
    input.onchange = (event) => {
      const target = event.target as HTMLInputElement
      const file = target.files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const content = e.target?.result as string
          setMd(content)
          localStorage.setItem('md', content)
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }
  interface CustomMermaidProps {
    value: string
  }

  const CustomMermaid: React.FC<CustomMermaidProps> = ({ value }) => {
    const elementRef = useRef<HTMLDivElement>(null)
    const [svg, setSvg] = useState('')

    useEffect(() => {
      const renderDiagram = async () => {
        if (elementRef.current) {
          try {
            const { svg } = await mermaid.render('mermaid-diagram', value)
            setSvg(svg)
          } catch (error) {
            console.error('Failed to render mermaid diagram:', error)
            setSvg('')
          }
        }
      }

      renderDiagram()
    }, [value])

    return <div ref={elementRef} dangerouslySetInnerHTML={{ __html: svg }} />
  }

  const handleGetArchivesMd = async () => {
    const archives = await window.electron.ipcRenderer.invoke('getArchivesMd')
    setArchivesmd(archives)
    console.log(archives)
  }
  return (
    <>
      <Island size={'lg'} position={'top'} distance={1} className="gap-5">
        <Drawer>
          <DrawerTrigger onClick={handleGetArchivesMd}>Archives</DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Your Archives</DrawerTitle>
              <DrawerDescription className="flex flex-row items-center justify-center">
                <Carousel
                  opts={{
                    align: 'start'
                  }}
                  className="w-full max-w-sm"
                >
                  <CarouselContent>
                    {archivesmd.map((component, index) => (
                      <CarouselItem key={index} className="">
                        <div className="p-1 flex flex-col justify-center items-center gap-3">
                          <span className="text-xl font-semibold">{component.name}</span>
                          <div className="flex gap-2 mt-2">
                            <Button onClick={() => insertExteralMd(component.content)}>
                              Insert
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger>View</AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>{component.name}</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    <Textarea
                                      value={component.content}
                                      placeholder="Component code"
                                    />
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Exit</AlertDialogCancel>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <DrawerClose>
                <Button variant="outline">Exit</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
        <Sheet>
          <SheetTrigger>CSS</SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>CSS styles in hsl</SheetTitle>
              <SheetDescription>
                <Textarea placeholder="CSS styles" id="textId" />
                <br />
                <Button onClick={getTextCss}>Apply</Button>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
        <Drawer>
          <DrawerTrigger>Components</DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Yours Components</DrawerTitle>
              <DrawerDescription className="flex flex-row items-center justify-center">
                <Carousel
                  opts={{
                    align: 'start'
                  }}
                  className="w-full max-w-sm"
                >
                  <CarouselContent>
                    {components.map((component, index) => (
                      <CarouselItem key={index} className="">
                        <div className="p-1 flex flex-col justify-center items-center gap-3">
                          <span className="text-xl font-semibold">{component.name}</span>
                          <div className="flex gap-2 mt-2">
                            <Button onClick={() => insertComponentIntoTextarea(component)}>
                              Insert
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger>Edit</AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Edit component</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    <Input
                                      value={component.name}
                                      onChange={(e) => {
                                        const updatedComponent = {
                                          ...component,
                                          name: e.target.value
                                        }
                                        editComponent(index, updatedComponent)
                                      }}
                                      placeholder="Name component"
                                    />
                                    <br />
                                    <Textarea
                                      value={component.description}
                                      onChange={(e) => {
                                        const updatedComponent = {
                                          ...component,
                                          description: e.target.value
                                        }
                                        editComponent(index, updatedComponent)
                                      }}
                                      placeholder="Component code"
                                    />
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction>Save</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <AlertDialog>
                <AlertDialogTrigger>Create Component</AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Create your component</AlertDialogTitle>
                    <AlertDialogDescription>
                      <Input
                        value={componentName}
                        onChange={(e) => setComponentName(e.target.value)}
                        placeholder="Name component"
                      />
                      <br />
                      <Textarea
                        value={componentDescription}
                        onChange={(e) => setComponentDescription(e.target.value)}
                        placeholder="Component description"
                      />
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={saveComponent}>Save</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <DrawerClose>
                <Button variant="outline">Exit</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
        <ImportIcon onClick={importArchiveMd} />
        <SaveAll onClick={saveToFile} />
      </Island>
      <div className="grid grid-cols-2 h-screen m-3 gap-5">
        <Textarea value={md} onChange={handleChange} placeholder="Any code HTML or MarkDown" />
        <div className="rounded-lg border-[1px] border-primary p-10" ref={markdownRef}>
          <Markdown
            className="w-full"
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex, rehypeRaw]}
            components={{
              code({
                inline,
                className,
                children,
                ...props
              }: {
                inline?: boolean
                className?: string
                children?: React.ReactNode
              }) {
                const match = /language-(\w+)/.exec(className || '')
                if (!inline && match && match[1] === 'mermaid') {
                  return <CustomMermaid value={String(children).replace(/\n$/, '')} />
                }
                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              }
            }}
          >
            {md}
          </Markdown>
        </div>
      </div>
    </>
  )
}

export default Editor

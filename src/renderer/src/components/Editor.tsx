import React, { useState, useEffect, useRef } from 'react'
import '../assets/index.css'
import { Textarea } from './ui/textarea/Textarea'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw' // Importa el plugin para procesar HTML
import 'katex/dist/katex.min.css' // Importa los estilos de KaTeX
import Island from './ui/island/Island'
import { SaveAll } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@renderer/components/ui/sheet/Sheet'
import { Button } from './ui/button/button'
import html2pdf from 'html2pdf.js'

function Editor() {
  const [md, setMd] = useState('')
  const markdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const savedMd = localStorage.getItem('md') || ''
    setMd(savedMd)
  }, [])

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMd = event.target.value
    setMd(newMd)
    localStorage.setItem('md', newMd)
  }

  const saveToFile = () => {
    const blob = new Blob([md], { type: 'text/markdown' }) // Crea el archivo .md
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'file.md' // Nombre del archivo
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url) // Limpia el objeto URL
  }

  const getTextCss = () => {
    const textId = document.getElementById('textId') as HTMLTextAreaElement
    const css = textId.value
    let style = document.getElementById('dynamic-style') as HTMLStyleElement

    if (!style) {
      style = document.createElement('style')
      style.id = 'dynamic-style'
      style.type = 'text/css'
      document.head.appendChild(style)
    }

    style.innerHTML = css
  }

  return (
    <>
      <Island size={'lg'} position={'top'} distance={1} className='gap-5'>
        <SaveAll onClick={saveToFile} />
        <Sheet>
          <SheetTrigger>CSS</SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>CSS styles in hsl</SheetTitle>
              <SheetDescription>
                <Textarea placeholder='CSS or Tailwind styles' id="textId"/>
                <br />
                <Button onClick={getTextCss}>Apply</Button>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </Island>
      <div className="grid grid-cols-2 h-screen m-3 gap-5">
        <Textarea value={md} onChange={handleChange} placeholder='Any code HTML or MarkDown'/>
        <div className="rounded-lg border-[1px] border-primary p-10" ref={markdownRef}>
          <Markdown
            className="w-full"
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex, rehypeRaw]} // Añade el renderizador de KaTeX y HTML
          >
            {md}
          </Markdown>
        </div>
      </div>
    </>
  )
}

export default Editor

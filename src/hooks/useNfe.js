import { useState, useCallback } from 'react'
import { parseXml, extractItems, parseItemNumbers } from '../utils/nfe.js'

export function useNfe() {
  const [fileName, setFileName]   = useState(null)
  const [xmlDoc, setXmlDoc]       = useState(null)
  const [rows, setRows]           = useState([])
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)
  const [info, setInfo]           = useState(null)

  const loadFile = useCallback((file) => {
    if (!file) return
    setError(null)
    setInfo(null)
    setRows([])
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const doc = parseXml(e.target.result)
        setXmlDoc(doc)
        setFileName(file.name)
        setInfo(`Arquivo carregado: ${file.name}`)
      } catch (err) {
        setError(err.message)
        setXmlDoc(null)
        setFileName(null)
      }
    }
    reader.readAsText(file, 'UTF-8')
  }, [])

  const extract = useCallback((itemsStr) => {
    if (!xmlDoc) { setError('Carregue um arquivo XML primeiro.'); return }
    setError(null)
    setInfo(null)
    setLoading(true)
    try {
      const itemNums = parseItemNumbers(itemsStr)
      const result = extractItems(xmlDoc, itemNums)
      setRows(result)
      if (result.length === 0) setInfo('Nenhum item encontrado para os números informados.')
      else setInfo(`${result.length} item(s) extraído(s) com sucesso.`)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [xmlDoc])

  return { fileName, rows, loading, error, info, loadFile, extract }
}

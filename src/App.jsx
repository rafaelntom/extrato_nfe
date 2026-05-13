import { useState } from 'react'
import { FileDown, Search, AlertCircle, Info, FileText } from 'lucide-react'
import { DropZone } from './components/DropZone.jsx'
import { ResultTable } from './components/ResultTable.jsx'
import { useNfe } from './hooks/useNfe.js'
import { exportXLS } from './utils/export.js'
import styles from './App.module.css'

export default function App() {
  const [itemsInput, setItemsInput] = useState('')
  const { fileName, rows, loading, error, info, loadFile, extract } = useNfe()

  const handleExtract = () => extract(itemsInput)

  const handleKey = (e) => {
    if (e.key === 'Enter') handleExtract()
  }

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <FileText size={20} />
          <span>Extrator NF-e</span>
        </div>

        <nav className={styles.nav}>
          <span className={styles.navLabel}>Configuração</span>

          <div className={styles.field}>
            <label className={styles.label}>Arquivo XML</label>
            <DropZone fileName={fileName} onFile={loadFile} />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Itens (nItem)</label>
            <input
              className={styles.input}
              type="text"
              placeholder="Ex: 1, 2, 3, 4, 5"
              value={itemsInput}
              onChange={e => setItemsInput(e.target.value)}
              onKeyDown={handleKey}
            />
            <p className={styles.hint}>
              Separados por vírgula.<br />Deixe em branco para todos os itens.
            </p>
          </div>

          <button
            className={styles.btnExtract}
            onClick={handleExtract}
            disabled={loading || !fileName}
          >
            <Search size={15} />
            {loading ? 'Extraindo...' : 'Extrair dados'}
          </button>

          {rows.length > 0 && (
            <button
              className={styles.btnExport}
              onClick={() => exportXLS(rows)}
            >
              <FileDown size={15} />
              Exportar Excel (.xls)
            </button>
          )}
        </nav>

        <div className={styles.sidebarFooter}>
          <p>Padrão SEFAZ NF-e</p>
        </div>
      </aside>

      {/* Main content */}
      <main className={styles.main}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Extração de Itens</h1>
            <p className={styles.subtitle}>
              {rows.length > 0
                ? `${rows.length} item(s) encontrado(s)`
                : 'Carregue um XML e informe os itens para extrair'}
            </p>
          </div>

          {rows.length > 0 && (
            <div className={styles.badge}>
              {rows.length} {rows.length === 1 ? 'item' : 'itens'}
            </div>
          )}
        </header>

        {/* Messages */}
        {error && (
          <div className={`${styles.msg} ${styles.msgError}`}>
            <AlertCircle size={15} />
            {error}
          </div>
        )}
        {info && !error && (
          <div className={`${styles.msg} ${styles.msgInfo}`}>
            <Info size={15} />
            {info}
          </div>
        )}

        {/* Table */}
        {rows.length > 0 ? (
          <ResultTable rows={rows} />
        ) : (
          <div className={styles.empty}>
            <FileText size={48} className={styles.emptyIcon} />
            <p className={styles.emptyTitle}>Nenhum dado extraído</p>
            <p className={styles.emptyText}>
              Carregue um arquivo XML NF-e no painel lateral,<br />
              informe os números dos itens desejados e clique em <strong>Extrair dados</strong>.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

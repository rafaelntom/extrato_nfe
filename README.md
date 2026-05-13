# Extrator NF-e

Ferramenta local para extração de dados de arquivos XML NF-e (padrão SEFAZ), com exportação para Excel.

## Requisitos

- [Node.js](https://nodejs.org/) versão 18 ou superior

## Como rodar

```bash
# 1. Instale as dependências
npm install

# 2. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse **http://localhost:5173** no navegador.

## Como usar

1. Arraste ou selecione o arquivo `.xml` da NF-e
2. Digite os números dos itens desejados (ex: `1, 2, 3`) — ou deixe em branco para todos
3. Clique em **Extrair dados**
4. Clique em **Exportar Excel** para baixar o `.xls`

## Colunas extraídas

### ICMS Próprio
| Coluna | Descrição |
|---|---|
| Data Emissão | Data de emissão da NF |
| Nº NF | Número da nota fiscal |
| Série | Série da NF |
| Modelo | Modelo do documento |
| Chave Acesso | Chave de acesso (44 dígitos) |
| CNPJ Fornecedor | CNPJ do emitente |
| Item | Número do item (nItem) |
| Cód. Produto | Código do produto (cProd) |
| Cód. Interno | **Em branco** — para preenchimento manual |
| Qtde | Quantidade comercializada |
| Valor Unit. | Valor unitário em R$ |
| B.C ICMS Próprio | Base de cálculo do ICMS |
| Alíq. ICMS | Alíquota do ICMS em % |

### ICMS ST
| Coluna | Descrição |
|---|---|
| IVA/MVA (%) | Margem de valor agregado |
| B.C ICMS ST | Base de cálculo do ICMS ST |
| Alíq. ICMS ST | Alíquota do ICMS ST em % |

## Build para produção

```bash
npm run build
```

Os arquivos gerados ficam na pasta `dist/`.

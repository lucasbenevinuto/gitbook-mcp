# looqbox-gitbook-mcp

MCP Server para automação completa do GitBook via API. Expõe **39 tools** que permitem a agentes AI (Claude Code, Cursor, etc.) gerenciar documentação, change requests, reviews e Git Sync programaticamente.

## Quickstart

```bash
# 1. Clonar
git clone git@github.com:looqbox/looqbox-gitbook-mcp.git
cd looqbox-gitbook-mcp

# 2. Instalar e compilar
npm install
npm run build

# 3. Configurar
cp .env.example .env
# Edite o .env com seu token (veja seção "Configuração" abaixo)

# 4. Testar
npm start
```

## Configuração

### Variáveis de ambiente

| Variável | Obrigatória | Descrição |
|---|---|---|
| `GITBOOK_API_TOKEN` | Sim | Token de API do GitBook |
| `GITBOOK_DEFAULT_ORG_ID` | Nao | ID da organização padrão |
| `GITBOOK_DEFAULT_SPACE_ID` | Nao | ID do space padrão |
| `GITBOOK_API_BASE_URL` | Nao | URL base da API (default: `https://api.gitbook.com/v1`) |

### Obter o token

1. Acesse [GitBook Developer Settings](https://app.gitbook.com/account/developer)
2. Crie um novo API Token
3. Copie o token para o `.env`

### `.env` de exemplo

```env
GITBOOK_API_TOKEN=gb_api_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GITBOOK_DEFAULT_SPACE_ID=
GITBOOK_DEFAULT_ORG_ID=Gwx2pZrgcM1dfV4JuNw5
```

## Integração com AI Agents

### Claude Code

Adicione ao `.mcp.json` na raiz do seu projeto:

```json
{
  "mcpServers": {
    "looqbox-gitbook": {
      "command": "node",
      "args": ["/home/SEU_USUARIO/looqbox-gitbook-mcp/dist/index.js"],
      "env": {
        "GITBOOK_API_TOKEN": "${GITBOOK_API_TOKEN}",
        "GITBOOK_DEFAULT_ORG_ID": "Gwx2pZrgcM1dfV4JuNw5"
      }
    }
  }
}
```

O Claude Code resolve `${GITBOOK_API_TOKEN}` a partir das variáveis de ambiente do shell. Adicione ao seu `~/.bashrc` ou `~/.zshrc`:

```bash
export GITBOOK_API_TOKEN="seu-token-aqui"
```

### Cursor

Adicione ao `~/.cursor/mcp.json` (global) ou `.cursor/mcp.json` (projeto):

```json
{
  "mcpServers": {
    "looqbox-gitbook": {
      "command": "node",
      "args": ["/home/SEU_USUARIO/looqbox-gitbook-mcp/dist/index.js"],
      "env": {
        "GITBOOK_API_TOKEN": "seu-token-aqui",
        "GITBOOK_DEFAULT_ORG_ID": "Gwx2pZrgcM1dfV4JuNw5"
      }
    }
  }
}
```

> No Cursor, `${VAR}` nao funciona. Coloque o token diretamente no JSON.

### Outros clientes MCP

Qualquer cliente compativel com MCP via **stdio transport** funciona. O servidor le stdin/stdout seguindo o protocolo MCP.

## Tools

### Spaces (6)

| Tool | Descricao |
|---|---|
| `get_space` | Detalhes de um space |
| `update_space` | Atualizar titulo, visibilidade |
| `create_space` | Criar novo space em uma org |
| `duplicate_space` | Duplicar um space existente |
| `list_spaces` | Listar spaces de uma org |
| `search_space_content` | Buscar conteudo dentro de um space |

### Pages (8)

| Tool | Descricao |
|---|---|
| `get_space_revision` | Arvore completa de paginas de um space |
| `list_pages` | Listar paginas (com paginacao) |
| `get_page_by_id` | Ler pagina por ID |
| `get_page_by_path` | Ler pagina por URL path (ex: `getting-started/install`) |
| `get_page_links` | Links de saida de uma pagina |
| `get_page_backlinks` | Paginas que linkam para uma pagina (backlinks) |
| `list_files` | Listar arquivos (imagens, anexos) |
| `get_file` | Detalhes e URL de download de um arquivo |

### Change Requests (6)

| Tool | Descricao |
|---|---|
| `create_change_request` | Criar novo CR (similar a PR/draft) |
| `list_change_requests` | Listar CRs de um space |
| `get_change_request` | Detalhes de um CR |
| `update_change_request` | Atualizar titulo/status de um CR |
| `merge_change_request` | Mergear CR no conteudo principal |
| `sync_change_request` | Sincronizar CR com conteudo mais recente |

### Reviews (5)

| Tool | Descricao |
|---|---|
| `list_reviews` | Listar reviews de um CR |
| `submit_review` | Aprovar, solicitar mudancas ou comentar |
| `list_requested_reviewers` | Listar reviewers solicitados |
| `request_reviewers` | Solicitar review de usuarios especificos |
| `remove_reviewer` | Remover reviewer de um CR |

### Comments (6)

| Tool | Descricao |
|---|---|
| `list_comments` | Listar comentarios (space ou CR) |
| `post_comment` | Postar comentario (suporta markdown) |
| `update_comment` | Editar comentario existente |
| `delete_comment` | Deletar comentario |
| `list_comment_replies` | Listar respostas a um comentario |
| `post_comment_reply` | Responder a um comentario |

### Git Sync (3)

| Tool | Descricao |
|---|---|
| `git_import` | Importar conteudo de um repo Git para um space |
| `git_export` | Exportar conteudo de um space para um repo Git |
| `get_git_info` | Status e configuracao do Git Sync |

### Organizations (4)

| Tool | Descricao |
|---|---|
| `get_organization` | Detalhes da organizacao |
| `list_collections` | Listar collections de uma org |
| `get_collection` | Detalhes de uma collection |
| `ask_ai` | Perguntar ao AI do GitBook sobre a documentacao |

### Content Import (1)

| Tool | Descricao |
|---|---|
| `import_content` | Importar conteudo de uma URL para a org |

## Arquitetura

```
src/
├── index.ts                 # Entrypoint — stdio transport
├── server.ts                # Criacao do McpServer
├── config.ts                # Carregamento de env vars
├── client/
│   ├── gitbook-client.ts    # HTTP client para GitBook API v1
│   └── types.ts             # Tipos das respostas da API
├── tools/
│   ├── index.ts             # Registro de todas as 39 tools
│   ├── spaces.ts            # 6 tools
│   ├── pages.ts             # 8 tools
│   ├── change-requests.ts   # 6 tools
│   ├── reviews.ts           # 5 tools
│   ├── comments.ts          # 6 tools
│   ├── git-sync.ts          # 3 tools
│   ├── organizations.ts     # 4 tools
│   └── content-import.ts    # 1 tool
├── schemas/
│   └── index.ts             # Schemas Zod reutilizaveis
└── utils/
    ├── errors.ts            # Tratamento de erros da API
    └── pagination.ts        # Helpers de paginacao
```

## Scripts

| Comando | Descricao |
|---|---|
| `npm run build` | Compila TypeScript para `dist/` |
| `npm start` | Inicia o servidor MCP via stdio |
| `npm run dev` | Compila em watch mode (desenvolvimento) |
| `npm run inspect` | Abre o MCP Inspector para debug |

## Requisitos

- Node.js >= 18.0.0
- npm

## Dependencias

| Pacote | Versao | Uso |
|---|---|---|
| `@modelcontextprotocol/sdk` | ^1.12.0 | SDK oficial do MCP |
| `zod` | ^3.24.0 | Validacao de schemas |
| `typescript` | ^5.7.0 | (dev) Compilacao |

## Debug

### MCP Inspector

```bash
npm run inspect
```

Abre uma interface web para testar as tools interativamente.

### Logs de erro

O servidor envia erros formatados de volta ao cliente MCP. Erros da API do GitBook incluem:
- Status code HTTP
- Endpoint que falhou
- Mensagem de erro do GitBook

### Problemas comuns

| Problema | Solucao |
|---|---|
| `GITBOOK_API_TOKEN is required` | Defina a variavel de ambiente ou crie o `.env` |
| `GitBook API error 401` | Token invalido ou expirado — gere um novo |
| `GitBook API error 403` | Token sem permissao para o recurso |
| `GitBook API error 404` | Space/page/org ID incorreto |
| `Cannot find module dist/index.js` | Execute `npm run build` primeiro |

## Atualizacao

```bash
cd ~/looqbox-gitbook-mcp
git pull
npm install
npm run build
```

## Licenca

Uso interno Looqbox.

# API Marcas de Tênis

> Aplicação da **AP2** desenvolvida em ASP.NET Core (.NET 10) com persistência em banco de dados **SQLite** (Entity Framework Core) e **interface web** responsiva integrada para cadastro e gerenciamento de tênis.

---

## 📹 Vídeo de Demonstração (AP2)

- **Link público do vídeo:** `[Cole aqui o link público do seu vídeo no YouTube / Loom / Google Drive]`

---

## Sobre o projeto

Este projeto foi desenvolvido como entrega da **AP2**, consistindo em uma solução completa que integra:
- **API RESTful em ASP.NET Core (.NET 10):** Minimal API com endpoints assíncronos para listagem, busca, criação, edição e exclusão de tênis.
- **Banco de Dados SQLite com Entity Framework Core:** persistência local com esquema criado via migrations versionadas e auto-migração na inicialização.
- **Interface Web Integrada (`wwwroot`):** tela interativa e responsiva desenvolvida em HTML5, CSS3 e JavaScript puro (Vanilla via `fetch()`), servida pela mesma origem da API para dispensar configurações extras de CORS.

---

## Tecnologias utilizadas

- C# / .NET 10
- ASP.NET Core (Minimal API)
- Entity Framework Core 10 com provedor SQLite
- Migrations do EF Core para versionamento do banco de dados
- HTML5, CSS3 (com acessibilidade `:focus-visible`) e JavaScript Vanilla (Fetch API)

---

## Estrutura do Projeto

- `Models/Tenis.cs`: Entidade `Tenis` e DTOs (`TenisDto`, `TenisInputDto`).
- `Data/TenisDbContext.cs`: Contexto do Entity Framework Core e mapeamento da tabela.
- `Migrations/`: Arquivos de migração versionados para o banco SQLite.
- `Program.cs`: Configuração de serviços, injeção de dependência, auto-migração, arquivos estáticos e endpoints da API.
- `wwwroot/`: Interface web (`index.html`, `style.css`, `app.js`).
- `bruno/`: Coleção de requisições prontas para testes no cliente HTTP Bruno.

---

## Como preparar e executar o projeto

### Pré-requisitos

- [.NET 10 SDK](https://dotnet.microsoft.com/) instalado no computador.
- (Opcional) Ferramenta `dotnet-ef` instalada globalmente:
  ```bash
  dotnet tool install --global dotnet-ef
  ```

### 1. Restaurar dependências

No terminal, na pasta raiz do projeto (`ApiMarcasTenis`), execute:

```bash
dotnet restore
```

### 2. Criar ou atualizar o banco de dados (Migrations)

Execute o comando a seguir para aplicar as migrações e criar o arquivo de banco de dados SQLite (`tenis.db`):

```bash
dotnet ef database update
```

> **Nota:** A aplicação também possui auto-migração em `Program.cs`. Ao executar `dotnet run`, o banco e os registros iniciais são criados automaticamente se ainda não existirem.

### 3. Executar a aplicação

Inicie o servidor informando a URL:

```bash
dotnet run --urls http://localhost:5050
```

### 4. Acessar a aplicação no Navegador

Com a aplicação em execução, acesse:

👉 **[http://localhost:5050/](http://localhost:5050/)**

Pela **interface web**, é possível:
- **Listar:** Visualizar todos os tênis cadastrados no banco de dados SQLite.
- **Filtrar:** Pesquisar em tempo real por nome ou marca.
- **Visualizar:** Exibir detalhes completos em modal com foco acessível.
- **Cadastrar:** Adicionar novos tênis através de formulário com validação.
- **Editar:** Modificar dados de modelos já cadastrados.
- **Excluir:** Remover itens do banco de dados com diálogo de confirmação.

---

## Rotas da API RESTful

| Método | Endpoint | Descrição | Status de Sucesso | Status de Erro |
|---|---|---|---|---|
| `GET` | `/` | Serve a interface web (`index.html`) | 200 OK | - |
| `GET` | `/api/tenis` | Lista todos os tênis cadastrados | 200 OK | - |
| `GET` | `/api/tenis/{id}` | Busca um tênis pelo ID | 200 OK | 404 Not Found |
| `POST` | `/api/tenis` | Cadastra um novo tênis | 201 Created | 400 Bad Request |
| `PUT` | `/api/tenis/{id}` | Atualiza um tênis existente pelo ID | 200 OK | 404 Not Found |
| `DELETE` | `/api/tenis/{id}` | Exclui um tênis pelo ID | 204 No Content | 404 Not Found |

### Exemplo de JSON (POST / PUT)

```json
{
  "nome": "Nike Air Max 90",
  "marca": "Nike",
  "preco": 599.90
}
```

---

## Testando com a Collection do Bruno

Abra a pasta `bruno/` no aplicativo [Bruno](https://www.usebruno.com/) e utilize o ambiente `Local`:

1. `00 - Raiz`: Testa o acesso à interface web na raiz (`GET http://localhost:5050/`).
2. `01 - Listar Tenis`: Retorna a lista de tênis (`GET /api/tenis`).
3. `02 - Buscar Tenis`: Busca um tênis pelo ID (`GET /api/tenis/1`).
4. `03 - Criar Tenis`: Cadastra um tênis (`POST /api/tenis`).
5. `04 - Atualizar Tenis`: Atualiza um tênis (`PUT /api/tenis/1`).
6. `05 - Excluir Tenis`: Remove um tênis (`DELETE /api/tenis/1`).
7. `06 - Buscar Excluido`: Valida o retorno de `404 Not Found` (`GET /api/tenis/1`).

# API Marcas de Tênis — AP2

## Sobre o projeto

Este projeto é uma aplicação completa para cadastro e gerenciamento de marcas e modelos de tênis (AP2 da faculdade).
A aplicação combina uma **API RESTful em ASP.NET Core** com persistência em banco de dados **SQLite via Entity Framework Core**, e uma **interface web (SPA)** responsiva desenvolvida em HTML, CSS e JavaScript puro (Vanilla), servida pela mesma origem da API através da pasta `wwwroot/`.

---

## 📹 Vídeo de Demonstração (AP2)

- **Link público do vídeo:** `[Cole aqui o link público do seu vídeo no YouTube / Loom / Google Drive]`

---

## Tecnologias utilizadas

- C# / .NET 10
- ASP.NET Core (Minimal API)
- Entity Framework Core 10 (com provedor SQLite)
- Migrations versionadas para criação e atualização do esquema
- HTML5 semântico, CSS3 responsivo e JavaScript Vanilla (Fetch API)

## Estrutura do Projeto

- `Models/Tenis.cs`: Modelo de dados da entidade `Tenis` e DTOs (`TenisDto`, `TenisInputDto`).
- `Data/TenisDbContext.cs`: Contexto de banco de dados do Entity Framework Core.
- `Migrations/`: Migrações versionadas para geração do esquema do banco de dados SQLite.
- `Program.cs`: Configuração de serviços, auto-migração, middlewares de arquivos estáticos e rotas da API.
- `wwwroot/`: Interface web integrada (`index.html`, `style.css`, `app.js`).
- `bruno/`: Coleção de requisições HTTP para testes no cliente Bruno.

---

## Como preparar e executar o projeto

### Pré-requisitos

- Ter o [.NET 10 SDK](https://dotnet.microsoft.com/) instalado no computador.
- (Opcional) Ferramenta `dotnet-ef` caso deseje gerar novas migrações manualmente:
  ```bash
  dotnet tool install --global dotnet-ef
  ```

### 1. Restaurar dependências

Abra o terminal na pasta raiz do projeto (`ApiMarcasTenis`) e execute:

```bash
dotnet restore
```

### 2. Criar e atualizar o banco de dados (Migrations)

Execute o comando a seguir para aplicar as migrações e gerar o arquivo de banco de dados SQLite (`tenis.db`):

```bash
dotnet ef database update
```

> **Nota:** A aplicação também possui auto-migração configurada em `Program.cs`. Caso execute diretamente `dotnet run`, o banco e os dados iniciais serão verificados automaticamente.

### 3. Executar a aplicação

Inicie o servidor informando a URL da aplicação:

```bash
dotnet run --urls http://localhost:5050
```

### 4. Acessar a aplicação no Navegador

Após iniciar o servidor, abra no seu navegador:

👉 **[http://localhost:5050/](http://localhost:5050/)**

A interface web permite:
- **Listar:** Exibe os tênis cadastrados no banco de dados SQLite.
- **Filtrar:** Pesquisa em tempo real por nome ou marca.
- **Visualizar:** Exibe os detalhes completos de um tênis em modal acessível.
- **Cadastrar:** Adiciona novos tênis com validação de campos obrigatórios.
- **Editar:** Atualiza os dados de um tênis já cadastrado.
- **Excluir:** Remove um tênis do banco com confirmação prévia.

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

### Exemplo de Corpo de Requisição (POST / PUT)

```json
{
  "nome": "Nike Air Max 90",
  "marca": "Nike",
  "preco": 599.90
}
```

---

## Testando com a Collection do Bruno

Abra a pasta `bruno/` no aplicativo [Bruno](https://www.usebruno.com/) para executar a coleção de testes com o ambiente `Local` selecionado:

1. `00 - Raiz`: Testa o carregamento da raiz da aplicação (`http://localhost:5050/`).
2. `01 - Listar Tenis`: Retorna a lista de tênis (`GET /api/tenis`).
3. `02 - Buscar Tenis`: Busca o primeiro tênis (`GET /api/tenis/1`).
4. `03 - Criar Tenis`: Cadastra um tênis (`POST /api/tenis`).
5. `04 - Atualizar Tenis`: Atualiza os dados de um tênis (`PUT /api/tenis/1`).
6. `05 - Excluir Tenis`: Remove um tênis (`DELETE /api/tenis/1`).
7. `06 - Buscar Excluido`: Verifica o retorno 404 para o item removido (`GET /api/tenis/1`).

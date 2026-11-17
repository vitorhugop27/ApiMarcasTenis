# Aula 14 — Tratamento de Erros

## 1. Posição do middleware

O middleware `UseExceptionHandler` foi colocado no arquivo `Program.cs`, logo após `builder.Build()` e antes do mapeamento das rotas da API.

Ele é responsável por capturar erros inesperados que acontecem durante a execução da aplicação e retornar uma resposta padronizada ao cliente.

## 2. Teste controlado de erro

Foi realizado um teste controlado para verificar o funcionamento do tratamento de exceções.

**Resultado esperado:** a API retorna o status HTTP 500 (Internal Server Error), com uma mensagem JSON:

`Ocorreu um erro interno. Tente novamente mais tarde.`

O teste confirmou que o middleware trata o erro sem expor detalhes internos da aplicação.

## 3. Teste de ID inexistente

Foi realizada uma consulta utilizando um ID que não existe na tabela de tênis.

**Resultado:** a API retorna o status HTTP 404 (Not Found), indicando que o registro não foi encontrado.

Esse comportamento foi mantido normalmente, sem ser confundido com um erro interno do servidor.

## 4. Por que não enviar a exceção bruta ao cliente?

Não devemos enviar a exceção bruta porque ela pode revelar informações internas da aplicação, como caminhos de arquivos, detalhes do banco de dados e informações que podem comprometer a segurança do sistema.

Por isso, a API retorna uma mensagem genérica ao cliente, mantendo os detalhes técnicos restritos ao ambiente de desenvolvimento.

## 5. Conclusão

O tratamento centralizado de exceções foi implementado e testado. A API mantém suas operações de CRUD e diferencia erros internos de registros não encontrados.

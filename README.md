
# Exercícios Express.js com Rotas POST e TypeScript

Repositório contendo três projetos independentes desenvolvidos em **Node.js**, **Express.js** e **TypeScript**, organizados em uma estrutura unificada para praticar o ciclo de requisição e resposta HTTP (`Request`/`Response`), extração de dados via `req.body`, validação de tipos, leitura de arquivos JSON e tratamento padronizado de status HTTP (`200`, `400`, `401` e `500`).

---

## 📁 Estrutura do Repositório

```text
exercicios-express-post/
├── projeto-1-mensagem/
│   └── src/
│       └── app.ts           # Rota POST /mensagem
├── projeto-2-soma/
│   └── src/
│       └── app.ts           # Rota POST /soma
├── projeto-3-login/
│   └── src/
│       ├── app.ts           # Rota POST /login
│       └── usuarios.json    # Base de usuários cadastrados
├── package.json             # Dependências e scripts compartilhados
├── tsconfig.json            # Configuração unificada do TypeScript
└── README.md
```

---

## 🛠️ Tecnologias Utilizadas

* **Node.js**
* **Express.js**
* **TypeScript**
* **TSX** (execução e *watch mode* para desenvolvimento)
* **Postman** (validação e testes das rotas HTTP)

---

## 🚀 Como Executar os Projetos

1. **Clone o repositório:**
   ```bash
   git clone <URL_DO_SEU_REPOSITORIO>
   cd exercicios-express-post
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Execute o servidor do projeto desejado (um por vez, na porta `3000`):**
   * **Projeto 1 (Mensagem):**
     ```bash
     npm run dev:p1
     ```
   * **Projeto 2 (Soma):**
     ```bash
     npm run dev:p2
     ```
   * **Projeto 3 (Login):**
     ```bash
     npm run dev:p3
     ```

---

## 📌 Documentação das Rotas e Testes (Postman)

### 1. Projeto 1 — Rota `POST /mensagem`
Recebe três dados dinâmicos (`nome`, `idade` e `timeFavorito`) no corpo da requisição (`req.body`), valida o preenchimento e o tipo numérico da idade, e retorna uma frase personalizada em JSON.

* **Endpoint:** `POST http://localhost:3000/mensagem`
* **Corpo da Requisição (`Body` → `raw` → `JSON`):**
  ```json
  {
    "nome": "Juriscleuson",
    "idade": 67,
    "timeFavorito": "Ferroviaria FC"
  }
  ```
* **Resposta de Sucesso (`200 OK`):**
  ```json
  {
    "mensagem": "Olá, Juriscleuson! Você tem 67 anos e torce para o Ferroviaria FC!"
  }
  ```
* **Evidências de Teste:**
  * `1.png` — Envio dos dados via método `POST` no corpo da requisição JSON (`"nome": "Juriscleuson"`, `"idade": 67` e `"timeFavorito": "Ferroviaria FC"`).
  * `1.1.png` — Retorno do servidor com status HTTP `200 OK` (em 8 ms) e a frase montada dinamicamente.

---

### 2. Projeto 2 — Rota `POST /soma`
Recebe três valores (`num1`, `num2` e `num3`) no corpo da requisição, verifica se todos possuem valores numéricos válidos antes de calcular (acumulando e detalhando os erros em caso de falha) e retorna o resultado da soma.

* **Endpoint:** `POST http://localhost:3000/soma`
* **Corpo da Requisição (`Body` → `raw` → `JSON`):**
  ```json
  {
    "num1": 67,
    "num2": 42.3,
    "num3": 244
  }
  ```
* **Resposta de Sucesso (`200 OK`):**
  ```json
  {
    "numerosRecebidos": [67, 42.3, 244],
    "soma": 353.3
  }
  ```
* **Evidências de Teste:**
  * `2.png` — Resposta em formato JSON com status HTTP `200 OK` (em 5 ms), listando os números recebidos (`[67, 42.3, 244]`) e o total calculado (`353.3`).
  * `2.2.png` — Visualização em *Preview* detalhando os índices numéricos recebidos (`0: 67`, `1: 42.3`, `2: 244`) e o resultado da operação (`353.3`).

---

### 3. Projeto 3 — Rota `POST /login`
Recebe `usuario` e `senha` no corpo da requisição, realiza a leitura do arquivo `usuarios.json` utilizando os módulos nativos `fs` e `path` do Node.js, e valida se as credenciais correspondem a um registro cadastrado.

* **Endpoint:** `POST http://localhost:3000/login`
* **Corpo da Requisição (`Body` → `raw` → `JSON`):**
  ```json
  {
    "usuario": "admin",
    "senha": "123456"
  }
  ```
* **Resposta de Sucesso (`200 OK`):**
  ```json
  {
    "mensagem": "Login realizado com sucesso! Bem-vindo, admin."
  }
  ```
* **Resposta de Credenciais Inválidas (`401 Unauthorized`):**
  ```json
  {
    "erro": "Usuário ou senha incorretos. Acesso não autorizado."
  }
  ```
* **Evidências de Teste:**
  * `3.3.png` — Envio das credenciais (`"usuario": "admin"` e `"senha": "123456"`) no corpo da requisição `POST`.
  * `3.png` — Confirmação de autenticação com status HTTP `200 OK` (em 9 ms) e mensagem de boas-vindas em JSON.

---

## 🛡️ Tratamento de Erros e Status HTTP Padronizados

Todas as rotas contam com validação de entrada e *middleware* de tratamento de sintaxe JSON:
* **`200 OK`**: Requisição processada com sucesso.
* **`400 Bad Request`**: Campos obrigatórios ausentes, valores não numéricos na rota `/soma`, idade inválida na rota `/mensagem` ou JSON malformado.
* **`401 Unauthorized`**: Usuário ou senha incorretos na rota `/login`.
* **`500 Internal Server Error`**: Falhas internas inesperadas no servidor ou na leitura de arquivos.

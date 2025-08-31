# Aplicação Home Finance - Visão Geral da Documentação

Este documento descreve o funcionamento da aplicação Home Finance, os principais componentes, fluxos de dados e como a aplicação é estruturada. O objetivo é servir como referência para desenvolvedores, testers e equipes técnicas.

## Sumário

- [Visão Geral do Projeto](#visão-geral-do-projeto): Propósito e funcionalidades principais.
- [Tecnologias Utilizadas](#tecnologias-utilizadas): Lista das principais ferramentas e frameworks.
- [Estrutura do Repositório](#estrutura-do-repositório): Organização de diretórios e arquivos.
- [Fluxos de Dados Principais](#fluxos-de-dados-principais): Detalhamento dos fluxos de Cash Flow, Orçamento e Dashboard.
  - [Fluxo de Caixa (Cash Flow)](#fluxo-de-caixa-cash-flow)
  - [Orçamento (Budget)](#orçamento-budget)
  - [Dashboard](#dashboard)
- [Componentes-Chave](#componentes-chave): Descrição dos principais componentes reutilizáveis.
- [Endpoints e Interações de API](#endpoints-simulados-e-interações-de-api): Visão geral dos endpoints e exemplos de contrato.
- [Diagramas de Fluxo (Mermaid)](#diagramas-de-fluxo-mermaid): Representações visuais de processos.
- [Execução e Ambiente de Desenvolvimento](#execução-e-ambiente-de-desenvolvimento): Como configurar e rodar a aplicação.
- [Boas Práticas e Próximos Passos](#boas-práticas-e-próximos-passos): Recomendações e futuras melhorias.

## Visão geral do projeto

Home Finance é uma aplicação frontend (Vue.js) voltada para gerenciamento de finanças pessoais. A interface centraliza:

- Controle de fluxo de caixa (receitas, despesas, parcelas, status de pagamento)
- Orçamento mensal ou periódico por categorias
- Visualizações de dashboard com totais, gráficos e sumários
- Interações de usuário para criação, edição e exportação de dados

O frontend utiliza uma arquitetura baseada em componentes reutilizáveis, com estado compartilhado via Pinia e integração com uma API (endpoints simulados ou reais, conforme configuração).

## Tecnologias utilizadas

- Vue.js (Composition API)
- Vuetify (UI)
- Pinia (state management)
- Dayjs (datas)
- Axios (requisições HTTP)
- SCSS para estilos

## Estrutura do repositório

Principais diretórios relevantes:

- src/views
  - DashboardView.vue, CashFlowView.vue, BudgetView.vue, CostCenterView.vue, etc.
- src/components
  - cash_flow: TransactionForm.vue, CashFlowFilter.vue
  - budget: PrimaryCategoryBudget.vue, SecondaryCategoryBudget.vue, SpecificCategoryBudget.vue
  - generics: DatePicker.vue, DateRangePicker.vue, LoaderDialog.vue, etc.
  - dashboard: DashboardMain.vue, DashboardMainMobile.vue, charts, etc.
  - core: seletores e componentes de UI reutilizáveis
- src/composables: useDateHandler.js, useMonetaryValueHandler.js
- src/helper: axios.helper.js
- src/store: snackbar.store.js e outros stores
- README.md: instruções gerais de instalação e execução

Observação: os componentes abertos ajudam a entender responsabilidades e interações entre partes do sistema.

## Fluxos de dados principais

### Fluxo de Caixa (Cash Flow)

- Visão: lista de transações com filtros, exportação e edição.
- Entidades:
  - Transaction: descrição, valor, datas (compra, vencimento, pagamento), parcelas, categorias ( principal, secundária, específica ), tipo de transação, modalidade de pagamento, status de pagamento, notas, flags is_real e is_reconciled.
- Operações:
  - Criação/edição via TransactionForm.vue, enviando para API em /cashflow/transaction ou /cashflow/transaction/{id}.
  - Suporte a batching de parcelas, com datas de vencimento ajustadas.
  - Leitura via CashFlowView.vue com filtros em /cashflow/transaction.
  - Exportação para Excel via /cashflow/transaction/export.
- UX:
  - Marcar como pago, conciliar, excluir, editar, ver detalhes expandidos.

### Orçamento (Budget)

- Visão: orçamento por categorias para mês/ano específico, com receita prevista.
- Entidades:
  - Budget: categorias com orçamentos, hierarquias de categorias.
  - Forecast/revenue: receita prevista derivada de totais de transações.
- Fluxos:
  - Busca pelo mês/ano via /budget.
  - Salvamento com /budget (criar) ou /budget/{id}/categories (editar).
  - Validação para evitar exceder limites (100% entre categorias destacadas).
- Vistas:
  - BudgetView.vue exibe totais e componentes de orçamento (PrimaryCategoryBudget, etc.).

### Dashboard

- Visão geral com métricas-chave: receita, despesa, saldo, previsões, atualizações a partir de transações e orçamento.
- Componentes: DashboardMain.vue, DashboardMainMobile.vue, gráficos e totais.

## Componentes-chave

- TransactionForm.vue

  - Formulário para criar/editar transações
  - Campos: tipo de transação, pagamento, status, datas (compra, vencimento, pagamento), valor, parcelas, descrições, categorias, notas
  - Funcionalidades: suporte a geração de parcelas, preenchimento automático de datas conforme regras, validações abrangentes

- CashFlowFilter.vue

  - Filtro modal para transações
  - Permite selecionar tipos, pagamentos, status, datas, valores e categorias
  - Emite filtros formatados para a API

- PrimaryCategorySelector.vue, SecondaryCategorySelector.vue, SpecificCategorySelector.vue

  - Seletor de categorias com dependências entre si

- DatePicker.vue, YearMonthPicker.vue

  - Campos de seleção de datas com comportamento responsivo

- PrimaryCategoryBudget.vue, SecondaryCategoryBudget.vue, SpecificCategoryBudget.vue

  - Componentes de orçamento por categoria

- DashboardMain.vue, DashboardMainMobile.vue

  - Apresentação visual do dashboard com gráficos e resumos

- Utilitários de UX
  - LoaderDialog.vue, ConfirmationDialog.vue, LoaderCircular.vue

## Endpoints simulados e interações de API (alto nível)

Observação: os endpoints são consumidos pelo frontend através do helper axios.

- /cashflow/transaction
  - GET: listar com filtros
  - POST: criar
- /cashflow/transaction/{id}
  - PUT: atualizar
  - DELETE: excluir
- /cashflow/transaction/export
  - GET: exportar transações (Excel)
- /budget
  - GET: buscar orçamento mês/ano
  - POST: criar orçamento
- /budget/{id}/categories
  - PUT: atualizar categorias do orçamento

Observação: a formatação de datas e valores é gerida pelos composables useDateHandler.js e useMonetaryValueHandler.js para manter consistência na apresentação.

### Exemplo de Contrato de API (Transação)

#### `POST /cashflow/transaction`

Cria uma nova transação.

**Request Body:**

```json
{
  "description": "Aluguel Mensal",
  "value": 1200.0,
  "purchase_date": "2025-07-25",
  "due_date": "2025-08-01",
  "payment_date": null,
  "installments": 1,
  "primary_category_id": "uuid-primary-category",
  "secondary_category_id": "uuid-secondary-category",
  "specific_category_id": null,
  "transaction_type": "EXPENSE",
  "payment_type_id": "uuid-payment-type",
  "payment_status_type": "PENDING",
  "notes": "Pagamento do aluguel de agosto",
  "is_real": true,
  "is_reconciled": false
}
```

**Response Body (201 Created):**

```json
{
  "id": "uuid-transaction-123",
  "description": "Aluguel Mensal",
  "value": 1200.0,
  "purchase_date": "2025-07-25",
  "due_date": "2025-08-01",
  "payment_date": null,
  "installments": 1,
  "primary_category": { "id": "uuid-primary-category", "name": "Moradia" },
  "secondary_category": { "id": "uuid-secondary-category", "name": "Aluguel" },
  "specific_category": null,
  "transaction_type": "EXPENSE",
  "payment_type": { "id": "uuid-payment-type", "name": "Débito Automático" },
  "payment_status_type": "PENDING",
  "notes": "Pagamento do aluguel de agosto",
  "is_real": true,
  "is_reconciled": false,
  "created_at": "2025-07-26T10:00:00Z",
  "updated_at": "2025-07-26T10:00:00Z"
}
```

## Diagramas de Fluxo (Mermaid)

Para melhor compreensão dos fluxos de dados, apresentamos alguns diagramas utilizando a sintaxe Mermaid.

### Fluxo de Criação/Edição de Transação (Cash Flow)

```mermaid
graph TD
    A[Usuário Interage com TransactionForm.vue] --> B{Validação de Dados};
    B -- Dados Válidos --> C[Composable useMonetaryValueHandler/useDateHandler];
    C --> D[Prepara Objeto Transaction];
    D --> E[Chama axios.helper.js];
    E --> F{API: POST /cashflow/transaction ou PUT /cashflow/transaction/{id}};
    F -- Sucesso --> G[Atualiza Pinia Store (snackbar.store.js)];
    F -- Erro --> H[Exibe Mensagem de Erro (snackbar.store.js)];
    G --> I[Atualiza Lista de Transações (CashFlowView.vue)];
```

## Execução e ambiente de desenvolvimento

- Requisitos:
  - Node.js compatível com o projeto
  - Docker e Docker Compose (conforme README)
- Iniciar (conforme README):
  - Renomear .env.example para .env e configurar VUE_APP_ROOT_API
  - docker compose up -d
  - Acessar http://127.0.0.1:8085
- Scripts úteis mencionados:
  - docker compose exec home_finance npm install <package>
  - docker exec home_finance npm run serve
  - docker exec home_finance npm run build
  - docker exec home_finance npm run test:unit

## Boas práticas e próximos passos

- Manter consistência de nomenclatura entre componentes e endpoints
- Atualizar documentação com novas features ou alterações de API
- Incluir diagramas Mermaid para clarificar fluxos (opcional)
- Adicionar exemplos de código, fluxos de usuário e contratos de API

Se desejar, posso evoluir este documento incluindo diagramas Mermaid e expandir com exemplos de código, fluxos de usuário detalhados e um contrato de API de alto nível.

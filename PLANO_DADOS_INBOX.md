# Plano de Campos para Caixa de Entrada (Inbox)

## 📋 Resumo

Backend precisa criar 2 tabelas com seeders para popular a caixa de entrada e feed de atividades do dashboard.

---

## 1️⃣ Tabela: `notificacoes`

**Endpoint**: `GET /api/notificacoes`

### Campos Obrigatórios:

| Campo        | Tipo     | Descrição                             | Exemplo                         |
| ------------ | -------- | ------------------------------------- | ------------------------------- |
| `id`         | INT      | Identificador único                   | 1                               |
| `tipo`       | STRING   | Categoria (aprovacao, alerta, tarefa) | "aprovacao"                     |
| `titulo`     | STRING   | Título da notificação                 | "Requisição de Compra Pendente" |
| `mensagem`   | STRING   | Descrição/mensagem detalhada          | "Aguardando sua aprovação"      |
| `created_at` | DATETIME | Data/hora de criação                  | "2024-05-25 10:30:00"           |

### Tipos Suportados:

- `aprovacao` → Aba "Aprovações" (ícone: circuito monetário, cor: verde)
- `alerta` → Aba "Alertas" (ícone: triângulo de alerta, cor: vermelho)
- `tarefa` → Aba "Tarefas" (ícone: calendário, cor: azul)

### Exemplo de Seeder:

```
Notificacao 1: tipo="aprovacao", titulo="Aprov. Orçamento Q3", mensagem="Orçamento de R$50k aguardando sua aprovação"
Notificacao 2: tipo="alerta", titulo="Estoque Crítico", mensagem="Produto XYZ com estoque abaixo do mínimo"
Notificacao 3: tipo="tarefa", titulo="Reunião com Cliente", mensagem="Reunião com Cliente ABC às 14h"
Notificacao 4: tipo="aprovacao", titulo="Pedido #1234", mensagem="Pedido de venda em espera de aprovação"
```

---

## 2️⃣ Tabela: `atividades`

**Endpoint**: `GET /api/atividades`

### Campos Obrigatórios:

| Campo          | Tipo              | Descrição                                   | Exemplo               |
| -------------- | ----------------- | ------------------------------------------- | --------------------- |
| `id`           | INT               | Identificador único                         | 1                     |
| `usuario_nome` | STRING            | Nome do usuário que realizou a ação         | "João Silva"          |
| `acao`         | STRING            | Descrição da ação (sempre verbo no passado) | "aprovou"             |
| `alvo`         | STRING            | Objeto alvo da ação                         | "Orçamento Q3"        |
| `created_at`   | DATETIME          | Data/hora da atividade                      | "2024-05-25 09:15:00" |
| `avatar_url`   | STRING (opcional) | URL da foto do usuário                      | "https://..."         |

### Padrão de Construção:

**Resultado exibido**: `{usuario_nome} {acao} {alvo}`  
Exemplo: "João Silva aprovou Orçamento Q3"

### Exemplo de Seeder:

```
Atividade 1: usuario="Maria Santos", acao="aprovou", alvo="Requisição RQ-001"
Atividade 2: usuario="Pedro Costa", acao="atualizou", alvo="Estoque de Produtos"
Atividade 3: usuario="Ana Oliveira", acao="criou", alvo="Nova Campanha Marketing"
Atividade 4: usuario="Carlos Mendes", acao="finalizou", alvo="Tarefa XYZ-456"
Atividade 5: usuario="Lucia Torres", acao="enviou", alvo="Relatório de Vendas"
```

---

## 🎯 Quantidade Recomendada para Seeders:

- **Notificações**: 6-8 registros (2-3 de cada tipo)
- **Atividades**: 8-10 registros (variadas)

---

## 📊 Estrutura de Resposta Esperada (Frontend)

### Notificação (após processamento):

```json
{
  "id": 1,
  "type": "approval",
  "tab": "aprovacoes",
  "title": "Aprov. Orçamento Q3",
  "desc": "Orçamento de R$50k aguardando sua aprovação",
  "time": "25/05/2024",
  "icon": "M12 8c...", // SVG path (gerado automaticamente no frontend)
  "color": "text-success-500",
  "bg": "bg-success-50 dark:bg-success-500/10"
}
```

### Atividade (após processamento):

```json
{
  "id": 1,
  "user": "João Silva",
  "action": "aprovou",
  "target": "Orçamento Q3",
  "time": "25/05/2024",
  "avatar": "https://ui-avatars.com/api/?name=João%20Silva&background=random"
}
```

---

## ✅ Checklist para Backend:

- [ ] Criar tabela `notificacoes` com campos listados
- [ ] Criar tabela `atividades` com campos listados
- [ ] Criar seeder com 6-8 notificações variadas
- [ ] Criar seeder com 8-10 atividades variadas
- [ ] Endpoint `GET /api/notificacoes` retornando JSON
- [ ] Endpoint `GET /api/atividades` retornando JSON
- [ ] Endpoint `PUT /api/notificacoes/{id}/ler` para marcar como lida

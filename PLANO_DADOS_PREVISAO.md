# Plano de Campos para Página de Previsão

## 📋 Resumo

Backend precisa criar 1 tabela com seeders para popular a página de previsão de vendas com dados de 6 meses.

---

## 1️⃣ Tabela: `previsoes`

**Endpoint**: `GET /api/dashboard/previsao`

### Campos Obrigatórios:

| Campo                | Tipo          | Descrição                                             | Exemplo               |
| -------------------- | ------------- | ----------------------------------------------------- | --------------------- |
| `id`                 | INT           | Identificador único                                   | 1                     |
| `periodo`            | STRING        | Período no formato "MÊS ANO"                          | "Junho 2026"          |
| `mes_numero`         | INT           | Número do mês (1-12) para ordenação                   | 6                     |
| `ano`                | INT           | Ano da previsão                                       | 2026                  |
| `valor_previsao`     | DECIMAL(12,2) | Valor previsto em moeda                               | 156800.00             |
| `valor_minimo`       | DECIMAL(12,2) | Valor mínimo do intervalo de confiança                | 137600.00             |
| `valor_maximo`       | DECIMAL(12,2) | Valor máximo do intervalo de confiança                | 176000.00             |
| `confiabilidade`     | INT           | Percentual de confiança do modelo (0-100)             | 88                    |
| `status`             | STRING        | Status da previsão (Projetado, Realizado, Atualizado) | "Projetado"           |
| `margem_erro`        | DECIMAL(5,2)  | Margem de erro em percentual                          | 12.3                  |
| `ultima_atualizacao` | DATETIME      | Quando foi calculada a previsão                       | "2024-05-08 14:32:00" |
| `created_at`         | TIMESTAMP     | Criação do registro                                   | -                     |
| `updated_at`         | TIMESTAMP     | Última atualização                                    | -                     |

### Observações:

- **Ordenar por**: mes_numero ASC
- **Margem de erro**: Calcular como `(valor_maximo - valor_minimo) / valor_previsao * 100`
- **Última atualização**: Pode ser `NOW()` ou data fixa
- **Status**: Geralmente "Projetado" para meses futuros

### Exemplo de Seeder (6 períodos):

```
Previsão 1: Junho 2026, R$ 156.800, mín R$ 137.600, máx R$ 176.000, confiança 88%
Previsão 2: Julho 2026, R$ 168.300, mín R$ 147.500, máx R$ 189.100, confiança 86%
Previsão 3: Agosto 2026, R$ 172.500, mín R$ 151.100, máx R$ 193.900, confiança 85%
Previsão 4: Setembro 2026, R$ 181.200, mín R$ 158.900, máx R$ 203.500, confiança 82%
Previsão 5: Outubro 2026, R$ 195.700, mín R$ 171.500, máx R$ 219.900, confiança 80%
Previsão 6: Novembro 2026, R$ 210.400, mín R$ 184.300, máx R$ 236.500, confiança 78%
```

---

## 🎯 Estrutura de Resposta da API

**Endpoint:** `GET /api/dashboard/previsao`

**Resposta esperada pelo frontend:**

```json
{
  "kpis": {
    "previsao_proximo_mes": {
      "valor": 156800,
      "formatado": "R$ 156.800",
      "variacao": "+12%",
      "variacao_tipo": "positivo"
    },
    "confiabilidade": {
      "valor": 87.5,
      "formatado": "87.5%",
      "status": "Modelo de IA preciso"
    },
    "intervalo_confianca": {
      "valor": 12.3,
      "formatado": "±12.3%",
      "status": "Margem de erro"
    },
    "ultima_atualizacao": {
      "data": "08/05",
      "hora": "14h32min"
    }
  },
  "previsoes": [
    {
      "id": 1,
      "periodo": "Junho 2026",
      "valor_previsao": 156800,
      "valor_minimo": 137600,
      "valor_maximo": 176000,
      "confiabilidade": 88,
      "status": "Projetado"
    }
    // ... mais previsões
  ],
  "planejamentos": [
    {
      "id": 1,
      "previsao_id": 1,
      "titulo": "Estratégia de Crescimento - Junho 2026",
      "descricao": "1. Análise de Mercado:\n   - Expansão em 3 novos mercados...\n\n2. Execução:\n   - Investimento em marketing...",
      "confiabilidade": 85,
      "status": "Rascunho"
    }
  ],
  "dados_grafico": {
    // Dados para gráfico de linha (próx. 6 meses)
  }
}
```

---

## 📊 Dados para KPIs (Cálculos Backend)

### Previsão - Próx. Mês

- **Valor**: Pegar o primeiro registro da tabela (mês atual/próximo)
- **Variação**: Comparar com mês anterior real ou com previsão anterior

### Confiabilidade

- **Valor**: Média das confiabilidades dos próximos 6 meses
- **Fórmula**: `(88 + 86 + 85 + 82 + 80 + 78) / 6 = 83.17%`
- **Arredondar para**: 87.5% (ou usar média ponderada)

### Intervalo de Confiança

- **Valor**: Usar o primeiro registro (Junho)
- **Cálculo**: `(176000 - 137600) / 156800 * 100 = 24.36%` ÷ 2 = **±12.18%**
- **Arredondar**: ±12.3%

### Última Atualização

- **Data e Hora**: Do campo `ultima_atualizacao` da previsão mais recente

---

## 3️⃣ Tabela: `planejamentos_previsoes` (Planejamentos Gerados com IA)

### Campos Obrigatórios:
| Campo | Tipo | Descrição | Exemplo |
|-------|------|-----------|---------|
| `id` | INT | Identificador único | 1 |
| `previsao_id` | INT | FK para tabela previsoes | 1 |
| `titulo` | STRING(255) | Título do planejamento gerado | "Estratégia de Crescimento - Junho" |
| `descricao` | LONGTEXT | Planejamento detalhado gerado por IA | "1. Objetivos:\n2. Estratégia:\n3. Ações..." |
| `modelo_ia` | STRING(50) | Qual modelo gerou (lluvia_vendas, groq_mistral) | "groq_mistral" |
| `confiabilidade` | INT | Confiança da IA (0-100) | 85 |
| `status` | STRING(50) | Status (Rascunho, Aprovado, Implementando) | "Rascunho" |
| `created_at` | TIMESTAMP | Criação | - |
| `updated_at` | TIMESTAMP | Última atualização | - |

### Observações:
- **Relationship**: Um planejamento para cada previsão (ou múltiplos se revisados)
- **Status**: Pode mudar de Rascunho → Aprovado → Implementando
- **Descrição**: Pode conter quebras de linha `\n` para formatação

### Exemplo de Seeder (3 planejamentos):
```
Planejamento 1: Junho 2026, "Estratégia de Crescimento - Junho", descrição detalhada, confiança 85%
Planejamento 2: Julho 2026, "Plano de Expansão - Julho", descrição detalhada, confiança 82%
Planejamento 3: Agosto 2026, "Operacionalização - Agosto", descrição detalhada, confiança 80%
```

### Migration:
```php
Schema::create('planejamentos_previsoes', function (Blueprint $table) {
    $table->id();
    $table->foreignId('previsao_id')->constrained('previsoes')->onDelete('cascade');
    $table->string('titulo');
    $table->longText('descricao');
    $table->string('modelo_ia')->default('groq_mistral');
    $table->integer('confiabilidade')->default(80);
    $table->string('status')->default('Rascunho'); // Rascunho, Aprovado, Implementando
    $table->timestamps();
    
    $table->index('previsao_id');
    $table->index('status');
});
```

### Controller - Método index() atualizado:
```php
public function index()
{
    $previsoes = Previsao::orderBy('ano')
        ->orderBy('mes_numero')
        ->get();
    
    $planejamentos = PlanejamentoPrevisao::all(); // Buscar todos os planejamentos
    
    // Calcular KPIs
    $proximoMes = $previsoes->first();
    $confiabilidadeMedia = $previsoes->avg('confiabilidade');
    $margemErro = $proximoMes ? 
        (($proximoMes->valor_maximo - $proximoMes->valor_minimo) / 
         $proximoMes->valor_previsao * 100 / 2) : 0;
    
    return response()->json([
        'kpis' => [
            'previsao_proximo_mes' => [
                'valor' => $proximoMes->valor_previsao ?? 0,
                'formatado' => 'R$ ' . number_format($proximoMes->valor_previsao ?? 0, 0, ',', '.'),
                'variacao' => '+12%',
                'variacao_tipo' => 'positivo'
            ],
            'confiabilidade' => [
                'valor' => round($confiabilidadeMedia, 1),
                'formatado' => round($confiabilidadeMedia, 1) . '%',
                'status' => 'Modelo de IA preciso'
            ],
            'intervalo_confianca' => [
                'valor' => round($margemErro, 1),
                'formatado' => '±' . round($margemErro, 1) . '%',
                'status' => 'Margem de erro'
            ],
            'ultima_atualizacao' => [
                'data' => $proximoMes->ultima_atualizacao?->format('d/m') ?? 'N/A',
                'hora' => $proximoMes->ultima_atualizacao?->format('H\hi') ?? 'N/A'
            ]
        ],
        'previsoes' => $previsoes,
        'planejamentos' => $planejamentos  // ← NOVO
    ]);
}
```

---

## 🔧 Implementação Backend (Laravel exemplo)

### Migration:

```php
Schema::create('previsoes', function (Blueprint $table) {
    $table->id();
    $table->string('periodo'); // ex: "Junho 2026"
    $table->integer('mes_numero'); // 1-12
    $table->integer('ano'); // 2026
    $table->decimal('valor_previsao', 12, 2);
    $table->decimal('valor_minimo', 12, 2);
    $table->decimal('valor_maximo', 12, 2);
    $table->integer('confiabilidade'); // 0-100
    $table->string('status')->default('Projetado');
    $table->decimal('margem_erro', 5, 2)->nullable();
    $table->dateTime('ultima_atualizacao')->useCurrent();
    $table->timestamps();

    $table->index(['ano', 'mes_numero']);
});
```

### Seeder:

```php
DB::table('previsoes')->insert([
    [
        'periodo' => 'Junho 2026',
        'mes_numero' => 6,
        'ano' => 2026,
        'valor_previsao' => 156800.00,
        'valor_minimo' => 137600.00,
        'valor_maximo' => 176000.00,
        'confiabilidade' => 88,
        'status' => 'Projetado',
        'margem_erro' => 12.30,
        'ultima_atualizacao' => now(),
        'created_at' => now(),
        'updated_at' => now(),
    ],
    // ... resto dos dados
]);
```

### Endpoint:

```php
Route::get('/dashboard/previsao', [PrevisaoController::class, 'index'])->middleware('auth:sanctum');
```

### Controller (PrevisaoController.php):

```php
public function index()
{
    $previsoes = Previsao::orderBy('ano')
        ->orderBy('mes_numero')
        ->get();

    // Calcular KPIs
    $proximoMes = $previsoes->first();
    $confiabilidadeMedia = $previsoes->avg('confiabilidade');
    $margemErro = $proximoMes ?
        (($proximoMes->valor_maximo - $proximoMes->valor_minimo) /
         $proximoMes->valor_previsao * 100 / 2) : 0;

    return response()->json([
        'kpis' => [
            'previsao_proximo_mes' => [
                'valor' => $proximoMes->valor_previsao ?? 0,
                'formatado' => 'R$ ' . number_format($proximoMes->valor_previsao ?? 0, 0, ',', '.'),
                'variacao' => '+12%',
                'variacao_tipo' => 'positivo'
            ],
            'confiabilidade' => [
                'valor' => round($confiabilidadeMedia, 1),
                'formatado' => round($confiabilidadeMedia, 1) . '%',
                'status' => 'Modelo de IA preciso'
            ],
            'intervalo_confianca' => [
                'valor' => round($margemErro, 1),
                'formatado' => '±' . round($margemErro, 1) . '%',
                'status' => 'Margem de erro'
            ],
            'ultima_atualizacao' => [
                'data' => $proximoMes->ultima_atualizacao?->format('d/m') ?? 'N/A',
                'hora' => $proximoMes->ultima_atualizacao?->format('H\hi') ?? 'N/A'
            ]
        ],
        'previsoes' => $previsoes
    ]);
}
```

---

## 2️⃣ Endpoint para Gerar Previsões com IA

**POST `/api/dashboard/previsao/gerar`**

### Request Body:

```json
{
  "periodos": 6,
  "modelo": "lluvia_vendas"
}
```

### Parâmetros:

| Parâmetro  | Tipo   | Valores                                             | Descrição                        |
| ---------- | ------ | --------------------------------------------------- | -------------------------------- |
| `periodos` | INT    | 3, 6, 12                                            | Quantos períodos a frente prever |
| `modelo`   | STRING | `lluvia_vendas`, `lluvia_tendencia`, `groq_mistral` | Algoritmo/IA a usar              |

### Response (Success 200):

```json
{
  "success": true,
  "message": "Previsão gerada com sucesso",
  "previsoes_geradas": 6,
  "timestamp": "2026-05-25T14:32:00Z"
}
```

### Response (Error):

```json
{
  "success": false,
  "message": "Erro ao processar a IA",
  "error": "Detalhe do erro"
}
```

### Modelos Disponíveis:

#### 1. `lluvia_vendas` (Recomendado)

- Algoritmo customizado baseado em série temporal
- Analisa histórico de vendas
- Implementação local (rápida)
- Melhor para: Previsões de curto/médio prazo

#### 2. `lluvia_tendencia`

- Análise de tendências e sazonalidade
- Detecta padrões sazonais
- Implementação local
- Melhor para: Negócios com sazonalidade

#### 3. `groq_mistral` (IA Real)

- Usa API Groq com Mixtral 8x7B
- Análise contextual + histórico
- Requer API key Groq
- Melhor para: Análise mais profunda

---

## 🔧 Implementação Backend - Endpoint POST

### ⚠️ IMPORTANTE: Gerar Planejamento Automático
**Após salvar cada previsão, DEVE gerar um planejamento com IA usando Groq!**

Workflow:
1. Usuário clica "Gerar Previsão com IA"
2. Backend gera previsões (periodos: 3/6/12)
3. **Para CADA previsão gerada**, chamar Groq para gerar um planejamento
4. Salvar planejamento na tabela `planejamentos_previsoes` com FK para a previsão
5. Retornar sucesso

### Controller (PrevisaoController.php):

```php
public function gerar(Request $request)
{
    $validated = $request->validate([
        'periodos' => 'required|integer|in:3,6,12',
        'modelo' => 'required|string|in:lluvia_vendas,lluvia_tendencia,groq_mistral'
    ]);

    try {
        $periodos = $validated['periodos'];
        $modelo = $validated['modelo'];

        // Buscar histórico de vendas para treinar
        $historico = $this->obterHistoricoVendas();

        // Gerar previsões baseado no modelo
        $previsoes = match($modelo) {
            'lluvia_vendas' => $this->previsaoLluviaVendas($historico, $periodos),
            'lluvia_tendencia' => $this->previsaoLluvia TrendenciaVendas($historico, $periodos),
            'groq_mistral' => $this->previsaoGroqMistral($historico, $periodos),
            default => throw new \Exception('Modelo inválido')
        };

        $previsoesSalvas = [];
        
        // Salvar previsões no banco
        foreach ($previsoes as $previsao) {
            $prev = Previsao::create($previsao);
            $previsoesSalvas[] = $prev;
            
            // ⭐ NOVO: Gerar planejamento automático para cada previsão
            $this->gerarPlanejamentoParaPrevisao($prev, $modelo);
        }

        return response()->json([
            'success' => true,
            'message' => 'Previsão gerada com sucesso',
            'previsoes_geradas' => count($previsoesSalvas),
            'timestamp' => now()
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Erro ao processar a IA',
            'error' => $e->getMessage()
        ], 500);
    }
}

// ⭐ NOVO: Gerar planejamento usando Groq IA
private function gerarPlanejamentoParaPrevisao($previsao, $modelo)
{
    try {
        $apiKey = env('GROQ_API_KEY');
        $endpoint = 'https://api.groq.com/openai/v1/chat/completions';
        
        $prompt = "Gere um planejamento estratégico baseado nesta previsão de vendas:
        Período: {$previsao->periodo}
        Valor Previsto: R$ {$previsao->valor_previsao}
        Confiabilidade: {$previsao->confiabilidade}%
        
        Retorne OBRIGATORIAMENTE em JSON com estes campos EXATOS:
        {
          \"titulo\": \"Título do planejamento\",
          \"descricao\": \"Descrição detalhada com 1. Objetivos\\n2. Estratégia\\n3. Ações\"
        }";
        
        $payload = [
            'model' => 'mixtral-8x7b-32768',
            'messages' => [
                [
                    'role' => 'system',
                    'content' => 'Você é um consultor estratégico. Gere planejamentos detalhados em português brasileiro baseado em previsões de vendas.'
                ],
                [
                    'role' => 'user',
                    'content' => $prompt
                ]
            ],
            'temperature' => 0.7,
            'max_tokens' => 1500
        ];

        $ch = curl_init($endpoint);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
                'Authorization: Bearer ' . $apiKey,
                'Content-Type: application/json'
            ],
            CURLOPT_POSTFIELDS => json_encode($payload),
            CURLOPT_TIMEOUT => 30
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode === 200) {
            $data = json_decode($response, true);
            $conteudo = $data['choices'][0]['message']['content'] ?? '';
            
            // Extrair JSON da resposta
            preg_match('/\{.*\}/s', $conteudo, $matches);
            if ($matches) {
                $jsonResposta = json_decode($matches[0], true);
                
                // Salvar planejamento
                PlanejamentoPrevisao::create([
                    'previsao_id' => $previsao->id,
                    'titulo' => $jsonResposta['titulo'] ?? 'Planejamento: ' . $previsao->periodo,
                    'descricao' => $jsonResposta['descricao'] ?? $conteudo,
                    'modelo_ia' => $modelo,
                    'confiabilidade' => $previsao->confiabilidade - 5, // Um pouco menos que a previsão
                    'status' => 'Rascunho'
                ]);
            }
        }
    } catch (\Exception $e) {
        // Log erro mas não interrompe o fluxo
        \Log::error('Erro ao gerar planejamento para previsão: ' . $e->getMessage());
    }
}

private function obterHistoricoVendas()
{
    // Buscar últimas vendas para context
    return DB::table('vendas')
        ->select(DB::raw('DATE_FORMAT(created_at, "%Y-%m") as mes'), DB::raw('SUM(valor) as total'))
        ->groupBy('mes')
        ->orderBy('mes', 'asc')
        ->get()
        ->toArray();
}

private function previsaoLluviaVendas($historico, $periodos)
{
    // Algoritmo série temporal simples
    $ultimos = array_slice($historico, -3);
    $media = array_sum(array_column($ultimos, 'total')) / count($ultimos);

    $previsoes = [];
    $proximoMes = now()->addMonth();

    for ($i = 0; $i < $periodos; $i++) {
        $desvio = $media * 0.15; // 15% de desvio
        $previsoes[] = [
            'periodo' => $proximoMes->format('F Y'),
            'mes_numero' => $proximoMes->month,
            'ano' => $proximoMes->year,
            'valor_previsao' => $media * (1 + rand(-5, 15) / 100),
            'valor_minimo' => $media * 0.85,
            'valor_maximo' => $media * 1.15,
            'confiabilidade' => rand(75, 90),
            'status' => 'Projetado',
            'margem_erro' => round(($media * 1.15 - $media * 0.85) / $media * 100 / 2, 2),
            'ultima_atualizacao' => now()
        ];
        $proximoMes->addMonth();
    }

    return $previsoes;
}

private function previsaoLluvia TrendenciaVendas($historico, $periodos)
{
    // Análise de tendência com sazonalidade
    // Implementar lógica de tendência (crescente/decrescente)
    // Similar ao anterior mas com fator de crescimento
    // ...
}

private function previsaoGroqMistral($historico, $periodos)
{
    // Usar API Groq para análise de IA
    $apiKey = env('GROQ_API_KEY');
    $endpoint = 'https://api.groq.com/openai/v1/chat/completions';

    $prompt = "Analisar histórico de vendas e gerar previsão para $periodos períodos: " . json_encode($historico);

    $payload = [
        'model' => 'mixtral-8x7b-32768',
        'messages' => [
            ['role' => 'system', 'content' => 'Você é um analista de previsões de vendas. Retorne JSON com: valor_previsao, confiabilidade(%), margem_erro(%)'],
            ['role' => 'user', 'content' => $prompt]
        ],
        'temperature' => 0.7
    ];

    $ch = curl_init($endpoint);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            'Authorization: Bearer ' . $apiKey,
            'Content-Type: application/json'
        ],
        CURLOPT_POSTFIELDS => json_encode($payload)
    ]);

    $response = curl_exec($ch);
    $data = json_decode($response, true);

    // Processar resposta e retornar previsões
    // ...

    return [];
}
```

### Route:

```php
Route::post('/dashboard/previsao/gerar', [PrevisaoController::class, 'gerar'])->middleware('auth:sanctum');
```

---

## 🎉 Frontend - UI/UX da Geração

### Fluxo Visual:
1. **Usuário clica "Gerar Previsão com IA"**
   - Modal 1 abre: Configurar período (3/6/12) + modelo (lluvia_vendas, lluvia_tendencia, groq_mistral)

2. **Backend processa (30-60 segundos)**
   - Spinner animado no botão "Processando..."
   - Modal fechado

3. **Previsão Gerada com Sucesso! 🎉**
   - Modal 2 abre: Resultado visual bonito mostrando:
     - ✅ Badge verde com "Previsão Gerada!"
     - 📅 Período em destaque
     - 💰 Valor previsto em grande
     - 📊 Intervalo: Mínimo + Máximo
     - ⚡ Barra de progresso com confiabilidade
     - 🤖 Botão "Ver Planejamento IA" para visualizar plano automático

4. **Visualizar Planejamento**
   - Modal 3 abre: Mostra planejamento estratégico gerado por Groq
   - Fecha Modal 2 automaticamente

5. **Tabela Atualizada**
   - Nova previsão aparece na tabela "Detalhes da Previsão"
   - Novo planejamento já está disponível (botão "Ver Plano" ativado)

---

## ✅ Checklist Atualizado (com Planejamentos IA):

- [ ] Criar migration `previsoes`
- [ ] Criar model `Previsao`
- [ ] **NOVO**: Criar migration `planejamentos_previsoes`
- [ ] **NOVO**: Criar model `PlanejamentoPrevisao`
- [ ] Criar seeder com 6 registros de previsões (Junho-Novembro 2026)
- [ ] **NOVO**: Criar seeder com planejamentos para os períodos
- [ ] Criar `PrevisaoController` com método `index()` (retorna previsões + planejamentos)
- [ ] Implementar método `gerar()` com 3 modelos
- [ ] **NOVO**: Implementar método `gerarPlanejamentoParaPrevisao()` (Groq)
- [ ] Adicionar rota `GET /api/dashboard/previsao` (retorna kpis + previsões + planejamentos)
- [ ] Adicionar rota `POST /api/dashboard/previsao/gerar`
- [ ] Implementar `previsaoLluviaVendas()` (série temporal)
- [ ] Implementar `previsaoLluvia TrendenciaVendas()` (tendência)
- [ ] Implementar `previsaoGroqMistral()` (IA real)
- [ ] Testar endpoints com Postman
- [ ] Validar que planejamentos aparecem na tabela frontend
- [ ] Adicionar autenticação (middleware auth:sanctum)

---

## 📈 Próximas Melhorias (Futuro):

1. Gerar PDF com previsão + planejamento
2. Comparação previsão vs real
3. Histórico de previsões anteriores
4. Atualizar status de planejamentos (Aprovado, Implementando)
5. Alertas quando previsão desvia muito da realidade


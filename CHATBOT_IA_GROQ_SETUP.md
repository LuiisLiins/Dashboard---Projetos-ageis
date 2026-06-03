# 🤖 Implementação ChatBot IA com Groq - Guia Backend

## 📋 Resumo

Implementação de um assistente IA que responde perguntas sobre dados do dashboard usando **Groq** como provedor.

---

## 🎯 Por que Groq?

- ✅ **Gratuito** - Até 30 requisições/minuto (plano free)
- ✅ **Rápido** - LPM (Latency Per Million tokens) extremamente baixo
- ✅ **Modelo forte** - Mixtral 8x7B, LLaMA 70B, etc.
- ✅ **Sem cartão de crédito** - Apenas email para criar conta
- ✅ **API simples** - Compatível com OpenAI SDK

---

## 🔧 Setup Backend (Laravel/Qualquer framework)

### 1️⃣ Obter Chave de API Groq

```
1. Acesse: https://console.groq.com/keys
2. Crie uma conta (ou faça login)
3. Clique em "Create API Key"
4. Copie a chave
5. Adicione ao .env do backend:
   GROQ_API_KEY=seu_api_key_aqui
```

### 2️⃣ Instalar Dependência (PHP com Composer)

```bash
composer require groq-php/groq-php
# ou se usar OpenAI SDK (compatível com Groq)
composer require openai-php/client
```

### 3️⃣ Criar Endpoint Backend: `POST /api/chat/message`

**Resposta esperada pelo frontend:**

```json
{
  "reply": "Olá! As vendas deste mês tiveram crescimento de 12.5%..."
}
```

### 4️⃣ Implementação (Laravel exemplo)

**Route:**

```php
Route::post('/chat/message', [ChatController::class, 'sendMessage'])->middleware('auth:sanctum');
```

**Controller (ChatController.php):**

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function sendMessage(Request $request)
    {
        $validated = $request->validate([
            'message' => 'required|string|max:1000',
            'conversation' => 'array'
        ]);

        $message = $validated['message'];
        $history = $validated['conversation'] ?? [];

        try {
            // Usar Groq via cURL ou SDK
            $reply = $this->getGroqResponse($message, $history);

            return response()->json(['reply' => $reply]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao processar mensagem',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    private function getGroqResponse($userMessage, $conversationHistory)
    {
        $apiKey = env('GROQ_API_KEY');
        $endpoint = 'https://api.groq.com/openai/v1/chat/completions';

        // Montar histórico de conversa
        $messages = [];

        // Context do sistema
        $systemPrompt = <<<EOT
Você é um assistente de ajuda da aplicação de Dashboard Corporativo Multidomínio.
Seu papel é ajudar usuários a entender como usar as funcionalidades, recursos e features da aplicação.

IMPORTANTE: Você é um assistente de AJUDA sobre FUNCIONALIDADES, NÃO um consultor de dados.

Respostas que você DEVE dar:
- Como usar um recurso específico (ex: filtros, relatórios, gráficos)
- O que significa um botão ou menu
- Como navegar entre páginas
- Como exportar dados
- Como usar dashboards e visualizações
- Explicação de features e funcionalidades
- Dicas de uso da aplicação

Respostas que você NÃO deve dar:
- Não forneça dados confidenciais ou sensíveis
- Não responda perguntas genéricas não relacionadas à aplicação
- Não faça análise de negócio (não sou consultor)

Sempre:
- Seja direto e conciso
- Mantenha tom profissional e amigável
- Use exemplos práticos quando possível
- Respostas em Português Brasileiro
- Se não tiver informação, diga: "Desculpe, não tenho informações sobre isso. Contate o suporte."
EOT;

        $messages[] = [
            'role' => 'system',
            'content' => $systemPrompt
        ];

        // Adicionar histórico
        foreach ($conversationHistory as $msg) {
            $messages[] = [
                'role' => $msg['role'],
                'content' => $msg['content']
            ];
        }

        // Adicionar mensagem atual
        $messages[] = [
            'role' => 'user',
            'content' => $userMessage
        ];

        // Payload para Groq
        $payload = [
            'model' => 'mixtral-8x7b-32768', // ou 'llama-3.1-70b', etc
            'messages' => $messages,
            'max_tokens' => 1024,
            'temperature' => 0.7,
        ];

        $ch = curl_init($endpoint);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
                'Authorization: Bearer ' . $apiKey
            ],
            CURLOPT_POSTFIELDS => json_encode($payload),
            CURLOPT_TIMEOUT => 30
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode !== 200) {
            throw new \Exception("Groq API error: HTTP $httpCode");
        }

        $data = json_decode($response, true);

        if (!isset($data['choices'][0]['message']['content'])) {
            throw new \Exception('Invalid response format from Groq');
        }

        return $data['choices'][0]['message']['content'];
    }
}
```

---

## 📊 Alternativa: Usar OpenAI SDK com Groq

```php
// Usando openai-php/client (mais elegante)
use OpenAI\Client;

private function getGroqResponse($userMessage, $conversationHistory)
{
    $client = new Client(
        apiKey: env('GROQ_API_KEY'),
        baseURL: 'https://api.groq.com/openai/v1'
    );

    $messages = [
        [
            'role' => 'system',
            'content' => <<<EOT
Você é um assistente de ajuda da aplicação de Dashboard Corporativo Multidomínio.
Seu papel é ajudar usuários a entender como usar as funcionalidades, recursos e features da aplicação.

IMPORTANTE: Você é um assistente de AJUDA sobre FUNCIONALIDADES, NÃO um consultor de dados.

Respostas que você DEVE dar:
- Como usar um recurso específico (ex: filtros, relatórios, gráficos)
- O que significa um botão ou menu
- Como navegar entre páginas
- Como exportar dados
- Como usar dashboards e visualizações
- Explicação de features e funcionalidades
- Dicas de uso da aplicação

Respostas que você NÃO deve dar:
- Não forneça dados confidenciais ou sensíveis
- Não responda perguntas genéricas não relacionadas à aplicação
- Não faça análise de negócio (não sou consultor)

Sempre mantenha tom profissional e amigável em Português Brasileiro.
EOT
        ]
    ];

    foreach ($conversationHistory as $msg) {
        $messages[] = $msg;
    }

    $messages[] = [
        'role' => 'user',
        'content' => $userMessage
    ];

    $response = $client->chat()->create([
        'model' => 'mixtral-8x7b-32768',
        'messages' => $messages,
        'max_tokens' => 1024,
        'temperature' => 0.7,
    ]);

    return $response->choices[0]->message->content;
}
```

---

## 🧪 Testar Localmente

```bash
# Terminal 1: Backend rodando
php artisan serve # ou seu servidor

# Terminal 2: Teste a API
curl -X POST http://localhost:8000/api/chat/message \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Qual foi a receita total do mês?",
    "conversation": []
  }'
```

---

## ⚙️ Configurações Groq Recomendadas

| Parâmetro     | Valor                | Descrição                  |
| ------------- | -------------------- | -------------------------- |
| `model`       | `mixtral-8x7b-32768` | Modelo balanceado e rápido |
| `temperature` | `0.7`                | Criativo mas coherente     |
| `max_tokens`  | `1024`               | Respostas curtas/médias    |
| `top_p`       | `0.9`                | Diversidade na resposta    |

**Modelos disponíveis no Groq:**

- `mixtral-8x7b-32768` (recomendado)
- `llama-3.1-70b-versatile`
- `llama-2-70b-chat`
- `gemma-7b-it`

---

## 🔒 Segurança

- ✅ **Chave API no .env** (nunca expor no frontend)
- ✅ **Middleware de autenticação** (apenas usuários logados)
- ✅ **Rate limiting** recomendado (ex: 30 req/min por usuário)
- ✅ **Validação de input** (máximo 1000 caracteres)
- ✅ **Sanitizar respostas** (remover tokens sensíveis se necessário)

---

## 📈 Limites Groq (Plano Free)

- **30 requisições/minuto** por usuário
- **Sem cartão necessário**
- **Sem limite de tokens/dia**
- **Modelos atualizados regularmente**

---

## 🐛 Troubleshooting

| Erro                    | Solução                                        |
| ----------------------- | ---------------------------------------------- |
| `401 Unauthorized`      | Verificar `GROQ_API_KEY` no .env               |
| `429 Too Many Requests` | Implementar rate limiting no backend           |
| `Timeout`               | Aumentar timeout de cURL para 60s              |
| Resposta vazia          | Verificar `max_tokens` e histórico de conversa |

---

## ✅ Checklist Implementação

- [ ] Obter chave API Groq
- [ ] Adicionar `GROQ_API_KEY` ao `.env`
- [ ] Criar `ChatController.php`
- [ ] Adicionar rota `POST /api/chat/message`
- [ ] Implementar `getGroqResponse()`
- [ ] Adicionar middleware de autenticação
- [ ] Testar com curl ou Postman
- [ ] Testar no frontend (chatbot abrindo)
- [ ] Implementar rate limiting
- [ ] Deploy em produção

---

## 🚀 Próximas Melhorias (Futuro)

1. Armazenar histórico de chats em BD
2. Adicionar análise de sentimento nas respostas
3. Integrar com dados reais do dashboard dinamicamente
4. Criar personas/roles diferentes (vendedor, gerente, financeiro)
5. Fine-tuning do modelo com dados da empresa

# Plano de Geração de Planejamento com IA

## 📋 Resumo
Backend precisa criar 1 tabela e 1 endpoint para gerar planejamentos/planos com IA usando Groq.

---

## 1️⃣ Tabela: `planejamentos`

### Campos Obrigatórios:
| Campo | Tipo | Descrição | Exemplo |
|-------|------|-----------|---------|
| `id` | INT | Identificador único | 1 |
| `titulo` | STRING(255) | Título do planejamento | "Plano de Crescimento Q3 2026" |
| `descricao` | TEXT | Descrição detalhada do plano | "Estratégia de expansão..." |
| `modelo_ia` | STRING(50) | Qual IA gerou | "groq_mixtral" |
| `parametros` | JSON | Parâmetros usados | `{"tipo": "vendas", "periodo": "trimestral"}` |
| `confiabilidade` | INT | Confiança da IA (0-100) | 85 |
| `status` | STRING(50) | Status (Rascunho, Aprovado, Implementando) | "Rascunho" |
| `usuario_id` | INT | Quem criou | 1 |
| `data_geracao` | DATETIME | Quando foi gerado | "2026-05-25 14:30:00" |
| `created_at` | TIMESTAMP | Criação | - |
| `updated_at` | TIMESTAMP | Última atualização | - |

---

## 🔧 Endpoint para Gerar Planejamento com IA

**POST `/api/dashboard/planejamento/gerar`**

### Request Body:
```json
{
  "tipo": "vendas",
  "periodo": "trimestral",
  "contexto": "Aumentar vendas em 20% no próximo trimestre",
  "restricoes": "Orçamento limitado a R$ 50.000"
}
```

### Parâmetros:
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `tipo` | STRING | Tipo de plano: vendas, operacional, estrategico, financeiro |
| `periodo` | STRING | Prazo: mensal, trimestral, semestral, anual |
| `contexto` | STRING | O que você quer alcançar |
| `restricoes` | STRING(OPTIONAL) | Limitações ou restrições |

### Response (Success 200):
```json
{
  "success": true,
  "planejamento": {
    "id": 1,
    "titulo": "Plano de Crescimento de Vendas - Q3 2026",
    "descricao": "1. Objetivo Principal:\n   - Aumentar receita de vendas em 20% no próximo trimestre...\n\n2. Estratégia:\n   - Focar em clientes de alto valor...",
    "modelo_ia": "groq_mixtral",
    "confiabilidade": 87,
    "status": "Rascunho"
  },
  "timestamp": "2026-05-25T14:32:00Z"
}
```

### Response (Error):
```json
{
  "success": false,
  "message": "Erro ao gerar planejamento",
  "error": "Limite de requisições atingido"
}
```

---

## 📊 Estrutura de Resposta - GET (listagem)

**GET `/api/dashboard/planejamento`**

```json
{
  "planejamentos": [
    {
      "id": 1,
      "titulo": "Plano de Crescimento Q3 2026",
      "tipo": "vendas",
      "periodo": "trimestral",
      "confiabilidade": 87,
      "status": "Rascunho",
      "data_geracao": "2026-05-25 14:30:00"
    }
  ]
}
```

---

## 🚀 Implementação Backend (Laravel)

### Migration:
```php
Schema::create('planejamentos', function (Blueprint $table) {
    $table->id();
    $table->string('titulo');
    $table->longText('descricao');
    $table->string('modelo_ia')->default('groq_mixtral');
    $table->json('parametros')->nullable();
    $table->integer('confiabilidade')->default(0);
    $table->string('status')->default('Rascunho'); // Rascunho, Aprovado, Implementando, Concluído
    $table->foreignId('usuario_id')->constrained('users');
    $table->dateTime('data_geracao')->useCurrent();
    $table->timestamps();
    
    $table->index('usuario_id');
    $table->index('status');
});
```

### Model (Planejamento.php):
```php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Planejamento extends Model
{
    protected $table = 'planejamentos';
    
    protected $fillable = [
        'titulo',
        'descricao',
        'modelo_ia',
        'parametros',
        'confiabilidade',
        'status',
        'usuario_id',
        'data_geracao'
    ];
    
    protected $casts = [
        'parametros' => 'array',
        'data_geracao' => 'datetime'
    ];
    
    public function usuario()
    {
        return $this->belongsTo(User::class);
    }
}
```

### Controller (PlanejamentoController.php):
```php
namespace App\Http\Controllers;

use App\Models\Planejamento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PlanejamentoController extends Controller
{
    public function index()
    {
        $planejamentos = Planejamento::where('usuario_id', Auth::id())
            ->orderBy('data_geracao', 'desc')
            ->get();
        
        return response()->json([
            'planejamentos' => $planejamentos
        ]);
    }
    
    public function gerar(Request $request)
    {
        $validated = $request->validate([
            'tipo' => 'required|in:vendas,operacional,estrategico,financeiro',
            'periodo' => 'required|in:mensal,trimestral,semestral,anual',
            'contexto' => 'required|string|max:1000',
            'restricoes' => 'nullable|string|max:500'
        ]);

        try {
            // Chamar Groq IA para gerar plano
            $resposta = $this->gerarComGroq($validated);
            
            // Salvar no banco
            $planejamento = Planejamento::create([
                'titulo' => $resposta['titulo'],
                'descricao' => $resposta['descricao'],
                'modelo_ia' => 'groq_mixtral',
                'parametros' => $validated,
                'confiabilidade' => $resposta['confiabilidade'] ?? 80,
                'status' => 'Rascunho',
                'usuario_id' => Auth::id(),
                'data_geracao' => now()
            ]);
            
            return response()->json([
                'success' => true,
                'planejamento' => $planejamento,
                'timestamp' => now()
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao gerar planejamento',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    private function gerarComGroq($parametros)
    {
        $apiKey = env('GROQ_API_KEY');
        $endpoint = 'https://api.groq.com/openai/v1/chat/completions';
        
        // Montar prompt
        $prompt = $this->construirPrompt($parametros);
        
        // Chamar API Groq
        $payload = [
            'model' => 'mixtral-8x7b-32768',
            'messages' => [
                [
                    'role' => 'system',
                    'content' => 'Você é um consultor estratégico especializado em planejamento empresarial. Gere um plano detalhado em português brasileiro. Retorne SEMPRE em JSON puro com campos: "titulo", "descricao", "confiabilidade".'
                ],
                [
                    'role' => 'user',
                    'content' => $prompt
                ]
            ],
            'temperature' => 0.7,
            'max_tokens' => 2000
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

        if ($httpCode !== 200) {
            throw new \Exception('Erro da API Groq: HTTP ' . $httpCode);
        }

        $data = json_decode($response, true);
        
        if (!isset($data['choices'][0]['message']['content'])) {
            throw new \Exception('Resposta inválida da IA');
        }

        // Parse JSON da resposta
        $conteudo = $data['choices'][0]['message']['content'];
        
        // Tentar extrair JSON da resposta
        preg_match('/\{.*\}/s', $conteudo, $matches);
        if ($matches) {
            $jsonResposta = json_decode($matches[0], true);
            return $jsonResposta;
        }
        
        // Fallback
        return [
            'titulo' => 'Plano Gerado - ' . date('d/m/Y'),
            'descricao' => $conteudo,
            'confiabilidade' => 75
        ];
    }
    
    private function construirPrompt($parametros)
    {
        $tipo = $parametros['tipo'];
        $periodo = $parametros['periodo'];
        $contexto = $parametros['contexto'];
        $restricoes = $parametros['restricoes'] ?? 'Nenhuma restrição especificada';
        
        return <<<PROMPT
Gere um planejamento detalhado com as seguintes informações:

**Tipo de Plano:** $tipo
**Período:** $periodo
**Objetivo:** $contexto
**Restrições:** $restricoes

Por favor, crie um plano estruturado com:
1. Título descritivo
2. Descrição detalhada com objetivos, estratégias e ações
3. Uma avaliação de confiabilidade (0-100)

Retorne OBRIGATORIAMENTE em JSON com este formato:
{
  "titulo": "Título do plano",
  "descricao": "Descrição detalhada...",
  "confiabilidade": 85
}
PROMPT;
    }
    
    public function atualizar(Request $request, $id)
    {
        $planejamento = Planejamento::find($id);
        
        if ($planejamento->usuario_id !== Auth::id()) {
            return response()->json(['error' => 'Não autorizado'], 403);
        }
        
        $planejamento->update($request->only('status', 'descricao'));
        
        return response()->json([
            'success' => true,
            'planejamento' => $planejamento
        ]);
    }
}
```

### Routes (api.php):
```php
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/dashboard/planejamento', [PlanejamentoController::class, 'index']);
    Route::post('/dashboard/planejamento/gerar', [PlanejamentoController::class, 'gerar']);
    Route::put('/dashboard/planejamento/{id}', [PlanejamentoController::class, 'atualizar']);
});
```

### .env:
```
GROQ_API_KEY=seu_api_key_aqui
```

---

## ✅ Checklist para Backend:

- [ ] Criar migration `planejamentos`
- [ ] Criar model `Planejamento`
- [ ] Criar `PlanejamentoController`
- [ ] Implementar método `gerar()` com Groq
- [ ] Implementar método `index()` (listar planos)
- [ ] Implementar método `atualizar()` (mudar status)
- [ ] Adicionar rota `GET /api/dashboard/planejamento`
- [ ] Adicionar rota `POST /api/dashboard/planejamento/gerar`
- [ ] Adicionar rota `PUT /api/dashboard/planejamento/{id}`
- [ ] Configurar GROQ_API_KEY no .env
- [ ] Testar com Postman/Insomnia
- [ ] Validar autenticação (middleware auth:sanctum)

---

## 📝 Exemplo de Uso (Frontend - Alpine.js)

```javascript
async function gerarPlanejamento() {
  const token = localStorage.getItem('auth_token');
  
  try {
    const response = await fetch('http://localhost:8000/api/dashboard/planejamento/gerar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        tipo: 'vendas',
        periodo: 'trimestral',
        contexto: 'Aumentar vendas em 20%',
        restricoes: 'Orçamento: R$ 50.000'
      })
    });
    
    const data = await response.json();
    console.log('Planejamento criado:', data.planejamento);
  } catch (error) {
    console.error('Erro:', error);
  }
}
```

---

## 🔐 Segurança:

- ✅ Autenticação: Middleware `auth:sanctum`
- ✅ Validação: Valida tipo, período, contexto
- ✅ Autorização: Usuários veem apenas seus planos
- ✅ Rate Limiting: Implementar limite de requisições/min
- ✅ Timeout: 30s para respostas da IA

---

## 💡 Próximas Melhorias:

1. Gerar PDF com o plano
2. Compartilhar planos com equipe
3. Histórico de versões do plano
4. Clonar plano anterior
5. Integrar com tabela de tarefas para executar plano

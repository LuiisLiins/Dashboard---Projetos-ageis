import { buildDocument, section, kpiGrid, fmt, esc, badge } from './_shared.js';

export function buildEmpresaReport(data, pageMeta) {
  const e = data.empresa || {};

  const kpis = kpiGrid([
    { label: 'Faturamento Anual', value: esc(e.faturamento_anual ?? '—') },
    { label: 'Funcionários',      value: fmt(e.funcionarios) },
    { label: 'Clientes Ativos',   value: fmt(e.clientes_ativos) },
    { label: 'Filiais',           value: fmt(e.filiais) },
  ]);

  const identificacaoHTML = `
    <div class="detail-grid">
      <div><div class="dl">Razão Social</div><div class="dv">${esc(e.razao_social ?? '—')}</div></div>
      <div><div class="dl">Nome Fantasia</div><div class="dv">${esc(e.nome_fantasia ?? '—')}</div></div>
      <div><div class="dl">CNPJ</div><div class="dv mono">${esc(e.cnpj ?? '—')}</div></div>
      <div><div class="dl">Inscrição Estadual</div><div class="dv mono">${esc(e.inscricao_estadual ?? '—')}</div></div>
      <div><div class="dl">Setor</div><div class="dv">${esc(e.setor ?? '—')}</div></div>
      <div><div class="dl">Data de Fundação</div><div class="dv">${esc(e.data_fundacao ?? '—')}</div></div>
      <div style="grid-column:1/-1"><div class="dl">Descrição</div><div class="dv" style="line-height:1.6">${esc(e.descricao ?? '—')}</div></div>
    </div>`;

  const contatoHTML = `
    <div class="detail-grid">
      <div>
        <div class="dl">Endereço</div>
        <div class="dv">${esc(e.endereco ?? '—')}</div>
        <div class="dv" style="color:#718096">${esc(e.cidade_uf_cep ?? '')}</div>
      </div>
      <div><div class="dl">Telefone</div><div class="dv">${esc(e.telefone ?? '—')}</div></div>
      <div><div class="dl">Email</div><div class="dv">${esc(e.email ?? '—')}</div></div>
      <div><div class="dl">Website</div><div class="dv">${esc(e.website ?? '—')}</div></div>
    </div>`;

  const adminHTML = `
    <div class="detail-grid">
      <div><div class="dl">Proprietário / Presidente</div><div class="dv">${esc(e.proprietario ?? '—')}</div></div>
      <div><div class="dl">Responsável Técnico</div><div class="dv">${esc(e.responsavel_tecnico ?? '—')}</div></div>
      <div><div class="dl">Gerente Financeiro</div><div class="dv">${esc(e.gerente_financeiro ?? '—')}</div></div>
    </div>`;

  const certs = e.certificacoes || [];
  const certHTML = certs.length
    ? `<div style="display:flex;flex-wrap:wrap;gap:6px">${certs.map(c => badge(c, 'green')).join('')}</div>`
    : '<p class="note">Nenhuma certificação cadastrada.</p>';

  const body = [
    section('Informações Comerciais', kpis),
    section('Identificação', identificacaoHTML),
    section('Contato e Localização', contatoHTML),
    section('Dados Administrativos', adminHTML),
    section('Certificações', certHTML),
  ].join('');

  return buildDocument(
    'Detalhes da Empresa',
    'Informações gerais, administrativas e comerciais',
    pageMeta,
    body,
  );
}

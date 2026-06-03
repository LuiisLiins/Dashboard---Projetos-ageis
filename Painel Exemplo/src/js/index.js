import "jsvectormap/dist/jsvectormap.min.css";
import "flatpickr/dist/flatpickr.min.css";
import "dropzone/dist/dropzone.css";
import "../css/style.css";

import Alpine from "alpinejs";
import persist from "@alpinejs/persist";
import flatpickr from "flatpickr";
import Dropzone from "dropzone";
import {
  dashboardLevels,
  getIconMarkup,
  navigationGroups,
  pageCatalog,
} from "./config/navigation";

import chart01 from "./components/charts/chart-01";
import chart02 from "./components/charts/chart-02";
import chart03 from "./components/charts/chart-03";
import initDomainCharts from "./components/domain-charts";
import map01 from "./components/map-01";
import "./components/calendar-init.js";
import "./components/image-resize";
import { generateReport } from "./components/report-generator";
window.generateReport = generateReport;

const createNavigationStore = () => ({
  groups: navigationGroups,
  levels: dashboardLevels,
  pages: pageCatalog,
  getPageMeta(pageKey) {
    return (
      this.pages[pageKey] || {
        href: "index.html",
        title: "Dashboard",
        navLabel: "Dashboard",
        domainLabel: "Central",
        description: "Pagina sem configuracao cadastrada.",
        focus: "Visao geral",
        levelKey: "tatico",
        levelLabel: "Tatico",
        levelDescription: "Leitura gerencial sem configuracao cadastrada.",
        audience: "Gestao",
        cadence: "Sob demanda",
        badgeClass:
          "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-white/80",
      }
    );
  },
  getLevelMeta(levelKey) {
    return (
      this.levels.find((level) => level.key === levelKey) || {
        key: "tatico",
        label: "Tatico",
        description: "Leitura intermediaria para acompanhamento gerencial.",
        audience: "Gestao",
        cadence: "Sob demanda",
        anchor: "#",
        badgeClass:
          "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-white/80",
        borderClass: "border-gray-200 dark:border-gray-800",
      }
    );
  },
  getGroupKey(pageKey) {
    return this.getPageMeta(pageKey).groupKey || "";
  },
  getPagesByLevel(levelKey) {
    return Object.entries(this.pages)
      .filter(
        ([pageKey, meta]) =>
          pageKey !== "overview" && meta.levelKey === levelKey,
      )
      .map(([pageKey, meta]) => ({
        key: pageKey,
        href: meta.href,
        title: meta.title,
        navLabel: meta.navLabel,
        description: meta.description,
        groupLabel: meta.groupLabel || meta.domainLabel,
        badgeClass: meta.badgeClass,
      }));
  },
  isGroupActive(groupKey, pageKey) {
    return this.getGroupKey(pageKey) === groupKey;
  },
  getIcon(iconKey, className = "") {
    return getIconMarkup(iconKey, className);
  },
});

window.createAppShell = (pageKey) => ({
  page: pageKey,
  loaded: true,
  darkMode: false,
  stickyMenu: false,
  sidebarToggle: false,
  scrollTop: false,

  dashboardData: {
    kpis: {
      taxa_crescimento: 12.5,
      concluidos_hoje: 0,
      valor_estoque: {
        valor: 450250.5,
        formatado: "R$ 450.250,50",
        tipo: "moeda",
      },
      giro_estoque: {
        valor: 4.5,
        formatado: "4,5x",
        status: "Acima da média",
        tipo: "decimal",
      },
      risco_ruptura: {
        valor: 23,
        formatado: "23 itens",
        status: "Baixo estoque",
        tipo: "inteiro",
      },
      prazo_medio_reposicao: {
        valor: 7,
        formatado: "7 dias",
        status: "Normal",
        tipo: "inteiro",
      },
    },
    charts: {},
  },
  profileData: { id: "", nome: "", email: "", senha: "", perfil_acesso_id: "" },
  currentUser: {},
  notificacoes: [],
  unreadNotificacoes: 0,

  toasts: [],

  showToast(detail) {
    const id = Date.now() + Math.random();
    const duration = detail.duration || 4000;
    this.toasts.push({ id, type: detail.type || 'info', title: detail.title || '', message: detail.message || '', visible: true });
    setTimeout(() => {
      const t = this.toasts.find(t => t.id === id);
      if (t) t.visible = false;
      setTimeout(() => { this.toasts = this.toasts.filter(t => t.id !== id); }, 300);
    }, duration);
  },

  removeToast(id) {
    const t = this.toasts.find(t => t.id === id);
    if (t) t.visible = false;
    setTimeout(() => { this.toasts = this.toasts.filter(t => t.id !== id); }, 300);
  },

  timeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    if (diffInSeconds < 60) return `${diffInSeconds} seg atrás`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} min atrás`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} h atrás`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} d atrás`;
  },

  async fetchNotificacoes() {
    const token = localStorage.getItem("auth_token");
    if (!token) return;
    try {
      const response = await fetch("http://localhost:8000/api/notificacoes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        this.notificacoes = await response.json();
        this.unreadNotificacoes = this.notificacoes.filter(
          (n) => !n.lida,
        ).length;
      }
    } catch (e) {
      console.error("Erro ao buscar notificacoes", e);
    }
  },

  async fetchProfile() {
    const token = localStorage.getItem("auth_token");
    if (!token) return;
    try {
      const response = await fetch("http://localhost:8000/api/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        this.profileData.id = data.id;
        this.profileData.nome = data.nome;
        this.profileData.email = data.email;
        this.profileData.perfil_acesso_id = data.perfil_acesso_id;
        this.currentUser = data;
        localStorage.setItem("user", JSON.stringify(data));
      }
    } catch (e) {
      console.error("Erro ao buscar perfil", e);
    }
  },

  async updateProfile() {
    const token = localStorage.getItem("auth_token");
    const payload = {
      nome: this.profileData.nome,
      email: this.profileData.email,
      perfil_acesso_id: this.profileData.perfil_acesso_id,
    };
    if (this.profileData.senha) {
      payload.senha = this.profileData.senha;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/api/usuarios/${this.profileData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );
      if (response.ok) {
        this.showToast({ type: 'success', title: 'Perfil atualizado', message: 'Dados salvos com sucesso.' });
        this.profileData.senha = "";
        this.currentUser.nome = this.profileData.nome;
        this.currentUser.email = this.profileData.email;
        localStorage.setItem("user", JSON.stringify(this.currentUser));
      } else {
        const errorData = await response.json();
        this.showToast({ type: 'error', title: 'Erro ao atualizar', message: errorData.message || 'Verifique os dados.' });
      }
    } catch (e) {
      console.error("Erro ao atualizar perfil", e);
      this.showToast({ type: 'error', title: 'Erro de conexão', message: 'Não foi possível atualizar o perfil.' });
    }
  },

  formatNumber(value, decimals = 0) {
    if (value === undefined || value === null)
      return "0" + (decimals > 0 ? "," + "0".repeat(decimals) : "");
    const num = Number(value);
    if (isNaN(num))
      return "0" + (decimals > 0 ? "," + "0".repeat(decimals) : "");
    return num.toLocaleString("pt-BR", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  },

  async fetchDashboardData() {
    const token = localStorage.getItem("auth_token");
    if (!token && this.page !== "login") {
      window.location.href = "login.html";
      return;
    }

    const endpoints = {
      overview: "visao-geral",
      estrategico: "estrategico",
      operacional: "operacional",
      financeiro: "financeiro",
      comercial: "comercial",
      clientes: "clientes",
      estoque:   "estoque",
      analytics: "analytics",
    };
    const endpoint = endpoints[this.page];
    if (endpoint) {
      try {
        const response = await fetch(
          `http://localhost:8000/api/dashboard/${endpoint}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (response.ok) {
          const data = await response.json();
          // Merge com valores padrão para evitar campos vazios
          this.dashboardData = {
            ...this.dashboardData,
            ...data,
            kpis: {
              ...this.dashboardData.kpis,
              ...(data.kpis || {}),
            },
            charts: {
              ...this.dashboardData.charts,
              ...(data.charts || {}),
            },
          };
          window.dispatchEvent(
            new CustomEvent("dashboardDataFetched", {
              detail: this.dashboardData,
            }),
          );
        } else if (response.status === 401) {
          localStorage.removeItem("auth_token");
          window.location.href = "login.html";
        }
      } catch (e) {
        console.error("Erro ao conectar na API:", e);
      }
    }
  },

  async fetchProdutos(page = 1, perPage = 10, busca = '', status = '') {
    const token = localStorage.getItem("auth_token");
    if (!token) return;

    try {
      const params = new URLSearchParams({ page, per_page: perPage });
      if (busca) params.append('buscar', busca);
      if (status) params.append('status', status);
      const response = await fetch(
        `http://localhost:8000/api/produtos?${params}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.ok) {
        const data = await response.json();
        if (!this.dashboardData) this.dashboardData = {};
        this.dashboardData.produtos = data.data || [];
        this.dashboardData.produtosTotal = data.total || 0;
        this.dashboardData.produtosPage = page;
        window.dispatchEvent(
          new CustomEvent("produtosLoaded", { detail: this.dashboardData }),
        );
      } else if (response.status === 401) {
        localStorage.removeItem("auth_token");
        window.location.href = "login.html";
      }
    } catch (e) {
      console.error("Erro ao buscar produtos:", e);
      // Fallback com dados fictícios se API falhar
      this.dashboardData.produtos = [
        {
          id: 1,
          nome: "Notebook Dell Inspiron 15",
          sku: "SKU-001",
          categoria: "Eletrônicos",
          quantidade: 45,
          preco_unitario: 3500,
          status: "OK",
        },
        {
          id: 2,
          nome: "Mouse Logitech MX Master",
          sku: "SKU-002",
          categoria: "Periféricos",
          quantidade: 128,
          preco_unitario: 280,
          status: "OK",
        },
        {
          id: 3,
          nome: "Teclado Mecânico RGB",
          sku: "SKU-003",
          categoria: "Periféricos",
          quantidade: 23,
          preco_unitario: 450,
          status: "Baixo",
        },
        {
          id: 4,
          nome: 'Monitor LG 27\" 4K',
          sku: "SKU-004",
          categoria: "Monitores",
          quantidade: 18,
          preco_unitario: 1800,
          status: "OK",
        },
        {
          id: 5,
          nome: "Webcam HD 1080p",
          sku: "SKU-005",
          categoria: "Periféricos",
          quantidade: 5,
          preco_unitario: 320,
          status: "Crítico",
        },
        {
          id: 6,
          nome: "Headphone Gamer",
          sku: "SKU-006",
          categoria: "Áudio",
          quantidade: 67,
          preco_unitario: 420,
          status: "OK",
        },
      ];
    }
  },

  async realizarLogin(email, senha) {
    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, senha }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "index.html";
      } else {
        this.showToast({ type: 'error', title: 'Erro ao fazer login', message: data.message || 'Verifique suas credenciais.' });
      }
    } catch (error) {
      console.error("Erro na requisição", error);
      this.showToast({ type: 'error', title: 'Erro de conexão', message: 'Não foi possível conectar ao servidor.' });
    }
  },

  async fazerLogout() {
    const token = localStorage.getItem("auth_token");
    if (token) {
      try {
        await fetch("http://localhost:8000/api/logout", {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (e) {
        console.error("Erro ao fazer logout", e);
      }
    }
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    window.location.href = "login.html";
  },

  async downloadReport(format) {
    const pageMeta = Alpine.store('navigation').getPageMeta(this.page);
    const data = {
      ...this.dashboardData,
      empresa: (() => { try { const s = localStorage.getItem('empresa_data'); return s ? JSON.parse(s) : null; } catch(e) { return null; } })(),
    };
    await generateReport(this.page, data, pageMeta, format);
  },

  init() {
    const persistedDarkMode = localStorage.getItem("darkMode");

    this.darkMode = persistedDarkMode ? JSON.parse(persistedDarkMode) : false;
    this.$watch("darkMode", (value) => {
      localStorage.setItem("darkMode", JSON.stringify(value));
    });

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        this.currentUser = JSON.parse(storedUser);
      } catch (e) {
        console.error("Erro ao fazer parse do usuário", e);
      }
    }

    if (this.page !== "login") {
      this.fetchNotificacoes();
      if (this.page === "profile") {
        this.fetchProfile();
      } else if (this.page === "estoque") {
        this.fetchDashboardData();
        this.fetchProdutos();
      } else {
        this.fetchDashboardData();
      }
    }
  },
});

Alpine.plugin(persist);
window.Alpine = Alpine;
Alpine.store("navigation", createNavigationStore());

window.aiChat = () => ({
  isOpen: false,
  isLoading: false,
  userInput: "",
  messages: [],
  conversationContext: [],

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      setTimeout(() => {
        const input = document.querySelector(
          'input[placeholder="Pergunte sobre as vendas..."]',
        );
        if (input) input.focus();
      }, 100);
    }
  },

  async sendMessage() {
    if (!this.userInput.trim() || this.isLoading) return;

    const message = this.userInput.trim();
    this.messages.push({ role: "user", content: message });
    this.userInput = "";
    this.isLoading = true;

    this.scrollToBottom();

    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch("http://localhost:8000/api/chat/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: message,
          conversation: this.conversationContext,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        this.conversationContext.push({ role: "user", content: message });
        this.conversationContext.push({
          role: "assistant",
          content: data.reply,
        });
        this.messages.push({ role: "assistant", content: data.reply });
      } else {
        this.messages.push({
          role: "assistant",
          content:
            "Desculpe, houve um erro ao processar sua mensagem. Tente novamente.",
        });
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      this.messages.push({
        role: "assistant",
        content: "Erro de conexão. Verifique sua internet e tente novamente.",
      });
    }

    this.isLoading = false;
    this.scrollToBottom();
  },

  scrollToBottom() {
    setTimeout(() => {
      const container = document.getElementById("chat-messages");
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 50);
  },

  formatMessage(text) {
    // Simple markdown to HTML for bold text
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n/g, "<br>");
  },
});

Alpine.start();

// Init flatpickr
flatpickr(".datepicker", {
  mode: "range",
  static: true,
  monthSelectorType: "static",
  dateFormat: "M j",
  defaultDate: [new Date().setDate(new Date().getDate() - 6), new Date()],
  prevArrow:
    '<svg class="stroke-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.25 6L9 12.25L15.25 18.5" stroke="" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  nextArrow:
    '<svg class="stroke-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.75 19L15 12.75L8.75 6.5" stroke="" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  onReady: (selectedDates, dateStr, instance) => {
    // eslint-disable-next-line no-param-reassign
    instance.element.value = dateStr.replace("to", "-");
    const customClass = instance.element.getAttribute("data-class");
    instance.calendarContainer.classList.add(customClass);
  },
  onChange: (selectedDates, dateStr, instance) => {
    // eslint-disable-next-line no-param-reassign
    instance.element.value = dateStr.replace("to", "-");
  },
});

// Init Dropzone
const dropzoneArea = document.querySelectorAll("#demo-upload");

if (dropzoneArea.length) {
  let myDropzone = new Dropzone("#demo-upload", { url: "/file/post" });
}

// Document Loaded
document.addEventListener("DOMContentLoaded", () => {
  chart01();
  chart02();
  chart03();
  initDomainCharts();
  map01();
});

// Get the current year
const year = document.getElementById("year");
if (year) {
  year.textContent = new Date().getFullYear();
}

// For Copy//
document.addEventListener("DOMContentLoaded", () => {
  const copyInput = document.getElementById("copy-input");
  if (copyInput) {
    const copyButton = document.getElementById("copy-button");
    const copyText = document.getElementById("copy-text");
    const websiteInput = document.getElementById("website-input");

    copyButton.addEventListener("click", () => {
      navigator.clipboard.writeText(websiteInput.value).then(() => {
        copyText.textContent = "Copied";

        setTimeout(() => {
          copyText.textContent = "Copy";
        }, 2000);
      });
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("search-button");

  if (!searchInput || !searchButton) {
    return;
  }

  function focusSearchInput() {
    searchInput.focus();
  }

  searchButton.addEventListener("click", focusSearchInput);

  document.addEventListener("keydown", function (event) {
    if ((event.metaKey || event.ctrlKey) && event.key === "k") {
      event.preventDefault();
      focusSearchInput();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "/" && document.activeElement !== searchInput) {
      event.preventDefault();
      focusSearchInput();
    }
  });
});

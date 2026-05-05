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
  
  dashboardData: { kpis: {}, charts: {} },
  profileData: { id: '', nome: '', email: '', senha: '', perfil_acesso_id: '' },
  currentUser: {},
  notificacoes: [],
  unreadNotificacoes: 0,

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
    const token = localStorage.getItem('auth_token');
    if (!token) return;
    try {
      const response = await fetch('http://localhost:8000/api/notificacoes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        this.notificacoes = await response.json();
        this.unreadNotificacoes = this.notificacoes.filter(n => !n.lida).length;
      }
    } catch (e) {
      console.error('Erro ao buscar notificacoes', e);
    }
  },

  async fetchProfile() {
    const token = localStorage.getItem('auth_token');
    if (!token) return;
    try {
      const response = await fetch('http://localhost:8000/api/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        this.profileData.id = data.id;
        this.profileData.nome = data.nome;
        this.profileData.email = data.email;
        this.profileData.perfil_acesso_id = data.perfil_acesso_id;
        this.currentUser = data;
        localStorage.setItem('user', JSON.stringify(data));
      }
    } catch (e) {
      console.error('Erro ao buscar perfil', e);
    }
  },

  async updateProfile() {
    const token = localStorage.getItem('auth_token');
    const payload = {
      nome: this.profileData.nome,
      email: this.profileData.email,
      perfil_acesso_id: this.profileData.perfil_acesso_id
    };
    if (this.profileData.senha) {
      payload.senha = this.profileData.senha;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/usuarios/${this.profileData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        alert('Perfil atualizado com sucesso!');
        this.profileData.senha = '';
        this.currentUser.nome = this.profileData.nome;
        this.currentUser.email = this.profileData.email;
        localStorage.setItem('user', JSON.stringify(this.currentUser));
      } else {
        const errorData = await response.json();
        alert('Erro ao atualizar: ' + (errorData.message || 'Verifique os dados.'));
      }
    } catch (e) {
      console.error('Erro ao atualizar perfil', e);
      alert('Erro de conexão ao atualizar perfil.');
    }
  },
  
  formatNumber(value, decimals = 0) {
    if (value === undefined || value === null) return '0' + (decimals > 0 ? ',' + '0'.repeat(decimals) : '');
    const num = Number(value);
    if (isNaN(num)) return '0' + (decimals > 0 ? ',' + '0'.repeat(decimals) : '');
    return num.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  },

  async fetchDashboardData() {
    const token = localStorage.getItem('auth_token');
    if (!token && this.page !== 'login') {
        window.location.href = 'login.html';
        return;
    }

    const endpoints = {
      'overview': 'visao-geral',
      'estrategico': 'estrategico',
      'operacional': 'operacional',
      'financeiro': 'financeiro',
      'comercial': 'comercial',
      'clientes': 'clientes',
      'estoque': 'estoque'
    };
    const endpoint = endpoints[this.page];
    if (endpoint) {
      try {
        const response = await fetch(`http://localhost:8000/api/dashboard/${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if(response.ok) {
            this.dashboardData = await response.json();
            window.dispatchEvent(new CustomEvent('dashboardDataFetched', { detail: this.dashboardData }));
        } else if (response.status === 401) {
            localStorage.removeItem('auth_token');
            window.location.href = 'login.html';
        }
      } catch (e) {
        console.error("Erro ao conectar na API:", e);
      }
    }
  },

  async realizarLogin(email, senha) {
    try {
        const response = await fetch('http://localhost:8000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ email, senha })
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            alert('Login feito com sucesso!');
            window.location.href = 'index.html';
        } else {
            alert(data.message || 'Erro ao fazer login.');
        }
    } catch (error) {
        console.error('Erro na requisição', error);
        alert('Erro de conexão com o servidor.');
    }
  },

  async fazerLogout() {
      const token = localStorage.getItem('auth_token');
      if (token) {
          try {
              await fetch('http://localhost:8000/api/logout', {
                  method: 'POST',
                  headers: {
                      'Accept': 'application/json',
                      'Authorization': `Bearer ${token}`
                  }
              });
          } catch (e) {
              console.error('Erro ao fazer logout', e);
          }
      }
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = 'login.html';
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

    if (this.page !== 'login') {
      this.fetchNotificacoes();
      if (this.page === 'profile') {
        this.fetchProfile();
      } else {
        this.fetchDashboardData();
      }
    }
  },
});

Alpine.plugin(persist);
window.Alpine = Alpine;
Alpine.store("navigation", createNavigationStore());
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

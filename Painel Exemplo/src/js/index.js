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
  init() {
    const persistedDarkMode = localStorage.getItem("darkMode");

    this.darkMode = persistedDarkMode ? JSON.parse(persistedDarkMode) : false;
    this.$watch("darkMode", (value) => {
      localStorage.setItem("darkMode", JSON.stringify(value));
    });
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

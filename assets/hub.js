export const projects = [
  {
    id: "task-brief",
    name: "Digital Task Brief Maker",
    type: "Workflow",
    purpose: "Turn media plans into clear, creative-ready task briefs.",
    href: "./tools/digital-task-brief-maker/",
    external: false,
  },
  {
    id: "problem-wall",
    name: "Problem Wall Lab",
    type: "Strategy Lab",
    purpose: "Collect signals, score tensions, and shape stronger problems.",
    href: "https://agencythings-problem-wall.vercel.app",
    external: true,
  },
  {
    id: "gen-alpha",
    name: "Gen Alpha Intelligence Lab",
    type: "Living Research",
    purpose: "Map the media, behaviors, and cultural signals defining Gen Alpha.",
    href: "https://agencythings-gen-alpha.vercel.app",
    external: true,
  },
];

export function filterProjects(query = "") {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return projects;
  }

  return projects.filter((project) =>
    [project.name, project.type, project.purpose]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery),
  );
}

export function formatCurrentDate(date = new Date()) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function viewTargetSelector(view) {
  return view === "home" ? "#top" : `[data-view="${view}"]`;
}

export function getStoredValue(storage, key) {
  try {
    return storage?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

export function setStoredValue(storage, key, value) {
  try {
    storage?.setItem(key, value);
    return Boolean(storage);
  } catch {
    return false;
  }
}

export function activateView(view, root = document) {
  root.querySelectorAll("[data-nav-target]").forEach((control) => {
    const isActive = control.dataset.navTarget === view;
    control.classList.toggle("is-active", isActive);
    control.setAttribute("aria-current", isActive ? "page" : "false");
  });

  root.querySelectorAll("[data-view]").forEach((section) => {
    const isVisible = view === "home" || section.dataset.view === view;
    section.hidden = !isVisible;
  });
}

export function initHub(root = document) {
  const search = root.querySelector("[data-project-search]");
  const projectElements = Array.from(
    root.querySelectorAll("[data-project], [data-directory-project]"),
  );
  const emptyState = root.querySelector("[data-empty-state]");
  const currentDate = root.querySelector("[data-current-date]");

  if (currentDate) {
    currentDate.textContent = formatCurrentDate();
  }

  search?.addEventListener("input", () => {
    const visibleIds = new Set(filterProjects(search.value).map(({ id }) => id));

    projectElements.forEach((element) => {
      const projectId = element.dataset.project ?? element.dataset.directoryProject;
      element.hidden = !visibleIds.has(projectId);
    });

    if (emptyState) {
      emptyState.hidden = visibleIds.size !== 0;
    }
  });

  root.querySelectorAll("[data-nav-target]").forEach((control) => {
    control.addEventListener("click", () => {
      const target = control.dataset.navTarget;
      activateView(target, root);
      root.querySelector(viewTargetSelector(target))?.scrollIntoView({ behavior: "smooth" });
    });
  });

  root.addEventListener("keydown", (event) => {
    if (event.key === "/" && root.activeElement !== search) {
      event.preventDefault();
      search?.focus();
    }
  });

  root.querySelectorAll("[data-launch-project]").forEach((link) => {
    link.addEventListener("click", () => {
      setStoredValue(globalThis.localStorage, "agencythings:last-opened", link.dataset.launchProject);
    });
  });

  const lastOpened = getStoredValue(globalThis.localStorage, "agencythings:last-opened");
  if (lastOpened) {
    root.querySelector(`[data-project="${lastOpened}"]`)?.classList.add("was-recent");
  }
}

if (typeof document !== "undefined") {
  initHub();
}

export const PIPELINE_STAGES = [
  "Researching",
  "Ready to contact",
  "Outreach sent",
  "In conversation",
  "Confirmed",
];

export const partners = [
  {
    id: "adobe",
    name: "Adobe",
    category: "Creative technology",
    fit: "A practical session on how creative teams are changing their workflows with generative tools.",
    angle: "From blank canvas to useful first draft",
    contact: "Partnerships or enterprise creative lead",
    location: "New York / remote",
    signal: "Adobe MAX product and workflow announcements",
    searchQuery: "Adobe MAX creative workflow recent announcement partnership",
    tags: ["AI", "craft", "workflow"],
  },
  {
    id: "spotify",
    name: "Spotify Advertising",
    category: "Audio and culture",
    fit: "Show the agency how listening behavior can reveal audience moments that visual feeds miss.",
    angle: "What culture sounds like before it trends",
    contact: "Agency partnerships lead",
    location: "New York",
    signal: "Recent Spotify Culture Next and advertising research",
    searchQuery: "Spotify Culture Next advertising research recent",
    tags: ["culture", "audio", "insights"],
  },
  {
    id: "reddit",
    name: "Reddit",
    category: "Communities and research",
    fit: "Turn community conversations into a responsible source of early category tension and language.",
    angle: "Finding the question behind the search",
    contact: "Agency development or insights lead",
    location: "New York / remote",
    signal: "Reddit Pro and community intelligence updates",
    searchQuery: "Reddit Pro community intelligence recent announcement agencies",
    tags: ["community", "research", "strategy"],
  },
  {
    id: "pinterest",
    name: "Pinterest",
    category: "Visual discovery",
    fit: "Give teams a forward-looking method for spotting intent before a purchase or life moment.",
    angle: "Planning for what people are about to do",
    contact: "Agency partnerships or trends lead",
    location: "New York",
    signal: "Pinterest Predicts and seasonal behavior reports",
    searchQuery: "Pinterest Predicts recent report agency partnerships",
    tags: ["trends", "commerce", "visual"],
  },
  {
    id: "roblox",
    name: "Roblox",
    category: "Immersive platforms",
    fit: "Help the agency distinguish persistent participation from one-off virtual activations.",
    angle: "Designing for participation, not impressions",
    contact: "Brand partnerships lead",
    location: "New York / remote",
    signal: "New brand safety, commerce, and creator platform releases",
    searchQuery: "Roblox brand partnerships commerce recent announcement",
    tags: ["gaming", "community", "commerce"],
  },
  {
    id: "canva",
    name: "Canva",
    category: "Design collaboration",
    fit: "Explore how brand and agency teams can move faster without losing the logic of the system.",
    angle: "Speed without sameness",
    contact: "Enterprise partnerships lead",
    location: "New York / remote",
    signal: "Canva Create product and enterprise workflow launches",
    searchQuery: "Canva Create enterprise workflow recent announcement",
    tags: ["design", "workflow", "collaboration"],
  },
  {
    id: "nielsen",
    name: "Nielsen",
    category: "Audience measurement",
    fit: "Give planners a clearer mental model for cross-media measurement and its limitations.",
    angle: "What the dashboard can and cannot tell you",
    contact: "Agency solutions or thought leadership lead",
    location: "New York",
    signal: "Annual Marketing Report and cross-media measurement updates",
    searchQuery: "Nielsen Annual Marketing Report recent cross media measurement",
    tags: ["measurement", "media", "research"],
  },
  {
    id: "system1",
    name: "System1",
    category: "Creative effectiveness",
    fit: "Connect emotion, fluency, and distinctiveness to decisions creative teams can actually make.",
    angle: "The work people feel and remember",
    contact: "Agency partnerships or research lead",
    location: "New York / remote",
    signal: "Recent creative effectiveness studies and category reports",
    searchQuery: "System1 recent creative effectiveness study advertising",
    tags: ["effectiveness", "emotion", "research"],
  },
  {
    id: "tiktok",
    name: "TikTok for Business",
    category: "Entertainment and creators",
    fit: "Translate platform-native entertainment patterns into better briefs rather than copied aesthetics.",
    angle: "Briefing for entertainment, not interruption",
    contact: "Agency partnerships lead",
    location: "New York",
    signal: "What's Next trend reports and creator tooling updates",
    searchQuery: "TikTok What's Next report recent agency partnerships",
    tags: ["creators", "culture", "video"],
  },
  {
    id: "snap",
    name: "Snap Inc.",
    category: "AR and visual communication",
    fit: "Demonstrate where augmented reality adds utility, trial, or expression to a campaign idea.",
    angle: "When the camera becomes the interface",
    contact: "Agency AR partnerships lead",
    location: "New York",
    signal: "Lens Studio, AR commerce, and advertiser product updates",
    searchQuery: "Snap Lens Studio AR advertising recent announcement",
    tags: ["AR", "commerce", "craft"],
  },
  {
    id: "lego",
    name: "The LEGO Group",
    category: "Play and creativity",
    fit: "Bring a point of view on designing systems that invite imagination across ages and formats.",
    angle: "How constraints create more play",
    contact: "Brand experience or partnerships lead",
    location: "New York / remote",
    signal: "Recent play research, brand experiences, and creative partnerships",
    searchQuery: "LEGO recent play research creative partnership",
    tags: ["play", "design", "brand"],
  },
  {
    id: "duolingo",
    name: "Duolingo",
    category: "Social brand behavior",
    fit: "Unpack the operating model behind a distinctive social voice without reducing it to a mascot.",
    angle: "Building a brand people expect to hear from",
    contact: "Brand marketing or social lead",
    location: "New York / remote",
    signal: "Recent brand campaigns, product launches, and social experiments",
    searchQuery: "Duolingo recent brand campaign social strategy interview",
    tags: ["social", "brand", "community"],
  },
];

export const seedPipeline = [
  { id: "reddit", stage: "Researching", owner: "Joshua", note: "Find the agency partnership lead." },
  { id: "system1", stage: "Ready to contact", owner: "Joshua", note: "Use the emotion and memory angle." },
  { id: "spotify", stage: "Outreach sent", owner: "Joshua", note: "Follow up next Thursday." },
  { id: "canva", stage: "In conversation", owner: "Joshua", note: "Confirm which enterprise speaker is in New York." },
  { id: "nielsen", stage: "Confirmed", owner: "Joshua", note: "Measurement myths session." },
];

export const sessions = [
  { id: "session-1", date: "2026-04-16", partner: "Reddit", title: "Communities as an early signal", status: "completed" },
  { id: "session-2", date: "2026-05-21", partner: "Pinterest", title: "Planning for future intent", status: "completed" },
  { id: "session-3", date: "2026-06-25", partner: "System1", title: "Emotion, memory, and effectiveness", status: "completed" },
  { id: "session-4", date: "2026-08-13", partner: "Nielsen", title: "What measurement misses", status: "scheduled" },
  { id: "session-5", date: "2026-09-17", partner: "Canva", title: "Speed without sameness", status: "tentative" },
];

export const emailTemplates = [
  {
    id: "first-outreach",
    label: "First outreach",
    subject: "Lunch & Learn invitation: {{partner}} × AgencyThings",
    body: `Hi {{contact}},

I run a Lunch & Learn series for our agency team, built around practical ideas that make strategists and creatives better at the work.

I've been following {{signal}}, and I think {{angle}} would make a genuinely useful session for the group. Rather than a sales presentation, we'd love a 35-minute conversation with examples, followed by 15 minutes of questions.

Would someone from {{partner}} be open to joining us in the office or remotely this season? I can share a few date options and shape the brief around what your team is exploring now.

Best,
Joshua`,
  },
  {
    id: "follow-up",
    label: "Follow-up",
    subject: "Following up: {{partner}} Lunch & Learn",
    body: `Hi {{contact}},

Following up on the Lunch & Learn invitation below. The specific conversation I'd love to build with {{partner}} is “{{angle}}.” It feels timely because of {{signal}}, and it maps closely to questions our teams are working through now.

If you're not the right person, would you point me toward the partner, insights, or subject-matter lead who is?

Thanks,
Joshua`,
  },
  {
    id: "confirmation",
    label: "Confirmation",
    subject: "Confirmed: {{partner}} Lunch & Learn",
    body: `Hi {{contact}},

We're excited to confirm {{partner}} for an AgencyThings Lunch & Learn.

Working topic: {{angle}}
Format: 35-minute conversation + 15-minute Q&A
Audience: strategy, creative, media, and account teams
Location: our office, with a remote option available

I'll send the final calendar hold, arrival details, and a short speaker brief next. Please send the speaker name, title, headshot, and any links you'd like us to review in advance.

Best,
Joshua`,
  },
  {
    id: "internal-announcement",
    label: "Internal announcement",
    subject: "Next Lunch & Learn: {{partner}} on {{angle}}",
    body: `Team,

Our next Lunch & Learn is with {{partner}}: “{{angle}}.”

We'll get a practical look at {{fit}} Bring questions, examples, and a point of view—the final 15 minutes are open Q&A.

Add it to your calendar and come hungry.

—Joshua`,
  },
];

export function nextSuggestionBatch(sourcePartners, seenIds = [], batchSize = 3) {
  const knownIds = new Set(sourcePartners.map(({ id }) => id));
  const validSeen = seenIds.filter((id) => knownIds.has(id));
  let seen = new Set(validSeen);
  let didReset = false;
  let unseen = sourcePartners.filter(({ id }) => !seen.has(id));

  if (unseen.length === 0) {
    seen = new Set();
    unseen = [...sourcePartners];
    didReset = true;
  }

  const items = unseen.slice(0, Math.max(0, batchSize));
  items.forEach(({ id }) => seen.add(id));

  return { items, seenIds: [...seen], didReset };
}

export function movePipelinePartner(pipeline, partnerId, direction) {
  const step = Math.sign(Number(direction) || 0);

  return pipeline.map((record) => {
    if (record.id !== partnerId || step === 0) return { ...record };
    const currentIndex = Math.max(0, PIPELINE_STAGES.indexOf(record.stage));
    const nextIndex = Math.min(PIPELINE_STAGES.length - 1, Math.max(0, currentIndex + step));
    return { ...record, stage: PIPELINE_STAGES[nextIndex] };
  });
}

function dayNumber(value) {
  const date = typeof value === "string" ? new Date(`${value}T00:00:00Z`) : value;
  return Math.floor(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / 86_400_000);
}

export function calendarMetrics(sourceSessions, now = new Date()) {
  const today = dayNumber(now);
  const sorted = [...sourceSessions].sort((a, b) => a.date.localeCompare(b.date));
  const completed = sorted.filter((session) => session.status === "completed" && dayNumber(session.date) <= today);
  const upcoming = sorted.filter((session) => session.status !== "completed" && dayNumber(session.date) >= today);
  const lastSession = completed.at(-1) ?? null;
  const nextSession = upcoming[0] ?? null;

  return {
    lastSession,
    nextSession,
    daysSinceLast: lastSession ? today - dayNumber(lastSession.date) : null,
    daysUntilNext: nextSession ? dayNumber(nextSession.date) - today : null,
  };
}

export function filterPartners(sourcePartners, query = "") {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return sourcePartners;

  return sourcePartners.filter((partner) =>
    [partner.name, partner.category, partner.contact, partner.fit, partner.angle, ...(partner.tags ?? [])]
      .join(" ")
      .toLowerCase()
      .includes(normalized),
  );
}

export function researchUrl(partner) {
  const query = partner.searchQuery || `${partner.name} recent news partnership`;
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

const STORAGE_PREFIX = "agencythings:lunch-learn:";

function readStoredJson(key, fallback) {
  try {
    const value = globalThis.localStorage?.getItem(`${STORAGE_PREFIX}${key}`);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeStoredJson(key, value) {
  try {
    globalThis.localStorage?.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function partnerById(id) {
  return partners.find((partner) => partner.id === id);
}

function fillTemplate(template, partner, contact = "there") {
  const replacements = {
    partner: partner.name,
    contact: contact.trim() || "there",
    signal: partner.signal,
    angle: partner.angle,
    fit: partner.fit,
  };

  const replace = (text) =>
    Object.entries(replacements).reduce(
      (result, [key, value]) => result.replaceAll(`{{${key}}}`, value),
      text,
    );

  return { subject: replace(template.subject), body: replace(template.body) };
}

function formatSessionDate(date) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(
    new Date(`${date}T12:00:00`),
  );
}

function createSuggestionController(root) {
  const list = root.querySelector("[data-suggestion-list]");
  const template = root.querySelector("#suggestion-card-template");
  const status = root.querySelector("[data-suggestion-status]");
  const preference = root.querySelector("[data-preference-filter]");
  let seenIds = readStoredJson("seen-suggestions", []);
  let dismissedIds = readStoredJson("dismissed-partners", []);
  let lessTags = readStoredJson("less-tags", []);
  let pipeline = readStoredJson("pipeline", seedPipeline);

  function pool() {
    const selected = preference?.value ?? "all";
    const available = partners.filter(
      (partner) =>
        !dismissedIds.includes(partner.id) &&
        !partner.tags.some((tag) => lessTags.includes(tag)) &&
        (selected === "all" || partner.tags.includes(selected)),
    );
    return available.length ? available : partners.filter((partner) => !dismissedIds.includes(partner.id));
  }

  function addToPipeline(partner) {
    if (pipeline.some(({ id }) => id === partner.id)) {
      status.textContent = `${partner.name} is already in the outreach pipeline.`;
      return;
    }

    pipeline = [
      ...pipeline,
      { id: partner.id, stage: PIPELINE_STAGES[0], owner: "Joshua", note: `Develop the “${partner.angle}” angle.` },
    ];
    writeStoredJson("pipeline", pipeline);
    root.dispatchEvent(new CustomEvent("pipelinechange", { detail: pipeline }));
    status.textContent = `${partner.name} was added to Researching.`;
  }

  function applyFeedback(partner, type) {
    if (type === "dismiss") {
      dismissedIds = [...new Set([...dismissedIds, partner.id])];
      writeStoredJson("dismissed-partners", dismissedIds);
      status.textContent = `${partner.name} will not appear in this workspace again unless you reset it.`;
      showNext();
      return;
    }

    const tag = partner.tags[0];
    if (type === "less") {
      lessTags = [...new Set([...lessTags, tag])];
      writeStoredJson("less-tags", lessTags);
      status.textContent = `Showing fewer ${tag} partners from now on.`;
      showNext();
      return;
    }

    if ([...preference.options].some((option) => option.value === tag)) preference.value = tag;
    status.textContent = `Steering the next refresh toward ${tag}.`;
  }

  function render(items) {
    list.replaceChildren();
    if (!items.length) {
      const empty = document.createElement("p");
      empty.className = "empty-message";
      empty.textContent = "No unseen partners match this mix. Change the filter or refresh once more to restart the cycle.";
      list.append(empty);
      return;
    }

    items.forEach((partner) => {
      const card = template.content.firstElementChild.cloneNode(true);
      card.dataset.partnerId = partner.id;
      card.querySelector("[data-card-category]").textContent = partner.category;
      card.querySelector("[data-card-location]").textContent = partner.location;
      card.querySelector("[data-card-name]").textContent = partner.name;
      card.querySelector("[data-card-fit]").textContent = partner.fit;
      card.querySelector("[data-card-angle]").textContent = partner.angle;
      card.querySelector("[data-card-signal]").textContent = partner.signal;
      const research = card.querySelector("[data-research-link]");
      research.href = researchUrl(partner);
      research.setAttribute("aria-label", `Research recent ${partner.name} activity`);
      card.querySelector("[data-add-pipeline]").addEventListener("click", () => addToPipeline(partner));
      card.querySelectorAll("[data-feedback]").forEach((button) => {
        button.addEventListener("click", () => applyFeedback(partner, button.dataset.feedback));
      });
      list.append(card);
    });
  }

  function showNext() {
    const result = nextSuggestionBatch(pool(), seenIds, 3);
    seenIds = result.seenIds;
    writeStoredJson("seen-suggestions", seenIds);
    if (result.didReset) status.textContent = "You reached the end of the unseen pool, so the cycle has restarted.";
    render(result.items);
  }

  root.querySelector("[data-refresh-suggestions]")?.addEventListener("click", showNext);
  preference?.addEventListener("change", () => {
    status.textContent = preference.value === "all" ? "Showing the full partner mix." : `Focusing on ${preference.value}.`;
    showNext();
  });
  root.addEventListener("pipelinechange", (event) => {
    pipeline = event.detail;
  });
  showNext();
}

function createPipelineController(root) {
  const board = root.querySelector("[data-pipeline-board]");
  const template = root.querySelector("#pipeline-card-template");
  let pipeline = readStoredJson("pipeline", seedPipeline);

  function persist() {
    writeStoredJson("pipeline", pipeline);
    root.dispatchEvent(new CustomEvent("pipelinechange", { detail: pipeline }));
  }

  function render() {
    board.replaceChildren();

    PIPELINE_STAGES.forEach((stage) => {
      const column = document.createElement("section");
      column.className = "pipeline-column";
      const records = pipeline.filter((record) => record.stage === stage);
      column.innerHTML = `<header class="pipeline-column-header"><h2></h2><span></span></header><div class="pipeline-cards"></div>`;
      column.querySelector("h2").textContent = stage;
      column.querySelector(".pipeline-column-header span").textContent = records.length;
      const cards = column.querySelector(".pipeline-cards");

      records.forEach((record) => {
        const partner = partnerById(record.id);
        if (!partner) return;
        const card = template.content.firstElementChild.cloneNode(true);
        card.querySelector("[data-pipeline-name]").textContent = partner.name;
        card.querySelector("[data-pipeline-note]").textContent = record.note || partner.angle;
        card.querySelector("[data-pipeline-owner]").textContent = `Owner · ${record.owner || "Joshua"}`;
        card.querySelector("[data-move='previous']").disabled = stage === PIPELINE_STAGES[0];
        card.querySelector("[data-move='next']").disabled = stage === PIPELINE_STAGES.at(-1);
        card.querySelectorAll("[data-move]").forEach((button) => {
          button.addEventListener("click", () => {
            pipeline = movePipelinePartner(pipeline, record.id, button.dataset.move === "next" ? 1 : -1);
            persist();
            render();
          });
        });
        card.querySelector("[data-remove-pipeline]").addEventListener("click", () => {
          pipeline = pipeline.filter(({ id }) => id !== record.id);
          persist();
          render();
        });
        cards.append(card);
      });
      board.append(column);
    });
  }

  root.addEventListener("pipelinechange", (event) => {
    pipeline = event.detail;
    render();
  });
  render();
}

function createCalendarController(root) {
  const metrics = calendarMetrics(sessions);
  const today = new Date();
  let visibleMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthPanel = root.querySelector("[data-calendar-month-panel]");
  const completedPanel = root.querySelector("[data-calendar-completed-panel]");
  const grid = root.querySelector("[data-calendar-grid]");
  const title = root.querySelector("[data-calendar-title]");

  root.querySelector("[data-days-since]").textContent = metrics.daysSinceLast ?? "—";
  root.querySelector("[data-days-until]").textContent = metrics.daysUntilNext ?? "—";
  root.querySelector("[data-last-session]").textContent = metrics.lastSession
    ? `${metrics.lastSession.partner} · ${formatSessionDate(metrics.lastSession.date)}`
    : "No completed session";
  root.querySelector("[data-next-session]").textContent = metrics.nextSession
    ? `${metrics.nextSession.partner} · ${formatSessionDate(metrics.nextSession.date)}`
    : "No session scheduled";
  root.querySelector("[data-completed-count]").textContent = sessions.filter(
    ({ date, status }) => status === "completed" && date.startsWith(String(today.getFullYear())),
  ).length;

  function renderMonth() {
    title.textContent = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(visibleMonth);
    grid.replaceChildren();
    const first = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
    const start = new Date(first);
    start.setDate(first.getDate() - first.getDay());

    for (let index = 0; index < 42; index += 1) {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      const day = document.createElement("div");
      day.className = "calendar-day";
      if (date.getMonth() !== visibleMonth.getMonth()) day.classList.add("is-outside");
      const number = document.createElement("span");
      number.className = "calendar-day-number";
      number.textContent = date.getDate();
      day.append(number);
      sessions.filter((session) => session.date === iso).forEach((session) => {
        const event = document.createElement("span");
        event.className = `calendar-event${session.status === "completed" ? " is-completed" : ""}`;
        event.textContent = `${session.partner} · ${session.title}`;
        event.title = event.textContent;
        day.append(event);
      });
      grid.append(day);
    }
  }

  function renderCompleted() {
    completedPanel.replaceChildren();
    sessions
      .filter(({ status }) => status === "completed")
      .sort((a, b) => b.date.localeCompare(a.date))
      .forEach((session) => {
        const row = document.createElement("article");
        row.className = "completed-session";
        const time = document.createElement("time");
        time.dateTime = session.date;
        time.textContent = formatSessionDate(session.date);
        const titleWrap = document.createElement("div");
        const heading = document.createElement("h3");
        heading.textContent = session.title;
        const partner = document.createElement("span");
        partner.textContent = session.partner;
        titleWrap.append(heading, partner);
        const status = document.createElement("span");
        status.textContent = "Completed";
        row.append(time, titleWrap, status);
        completedPanel.append(row);
      });
  }

  root.querySelector("[data-calendar-previous]")?.addEventListener("click", () => {
    visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1);
    renderMonth();
  });
  root.querySelector("[data-calendar-next]")?.addEventListener("click", () => {
    visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1);
    renderMonth();
  });
  root.querySelectorAll("[data-calendar-view]").forEach((button) => {
    button.addEventListener("click", () => {
      root.querySelectorAll("[data-calendar-view]").forEach((control) =>
        control.classList.toggle("is-active", control === button),
      );
      const showCompleted = button.dataset.calendarView === "completed";
      monthPanel.hidden = showCompleted;
      completedPanel.hidden = !showCompleted;
    });
  });
  renderMonth();
  renderCompleted();
}

function createEmailController(root) {
  const partnerSelect = root.querySelector("[data-template-partner]");
  const toField = root.querySelector("[data-email-to]");
  const subject = root.querySelector("[data-email-subject]");
  const body = root.querySelector("[data-email-body]");
  const copyStatus = root.querySelector("[data-copy-status]");
  let activeTemplate = emailTemplates[0];

  partners.forEach((partner) => {
    const option = document.createElement("option");
    option.value = partner.id;
    option.textContent = partner.name;
    partnerSelect.append(option);
  });

  function render() {
    const partner = partnerById(partnerSelect.value) ?? partners[0];
    const email = fillTemplate(activeTemplate, partner, toField.value.split("@")[0]);
    subject.textContent = email.subject;
    body.textContent = email.body;
  }

  root.querySelectorAll("[data-template-id]").forEach((button) => {
    button.addEventListener("click", () => {
      activeTemplate = emailTemplates.find(({ id }) => id === button.dataset.templateId) ?? emailTemplates[0];
      root.querySelectorAll("[data-template-id]").forEach((control) =>
        control.classList.toggle("is-active", control === button),
      );
      render();
    });
  });
  partnerSelect.addEventListener("change", render);
  toField.addEventListener("input", render);
  root.querySelector("[data-copy-email]")?.addEventListener("click", async () => {
    const text = `To: ${toField.value}\nSubject: ${subject.textContent}\n\n${body.textContent}`;
    try {
      await navigator.clipboard.writeText(text);
      copyStatus.textContent = "Copied. Paste it into your email client.";
    } catch {
      copyStatus.textContent = "Clipboard access is blocked. Select the email text and copy it manually.";
    }
  });
  render();
}

function createDirectoryController(root) {
  const list = root.querySelector("[data-directory-list]");
  const search = root.querySelector("[data-directory-search]");

  function addToPipeline(partner) {
    const pipeline = readStoredJson("pipeline", seedPipeline);
    if (pipeline.some(({ id }) => id === partner.id)) return;
    const next = [
      ...pipeline,
      { id: partner.id, stage: PIPELINE_STAGES[0], owner: "Joshua", note: `Develop the “${partner.angle}” angle.` },
    ];
    writeStoredJson("pipeline", next);
    root.dispatchEvent(new CustomEvent("pipelinechange", { detail: next }));
  }

  function render(query = "") {
    list.replaceChildren();
    const matches = filterPartners(partners, query);
    if (!matches.length) {
      const empty = document.createElement("p");
      empty.className = "empty-message";
      empty.textContent = "No partners match that search.";
      list.append(empty);
      return;
    }

    matches.forEach((partner) => {
      const row = document.createElement("article");
      row.className = "directory-row";
      const identity = document.createElement("div");
      const name = document.createElement("h2");
      name.textContent = partner.name;
      const category = document.createElement("span");
      category.textContent = partner.category;
      identity.append(name, category);
      const contact = document.createElement("p");
      contact.textContent = partner.contact;
      const angle = document.createElement("p");
      angle.textContent = partner.angle;
      const actions = document.createElement("div");
      actions.className = "directory-actions";
      const research = document.createElement("a");
      research.className = "research-link";
      research.href = researchUrl(partner);
      research.target = "_blank";
      research.rel = "noreferrer";
      research.textContent = "Research ↗";
      const add = document.createElement("button");
      add.className = "small-button";
      add.type = "button";
      add.textContent = "Add to pipeline";
      add.addEventListener("click", () => addToPipeline(partner));
      actions.append(research, add);
      row.append(identity, contact, angle, actions);
      list.append(row);
    });
  }

  search?.addEventListener("input", () => render(search.value));
  render();
}

export function initPartnerDesk(root = document) {
  const storedView = readStoredJson("active-view", "suggestions");

  function showView(view) {
    root.querySelectorAll("[data-view-button]").forEach((button) => {
      const active = button.dataset.viewButton === view;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-current", active ? "page" : "false");
    });
    root.querySelectorAll("[data-view-panel]").forEach((panel) => {
      panel.hidden = panel.dataset.viewPanel !== view;
    });
    writeStoredJson("active-view", view);
    root.querySelector(".workspace-main")?.scrollTo({ top: 0, behavior: "smooth" });
  }

  root.querySelectorAll("[data-view-button]").forEach((button) => {
    button.addEventListener("click", () => showView(button.dataset.viewButton));
  });
  root.querySelector("[data-reset-workspace]")?.addEventListener("click", () => {
    if (!globalThis.confirm("Reset Partner Desk demo data and preferences?")) return;
    try {
      Object.keys(globalThis.localStorage)
        .filter((key) => key.startsWith(STORAGE_PREFIX))
        .forEach((key) => globalThis.localStorage.removeItem(key));
    } catch {
      // The workspace remains usable when storage is unavailable.
    }
    globalThis.location.reload();
  });

  createSuggestionController(root);
  createPipelineController(root);
  createCalendarController(root);
  createEmailController(root);
  createDirectoryController(root);
  showView(storedView);
}

if (typeof document !== "undefined") initPartnerDesk();

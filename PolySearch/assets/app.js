"use strict";
const $ = (s) => document.querySelector(s);
const escapeHTML = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const families = [
  {
    name: "Paper Understanding",
    sub: "Current · QASPER",
    status: "In the frozen pilot",
    text: "Extract datasets and metrics, explain methods and architectures, locate evidence, and interpret results or ablations.",
    example:
      "Identify the evaluated systems and explain how their components combine.",
    source: "QASPER",
    dims: ["Correctness", "Attribution", "Grounding", "Format"],
    zh: "从论文中提取并解释信息，同时区分实验结果与背景描述。",
  },
  {
    name: "Citation / Evidence Grounding",
    sub: "Current · SciFact",
    status: "In the frozen pilot",
    text: "Verify scientific claims, identify supporting or refuting evidence, obey source restrictions and abstain when evidence is insufficient.",
    example:
      "Does the supplied evidence support the claim? Cite precise source locations.",
    source: "SciFact",
    dims: ["Entailment", "Citation validity", "Abstention", "Source-only"],
    zh: "正确的结论与有效的证据缺一不可；证据不足时应明确保留判断。",
  },
  {
    name: "Multi-Paper Synthesis",
    sub: "Proposed · ScholarQABench",
    status: "Proposed for later experiments",
    text: "Compare papers, attribute findings, identify agreement and disagreement, and distinguish reported findings from speculation.",
    example:
      "Compare the evidence for two approaches and attribute each conclusion to its source.",
    source: "ScholarQABench / OpenScholar — candidate",
    dims: ["Synthesis", "Source attribution", "Coverage", "Uncertainty"],
    zh: "跨论文综合需要保持出处可追溯，不能把推测写成共同结论。",
  },
  {
    name: "Literature Discovery",
    sub: "Planned · live case study",
    status: "Planned; not executed",
    text: "Find recent literature under explicit constraints, check publication metadata and preserve source traceability.",
    example:
      "Find recent studies meeting a specified method and publication-date constraint.",
    source: "Future live third-party case study; no frozen benchmark yet",
    dims: ["Relevance", "Metadata accuracy", "Recency", "Traceability"],
    zh: "检索结果不仅需要相关，还需要满足约束并可核查来源。",
  },
];
function showFamily(i) {
  const f = families[i];
  $(".task-tabs").innerHTML = families
    .map(
      (x, j) =>
        `<button role="tab" id="family-${j}" aria-selected="${j === i}" tabindex="${j === i ? 0 : -1}" aria-controls="task-panel" data-family="${j}"><b>${"ABCD"[j]}</b>${x.name}<small>${x.sub}</small></button>`,
    )
    .join("");
  $("#task-panel").setAttribute("aria-labelledby", `family-${i}`);
  $("#task-panel").innerHTML =
    `<span class="tag ${i > 1 ? "purple" : ""}">${f.status}</span><h3>${f.name}</h3><p>${f.text}</p><p class="example">${f.example}</p><p lang="zh">${f.zh}</p><div class="chips">${f.dims.map((x) => `<span>${x}</span>`).join("")}</div><p class="micro">Source: ${f.source}</p>`;
  document.querySelectorAll("[data-family]").forEach((b) => {
    b.onclick = () => showFamily(Number(b.dataset.family));
    b.onkeydown = (e) => {
      if (
        [
          "ArrowDown",
          "ArrowUp",
          "ArrowLeft",
          "ArrowRight",
          "Home",
          "End",
        ].includes(e.key)
      ) {
        e.preventDefault();
        const n =
          e.key === "Home"
            ? 0
            : e.key === "End"
              ? 3
              : (i + (["ArrowDown", "ArrowRight"].includes(e.key) ? 1 : 3)) % 4;
        showFamily(n);
        $(`#family-${n}`).focus();
      }
    };
  });
}
showFamily(0);
const benchmarks = [
  [
    "QASPER",
    "2021 · research-paper question answering",
    "Answers with supporting evidence passages, including unanswerable cases.",
    "Two paper packets and question-derived PU tasks; task-level atomic rubric.",
    "Dataset-derived paper text does not reproduce all publisher layouts; hosted interfaces need equivalent ingestion.",
    "https://arxiv.org/abs/2105.03011",
    "https://huggingface.co/datasets/allenai/qasper",
    "Used in pilot",
  ],
  [
    "SciFact",
    "2020 · scientific claim verification",
    "Claim labels and evidence-sentence rationales linked to abstracts.",
    "Abstract packets and claim-derived grounding/abstention tasks.",
    "Abstract-only evidence limits scope; corpus retrieval and supplied-source verification are different conditions.",
    "https://arxiv.org/abs/2004.14974",
    "https://github.com/allenai/scifact",
    "Used in pilot",
  ],
  [
    "ScholarQABench / OpenScholar",
    "2024 preprint · literature synthesis",
    "Expert-written long-form answers and reference rubrics.",
    "Candidate for future multi-paper synthesis; not executed.",
    "Open retrieval, changing corpora and reference dates complicate like-for-like third-party comparison.",
    "https://arxiv.org/abs/2411.14199",
    "https://github.com/AkariAsai/ScholarQABench",
    "Future candidate",
  ],
  [
    "LitQA2 / PaperQA2",
    "2024 preprint · literature-grounded QA",
    "Multiple-choice questions with answer keys and relevant literature.",
    "Candidate for difficult evidence-seeking tasks; not executed.",
    "Paper access and retrieval setup must be controlled; multiple-choice accuracy alone misses citation quality.",
    "https://arxiv.org/abs/2409.13740",
    "https://github.com/Future-House/LitQA",
    "Future candidate",
  ],
  [
    "AgentSearchBench",
    "2026 preprint · AI agent search",
    "Task queries, an agent corpus and released execution evidence support evaluation.",
    "Related agent-selection methodology; no pilot tasks reused.",
    "Agent-platform search settings do not establish performance for arbitrary academic web tools.",
    "https://arxiv.org/abs/2604.22436",
    "https://github.com/Bingo-W/AgentSearchBench",
    "Related benchmark",
  ],
  [
    "ToolRet",
    "ACL 2025 · tool retrieval",
    "Retrieval tasks linked to relevant tools in a heterogeneous tool corpus.",
    "Description-retrieval baseline perspective; no pilot tasks reused.",
    "Relevant tool documentation does not by itself establish live task execution quality.",
    "https://arxiv.org/abs/2503.01763",
    "https://github.com/mangopy/tool-retrieval-benchmark",
    "Related benchmark",
  ],
];
$("#benchmark-list").innerHTML = benchmarks
  .map(
    (b) =>
      `<details><summary>${b[0]}<span>${b[1]} · ${b[7]}</span></summary><p><strong>Reference structure.</strong> ${b[2]}</p><p><strong>PolySearch use.</strong> ${b[3]}</p><p><strong>Transfer limit.</strong> ${b[4]}</p><a href="${b[5]}" target="_blank" rel="noopener noreferrer">Paper ↗</a><a href="${b[6]}" target="_blank" rel="noopener noreferrer">Official data / repository ↗</a></details>`,
  )
  .join("");
const tools = [
  {
    name: "ChatPDF",
    url: "https://www.chatpdf.com/",
    type: "Hosted document chat",
    status: "pilot",
    workflow: "Paper understanding and PDF-grounded questions.",
    input: "PDF upload observed in pilot.",
    citations: "Explicit source locators observed; PDF citations documented.",
    interface: "Web · anonymous/free · Fast in pilot",
    limit:
      "Daily two-chat limit blocked both PU attempts in this run; not a semantic failure.",
  },
  {
    name: "SciSpace",
    url: "https://scispace.com/",
    type: "Hosted research assistant",
    status: "pilot",
    workflow: "Paper questions and evidence inspection.",
    input: "PDF upload observed in pilot.",
    citations: "Native source panels captured and mapped to supplied evidence.",
    interface: "Web · Basic free · High Quality off in pilot",
    limit:
      "CG complete-output JSON contracts failed; substantive answers were correct under preliminary review.",
  },
  {
    name: "Elicit",
    url: "https://elicit.com/",
    type: "Hosted research workflow",
    status: "candidate",
    workflow: "Literature search, extraction and research synthesis.",
    input: "Research papers; upload workflow not independently verified here.",
    citations: "Evidence-linked research workflow documented.",
    interface: "Web; current access/tier untested",
    limit:
      "Candidate only. Source equivalence, quota and capture readiness need verification.",
  },
  {
    name: "PaperQA2",
    url: "https://github.com/Future-House/paper-qa",
    type: "Self-hosted software",
    status: "candidate",
    workflow: "Retrieval-augmented scientific document QA.",
    input: "Local documents and configured retrieval sources.",
    citations: "Citation-bearing answers documented in official repository.",
    interface: "Python software / configured model APIs",
    limit:
      "Not a hosted third-party website. Setup, corpus, model choice and costs need separate controls.",
  },
  {
    name: "Consensus",
    url: "https://consensus.app/",
    docs: "https://help.consensus.app/en/collections/10600168-explore-features",
    type: "Hosted scientific search",
    status: "candidate",
    workflow: "Search literature and inspect cited evidence.",
    input: "Research queries; document upload described in help center.",
    citations: "Citations and analysis documented.",
    interface: "Web; current access/tier untested",
    limit:
      "Candidate only. Search-corpus access may differ from supplied-source conditions.",
  },
  {
    name: "Perplexity",
    url: "https://www.perplexity.ai/",
    docs: "https://www.perplexity.ai/help-center/en/articles/10354807-file-uploads",
    type: "Hosted answer search",
    status: "candidate",
    workflow: "Literature discovery and document-assisted inquiry.",
    input: "Queries and file attachments documented.",
    citations: "Cited web-search workflow; source-only compliance untested.",
    interface: "Web; current access/tier untested",
    limit:
      "Candidate only. Open-web retrieval is not equivalent to frozen-source reasoning.",
  },
  {
    name: "Undermind",
    url: "https://www.undermind.ai/",
    type: "Hosted literature discovery",
    status: "candidate",
    workflow: "In-depth search for relevant scientific papers.",
    input: "Research query; supplied-PDF support unverified here.",
    citations: "Paper-linked discovery workflow documented.",
    interface: "Web; current access/tier untested",
    limit:
      "Candidate only. Search latency, coverage and stable capture remain unmeasured.",
  },
  {
    name: "Scite",
    url: "https://scite.ai/",
    type: "Hosted citation research",
    status: "candidate",
    workflow: "Inspect citation context and supporting/contrasting evidence.",
    input:
      "Research query and indexed literature; upload support unverified here.",
    citations: "Smart Citations and literature-grounded assistant documented.",
    interface: "Web; current access/tier untested",
    limit:
      "Candidate only. Citation intent is distinct from factual correctness on our tasks.",
  },
];
function showTools(filter) {
  $("#tool-list").innerHTML = tools
    .filter((t) => filter === "all" || t.status === filter)
    .map(
      (t) =>
        `<article class="tool-card"><span class="tag ${t.status === "pilot" ? "" : "neutral"}">${t.status === "pilot" ? "Evaluated in pilot" : "Future candidate"}</span><h3>${t.name}</h3><span class="tool-type">${t.type}</span><p>${t.workflow}</p><a href="${t.url}" target="_blank" rel="noopener noreferrer">Official ${t.name === "PaperQA2" ? "repository" : "website"} ↗</a><details><summary>Evidence & experimental scope</summary><dl><dt>Source input</dt><dd>${t.input}</dd><dt>Citations / grounding</dt><dd>${t.citations}</dd><dt>Interface</dt><dd>${t.interface}</dd><dt>Limitation</dt><dd>${t.limit}</dd></dl>${t.docs ? `<a href="${t.docs}" target="_blank" rel="noopener noreferrer">Official documentation ↗</a>` : ""}<p class="micro">Documentation reviewed October 10, 2026. Descriptions are not evaluation results.</p></details></article>`,
    )
    .join("");
}
showTools("all");
document.querySelectorAll("[data-tool-filter]").forEach(
  (b) =>
    (b.onclick = () => {
      document.querySelectorAll("[data-tool-filter]").forEach((x) => {
        x.classList.toggle("active", x === b);
        x.setAttribute("aria-pressed", String(x === b));
      });
      showTools(b.dataset.toolFilter);
    }),
);
$("#menu").onclick = () => {
  const open = $("#menu").getAttribute("aria-expanded") !== "true";
  $("#menu").setAttribute("aria-expanded", String(open));
  $("#navigation").classList.toggle("open", open);
};
document.querySelectorAll("#navigation a").forEach(
  (a) =>
    (a.onclick = () => {
      $("#menu").setAttribute("aria-expanded", "false");
      $("#navigation").classList.remove("open");
    }),
);
const names = { "chatpdf:web": "ChatPDF", "scispace:web": "SciSpace" };
const statuses = {
  passed: ["✓", "Criteria passed"],
  contract: ["△", "Contract failed"],
  blocked: ["⊘", "Quota blocked"],
};
const value = (v) => (v === 1 ? "Pass" : v === 0 ? "Fail" : "Not evaluated");
function bar(label, n, total, color = "", note = "") {
  return `<div class="chart-row"><div class="labels"><span>${label}</span><strong>${n} / ${total}</strong></div><div class="bar-track" role="img" aria-label="${label}: ${n} of ${total}"><div class="bar-fill ${color}" style="width:${total ? (100 * n) / total : 0}%"></div></div>${note ? `<small>${note}</small>` : ""}</div>`;
}
let dataset;
function renderDimension() {
  const dimension = $("#dimension").value;
  $("#dimension-chart").innerHTML = Object.entries(names)
    .map(([id, name]) => {
      const rows = dataset.observations.filter((r) => r.tool === id);
      const scored = rows.filter(
        (r) => typeof r.dimensions[dimension] === "number",
      );
      const n = scored.filter((r) => r.dimensions[dimension] === 1).length;
      return bar(
        name,
        n,
        scored.length,
        "",
        `${scored.length} applicable observed outputs; ${rows.filter((r) => r.status === "blocked").length} access-blocked. ${dimension === "semantic_abstention" ? "Other tasks are not applicable." : ""}`,
      );
    })
    .join("");
}
function selectObservation(id, focus = false) {
  const r = dataset.observations.find((r) => r.id === id);
  document
    .querySelectorAll("[data-observation]")
    .forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.observation === id)),
    );
  const d = r.dimensions;
  const received = r.operational === "output_received";
  $("#detail").innerHTML =
    `<div class="detail-top"><span class="small-label">${names[r.tool]} WEB · ${r.task}</span><span class="${r.status}">${statuses[r.status][0]} ${statuses[r.status][1]}</span></div><h3>${r.task.startsWith("PU") ? "Paper understanding" : "Citation / evidence grounding"}</h3><p>Executed ${new Date(r.date).toISOString().replace("T", " ").replace(".000Z", " UTC").replace("Z", " UTC")}</p><dl><div><dt>Operational outcome</dt><dd>${received ? "Complete answer captured" : "Daily quota/access block"}</dd></div><div><dt>Semantic correctness</dt><dd>${value(d.factual_correctness)}</dd></div><div><dt>Grounding / citation validity</dt><dd>${value(d.grounding_citation_validity)}</dd></div><div><dt>Instruction / format</dt><dd>${value(d.instruction_format)}</dd></div><div><dt>Substantive abstention</dt><dd>${d.semantic_abstention === null ? (received ? "Not applicable" : "Not evaluated") : value(d.semantic_abstention)}</dd></div><div><dt>Outside-source assertions</dt><dd>${d.outside_source_assertions_present === null ? "Not evaluated" : d.outside_source_assertions_present ? "Observed" : "None observed; hidden retrieval unknown"}</dd></div></dl>${r.task === "CG-2" && r.tool === "scispace:web" ? '<p class="callout">Substantive abstention passed. The literal label + empty-list atom failed with the JSON contract. This is not evidence of background-knowledge leakage.</p>' : ""}<h4>Atomic outcomes · unchanged rubric</h4>${r.atoms.map((a) => `<div class="atom-row"><span>${escapeHTML(a.name)}</span><strong class="${a.score === 1 ? "passed" : a.score === 0 ? "contract" : "pending"}">${a.score === null ? "— Not evaluated" : a.score + " · " + value(a.score)}</strong></div>`).join("")}<p class="micro">Atoms differ across tasks and must not be treated as a global tool score. Gold criteria and private grading rationales are withheld.</p><div class="unavailable"><strong>Screenshot and output excerpt unavailable for public display.</strong><br>${escapeHTML(r.evidence_notice)}</div><details><summary>Provenance, effort & timing</summary><h4>Immutable raw-record SHA-256</h4><div class="hash">${escapeHTML(r.raw_sha256)}</div><p>${escapeHTML(r.effort)}</p><p>${escapeHTML(r.timing_note)}</p><p>${escapeHTML(dataset.review_status)}</p><a href="data/provenance.json">Export provenance ↗</a></details>`;
  if (focus) {
    $("#detail").focus({ preventScroll: true });
    if (matchMedia("(max-width:760px)").matches)
      $("#detail").scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
async function init() {
  try {
    const response = await fetch("data/pilot-results.json");
    if (!response.ok) throw Error("Public evidence data unavailable");
    dataset = await response.json();
    const c = dataset.counts;
    $("#snapshot-date").textContent =
      "Verified as of " +
      new Date(dataset.as_of).toISOString().slice(0, 10) +
      " · static export";
    $("#review-status").textContent = dataset.review_status;
    $("#pilot-stats").innerHTML = [
      [c.attempts, "Attempted executions"],
      [c.answers, "Answers captured"],
      [c.quota_blocks, "Quota / access blocks"],
      [c.contract_failures, "Output-contract failures"],
    ]
      .map(
        ([n, l]) =>
          `<div class="stat"><strong>${n.toString().padStart(2, "0")}</strong><span>${l}</span></div>`,
      )
      .join("");
    $("#status-chart").innerHTML =
      bar("Answer received", c.answers, c.attempts) +
      bar("Quota / access blocked", c.quota_blocks, c.attempts, "amber") +
      bar(
        "Other operational outcomes",
        c.attempts - c.answers - c.quota_blocks,
        c.attempts,
      );
    renderDimension();
    $("#dimension").onchange = renderDimension;
    const taskids = ["PU-1", "PU-2", "CG-1", "CG-2"];
    $("#matrix").innerHTML =
      `<table aria-label="Pilot tool by task observations"><thead><tr><th scope="col">Tool / task</th>${taskids.map((t) => `<th scope="col">${t}</th>`).join("")}</tr></thead><tbody>${Object.entries(
        names,
      )
        .map(
          ([id, name]) =>
            `<tr><th scope="row">${name}</th>${taskids
              .map((t) => {
                const r = dataset.observations.find(
                  (r) => r.tool === id && r.task === t,
                );
                return `<td><button class="${r.status}" aria-label="${name} ${t}: ${statuses[r.status][1]}. Inspect evidence" aria-pressed="false" data-observation="${r.id}"><b aria-hidden="true">${statuses[r.status][0]}</b>${statuses[r.status][1]}</button></td>`;
              })
              .join("")}</tr>`,
        )
        .join("")}</tbody></table>`;
    document
      .querySelectorAll("[data-observation]")
      .forEach(
        (b) =>
          (b.onclick = () => selectObservation(b.dataset.observation, true)),
      );
    selectObservation("scispace-CG-2");
    const rep = dataset.replication;
    $("#replication-count").textContent =
      `${rep.executed} / ${rep.planned} recorded`;
    $("#replication-progress").max = rep.planned;
    $("#replication-progress").value = rep.executed;
    $("#replication-note").textContent = rep.note;
    $("#schedule").innerHTML = rep.days
      .map(
        (day) =>
          `<article><span class="small-label">REPETITION ${day.repetition}</span><h4>${day.date}</h4><p>${day.tasks.join(" → ")}</p><span class="tag neutral">○ Not executed</span><br><small>16:00 · New York</small></article>`,
      )
      .join("");
  } catch (error) {
    $("#review-status").textContent =
      "Evidence unavailable: the verified data file could not be loaded. No results are inferred.";
    $("#snapshot-date").textContent = "Data load failed";
    console.error(error);
  }
}
init();

(() => {
  "use strict";

  // ========== Constants / Data (no personal data persistence) ==========
  const SCALE_LABELS = [
    "전혀 그렇지 않다",
    "그렇지 않은 편이다",
    "보통이다",
    "그런 편이다",
    "매우 그렇다",
  ];

  // 5-bin mapping (matches your LDP bins)
  const BINS = [
    { min: 1.0, max: 1.8, label: "고요 충전형", emoji: "🌿", short: "고요" },
    { min: 1.8, max: 2.6, label: "선택적 교류형", emoji: "☁️", short: "선택" },
    { min: 2.6, max: 3.4, label: "균형 교류형", emoji: "⚖️", short: "균형" },
    { min: 3.4, max: 4.2, label: "활력 확장형", emoji: "✨", short: "활력" },
    { min: 4.2, max: 5.0, label: "강한 파동형", emoji: "🔥", short: "파동" },
  ];

  const TESTS = [
    {
      id: "social",
      title: "사회적 에너지",
      subtitle: "사람과 함께 있을 때의 흐름",
      tag: "대인 에너지",
      introLines: [
        "사람 사이에서 에너지가 어떻게 흐르는지 살펴봐요.",
        "좋고 나쁨이 아니라, ‘당신에게 편한 방향’을 찾는 과정이에요.",
      ],
      // 8 items, include reverse-coded (rev: true)
      items: [
        { t: "낯선 자리에서도 비교적 빨리 편해진다." },
        { t: "여럿이 모인 자리에서 에너지가 차오르는 편이다." },
        { t: "혼자 있는 시간이 길어지면 오히려 답답해진다." },
        { t: "사람을 만나고 나면 종종 기운이 빠진다.", rev: true },
        { t: "대화가 길어져도 집중이 유지되는 편이다." },
        { t: "약속이 잦아지면 피로가 빠르게 쌓인다.", rev: true },
        { t: "친한 사람과 함께 있을 때 편안함이 커진다." },
        { t: "사람 많은 환경은 오래 머물기 어렵다.", rev: true },
      ],
      result: {
        short2: [
          "사회적 에너지의 흐름이 어떤 방향인지 보여줘요.",
          "상황에 따라 ‘회복 방식’이 달라질 수 있어요.",
        ],
        moreTitle: "자세히 보기",
        moreBody: [
          "점수가 높다고 ‘사교적’이라 단정할 수는 없어요. 다만, 사람과의 접촉에서 에너지가 덜 소모되거나 오히려 채워지는 경향을 의미할 수 있어요.",
          "점수가 낮다면 혼자 있는 시간이 회복에 더 도움이 될 수 있어요. 이는 ‘대인관계 능력’과는 별개의 흐름이에요.",
          "당신에게 편한 리듬을 찾는 것이 핵심이에요.",
        ],
      },
    },
    {
      id: "recovery",
      title: "감정 회복 속도",
      subtitle: "감정이 지나간 뒤 돌아오는 속도",
      tag: "회복 리듬",
      introLines: [
        "감정이 흔들린 뒤, 다시 중심으로 돌아오는 흐름을 봐요.",
        "진단이 아니라 ‘회복 방향’을 가늠하는 참고예요.",
      ],
      items: [
        { t: "기분이 흔들려도 비교적 금방 안정된다." },
        { t: "하루 중 감정 기복이 오래 남는 편이다.", rev: true },
        { t: "기분 전환을 위해 스스로 할 수 있는 방법이 있다." },
        { t: "작은 일도 오래 곱씹는 편이다.", rev: true },
        { t: "스트레스가 와도 금방 일상 루틴을 되찾는다." },
        { t: "감정이 가라앉기까지 시간이 꽤 걸린다.", rev: true },
        { t: "잠을 자고 나면 마음이 한결 가벼워지는 편이다." },
        { t: "마음이 복잡하면 하루 종일 영향을 받는다.", rev: true },
      ],
      result: {
        short2: [
          "회복 속도는 ‘성격’이 아니라 ‘패턴’일 수 있어요.",
          "지금의 컨디션도 결과에 영향을 줄 수 있어요.",
        ],
        moreTitle: "자세히 보기",
        moreBody: [
          "점수가 높다면 흔들림 이후 안정으로 돌아오는 시간이 상대적으로 짧을 수 있어요.",
          "점수가 낮다면 감정이 머무는 시간이 길 수 있어요. 이는 나쁜 것이 아니라, ‘정리 방식’이 깊은 흐름일 수도 있어요.",
          "회복을 돕는 루틴(수면·운동·정리·대화)을 찾는 것이 중요해요.",
        ],
      },
    },
    {
      id: "fatigue",
      title: "인간관계 피로도",
      subtitle: "관계에서 소모되는 정도",
      tag: "관계 소모",
      introLines: [
        "관계가 당신의 에너지를 얼마나 쓰게 하는지 확인해요.",
        "우열이 아니라 ‘경계선’과 ‘회복 방식’을 찾는 과정이에요.",
      ],
      items: [
        { t: "부탁을 거절하는 게 어렵다." },
        { t: "상대 기분을 먼저 살피느라 지친다." },
        { t: "관계에서 적당한 거리를 유지하기 쉽다.", rev: true },
        { t: "연락/메시지에 부담을 느끼는 편이다." },
        { t: "사람을 만나고 나면 혼자만의 시간이 꼭 필요하다." },
        { t: "갈등 상황을 피하려고 많이 참는 편이다." },
        { t: "내 속도를 지키며 관계를 이어갈 수 있다.", rev: true },
        { t: "관계가 많아질수록 피로가 크게 늘어난다." },
      ],
      result: {
        short2: [
          "관계 피로는 ‘나쁨’이 아니라 ‘소모 방식’을 보여줘요.",
          "당신에게 맞는 거리감이 있을 수 있어요.",
        ],
        moreTitle: "자세히 보기",
        moreBody: [
          "점수가 높다면 관계에서 에너지가 많이 소모될 수 있어요. 특히 경계가 흐려지거나 ‘배려 과부하’가 올 때 피로가 커질 수 있어요.",
          "점수가 낮다면 관계를 유지하는 데 드는 비용이 상대적으로 낮을 수 있어요. 다만 상황에 따라 달라질 수 있어요.",
          "피로를 줄이는 핵심은 ‘거리·빈도·회복 시간’을 조절하는 거예요.",
        ],
      },
    },
  ];

  // ========== State (memory only; no localStorage/sessionStorage) ==========
  const state = {
    route: "home",
    currentTest: null, // TESTS index
    answers: {}, // { testId: number[] }
    results: {}, // { testId: {score, bin, ...} }
    expanded: {}, // expand toggles per testId
  };

  // ========== Helpers ==========
  const $ = (sel, root = document) => root.querySelector(sel);

  function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
  }

  function mean(arr) {
    if (!arr || !arr.length) return 0;
    return arr.reduce((s, x) => s + x, 0) / arr.length;
  }

  function binForScore(score) {
    const s = clamp(score, 1, 5);
    for (const b of BINS) {
      if (s >= b.min && s <= b.max) return b;
    }
    return BINS[BINS.length - 1];
  }

  function toast(msg) {
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = msg;
    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add("show"));
    setTimeout(() => {
      el.classList.remove("show");
      setTimeout(() => el.remove(), 250);
    }, 2200);
  }

  // ========== Routing ==========
  function go(route, payload = {}) {
    state.route = route;
    state.routePayload = payload;
    render();
  }

  // ========== Render ==========
  function render() {
    const app = $("#app");
    if (!app) return;

    if (state.route === "home") {
      app.innerHTML = homeView();
      wireHome();
      return;
    }
    if (state.route === "trust") {
      app.innerHTML = trustView();
      wireTrust();
      return;
    }
    if (state.route === "test") {
      app.innerHTML = testView(state.routePayload.testId);
      wireTest(state.routePayload.testId);
      return;
    }
    if (state.route === "result") {
      app.innerHTML = resultView(state.routePayload.testId);
      wireResult(state.routePayload.testId);
      return;
    }
    if (state.route === "profile") {
      app.innerHTML = profileView();
      wireProfile();
      return;
    }
    // fallback
    go("home");
  }

  function homeView() {
    return `
      <section class="hero">
        <div class="heroCard">
          <div class="heroTop">
            <div class="pill">감성형 심리테스트</div>
            <h1 class="heroTitle">Mind Spark</h1>
            <p class="heroSub">가볍게 확인 · 부드럽게 이해</p>
          </div>

          <div class="grid3">
            ${TESTS.map(
              (t) => `
              <div class="testCard">
                <div class="testMeta">
                  <div class="testTitle">${escapeHtml(t.title)}</div>
                  <div class="testSub">${escapeHtml(t.subtitle)}</div>
                </div>
                <button class="primaryBtn" data-start="${t.id}">시작하기</button>
              </div>
            `
            ).join("")}
          </div>

          <div class="note">
            <b>안내</b> · 개인 응답/개인 점수는 저장하지 않아요. 결과는 진단이 아니며, 인과관계를 단정할 수 없습니다.
          </div>

          <div class="ctaRow">
            <button class="ghostBtn" id="goTrust">신뢰/원칙 보기</button>
          </div>
        </div>
      </section>
    `;
  }

  function trustView() {
    return `
      <section class="panel">
        <div class="panelCard">
          <div class="panelHead">
            <div class="pill">원칙</div>
            <h2 class="panelTitle">개인 데이터는 남기지 않습니다</h2>
            <p class="panelSub">이 사이트는 월간 집계(익명) 목적의 구조를 따릅니다.</p>
          </div>

          <div class="bullet">
            <div class="bItem">✅ 개인 원응답 저장 금지</div>
            <div class="bItem">✅ 개인 점수 저장 금지</div>
            <div class="bItem">✅ URL에 점수 포함 금지</div>
            <div class="bItem">✅ localStorage/sessionStorage/IndexedDB 저장 금지</div>
            <div class="bItem">✅ 서버 저장은 <b>month × metric × bin × count</b>만</div>
            <div class="bItem">✅ GA4에 심리 데이터 전송 금지</div>
            <div class="bItem">✅ 결과는 진단이 아니며 인과관계 단정 금지</div>
            <div class="bItem">✅ 공유는 이미지 저장(PNG) 방식</div>
          </div>

          <div class="ctaRow">
            <button class="primaryBtn" id="backHome">홈으로</button>
          </div>
        </div>
      </section>
    `;
  }

  function testView(testId) {
    const t = TESTS.find((x) => x.id === testId);
    if (!t) return `<div class="panelCard">테스트를 찾을 수 없어요.</div>`;

    const answers = state.answers[testId] || Array(t.items.length).fill(0);
    return `
      <section class="panel">
        <div class="panelCard">
          <div class="panelHead">
            <div class="pill">${escapeHtml(t.tag)}</div>
            <h2 class="panelTitle">${escapeHtml(t.title)}</h2>
            <p class="panelSub">${escapeHtml(t.subtitle)}</p>
          </div>

          <div class="introLines">
            ${t.introLines.map((x) => `<div class="line">${escapeHtml(x)}</div>`).join("")}
          </div>

          <div class="qList">
            ${t.items
              .map((q, i) => {
                const v = answers[i] || 0;
                return `
                  <div class="qItem">
                    <div class="qText">
                      <span class="qNo">${i + 1}.</span>
                      ${escapeHtml(q.t)}
                      ${q.rev ? `<span class="revTag">역문항</span>` : ""}
                    </div>
                    <div class="scale" role="group" aria-label="question ${i + 1}">
                      ${SCALE_LABELS.map((lab, idx) => {
                        const score = idx + 1;
                        const checked = v === score ? "data-on='1'" : "";
                        return `
                          <button class="scaleBtn" type="button" data-q="${i}" data-v="${score}" ${checked}>
                            <span class="dot"></span>
                            <span class="lab">${escapeHtml(lab)}</span>
                          </button>
                        `;
                      }).join("")}
                    </div>
                  </div>
                `;
              })
              .join("")}
          </div>

          <div class="ctaRow">
            <button class="ghostBtn" id="backHome2">홈</button>
            <button class="primaryBtn" id="submitTest">결과 보기</button>
          </div>
        </div>
      </section>
    `;
  }

  function resultView(testId) {
    const t = TESTS.find((x) => x.id === testId);
    const r = state.results[testId];
    if (!t || !r) return `<div class="panelCard">결과를 찾을 수 없어요.</div>`;

    const next = nextTestId(testId);
    const expanded = !!state.expanded[testId];

    return `
      <section class="panel">
        <div class="panelCard">
          <div class="panelHead">
            <div class="pill">${escapeHtml(t.tag)}</div>
            <h2 class="panelTitle">${escapeHtml(t.title)} 결과</h2>
            <p class="panelSub">${escapeHtml(r.bin.emoji)} ${escapeHtml(r.bin.label)} · Score ${r.score.toFixed(
              1
            )}</p>
          </div>

          <div class="resultCard" id="resultCard">
            <div class="resultTop">
              <div class="big">${escapeHtml(r.bin.short)}</div>
              <div class="small">${escapeHtml(r.bin.emoji)} ${escapeHtml(r.bin.label)}</div>
            </div>
            <div class="short2">
              <div>${escapeHtml(t.result.short2[0])}</div>
              <div>${escapeHtml(t.result.short2[1])}</div>
            </div>

            <button class="moreBtn" id="toggleMore" type="button" aria-expanded="${expanded}">
              ${escapeHtml(t.result.moreTitle)} ${expanded ? "▲" : "▼"}
            </button>

            <div class="moreBody" ${expanded ? "" : "hidden"}>
              ${t.result.moreBody.map((x) => `<p>${escapeHtml(x)}</p>`).join("")}
            </div>
          </div>

          <div class="ctaRow">
            <button class="ghostBtn" id="saveResultPng">결과 이미지 저장</button>
            ${next ? `<button class="primaryBtn" id="goNext">다음 테스트 제안 보기</button>` : ""}
          </div>

          <div class="suggest">
            ${
              next
                ? `
              <div class="suggestCard">
                <div class="suggestTitle">다음으로 이어가 볼까요?</div>
                <div class="suggestSub">${escapeHtml(TESTS.find((x) => x.id === next).title)}로 넘어가면, ‘에너지 패턴’을 더 입체적으로 볼 수 있어요.</div>
                <div class="ctaRow">
                  <button class="primaryBtn" id="startNext">다음 테스트 시작</button>
                </div>
              </div>
            `
                : `
              <div class="suggestCard">
                <div class="suggestTitle">3가지 흐름이 모두 준비됐어요</div>
                <div class="suggestSub">이제 ‘에너지 프로파일’로 한눈에 정리해 볼 수 있어요.</div>
                <div class="ctaRow">
                  <button class="primaryBtn" id="goProfile">프로파일 보기</button>
                </div>
              </div>
            `
            }
          </div>

          <div class="ctaRow">
            <button class="ghostBtn" id="backHome3">홈</button>
            <button class="ghostBtn" id="goTrust2">신뢰</button>
          </div>
        </div>
      </section>
    `;
  }

  function profileView() {
    const a = state.results.social;
    const b = state.results.recovery;
    const c = state.results.fatigue;

    if (!a || !b || !c) {
      return `
        <section class="panel">
          <div class="panelCard">
            <div class="panelHead">
              <div class="pill">프로파일</div>
              <h2 class="panelTitle">아직 3개 결과가 모두 없어요</h2>
              <p class="panelSub">테스트 3개를 완료하면 프로파일을 볼 수 있어요.</p>
            </div>
            <div class="ctaRow">
              <button class="primaryBtn" id="toHomeFromProfile">홈으로</button>
            </div>
          </div>
        </section>
      `;
    }

    return `
      <section class="panel">
        <div class="panelCard profileCard">
          <div class="panelHead">
            <div class="pill">프로파일</div>
            <h2 class="panelTitle">✨ 에너지 프로파일</h2>
            <p class="panelSub">3가지 흐름을 한눈에 정리해요</p>
          </div>

          <div class="profileGrid">
            <div class="chartBox">
              <canvas id="radar" height="320" aria-label="Radar chart"></canvas>
            </div>

            <div class="barsBox">
              ${profileBar("사회적 에너지", a.score, "v1")}
              ${profileBar("감정 회복 속도", b.score, "v2")}
              ${profileBar("인간관계 피로도", c.score, "v3")}
            </div>
          </div>

          <div class="profileFooter">
            <div class="pfNote">
              <b>안내</b> · 이 화면은 진단이 아닌, 에너지 흐름/패턴에 대한 참고예요. 다음 달에 다시 확인해도 좋아요.
            </div>
            <div class="ctaRow">
              <button class="ghostBtn" id="saveProfilePng">프로파일 이미지 저장(PNG)</button>
              <button class="primaryBtn" id="saveAllPng">3개 결과+프로파일 한번에 저장</button>
            </div>
          </div>

          <div class="ctaRow">
            <button class="ghostBtn" id="backHome4">홈</button>
            <button class="ghostBtn" id="goTrust3">신뢰</button>
          </div>
        </div>
      </section>
    `;
  }

  function profileBar(label, score, cls) {
    const pct = (clamp(score, 1, 5) / 5) * 100;
    return `
      <div class="pBar">
        <div class="pRow">
          <div class="pLabel">${escapeHtml(label)}</div>
          <div class="pScore">Score ${score.toFixed(1)}</div>
        </div>
        <div class="pTrack">
          <div class="pFill ${cls}" style="width:${pct}%"></div>
        </div>
      </div>
    `;
  }

  function nextTestId(current) {
    const idx = TESTS.findIndex((t) => t.id === current);
    if (idx < 0) return null;
    const next = TESTS[idx + 1];
    return next ? next.id : null;
  }

  // ========== Wiring ==========
  function wireHome() {
    $("#navHome")?.addEventListener("click", () => go("home"));
    $("#navTrust")?.addEventListener("click", () => go("trust"));

    $("#goTrust")?.addEventListener("click", () => go("trust"));

    document.querySelectorAll("[data-start]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-start");
        go("test", { testId: id });
      });
    });
  }

  function wireTrust() {
    $("#navHome")?.addEventListener("click", () => go("home"));
    $("#navTrust")?.addEventListener("click", () => go("trust"));
    $("#backHome")?.addEventListener("click", () => go("home"));
  }

  function wireTest(testId) {
    $("#navHome")?.addEventListener("click", () => go("home"));
    $("#navTrust")?.addEventListener("click", () => go("trust"));
    $("#backHome2")?.addEventListener("click", () => go("home"));

    // init answers array
    const t = TESTS.find((x) => x.id === testId);
    if (!t) return;
    if (!state.answers[testId]) state.answers[testId] = Array(t.items.length).fill(0);

    // scale buttons
    document.querySelectorAll(".scaleBtn").forEach((b) => {
      b.addEventListener("click", () => {
        const q = parseInt(b.getAttribute("data-q"), 10);
        const v = parseInt(b.getAttribute("data-v"), 10);
        state.answers[testId][q] = v;

        // visual toggle
        const parent = b.closest(".scale");
        parent.querySelectorAll(".scaleBtn").forEach((x) => x.removeAttribute("data-on"));
        b.setAttribute("data-on", "1");
      });
    });

    $("#submitTest")?.addEventListener("click", () => {
      const arr = state.answers[testId];
      if (arr.some((x) => x === 0)) {
        toast("모든 문항에 답변해 주세요.");
        return;
      }
      const score = scoreForTest(testId, arr);
      const bin = binForScore(score);

      // store only in memory
      state.results[testId] = {
        testId,
        score,
        bin,
        ts: Date.now(),
      };

      // Optional: send only aggregated monthly bin counts (LDP) - disabled by default in this static build
      // sendAggregateCount(testId, bin.short);

      go("result", { testId });
    });
  }

  function wireResult(testId) {
    $("#navHome")?.addEventListener("click", () => go("home"));
    $("#navTrust")?.addEventListener("click", () => go("trust"));
    $("#backHome3")?.addEventListener("click", () => go("home"));
    $("#goTrust2")?.addEventListener("click", () => go("trust"));

    $("#toggleMore")?.addEventListener("click", () => {
      state.expanded[testId] = !state.expanded[testId];
      render();
    });

    $("#saveResultPng")?.addEventListener("click", () => {
      const r = state.results[testId];
      if (!r) return;
      // Save current result as image (canvas)
      downloadResultCardImage(r);
    });

    $("#goNext")?.addEventListener("click", () => {
      const next = nextTestId(testId);
      if (!next) return;
      // just scroll down to suggestion card area on mobile
      document.querySelector(".suggest")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    $("#startNext")?.addEventListener("click", () => {
      const next = nextTestId(testId);
      if (next) go("test", { testId: next });
    });

    $("#goProfile")?.addEventListener("click", () => go("profile"));
  }

  function wireProfile() {
    $("#navHome")?.addEventListener("click", () => go("home"));
    $("#navTrust")?.addEventListener("click", () => go("trust"));
    $("#backHome4")?.addEventListener("click", () => go("home"));
    $("#goTrust3")?.addEventListener("click", () => go("trust"));
    $("#toHomeFromProfile")?.addEventListener("click", () => go("home"));

    // Radar chart (client-side only)
    renderRadarChart();

    $("#saveProfilePng")?.addEventListener("click", () => {
      downloadProfileImage({
        social: state.results.social,
        recovery: state.results.recovery,
        fatigue: state.results.fatigue,
      });
    });

    $("#saveAllPng")?.addEventListener("click", () => {
      if (!state.results.social || !state.results.recovery || !state.results.fatigue) {
        toast("3개 결과가 모두 필요해요.");
        return;
      }
      // profile
      downloadProfileImage({
        social: state.results.social,
        recovery: state.results.recovery,
        fatigue: state.results.fatigue,
      });
      // results
      downloadResultCardImage(state.results.social);
      setTimeout(() => downloadResultCardImage(state.results.recovery), 250);
      setTimeout(() => downloadResultCardImage(state.results.fatigue), 500);
    });
  }

  // ========== Scoring ==========
  function scoreForTest(testId, answers) {
    const t = TESTS.find((x) => x.id === testId);
    if (!t) return 0;
    const scored = answers.map((v, i) => {
      const q = t.items[i];
      if (!q) return v;
      // reverse: 1<->5, 2<->4, 3 stays 3
      return q.rev ? 6 - v : v;
    });
    // average 1..5
    return mean(scored);
  }

  // ========== Radar (Chart.js) ==========
  function renderRadarChart() {
    const el = $("#radar");
    if (!el || !window.Chart) return;

    const a = state.results.social.score;
    const b = state.results.recovery.score;
    const c = state.results.fatigue.score;

    // destroy old chart if exists
    if (el._chart) {
      el._chart.destroy();
      el._chart = null;
    }

    const data = {
      labels: ["사회적 에너지", "감정 회복", "관계 피로도"],
      datasets: [
        {
          label: "Energy Profile",
          data: [a, b, c],
          fill: true,
          borderWidth: 2,
          pointRadius: 4,
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      scales: {
        r: {
          min: 1,
          max: 5,
          ticks: { stepSize: 1, display: true },
          grid: { circular: true },
        },
      },
    };

    el._chart = new window.Chart(el, { type: "radar", data, options });
  }

  // ========== Image download (canvas-only; no HTML capture; no storage) ==========
  function downloadResultCardImage(result) {
    const t = TESTS.find((x) => x.id === result.testId);
    if (!t) return;

    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1350;
    const ctx = canvas.getContext("2d");

    // background
    const g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    g.addColorStop(0, "rgba(109,94,252,0.22)");
    g.addColorStop(0.55, "rgba(255,111,174,0.16)");
    g.addColorStop(1, "rgba(11,16,32,1)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // sparkles
    for (let i = 0; i < 90; i++) {
      const x0 = Math.random() * canvas.width;
      const y0 = Math.random() * canvas.height;
      const r0 = 1 + Math.random() * 2.8;
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${0.06 + Math.random() * 0.16})`;
      ctx.arc(x0, y0, r0, 0, Math.PI * 2);
      ctx.fill();
    }

    // card
    const x = 80,
      y = 120,
      w = canvas.width - 160,
      h = canvas.height - 240,
      rad = 44;
    drawRoundRect(ctx, x, y, w, h, rad);
    ctx.fillStyle = "rgba(255,255,255,0.10)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.16)";
    ctx.lineWidth = 3;
    ctx.stroke();

    // header
    ctx.fillStyle = "rgba(255,255,255,0.92)";
    ctx.font = "900 72px system-ui, -apple-system, Segoe UI, Roboto, Noto Sans KR";
    ctx.fillText(`${t.title} 결과`, x + 70, y + 170);

    ctx.fillStyle = "rgba(255,255,255,0.72)";
    ctx.font = "800 34px system-ui, -apple-system, Segoe UI, Roboto, Noto Sans KR";
    ctx.fillText(`${result.bin.emoji} ${result.bin.label}`, x + 70, y + 230);

    // big label
    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.font = "900 140px system-ui, -apple-system, Segoe UI, Roboto, Noto Sans KR";
    ctx.fillText(result.bin.short, x + 70, y + 420);

    // short lines
    ctx.fillStyle = "rgba(255,255,255,0.82)";
    ctx.font = "800 42px system-ui, -apple-system, Segoe UI, Roboto, Noto Sans KR";
    ctx.fillText(t.result.short2[0], x + 70, y + 520);
    ctx.fillText(t.result.short2[1], x + 70, y + 585);

    // score
    ctx.fillStyle = "rgba(255,255,255,0.70)";
    ctx.font = "900 42px system-ui, -apple-system, Segoe UI, Roboto, Noto Sans KR";
    ctx.fillText(`Score ${result.score.toFixed(1)}`, x + 70, y + 680);

    // divider
    ctx.strokeStyle = "rgba(255,255,255,0.16)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + 70, y + 740);
    ctx.lineTo(x + w - 70, y + 740);
    ctx.stroke();

    // footer
    ctx.fillStyle = "rgba(255,255,255,0.62)";
    ctx.font = "750 32px system-ui, -apple-system, Segoe UI, Roboto, Noto Sans KR";
    wrapText(
      ctx,
      "익명 집계 데이터 기반 비교 · 직접적인 인과관계를 단정할 수 없다",
      x + 70,
      y + h - 110,
      w - 140,
      44
    );

    ctx.fillStyle = "rgba(255,255,255,0.62)";
    ctx.font = "900 34px system-ui, -apple-system, Segoe UI, Roboto, Noto Sans KR";
    ctx.fillText("Mind Spark", x + w - 290, y + h - 110);

    canvas.toBlob(
      (blob) => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `mind-spark-${result.testId}-result.png`;
        a.click();
        URL.revokeObjectURL(a.href);
        toast("이미지를 저장했어요.");
      },
      "image/png",
      1.0
    );
  }

  function downloadProfileImage(payload){
    // Draw a shareable profile card (radar-like triangle + bars) in canvas
    // NOTE: Layout is computed so that the footer area never overlaps the bar area.
    const s = payload.social.score;
    const r = payload.recovery.score;
    const f = payload.fatigue.score;

    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1350;
    const ctx = canvas.getContext('2d');

    // background (brighter, soft pastel)
    const g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    g.addColorStop(0, 'rgba(109,94,252,0.18)');
    g.addColorStop(0.55, 'rgba(255,111,174,0.14)');
    g.addColorStop(1, 'rgba(255,255,255,0.94)');
    ctx.fillStyle = g;
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // subtle sparkle dots (kept light to avoid "gloomy" feel)
    for (let i=0; i<80; i++){
      ctx.beginPath();
      const x0 = Math.random()*canvas.width;
      const y0 = Math.random()*canvas.height;
      const r0 = 1 + Math.random()*2.2;
      ctx.fillStyle = `rgba(255,255,255,${0.06 + Math.random()*0.12})`;
      ctx.arc(x0, y0, r0, 0, Math.PI*2);
      ctx.fill();
    }

    // card
    const x=80, y=120, w=canvas.width-160, h=canvas.height-240, rad=44;
    drawRoundRect(ctx, x,y,w,h,rad);
    ctx.fillStyle = 'rgba(255,255,255,0.14)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.20)';
    ctx.lineWidth = 3;
    ctx.stroke();

    // header
    ctx.fillStyle = 'rgba(20,24,40,0.92)';
    ctx.font = '900 72px system-ui, -apple-system, Segoe UI, Roboto, Noto Sans KR';
    ctx.fillText('✨ 에너지 프로파일', x+70, y+170);

    ctx.fillStyle = 'rgba(20,24,40,0.68)';
    ctx.font = '800 34px system-ui, -apple-system, Segoe UI, Roboto, Noto Sans KR';
    ctx.fillText('3가지 흐름을 한눈에', x+70, y+230);

    // radar-like triangle
    const cx = x + w/2;
    const cy = y + 520;
    const R = 220;

    // axes
    ctx.strokeStyle = 'rgba(20,24,40,0.12)';
    ctx.lineWidth = 3;
    const angles = [-Math.PI/2, (2*Math.PI/3)-Math.PI/2, (4*Math.PI/3)-Math.PI/2];
    angles.forEach(a=>{
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + R*Math.cos(a), cy + R*Math.sin(a));
      ctx.stroke();
    });

    // levels
    for (let lvl=1; lvl<=5; lvl++){
      const rr = (R * (lvl/5));
      ctx.beginPath();
      angles.forEach((a, i)=>{
        const px = cx + rr*Math.cos(a);
        const py = cy + rr*Math.sin(a);
        if (i===0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      });
      ctx.closePath();
      ctx.strokeStyle = 'rgba(20,24,40,0.10)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // polygon points based on scores (1..5)
    const vals = [s, r, f].map(v => clamp(v,1,5)/5);
    const pts = angles.map((a,i)=>({
      x: cx + (R*vals[i])*Math.cos(a),
      y: cy + (R*vals[i])*Math.sin(a)
    }));

    // fill polygon
    ctx.beginPath();
    pts.forEach((p,i)=>{ if(i===0) ctx.moveTo(p.x,p.y); else ctx.lineTo(p.x,p.y); });
    ctx.closePath();
    ctx.fillStyle = 'rgba(109,94,252,0.16)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(109,94,252,0.92)';
    ctx.lineWidth = 4;
    ctx.stroke();

    // points
    const pointColors = ['rgba(109,94,252,0.95)','rgba(255,111,174,0.92)','rgba(56,189,248,0.92)'];
    pts.forEach((p,i)=>{
      ctx.beginPath();
      ctx.arc(p.x,p.y,10,0,Math.PI*2);
      ctx.fillStyle = pointColors[i];
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.92)';
      ctx.lineWidth = 3;
      ctx.stroke();
    });

    // axis labels
    ctx.fillStyle = 'rgba(20,24,40,0.76)';
    ctx.font = '900 34px system-ui, -apple-system, Segoe UI, Roboto, Noto Sans KR';
    ctx.fillText('사회적 에너지', cx-420, cy-250);
    ctx.fillText('감정 회복', cx+140, cy+10);
    ctx.fillText('관계 피로도', cx-430, cy+60);

    // ----- Layout-safe footer area (prevents overlap) -----
    const footerAreaH = 190; // reserved bottom space inside the card
    const dividerY = y + h - footerAreaH;

    // divider line to visually separate footer
    ctx.strokeStyle = 'rgba(20,24,40,0.10)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x+60, dividerY);
    ctx.lineTo(x+w-60, dividerY);
    ctx.stroke();

    // bars
    const barX = x+70;
    const barW = w-140;
    const barH = 20;

    // compute a safe start Y so bars always end above dividerY
    const barsCount = 3;
    const barStep = 96;
    const barsHeight = barStep * barsCount;
    let barY = dividerY - barsHeight - 26;      // preferred (adaptive)
    const minBarY = y + 760;                    // keeps spacing under radar
    if (barY < minBarY) barY = minBarY;
    if (barY + barsHeight > dividerY - 8) barY = dividerY - barsHeight - 8;

    const bar = (label, val, color) => {
      ctx.fillStyle = 'rgba(20,24,40,0.78)';
      ctx.font = '900 34px system-ui, -apple-system, Segoe UI, Roboto, Noto Sans KR';
      ctx.fillText(label, barX, barY);

      // bg
      ctx.fillStyle = 'rgba(20,24,40,0.08)';
      drawRoundRect(ctx, barX, barY+18, barW, barH, 999);
      ctx.fill();

      // fill
      ctx.fillStyle = color;
      drawRoundRect(ctx, barX, barY+18, barW*(clamp(val,1,5)/5), barH, 999);
      ctx.fill();

      ctx.fillStyle = 'rgba(20,24,40,0.62)';
      ctx.font = '900 32px system-ui, -apple-system, Segoe UI, Roboto, Noto Sans KR';
      ctx.fillText(`Score ${val.toFixed(1)}`, barX+barW-190, barY);

      barY += barStep;
    };

    bar('사회적 에너지', s, 'rgba(109,94,252,0.92)');
    bar('감정 회복 속도', r, 'rgba(255,111,174,0.88)');
    bar('인간관계 피로도', f, 'rgba(56,189,248,0.86)');

    // footer (inside reserved area)
    const footerTextY = dividerY + 72;
    ctx.fillStyle = 'rgba(20,24,40,0.56)';
    ctx.font = '800 30px system-ui, -apple-system, Segoe UI, Roboto, Noto Sans KR';
    wrapText(ctx, '익명 집계 데이터 기반 비교 · 직접적인 인과관계를 단정할 수 없다', x+70, footerTextY, w-140, 42);

    ctx.fillStyle = 'rgba(20,24,40,0.56)';
    ctx.font = '900 34px system-ui, -apple-system, Segoe UI, Roboto, Noto Sans KR';
    ctx.fillText('Mind Spark', x+w-290, footerTextY+42);

    canvas.toBlob((blob)=>{
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'mind-spark-profile.png';
      a.click();
      URL.revokeObjectURL(a.href);
      toast('프로파일 이미지를 저장했어요.');
    }, 'image/png', 1.0);
  }

  function drawRoundRect(ctx, x, y, w, h, r) {
    const rr = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = String(text).split(" ");
    let line = "";
    let yy = y;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, x, yy);
        line = words[n] + " ";
        yy += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, yy);
  }

  function escapeHtml(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  // ========== Init ==========
  function init() {
    // Avoid accidental caching on the client side isn't fully possible from static file.
    // For deployment, set HTTP headers: Cache-Control: no-store for /tests, /result, /profile.

    // Default route
    go("home");

    // If user closes/refreshes, memory state disappears (good for privacy)
  }

  init();
})();

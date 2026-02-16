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
    { min: 3.4, max: 4.2, label: "에너지 확산형", emoji: "🔥", short: "확산" },
    { min: 4.2, max: 5.0, label: "강한 교류형", emoji: "⚡", short: "강함" },
  ];

  // Tests (8 questions each) — standard form
  const TESTS = [
    {
      id: "social",
      title: "사회적 에너지",
      headline: "사람 만나면 충전돼요, 방전돼요?",
      desc: "지금의 사회적 에너지 흐름을 가볍게 확인해요.",
      badge: "SE",
      metricKey: "socialEnergy",
      questions: [
        { t: "사람들과 함께 있는 시간이 오히려 에너지를 준다.", rev: false },
        { t: "모임 후에는 혼자만의 시간이 꼭 필요하다.", rev: true },
        { t: "낯선 사람과 대화하는 것이 크게 부담되지 않는다.", rev: false },
        { t: "사람 많은 자리는 되도록 피하고 싶다.", rev: true },
        { t: "즉흥적인 약속도 비교적 즐기는 편이다.", rev: false },
        { t: "여러 사람과 동시에 어울리면 금방 지친다.", rev: true },
        { t: "대화를 주도하는 편이다.", rev: false },
        { t: "조용한 환경이 더 편하다.", rev: true },
      ],
      shortExplain: {
        short: "교류가 에너지가 되는지, 혹은 휴식이 더 필요한지의 흐름을 봅니다.",
        long: [
          "이 결과는 ‘우열’이 아니라 에너지 방향의 차이를 보여줘요.",
          "조용한 회복이 잘 맞는 사람도, 교류 속에서 충전되는 사람도 모두 자연스러운 패턴입니다.",
          "공용 기기에서는 시크릿 모드 사용을 권장합니다.",
        ].join("\n"),
      },
    },
    {
      id: "recovery",
      title: "감정 회복 속도",
      headline: "감정이 얼마나 빨리 정리되는 편인가요?",
      desc: "속상함·갈등 이후, 마음이 원래 흐름으로 돌아오는 속도를 확인해요.",
      badge: "ER",
      metricKey: "recoverySpeed",
      questions: [
        { t: "속상한 일이 있어도 비교적 빨리 기분이 정리된다.", rev: false },
        { t: "기분이 상하면 하루 이상 계속 영향을 받는다.", rev: true },
        { t: "실망스러운 일이 있어도 금방 다른 일에 집중할 수 있다.", rev: false },
        { t: "작은 갈등도 오래 마음에 남는 편이다.", rev: true },
        { t: "감정이 흔들려도 스스로 균형을 되찾는 편이다.", rev: false },
        { t: "한 번 상처받으면 쉽게 잊히지 않는다.", rev: true },
        { t: "스트레스 상황에서도 비교적 빠르게 평정을 찾는다.", rev: false },
        { t: "기분이 가라앉으면 오래 지속되는 편이다.", rev: true },
      ],
      shortExplain: {
        short: "회복 속도는 ‘강함’이 아니라 정리되는 리듬의 차이일 뿐이에요.",
        long: [
          "여운이 오래 남는 편이라면, 그만큼 경험을 섬세하게 받아들이는 경향이 있을 수 있어요.",
          "회복이 빠른 편이라면, 상황을 재정리하는 속도가 장점이 될 수 있습니다.",
          "어느 쪽이든 ‘더 좋다/나쁘다’가 아닙니다.",
        ].join("\n"),
      },
    },
    {
      id: "fatigue",
      title: "인간관계 피로도",
      headline: "관계 속 감정 소모는 어느 정도인가요?",
      desc: "관계 밀도에 따라 감정 에너지가 얼마나 소모되는지 확인해요.",
      badge: "RF",
      metricKey: "relationshipFatigue",
      questions: [
        { t: "사람들과 긴 시간 함께하면 감정적으로 지치는 편이다.", rev: false },
        { t: "관계 속 갈등이 생겨도 비교적 쉽게 넘기는 편이다.", rev: true },
        { t: "누군가의 감정을 오래 신경 쓰는 편이다.", rev: false },
        { t: "관계 문제는 비교적 빨리 잊는 편이다.", rev: true },
        { t: "대화를 오래 이어가면 피로가 쌓인다.", rev: false },
        { t: "혼자 있는 시간이 관계 피로를 회복시킨다.", rev: false },
        { t: "관계 속에서 눈치를 많이 보는 편이다.", rev: false },
        { t: "감정 소모가 있어도 크게 부담되지 않는다.", rev: true },
      ],
      shortExplain: {
        short: "관계 피로는 ‘사회성 부족’이 아니라 에너지 소모 패턴입니다.",
        long: [
          "피로가 높게 느껴질수록, 회복 시간과 거리 조절이 중요해질 수 있어요.",
          "피로가 낮게 느껴진다면, 교류를 비교적 편안하게 유지하는 흐름일 수 있습니다.",
          "상황(업무/학업/가족 등)에 따라 달라질 수 있어요.",
        ].join("\n"),
      },
    },
  ];

  // ========== App State (memory-only) ==========
  const state = {
    route: "home", // home | test | result | profile | trust
    currentTestId: null,
    qIndex: 0,
    answers: [], // for current test only, memory-only
    results: {
      social: null,
      recovery: null,
      fatigue: null,
    },
    // Example month average snapshot (placeholder — replace with your aggregate)
    snapshot: {
      month: "이번 달",
      socialEnergyAvg: 3.08,
      recoverySpeedAvg: 3.14,
      relationshipFatigueAvg: 2.97,
    },
    profileChart: null,
  };

  // ========== Helpers ==========
  const $ = (sel) => document.querySelector(sel);

  function clamp(n, a, b){ return Math.max(a, Math.min(b, n)); }

  function reverseLikert(v){ // 1..5
    return 6 - v;
  }

  function computeScore(test, answers){
    // answers length = 8, values 1..5
    let sum = 0;
    for (let i=0; i<answers.length; i++){
      const q = test.questions[i];
      const v = q.rev ? reverseLikert(answers[i]) : answers[i];
      sum += v;
    }
    const avg = sum / answers.length;
    // round to 1 decimal for display
    return Math.round(avg * 10) / 10;
  }

  function binForScore(score){
    // note: boundaries are inclusive of min, exclusive of max except final
    for (let i=0; i<BINS.length; i++){
      const b = BINS[i];
      const isLast = i === BINS.length - 1;
      if ((score >= b.min && score < b.max) || (isLast && score >= b.min && score <= b.max)){
        return b;
      }
    }
    return BINS[2];
  }

  function gentleCompare(score, avg){
    const d = Math.round((score - avg) * 10) / 10;
    if (Math.abs(d) < 0.2) return "이번 달 평균과 비슷한 흐름입니다.";
    if (d > 0) return "이번 달 평균보다 약간 높은 흐름입니다.";
    return "이번 달 평균보다 다소 조용한 흐름입니다.";
  }

  function summarizeProfile(s, r, f){
    // gentle, non-judgmental, 2 lines max
    const t1 = s >= 3.4 ? "교류에서 비교적 활력을 얻는 편이며" : s <= 2.6 ? "조용한 환경에서 회복이 잘 되는 편이며" : "교류와 휴식의 균형을 잘 맞추는 편이며";
    const t2 = r >= 3.4 ? "감정이 비교적 빠르게 정리되는 흐름이에요." : r <= 2.6 ? "감정의 여운이 비교적 오래 남을 수 있어요." : "회복 흐름이 비교적 안정적인 편이에요.";
    const t3 = f >= 3.4 ? "관계 속 감정 소모가 쌓일 때는 휴식이 도움이 될 수 있습니다." : f <= 2.6 ? "관계 속 감정 소모는 비교적 낮은 흐름으로 보입니다." : "관계 소모는 상황에 따라 달라질 수 있어요.";
    return `${t1} ${t2} ${t3}`;
  }

  function toast(msg){
    let el = document.querySelector('.toast');
    if (!el){
      el = document.createElement('div');
      el.className = 'toast';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add('show');
    setTimeout(()=> el.classList.remove('show'), 1600);
  }

  function hardReset(){
    // wipe memory state
    state.route = 'home';
    state.currentTestId = null;
    state.qIndex = 0;
    state.answers = [];
    state.results.social = null;
    state.results.recovery = null;
    state.results.fatigue = null;
    if (state.profileChart){
      try{ state.profileChart.destroy(); } catch(e){}
      state.profileChart = null;
    }
    render();
    // avoid back showing result
    if (history && history.replaceState){
      history.replaceState(null, '', location.pathname + location.search);
    }
    toast('세션을 종료했어요.');
  }

  function go(route){
    state.route = route;
    render();
    window.scrollTo({top:0, behavior:'smooth'});
  }

  function startTest(testId){
    const t = TESTS.find(x=>x.id === testId);
    if (!t) return;
    state.currentTestId = testId;
    state.qIndex = 0;
    state.answers = [];
    state.route = 'test';
    render();
    window.scrollTo({top:0, behavior:'smooth'});
  }

  function recordAnswer(v){
    // v 1..5
    state.answers[state.qIndex] = v;
    const t = TESTS.find(x=>x.id === state.currentTestId);
    // auto-next after short delay
    setTimeout(()=>{
      state.qIndex += 1;
      if (state.qIndex >= t.questions.length){
        finishTest();
      } else {
        render();
        window.scrollTo({top:0, behavior:'smooth'});
      }
    }, 220);
  }

  function finishTest(){
    const t = TESTS.find(x=>x.id === state.currentTestId);
    const score = computeScore(t, state.answers);
    const bin = binForScore(score);

    const result = {
      testId: t.id,
      title: t.title,
      badge: t.badge,
      score,
      binLabel: bin.label,
      binEmoji: bin.emoji,
      compareLine: null, // set below
      short: t.shortExplain.short,
      long: t.shortExplain.long,
    };

    // compare against snapshot mean of the same metric
    let avg = 3.0;
    if (t.metricKey === 'socialEnergy') avg = state.snapshot.socialEnergyAvg;
    if (t.metricKey === 'recoverySpeed') avg = state.snapshot.recoverySpeedAvg;
    if (t.metricKey === 'relationshipFatigue') avg = state.snapshot.relationshipFatigueAvg;
    result.compareLine = gentleCompare(score, avg);

    if (t.id === 'social') state.results.social = result;
    if (t.id === 'recovery') state.results.recovery = result;
    if (t.id === 'fatigue') state.results.fatigue = result;

    // wipe per-test answers immediately (minimize local residue)
    state.answers = [];
    state.qIndex = 0;

    state.route = 'result';
    render();
    window.scrollTo({top:0, behavior:'smooth'});
  }

  function nextSuggestion(){
    // social -> recovery -> fatigue -> profile
    if (state.currentTestId === 'social') return 'recovery';
    if (state.currentTestId === 'recovery') return 'fatigue';
    return null;
  }

  function canShowProfile(){
    return !!(state.results.social && state.results.recovery && state.results.fatigue);
  }

  // ========== Rendering ==========
  function render(){
    const app = $('#app');
    if (!app) return;

    if (state.route === 'home'){
      app.innerHTML = homeView();
      bindHome();
      return;
    }
    if (state.route === 'test'){
      app.innerHTML = testView();
      bindTest();
      return;
    }
    if (state.route === 'result'){
      app.innerHTML = resultView();
      bindResult();
      return;
    }
    if (state.route === 'profile'){
      app.innerHTML = profileView();
      bindProfile();
      return;
    }
    if (state.route === 'trust'){
      app.innerHTML = trustView();
      bindTrust();
      return;
    }

    // fallback
    state.route = 'home';
    app.innerHTML = homeView();
    bindHome();
  }

  function homeView(){
    return `
      <section class="card">
        <div class="hero">
          <div class="kickers">
            <span class="chip">⏱ 3분</span>
            <span class="chip">📱 모바일 최적</span>
            <span class="chip">🔒 저장 안 함</span>
          </div>

          <h1 class="h1">가볍게 해보고,<br/>내 흐름을 부드럽게 알아보기</h1>
          <p class="sub">결과는 <b>점수 + 5단계 캐릭터</b>로 보여드려요. 개인 응답/점수는 서버에 저장하지 않습니다.</p>

          <div class="btnRow">
            <button class="btn btnPrimary" id="startSocial">사회적 에너지 시작</button>
            <button class="btn btnGhost" id="goTrust">왜 믿어도 돼요?</button>
          </div>

          <div class="grid" style="margin-top:14px;">
            <div class="tile" role="button" tabindex="0" id="tileSocial">
              <div>
                <p class="tileName">사회적 에너지</p>
                <div class="tileMeta">3분 · 비교형 결과</div>
              </div>
              <div class="tileMeta">${state.snapshot.month} 평균 ${state.snapshot.socialEnergyAvg.toFixed(2)}</div>
            </div>
            <div class="tile" role="button" tabindex="0" id="tileRecovery">
              <div>
                <p class="tileName">감정 회복 속도</p>
                <div class="tileMeta">3분 · 흐름 확인</div>
              </div>
              <div class="tileMeta">${state.snapshot.month} 평균 ${state.snapshot.recoverySpeedAvg.toFixed(2)}</div>
            </div>
            <div class="tile" role="button" tabindex="0" id="tileFatigue">
              <div>
                <p class="tileName">인간관계 피로도</p>
                <div class="tileMeta">3분 · 에너지 소모</div>
              </div>
              <div class="tileMeta">${state.snapshot.month} 평균 ${state.snapshot.relationshipFatigueAvg.toFixed(2)}</div>
            </div>
            <div class="tile tileSoon" aria-disabled="true">
              <div>
                <p class="tileName">에너지 프로파일</p>
                <div class="tileMeta">3개 완료 시 제공</div>
              </div>
              <div class="tileMeta">그래픽 요약 · 이미지 저장</div>
            </div>
          </div>

          <div class="cardInner" style="padding-top:0;">
            <div class="fine">
              <b>짧게 안내</b> · 익명 집계 데이터 · 로컬 프라이버시(LDP) 기반 추정 · 직접적인 인과관계를 단정할 수 없다
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function testView(){
    const t = TESTS.find(x=>x.id === state.currentTestId);
    const total = t.questions.length;
    const idx = state.qIndex;
    const pct = clamp(Math.round((idx / total) * 100), 0, 100);
    const q = t.questions[idx];

    return `
      <section class="card">
        <div class="cardInner">
          <div class="progressRow">
            <div class="progressText">Q ${idx+1} / ${total}</div>
            <div class="progressBar" aria-hidden="true">
              <div class="progressFill" style="width:${pct}%;"></div>
            </div>
          </div>

          <div class="qTitle">${escapeHtml(q.t)}</div>

          <div class="choices" role="group" aria-label="Answer choices">
            ${SCALE_LABELS.map((lab, i)=>
              `<button class="choice" data-v="${i+1}">${lab}</button>`
            ).join('')}
          </div>

          <div style="margin-top:10px; display:flex; justify-content:space-between; align-items:center; gap:10px;">
            <button class="btnText" id="backBtn">← 이전</button>
            <button class="btnText" id="quitBtn">종료</button>
          </div>

          <div class="fine" style="margin-top:10px;">
            개인 응답/점수는 서버에 저장하지 않습니다. (공용 기기에서는 시크릿 모드 권장)
          </div>
        </div>
      </section>
    `;
  }

  function resultView(){
    const t = TESTS.find(x=>x.id === state.currentTestId);
    const r = (t.id === 'social') ? state.results.social : (t.id === 'recovery') ? state.results.recovery : state.results.fatigue;

    const next = nextSuggestion();
    const nextTest = next ? TESTS.find(x=>x.id === next) : null;

    const profileReady = canShowProfile();

    return `
      <section class="card">
        <div class="cardInner">
          <div class="resultTop">
            <div>
              <h2 class="resultName">${r.binEmoji} ${escapeHtml(r.binLabel)}</h2>
              <div class="resultMeta">Score ${r.score.toFixed(1)} · ${escapeHtml(r.compareLine)}</div>
            </div>
            <div class="badge" aria-label="test badge">${escapeHtml(r.badge)}</div>
          </div>

          <p class="resultMini">${escapeHtml(r.short)}</p>

          <div class="accordion">
            <button class="btn btnGhost accBtn" id="moreBtn">🔎 자세히 보기</button>
            <div class="accBody" id="moreBody">
              ${escapeHtml(r.long).replaceAll('\n','<br/>')}
              <div style="margin-top:10px;" class="fine">
                익명 집계 데이터 기반 비교 · 로컬 프라이버시(LDP) 기반 추정 · 직접적인 인과관계를 단정할 수 없다
              </div>
            </div>
          </div>

          ${nextTest ? `
            <div class="suggest">
              <div class="suggestTitle">🧩 다음으로 ${escapeHtml(nextTest.title)}도 함께 볼까요?</div>
              <p class="suggestText">함께 보면 흐름이 더 분명해질 수 있어요. (선택)</p>
              <div class="btnRow" style="margin-top:10px;">
                <button class="btn btnPrimary" id="goNext">${escapeHtml(nextTest.title)} 시작</button>
                <button class="btn btnGhost" id="goHome">홈으로</button>
              </div>
            </div>
          ` : `
            <div class="suggest">
              <div class="suggestTitle">✨ 3개 테스트를 모두 완료했어요</div>
              <p class="suggestText">이제 한 장으로 정리한 <b>에너지 프로파일</b>을 볼 수 있어요.</p>
              <div class="btnRow" style="margin-top:10px;">
                <button class="btn btnPrimary" id="toProfile" ${profileReady ? '' : 'disabled'}>프로파일 보기</button>
                <button class="btn btnGhost" id="goHome">홈으로</button>
              </div>
            </div>
          `}

          <div style="margin-top:12px; display:flex; justify-content:space-between; align-items:center; gap:10px;">
            <button class="btnText" id="endBtn">끝내기(흔적 지우기)</button>
            <button class="btnText" id="saveCardBtn">이미지로 저장</button>
          </div>

          <div class="fine" style="margin-top:10px;">
            * 이미지는 사용자 기기에 저장됩니다. 저장/공유 이후 관리 책임은 사용자에게 있습니다.
          </div>
        </div>
      </section>
    `;
  }

  function profileView(){
    const s = state.results.social?.score;
    const r = state.results.recovery?.score;
    const f = state.results.fatigue?.score;

    if (typeof s !== 'number' || typeof r !== 'number' || typeof f !== 'number'){
      return `
        <section class="card"><div class="cardInner">
          <h2 class="resultName">프로파일을 만들 수 없어요</h2>
          <p class="resultMini">3개 테스트를 모두 완료하면 프로파일이 생성됩니다.</p>
          <div class="btnRow"><button class="btn btnPrimary" id="backHome">홈으로</button></div>
        </div></section>
      `;
    }

    const summary = summarizeProfile(s, r, f);

    return `
      <section class="card">
        <div class="cardInner profileWrap">
          <div>
            <h2 class="resultName">✨ 당신의 에너지 프로파일</h2>
            <div class="resultMeta">3가지 흐름을 한눈에 정리했어요. (점수는 저장되지 않습니다)</div>
          </div>

          <div class="chartWrap">
            <canvas id="radar" height="320" aria-label="Radar chart"></canvas>
          </div>

          <div class="metricRow"><div class="metricName">사회적 에너지</div><div class="metricVal">Score ${s.toFixed(1)}</div></div>
          <div class="metricRow"><div class="metricName">감정 회복 속도</div><div class="metricVal">Score ${r.toFixed(1)}</div></div>
          <div class="metricRow"><div class="metricName">인간관계 피로도</div><div class="metricVal">Score ${f.toFixed(1)}</div></div>

          <p class="resultMini">${escapeHtml(summary)}</p>

          <div class="btnRow">
            <button class="btn btnPrimary" id="saveProfile">프로파일 이미지 저장</button>
            <button class="btn btnGhost" id="backHome">홈으로</button>
          </div>

          <div class="fine">
            익명 집계 데이터 기반 비교 · 로컬 프라이버시(LDP) 기반 추정 · 직접적인 인과관계를 단정할 수 없다
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; gap:10px;">
            <button class="btnText" id="endBtn2">끝내기(흔적 지우기)</button>
            <button class="btnText" id="saveAll">(선택) 3개 결과 카드 저장</button>
          </div>
        </div>
      </section>
    `;
  }

  function trustView(){
    return `
      <section class="card">
        <div class="cardInner">
          <h2 class="resultName">🔒 신뢰/프라이버시 안내</h2>
          <p class="resultMini">
            이 사이트는 “재미로 해보는 테스트”처럼 보이지만, 개인 데이터를 남기지 않도록 설계했습니다.
          </p>
          <div class="grid" style="margin-top:12px;">
            <div class="tile">
              <p class="tileName">개인 응답/점수 저장 안 함</p>
              <div class="tileMeta">결과는 화면에서만 표시됩니다.</div>
            </div>
            <div class="tile">
              <p class="tileName">익명 집계 데이터</p>
              <div class="tileMeta">서버에는 월간 집계만 저장합니다.</div>
            </div>
            <div class="tile">
              <p class="tileName">LDP 기반 추정</p>
              <div class="tileMeta">로컬 프라이버시(LDP) 기반으로 추정/집계합니다.</div>
            </div>
            <div class="tile">
              <p class="tileName">인과 단정 금지</p>
              <div class="tileMeta">직접적인 인과관계를 단정할 수 없습니다.</div>
            </div>
          </div>

          <div class="fine" style="margin-top:12px;">
            공용 PC/공용 기기에서는 시크릿 모드 사용을 권장합니다. 또한 화면에 표시된 내용은 스크린샷/촬영으로 남을 수 있습니다.
          </div>

          <div class="btnRow" style="margin-top:12px;">
            <button class="btn btnPrimary" id="backHome">홈으로</button>
          </div>
        </div>
      </section>
    `;
  }

  // ========== Bindings ==========
  function bindHome(){
    $('#startSocial')?.addEventListener('click', ()=> startTest('social'));
    $('#goTrust')?.addEventListener('click', ()=> go('trust'));
    $('#tileSocial')?.addEventListener('click', ()=> startTest('social'));
    $('#tileRecovery')?.addEventListener('click', ()=> startTest('recovery'));
    $('#tileFatigue')?.addEventListener('click', ()=> startTest('fatigue'));

    // keyboard accessibility for tiles
    for (const id of ['tileSocial','tileRecovery','tileFatigue']){
      const el = document.getElementById(id);
      if (!el) continue;
      el.addEventListener('keydown', (e)=>{ if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); } });
    }
  }

  function bindTest(){
    const choices = document.querySelectorAll('.choice');
    choices.forEach(btn => {
      btn.addEventListener('click', ()=>{
        const v = Number(btn.getAttribute('data-v'));
        recordAnswer(clamp(v,1,5));
      });
    });

    $('#backBtn')?.addEventListener('click', ()=>{
      if (state.qIndex > 0){
        state.qIndex -= 1;
        render();
      } else {
        go('home');
      }
    });

    $('#quitBtn')?.addEventListener('click', ()=>{
      hardReset();
    });
  }

  function bindResult(){
    $('#moreBtn')?.addEventListener('click', ()=>{
      const body = $('#moreBody');
      body?.classList.toggle('show');
    });

    $('#goHome')?.addEventListener('click', ()=>{ go('home'); });

    const next = nextSuggestion();
    if (next){
      $('#goNext')?.addEventListener('click', ()=> startTest(next));
    } else {
      $('#toProfile')?.addEventListener('click', ()=> go('profile'));
    }

    $('#endBtn')?.addEventListener('click', ()=> hardReset());

    $('#saveCardBtn')?.addEventListener('click', ()=>{
      // Save current result as image (canvas)
      const t = TESTS.find(x=>x.id === state.currentTestId);
      const r = (t.id === 'social') ? state.results.social : (t.id === 'recovery') ? state.results.recovery : state.results.fatigue;
      downloadResultCardImage(r);
    });
  }

  function bindProfile(){
    $('#backHome')?.addEventListener('click', ()=> go('home'));
    $('#endBtn2')?.addEventListener('click', ()=> hardReset());

    const s = state.results.social.score;
    const r = state.results.recovery.score;
    const f = state.results.fatigue.score;

    // Chart.js radar — soft style
    const ctx = document.getElementById('radar');
    if (ctx && window.Chart){
      if (state.profileChart){
        try{ state.profileChart.destroy(); } catch(e){}
        state.profileChart = null;
      }

      const COLORS = {
        stroke: "rgba(109,94,252,0.92)",
        fill: "rgba(109,94,252,0.16)",
        p1: "rgba(109,94,252,0.92)",
        p2: "rgba(255,111,174,0.90)",
        p3: "rgba(56,189,248,0.88)",
        grid: "rgba(255,255,255,0.10)",
        tick: "rgba(255,255,255,0.70)",
        label: "rgba(255,255,255,0.75)",
      };

      state.profileChart = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: ['사회적 에너지', '감정 회복 속도', '관계 피로도'],
          datasets: [{
            label: 'Energy Profile',
            data: [s, r, f],
            borderColor: COLORS.stroke,
            backgroundColor: COLORS.fill,
            pointBackgroundColor: [COLORS.p1, COLORS.p2, COLORS.p3],
            pointBorderColor: "rgba(255,255,255,0.9)",
            pointBorderWidth: 1.5,
            pointRadius: 4.5,
            pointHoverRadius: 5.5,
            borderWidth: 2.2,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 700, easing: 'easeOutQuart' },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: 'rgba(11,16,32,0.92)',
              titleColor: 'rgba(255,255,255,0.92)',
              bodyColor: 'rgba(255,255,255,0.9)',
              displayColors: false,
              padding: 10,
              callbacks: { label: (c) => ` ${c.formattedValue} / 5` }
            }
          },
          scales: {
            r: {
              min: 1,
              max: 5,
              ticks: {
                stepSize: 1,
                showLabelBackdrop: false,
                color: COLORS.tick,
                font: { size: 12, weight: '700' },
              },
              grid: { color: COLORS.grid },
              angleLines: { color: COLORS.grid },
              pointLabels: { color: COLORS.label, font: { size: 12, weight: '800' } }
            }
          }
        }
      });
    }

    $('#saveProfile')?.addEventListener('click', ()=>{
      downloadProfileImage({
        social: state.results.social,
        recovery: state.results.recovery,
        fatigue: state.results.fatigue,
      });
    });

    $('#saveAll')?.addEventListener('click', ()=>{
      downloadResultCardImage(state.results.social);
      setTimeout(()=> downloadResultCardImage(state.results.recovery), 250);
      setTimeout(()=> downloadResultCardImage(state.results.fatigue), 500);
    });
  }

  function bindTrust(){
    $('#backHome')?.addEventListener('click', ()=> go('home'));
  }

  // Header nav
  document.addEventListener('click', (e)=>{
    if (e.target?.id === 'navHome') go('home');
    if (e.target?.id === 'navTrust') go('trust');
  });

  // ========== Image export (client-side only) ==========
  function downloadResultCardImage(result){
    if (!result) return;

    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1350;
    const ctx = canvas.getContext('2d');

    // background gradient
    const g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    g.addColorStop(0, 'rgba(109,94,252,0.22)');
    g.addColorStop(0.55, 'rgba(255,111,174,0.18)');
    g.addColorStop(1, 'rgba(11,16,32,1)');
    ctx.fillStyle = g;
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // soft grain-ish overlay
    ctx.fillStyle = 'rgba(255,255,255,0.03)';
    for (let i=0; i<1400; i++){
      const x = Math.random()*canvas.width;
      const y = Math.random()*canvas.height;
      ctx.fillRect(x,y,1,1);
    }

    // card panel
    const x=80, y=120, w=canvas.width-160, h=canvas.height-240, rad=44;
    drawRoundRect(ctx, x,y,w,h,rad);
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.16)';
    ctx.lineWidth = 3;
    ctx.stroke();

    // title
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.font = '900 76px system-ui, -apple-system, Segoe UI, Roboto, Noto Sans KR';
    ctx.fillText(`${result.binEmoji} ${result.binLabel}`, x+70, y+190);

    // score
    ctx.fillStyle = 'rgba(255,255,255,0.78)';
    ctx.font = '800 44px system-ui, -apple-system, Segoe UI, Roboto, Noto Sans KR';
    ctx.fillText(`Score ${result.score.toFixed(1)}`, x+70, y+270);

    // compare highlight
    ctx.fillStyle = 'rgba(109,94,252,0.95)';
    ctx.font = '900 46px system-ui, -apple-system, Segoe UI, Roboto, Noto Sans KR';
    wrapText(ctx, result.compareLine, x+70, y+350, w-140, 56);

    // short line
    ctx.fillStyle = 'rgba(255,255,255,0.78)';
    ctx.font = '750 44px system-ui, -apple-system, Segoe UI, Roboto, Noto Sans KR';
    wrapText(ctx, result.short, x+70, y+480, w-140, 56);

    // footer
    ctx.fillStyle = 'rgba(255,255,255,0.62)';
    ctx.font = '750 32px system-ui, -apple-system, Segoe UI, Roboto, Noto Sans KR';
    wrapText(ctx, '익명 집계 데이터 기반 비교 · 직접적인 인과관계를 단정할 수 없다', x+70, y+h-110, w-140, 44);

    ctx.fillStyle = 'rgba(255,255,255,0.62)';
    ctx.font = '900 34px system-ui, -apple-system, Segoe UI, Roboto, Noto Sans KR';
    ctx.fillText('Mind Spark', x+w-290, y+h-110);

    canvas.toBlob((blob)=>{
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `mind-spark-${result.testId}-result.png`;
      a.click();
      URL.revokeObjectURL(a.href);
      toast('이미지를 저장했어요.');
    }, 'image/png', 1.0);
  }

  function downloadProfileImage(payload){
    // Draw a shareable profile card (radar-like triangle + bars) in canvas
    const s = payload.social.score;
    const r = payload.recovery.score;
    const f = payload.fatigue.score;

    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1350;
    const ctx = canvas.getContext('2d');

    // background
    const g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    g.addColorStop(0, 'rgba(109,94,252,0.22)');
    g.addColorStop(0.55, 'rgba(255,111,174,0.16)');
    g.addColorStop(1, 'rgba(11,16,32,1)');
    ctx.fillStyle = g;
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // card
    const x=80, y=120, w=canvas.width-160, h=canvas.height-240, rad=44;
    drawRoundRect(ctx, x,y,w,h,rad);
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.16)';
    ctx.lineWidth = 3;
    ctx.stroke();

    // header
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.font = '900 72px system-ui, -apple-system, Segoe UI, Roboto, Noto Sans KR';
    ctx.fillText('✨ 에너지 프로파일', x+70, y+170);

    ctx.fillStyle = 'rgba(255,255,255,0.70)';
    ctx.font = '800 34px system-ui, -apple-system, Segoe UI, Roboto, Noto Sans KR';
    ctx.fillText('3가지 흐름을 한눈에', x+70, y+230);

    // radar-like triangle
    const cx = x + w/2;
    const cy = y + 520;
    const R = 220;

    // axes
    ctx.strokeStyle = 'rgba(255,255,255,0.14)';
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
      ctx.strokeStyle = 'rgba(255,255,255,0.10)';
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
    ctx.fillStyle = 'rgba(109,94,252,0.20)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(109,94,252,0.92)';
    ctx.lineWidth = 4;
    ctx.stroke();

    // points
    const pointColors = ['rgba(109,94,252,0.95)','rgba(255,111,174,0.92)','rgba(56,189,248,0.90)'];
    pts.forEach((p,i)=>{
      ctx.beginPath();
      ctx.arc(p.x,p.y,10,0,Math.PI*2);
      ctx.fillStyle = pointColors[i];
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.85)';
      ctx.lineWidth = 3;
      ctx.stroke();
    });

    // axis labels
    ctx.fillStyle = 'rgba(255,255,255,0.78)';
    ctx.font = '900 34px system-ui, -apple-system, Segoe UI, Roboto, Noto Sans KR';
    ctx.fillText('사회적 에너지', cx-420, cy-250);
    ctx.fillText('감정 회복', cx+140, cy+10);
    ctx.fillText('관계 피로도', cx-430, cy+60);

    // bars
    const barX = x+70;
    let barY = y+820;
    const barW = w-140;
    const barH = 20;

    const bar = (label, val, color) => {
      ctx.fillStyle = 'rgba(255,255,255,0.70)';
      ctx.font = '900 34px system-ui, -apple-system, Segoe UI, Roboto, Noto Sans KR';
      ctx.fillText(label, barX, barY);

      // bg
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      drawRoundRect(ctx, barX, barY+18, barW, barH, 999);
      ctx.fill();

      // fill
      ctx.fillStyle = color;
      drawRoundRect(ctx, barX, barY+18, barW*(clamp(val,1,5)/5), barH, 999);
      ctx.fill();

      ctx.fillStyle = 'rgba(255,255,255,0.72)';
      ctx.font = '900 32px system-ui, -apple-system, Segoe UI, Roboto, Noto Sans KR';
      ctx.fillText(`Score ${val.toFixed(1)}`, barX+barW-190, barY);

      barY += 96;
    };

    bar('사회적 에너지', s, 'rgba(109,94,252,0.92)');
    bar('감정 회복 속도', r, 'rgba(255,111,174,0.88)');
    bar('인간관계 피로도', f, 'rgba(56,189,248,0.86)');

    // footer
    ctx.fillStyle = 'rgba(255,255,255,0.62)';
    ctx.font = '800 30px system-ui, -apple-system, Segoe UI, Roboto, Noto Sans KR';
    wrapText(ctx, '익명 집계 데이터 기반 비교 · 직접적인 인과관계를 단정할 수 없다', x+70, y+h-110, w-140, 42);

    ctx.fillStyle = 'rgba(255,255,255,0.62)';
    ctx.font = '900 34px system-ui, -apple-system, Segoe UI, Roboto, Noto Sans KR';
    ctx.fillText('Mind Spark', x+w-290, y+h-110);

    canvas.toBlob((blob)=>{
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'mind-spark-profile.png';
      a.click();
      URL.revokeObjectURL(a.href);
      toast('프로파일 이미지를 저장했어요.');
    }, 'image/png', 1.0);
  }

  function drawRoundRect(ctx, x,y,w,h,r){
    const rr = Math.min(r, w/2, h/2);
    ctx.beginPath();
    ctx.moveTo(x+rr, y);
    ctx.arcTo(x+w, y, x+w, y+h, rr);
    ctx.arcTo(x+w, y+h, x, y+h, rr);
    ctx.arcTo(x, y+h, x, y, rr);
    ctx.arcTo(x, y, x+w, y, rr);
    ctx.closePath();
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight){
    const words = String(text).split(' ');
    let line = '';
    let yy = y;
    for (let n=0; n<words.length; n++){
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0){
        ctx.fillText(line, x, yy);
        line = words[n] + ' ';
        yy += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, yy);
  }

  function escapeHtml(s){
    return String(s)
      .replaceAll('&','&amp;')
      .replaceAll('<','&lt;')
      .replaceAll('>','&gt;')
      .replaceAll('"','&quot;')
      .replaceAll("'",'&#039;');
  }

  // ========== Init ==========
  function init(){
    // Avoid accidental caching on the client side isn't fully possible from static file.
    // For deployment, set HTTP headers: Cache-Control: no-store for /tests, /result, /profile.

    // Default route
    go('home');

    // If user closes/refreshes, memory state disappears (good for privacy)
  }

  init();
})();

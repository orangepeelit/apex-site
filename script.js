(() => {
  const escapeHtml = (value) => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('\"', '&quot;')
    .replaceAll("'", '&#039;');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add('visible'));
  }

  const flowContent = [
    {
      label: 'THE QUESTION',
      title: 'An authorised Actor asks APEX a decision question.',
      copy: 'The conversational or voice interface is the front door—not the intelligence itself. APEX identifies the Actor, decision, context and point in time.',
      extras: ['Which decision?', 'Which context?', 'Which point in time?', 'Who holds authority?']
    },
    {
      label: 'QUALIFY BEFORE ANSWERING',
      title: 'APEX asks enough questions to avoid answering the wrong problem.',
      copy: 'Where context is ambiguous or incomplete, APEX asks targeted qualifying questions. It does not manufacture certainty from a vague prompt.',
      extras: ['Which baseline applies?', 'What changed?', 'What business outcome is exposed?', 'Whose voice is missing?']
    },
    {
      label: "THE ORGANISATION'S IQ",
      title: 'Relevant evidence is identified, qualified and preserved.',
      copy: 'Business cases, benefits, contracts, plans, risks, changes, tests, approvals and conversations are assessed for owner, version, effective time, status and provenance.',
      extras: ['Intent', 'Commitments', 'Delivery', 'Assurance', 'Authority', 'Outcomes']
    },
    {
      label: 'SEMANTIC MAPPING',
      title: 'The evidence is mapped into the APEX ontology.',
      copy: 'Actors, Roles, Authority, Purpose, Commitments, Work, Decisions, Conditions, Evidence and Outcomes become meaningfully connected without losing their source or time.',
      extras: ['Actor', 'Authority', 'Purpose', 'Decision', 'Condition', 'Evidence']
    },
    {
      label: 'EXPLAINABLE REASONING',
      title: 'APEX tests the question against explicit rules and competency questions.',
      copy: 'Contradictions, gaps, dependencies, time-validity and strategic drift are surfaced. Facts, assertions, inferences and missing evidence remain distinguishable.',
      extras: ['Rules', 'Contradictions', 'Causality', 'Time', 'Confidence', 'Limitations']
    },
    {
      label: 'THE OUTPUT',
      title: 'The authorised person receives an APEX Decision Brief.',
      copy: 'It contains the answer, evidence trail, opposing evidence, unmet conditions, required actions, confidence, limitations and the roles that must decide.',
      extras: ['Answer', 'Why', 'Evidence', 'Action', 'Authority', 'Audit trail']
    }
  ];

  const journey = document.querySelector('[data-reasoning-journey]');
  if (journey) {
    const nodes = [...journey.querySelectorAll('[data-flow-step]')];
    const label = journey.querySelector('[data-flow-label]');
    const title = journey.querySelector('[data-flow-title]');
    const copy = journey.querySelector('[data-flow-copy]');
    const extra = journey.querySelector('[data-flow-extra]');
    const pulse = journey.querySelector('.reasoning-pulse');
    let activeIndex = 0;
    let timer;

    const setFlowStep = (index, userInitiated = false) => {
      activeIndex = index;
      nodes.forEach((node, nodeIndex) => {
        const isActive = nodeIndex === index;
        node.classList.toggle('is-active', isActive);
        node.setAttribute('aria-selected', String(isActive));
      });
      const content = flowContent[index];
      label.textContent = content.label;
      title.textContent = content.title;
      copy.textContent = content.copy;
      extra.innerHTML = content.extras.map((item) => `<span>${item}</span>`).join('');
      pulse.style.setProperty('--flow-position', `${5 + (index / (nodes.length - 1)) * 90}%`);
      if (userInitiated) restartFlowTimer();
    };

    const restartFlowTimer = () => {
      window.clearInterval(timer);
      if (!reduceMotion) {
        timer = window.setInterval(() => setFlowStep((activeIndex + 1) % nodes.length), 4200);
      }
    };

    nodes.forEach((node, index) => {
      node.addEventListener('click', () => setFlowStep(index, true));
      node.addEventListener('keydown', (event) => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        let next = index;
        if (event.key === 'ArrowRight') next = (index + 1) % nodes.length;
        if (event.key === 'ArrowLeft') next = (index - 1 + nodes.length) % nodes.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = nodes.length - 1;
        nodes[next].focus();
        setFlowStep(next, true);
      });
    });

    journey.addEventListener('mouseenter', () => window.clearInterval(timer));
    journey.addEventListener('mouseleave', restartFlowTimer);
    journey.addEventListener('focusin', () => window.clearInterval(timer));
    journey.addEventListener('focusout', (event) => {
      if (!journey.contains(event.relatedTarget)) restartFlowTimer();
    });

    setFlowStep(0);
    restartFlowTimer();
  }

  const selector = document.getElementById('case-selector');
  const preview = document.getElementById('case-preview');
  if (selector && preview) {
    const escapeHtml = (value) => String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');

    const renderPreview = (item) => {
      preview.innerHTML = `
        <p class="maturity-label ${escapeHtml(item.statusClass)}">${escapeHtml(item.maturity)}</p>
        <p class="case-actor">ASKED BY · ${escapeHtml(item.actor)}</p>
        <h3>${escapeHtml(item.question)}</h3>
        <h4>${escapeHtml(item.title)}</h4>
        <p>${escapeHtml(item.detail)}</p>
        <div class="case-outcome"><span>Current position</span><strong>${escapeHtml(item.answer)}</strong></div>
        <a class="button button-primary" href="${escapeHtml(item.link)}">${escapeHtml(item.linkLabel)}</a>
      `;
    };

    fetch('case-studies.json')
      .then((response) => {
        if (!response.ok) throw new Error('Case-study catalogue could not be loaded.');
        return response.json();
      })
      .then((items) => {
        selector.innerHTML = items.map((item, index) => `
          <button type="button" class="case-option ${index === 0 ? 'is-active' : ''}" role="tab" aria-selected="${index === 0}" data-case-id="${escapeHtml(item.id)}">
            <span>${escapeHtml(item.number)}</span>
            <div><small>${escapeHtml(item.status)}</small><strong>${escapeHtml(item.question)}</strong><p>${escapeHtml(item.summary)}</p></div>
          </button>
        `).join('');

        const buttons = [...selector.querySelectorAll('[data-case-id]')];
        buttons.forEach((button, index) => {
          button.addEventListener('click', () => {
            buttons.forEach((candidate) => {
              const active = candidate === button;
              candidate.classList.toggle('is-active', active);
              candidate.setAttribute('aria-selected', String(active));
            });
            renderPreview(items[index]);
          });
        });
        renderPreview(items[0]);
      })
      .catch((error) => {
        selector.innerHTML = '<p class="loading-note">The case-study catalogue is unavailable. Refresh the page from a local web server.</p>';
        preview.innerHTML = `<p>${escapeHtml(error.message)}</p>`;
      });
  }

  const northstarTabs = document.querySelector('[data-northstar-tabs]');
  if (northstarTabs) {
    const buttons = [...northstarTabs.querySelectorAll('[data-northstar-panel]')];
    const panels = [...northstarTabs.querySelectorAll('[data-northstar-content]')];
    buttons.forEach((button, index) => {
      button.addEventListener('click', () => {
        buttons.forEach((candidate) => candidate.setAttribute('aria-selected', String(candidate === button)));
        panels.forEach((panel) => {
          const active = panel.dataset.northstarContent === button.dataset.northstarPanel;
          panel.hidden = !active;
          panel.classList.toggle('is-active', active);
        });
      });
      button.addEventListener('keydown', (event) => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        let next = index;
        if (event.key === 'ArrowRight') next = (index + 1) % buttons.length;
        if (event.key === 'ArrowLeft') next = (index - 1 + buttons.length) % buttons.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = buttons.length - 1;
        buttons[next].focus();
        buttons[next].click();
      });
    });
  }

  const interview = document.querySelector('[data-case-interview]');
  if (interview) {
    const steps = [...interview.querySelectorAll('[data-interview-step]')];
    const backButton = interview.querySelector('[data-interview-back]');
    const nextButton = interview.querySelector('[data-interview-next]');
    const progressText = interview.querySelector('[data-progress-text]');
    const progressBar = interview.querySelector('[data-progress-bar]');
    const summary = interview.querySelector('[data-interview-summary]');
    const summaryContent = interview.querySelector('[data-summary-content]');
    const editButton = interview.querySelector('[data-interview-edit]');
    const emailLink = interview.querySelector('[data-interview-email]');
    let current = 0;

    const showStep = (index) => {
      current = Math.max(0, Math.min(index, steps.length - 1));
      steps.forEach((step, stepIndex) => {
        const active = stepIndex === current;
        step.hidden = !active;
        step.classList.toggle('is-active', active);
      });
      summary.hidden = true;
      progressText.textContent = `Question ${current + 1} of ${steps.length}`;
      progressBar.style.width = `${((current + 1) / steps.length) * 100}%`;
      backButton.disabled = current === 0;
      nextButton.textContent = current === steps.length - 1 ? 'Create draft brief' : 'Next question';
      const control = steps[current].querySelector('input, textarea');
      window.setTimeout(() => control?.focus(), 0);
    };

    const getValues = () => Object.fromEntries(new FormData(interview).entries());
    const valueOrPrompt = (value, fallback) => value?.trim() || fallback;

    const createSummary = () => {
      const values = getValues();
      const actor = valueOrPrompt(values.actor, 'Actor not yet defined');
      const decision = valueOrPrompt(values.decision, 'Decision question not yet defined');
      const purpose = valueOrPrompt(values.purpose, 'Original purpose and benefits not yet defined');
      const change = valueOrPrompt(values.change, 'Material changes not yet defined');
      const evidence = valueOrPrompt(values.evidence, 'Evidence sources not yet defined');
      const quietVoice = valueOrPrompt(values.quietVoice, 'Quiet or missing voice not yet defined');
      const output = valueOrPrompt(values.output, 'Required decision support not yet defined');

      summaryContent.innerHTML = `
        <dl>
          <div><dt>Actor</dt><dd>${escapeHtml(actor)}</dd></div>
          <div><dt>Decision question</dt><dd>${escapeHtml(decision)}</dd></div>
          <div><dt>Purpose and benefits</dt><dd>${escapeHtml(purpose)}</dd></div>
          <div><dt>What changed</dt><dd>${escapeHtml(change)}</dd></div>
          <div><dt>Evidence available</dt><dd>${escapeHtml(evidence)}</dd></div>
          <div><dt>Quiet or missing voice</dt><dd>${escapeHtml(quietVoice)}</dd></div>
          <div><dt>Useful APEX output</dt><dd>${escapeHtml(output)}</dd></div>
        </dl>
      `;

      const body = [
        'APEX case-study interview',
        '',
        `Actor: ${actor}`,
        `Decision question: ${decision}`,
        '',
        `Purpose and intended benefits: ${purpose}`,
        '',
        `What changed: ${change}`,
        '',
        `Evidence available: ${evidence}`,
        '',
        `Quiet or missing voice: ${quietVoice}`,
        '',
        `Required APEX output: ${output}`
      ].join('\n');
      emailLink.href = `mailto:neil@orangepeelit.co.uk?subject=${encodeURIComponent(`APEX case study: ${decision}`)}&body=${encodeURIComponent(body)}`;

      steps.forEach((step) => { step.hidden = true; });
      summary.hidden = false;
      progressText.textContent = 'Draft brief created';
      progressBar.style.width = '100%';
      backButton.hidden = true;
      nextButton.hidden = true;
      summary.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
    };

    backButton.addEventListener('click', () => showStep(current - 1));
    nextButton.addEventListener('click', () => {
      if (current === steps.length - 1) createSummary();
      else showStep(current + 1);
    });
    editButton.addEventListener('click', () => {
      backButton.hidden = false;
      nextButton.hidden = false;
      showStep(0);
    });

    showStep(0);
  }
})();

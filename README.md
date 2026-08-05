# APEX microsite

Public static microsite for the Orange Peel OPUS and APEX research programme.

## Current release

**v0.6 — First proof of concept demonstrated**

This release restores the enduring OPUS-to-APEX narrative from v0.5 and places Northstar Release R12 inside a reusable case-study library rather than allowing one proof of concept to replace the broader proposition.

## Product narrative

- **OPUS** is the research-led operating system: principles, ontology, evidence discipline, competency questions and reasoning rules.
- **APEX** is the product that applies OPUS to difficult organisational decisions.
- Actors ask questions through a conversational or voice interface.
- APEX asks qualifying questions where the decision context is incomplete.
- Evidence is identified, qualified, mapped into the ontology and reasoned over.
- The output is an explainable decision brief for the authorised person.

## Case-study catalogue

Case studies are defined in `case-studies.json` and rendered by `script.js`.

Current catalogue:

1. **Should we go live?** — demonstrated through Northstar Release R12.
2. **Is our programme really on track?** — next research case.
3. **Will this programme deliver the benefits we wanted?** — planned.
4. **Should we approve this change?** — illustrative strategic-drift case.

Add future cases by appending a record to `case-studies.json` and adding a full case section where the result has been demonstrated.

## Main files

```text
index.html
styles.css
script.js
case-studies.json
README.md
CHANGELOG.md
assets/
├── orange-peel-brand.png
├── favicon.ico
├── favicon-32.png
└── apple-touch-icon.png
```

## Local preview

From the repository root:

```bash
py -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

A web server is required because the case-study selector loads `case-studies.json` using `fetch`.

## Public boundaries

- Northstar is a controlled synthetic proof of concept.
- APEX is not a production service or autonomous approval authority.
- The 72% trajectory-divergence example is illustrative future case material, not a Northstar POC result.
- The interview prototype stores nothing automatically; answers remain in the browser unless the visitor chooses to create an email.
- No private ontology files, source documents or implementation secrets are exposed.

## Accessibility

The site includes:

- semantic headings and landmarks;
- keyboard-operated flow, case and Northstar controls;
- visible focus states;
- reduced-motion support;
- a no-JavaScript explanation for the core reasoning flow.

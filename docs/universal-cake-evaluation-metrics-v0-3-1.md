---
dc:title: "Universal Cake Evaluation Metrics"
dcterms:version: "0.3.1"
dc:creator: "Christopher Steel"
dc:contributor: "Claude (Anthropic)"
dc:subject:
  - "evaluation"
  - "metrics"
  - "inclusive design"
  - "agency"
  - "wellbeing"
  - "power imbalances"
dc:description: "Evaluation metrics for products, services, and approaches. The goal is to support more people in better ways that support wellbeing, so that applications and services built with Universal Cake reflect these foundations in their product and design cycles."
dc:publisher: "UniversalCake"
dcterms:created: "2026-07-15"
dcterms:modified: "2026-07-17"
dc:type: "Text"
dc:format: "text/markdown"
dc:language: "en"
sat:language_bcp47: "en"
dc:source: ""
dc:relation: "sat-radar-entry-template"
dc:identifier: "universal-cake-evaluation-metrics"
dcterms:rightsHolder: "Christopher Steel"
dc:rights: >
  Copyright 2026 Christopher Steel / UniversalCake.
  SPDX-License-Identifier: AGPL-3.0-or-later
sat:uuid: ""
sat:version_at_creation: "0.3.1"
sat:migration_status: pre-sat
sat:changelog:
  - version: "0.3.1"
    date: "2026-07-17"
    author: "Christopher Steel"
    notes: >
      Merged the duplicate Data portability proxy into one bullet covering
      both machine-readable and human-readable export. Relocated three
      dark-pattern examples that were filed under the wrong row: the
      hit-a-limit/data-held-hostage case moved from Forgiveness to Leaves
      you whole, where the existing "hostage data" language already
      covers it; the undisclosed-limit half of that same case moved to
      Visible costs, since it is a disclosure-timing issue rather than a
      recoverability issue; the free-tier-export example (MEGA) moved
      from Plain asking to Leaves you whole as a named worked example.
      Kept the offers-of-assistance addition under Quiet by default and
      the vulnerability-disclosure sub-bullet under Security as originally
      placed; both fit their rows. Pluralized "system(s)" under
      Environment.
  - version: "0.3.0"
    date: "2026-07-17"
    author: "Christopher Steel"
    notes: >
      Integrated the technological-power-imbalances measurement proxies
      directly into the existing pillars rather than adding an eighth
      pillar, per that document's own recommendation. Added explicit,
      checklist-able proxies for the vendor <--> user relationship (exit cost,
      data portability, ToS volatility, pricing asymmetry) to Sovereignty
      & Privacy; added a new Representation subsection under Inclusive for
      the designer <--> designed-for relationship (representation distance,
      compensated vs. extractive research); added a new Market Position
      subsection under The Product or Service Itself for the
      platform <--> ecosystem relationship (market concentration, take rate,
      API stability, forkability, contributor concentration). Added the
      two cross-cutting measurement principles (information asymmetry is
      measurable; measure reversibility, not promises) and the
      reversibility one-question test as reusable guidance. Extended the
      scorecard template accordingly. VERSION NUMBER PROVISIONAL, pending
      Christopher's confirmation per house convention that version
      bumping is his call.
  - version: "0.2.0"
    date: "2026-07-15"
    author: "Christopher Steel"
    notes: >
      Major revision. Added Agency as an organizing category containing
      Sovereignty & Privacy (structural agency) and Interaction Patterns
      (supportive versus dark patterns). Added Security section. Added
      rating scale, evidence tags, gates, and stakeholder lenses. Broadened
      Accessibility with economic and cognitive questions. Added Exit and
      Portability questions. Added lifecycle guidance and scorecard
      template. Fixed typos, standardized question phrasing, applied
      project front matter, licence, and changelog conventions.
  - version: "0.1.0"
    date: ""
    author: "Christopher Steel"
    notes: "Initial incomplete draft."
---

# universal-cake-evaluation-metrics-v0.3.1

## Purpose

The general idea is to support more people in better ways that support wellbeing. Evaluating products, services, and approaches against these metrics allows Universal Cake to build applications and services with these foundations reflected in our product and design cycles.

The metrics ask two kinds of questions. Structural questions ask what a product is, its licence, its dependencies, where data rests, what happens when it disappears. Interaction questions ask what a product does to the person using it, moment to moment. A product can pass one and fail the other, so both are always evaluated.

A third thread runs through both: **power**. Every structural and interaction question has a "who holds the leverage here" version. Rather than scoring power as its own pillar, this version of the metrics threads explicit, checklist-able power-imbalance proxies through the existing pillars, at the three levels where they show up in practice — vendor <--> user (folded into Sovereignty & Privacy), designer <--> designed-for (folded into a new Representation subsection under Inclusive), and platform <--> ecosystem (folded into a new Market Position subsection under The Product or Service Itself).

## How to answer

### Rating scale

Answer each metric with one of the following ratings so that evaluations remain comparable across products and over time.

- **Strong**, the product actively advances this value
- **Moderate**, the product is adequate, with named limitations
- **Weak**, the product works against this value
- **Unknown**, insufficient information to rate, record what would resolve it

### Evidence tags

Tag every rating with how it is known.

- **Verified**, confirmed by direct inspection, testing, or measurement, record the method and date
- **Inferred**, a reasonable conclusion from documentation or architecture, not yet tested
- **Claimed**, asserted by the vendor or community, not independently checked

A rating of Strong with an evidence tag of Claimed is weaker than a rating of Moderate with a tag of Verified. Trial-gate evaluations (see Lifecycle) should carry Verified tags on all gate criteria.

### Gates

Some criteria are gates, not scores. A failed gate cannot be averaged away by strength elsewhere, it moves the item to the hold ring on the SAT radar until the named condition changes. Gate criteria are marked **[GATE]** throughout this document. The default gates are:

- Telemetry or content exposure that cannot be disabled
- A licence incompatible with the project
- Failure of the accessibility floor (content is unreachable for people using assistive technology)
- No exit, data or content cannot be extracted in usable form

Projects may add gates but should not remove these without recording why.

### Stakeholder lenses

Each question is asked from one or more perspectives. Where perspectives conflict, record the conflict rather than letting one answer hide the other.

- **Owner**, the person or organization deploying the product
- **User**, the people who interact with what is built
- **Community**, contributors, translators, the wider public affected
- **Environment**, energy, hardware, and material consequences

Example of a conflict worth surfacing: a product may increase the owner's sovereignty (self-hostable, permissive licence) while decreasing the user's (no data export, manipulative defaults).

### Measuring power asymmetry

Two principles apply wherever a power-imbalance proxy appears below.

**Asymmetry of information is itself measurable.** Compare what each party can know about the other. A vendor with telemetry on a user's every click, facing a user who cannot even read the source code, scores badly regardless of stated intentions.

**Measure reversibility, not promises.** A vendor's stated values are unfalsifiable; the cost of leaving is not. Almost every power-imbalance proxy below reduces to one question, estimable per-tool during evaluation without needing access to the vendor's internals:

> If this relationship turned hostile tomorrow, what would it cost the weaker party to walk away?

Record that cost in hours or dollars wherever it can be estimated. It is the closest thing this framework has to a universal power-imbalance metric, and it is worth asking explicitly under Sovereignty & Privacy even when the more specific proxies below are also answered.

## Inclusive

### Accessibility

**Alternative methods of interacting with content.** Lens: user. Would this decrease or increase the number of people who can access content? Consider vision, hearing, motor, and speech differences, and whether the product supports assistive technologies rather than merely tolerating them. **[GATE]** if content becomes unreachable for people using assistive technology.

**Multilingual integration.** Lens: user, community. Is it available in languages the audience understands? Separately, is adding a language feasible for the community, is localization a data file anyone can supply, or a code change only maintainers can make?

**Economic accessibility.** Lens: user. Is it free or affordable to use? Does it run on old or low-end hardware? Does it work on slow or intermittent connections?

**Cognitive accessibility.** Lens: user. Is it learnable without training? Does it use plain language? Is it forgiving of errors, and does it explain them without blame?

**Compatibility.** Lens: owner, user. Is it likely to be more or less compatible with:

- My hardware
- My operating system(s)
- My web browser(s)
- My input device(s)
- My output device(s)

### Representation

*New in v0.3.0, from the designer <--> designed-for imbalance.* Lens: community, user. The people making design decisions are rarely the people most affected by them; a team that is nondisabled, high-bandwidth, and native-English-speaking builds defaults that quietly encode its own circumstances as "normal," and the effects surface as exclusion presented as neutrality.

- **Representation distance.** Is there disabled representation on the design/engineering team or its advisory structure? Is user research from affected communities compensated and ongoing, or extractive and one-time?
- **Reading level and language coverage.** Do the artifacts themselves (not just the marketing) reveal whose life the designers imagined? Cross-reference against reading level, language coverage, device and bandwidth assumptions, and error-recovery paths already surfaced under Accessibility above — this question asks *why* those patterns exist, not just whether they do.
- Where representation cannot be assessed from public information, rate **Unknown** and record that its absence from public documentation is itself a data point.

### Resilience

Lens: owner, user. Does it continue to work when:

- It goes out of date, is the built artifact self-contained, or does it depend on live services, licence servers, or expiring tokens?
- During power outages, does it add infrastructure that can fail beyond what already serves the content?
- During network outages, does it function offline or degrade gracefully once loaded?

## Agency

Agency is the organizing question of this section: does the product help you achieve your goals, or does it distract you from them? Every interaction can be tested with one question, **whose goal does this interaction serve, and would the user recognize it as their own?**

Agency operates at two altitudes. Sovereignty is agency at the structural level, who controls the software, the data, and the terms. Interaction patterns are agency at the interaction level, whether the interface bends attention and choices toward the user's goals or away from them. A product can be structurally sovereign yet interactionally manipulative, or calm and polite on the surface while resting on total lock-in. Evaluate both.

### Sovereignty & Privacy

Lens: owner, user.

- Does this increase or decrease the tech owner's and the tech user's sovereignty? Where the two diverge, record both answers.
- Can the owner self-host, modify, fork, and redistribute without permission?
- Where does user data rest, on the user's machine, the owner's infrastructure, or a third party's?
- Does it phone home, telemetry, analytics, update checks, licence server contact? Can each be disabled? **[GATE]** if telemetry or content exposure cannot be disabled.
- When the user and the product disagree, who wins, can the user override, configure, or leave?

**Power-imbalance proxies (vendor <--> user).** *New in v0.3.0.* Score these explicitly rather than folding them into the general questions above; they are the checklist-able core of the vendor <--> user imbalance.

- **Exit cost.** The hours or dollars needed to migrate data and workflows to an alternative. This is the reversibility test above, applied specifically.
- **Data portability.** Does a complete, documented export exist? Rate machine-readable (usable by another program without reverse-engineering) and human-readable (usable by a person with no tooling) separately, Yes/no plus format for each — a technically-complete export that only a developer can parse is not the same guarantee as one a person can open and read.
- **Terms-of-service volatility.** How often have terms changed unilaterally over roughly the last five years? Count changes, note materiality, record the method (e.g., diffing archived snapshots).
- **Pricing asymmetry.** Is pricing public and stable, or negotiated in the dark? Opacity itself signals who holds the leverage, independent of whether current prices are reasonable.

### Interaction Patterns

Lens: user. Does it make use of supportive patterns or dark patterns? Avoidance of dark patterns alone rewards blandness, so each row pairs the harm to avoid with the care to look for. Rate the pair together.

| Supportive pattern, look for | Dark pattern, check against |
|------------------------------|------------------------------|
| Honest defaults, the pre-selected option serves the user | Preselection tricks, defaults serve the vendor |
| Easy exit, cancelling or deleting takes no more effort than starting | Roach motel, easy in, hard out |
| Forgiveness, undo exists, destructive actions are recoverable | Confirmshaming, punishment friction, blame |
| Natural stopping points, the interface has endings | Infinite scroll, autoplay chaining, engagement traps |
| Quiet by default, notifications are opt-in, batched, user-scheduled | Attention farming, manufactured urgency, streaks, offers of assistance that exceed free limits |
| Plain asking, consent says what will happen, no is as easy as yes | Consent walls, trick wording, nagging re-prompts |
| Visible costs, prices, limits, and data collection disclosed before commitment | Drip pricing, hidden telemetry, surprise charges, limits disclosed only after being hit rather than in advance |
| Leaves you whole, data, content, and settings exit with you in open formats | Lock-in, proprietary formats, hostage data (including data held behind a hit usage limit), free-tier accumulated data not freely downloadable (e.g. MEGA) |

Supplementary questions:

- Does it help you accomplish the goal you arrived with, or does it manufacture new goals for you?
- Can you predict what an action will do before you take it?
- Does it respect a completed task as finished, or reopen your attention afterward?
- Can you stop, leave, or take breaks without penalty?

A worked positive anchor: an accessibility bar that lets a visitor make a page readable, saves the choice locally, and gets out of the way serves exactly the goal the user arrived with, manufactures nothing, and re-engages no one.

## Sustainability

### Environment

**Direct impacts.** Lens: environment, owner, user. Does it use more or less energy:

- On my system(s)
- On the service provider's system(s)

**Indirect impacts.** Lens: environment, community. Does it require new hardware or hardware upgrades:

- For the product's host?
- For me?
- For others?

Does it use more or less bandwidth, and is the payload served once and cached, or repeatedly?

## Security

Lens: owner, user.

- What data does it collect, and where does that data rest?
- How are vulnerabilities reported, and is there a published security policy?
  - Is it advertised by the service or product creator, are users notified or kept in the dark?

- How quickly are security patches released, and is the project responsive to reports?
- What is the supply chain exposure, how many runtime dependencies, is third-party code vendored and pinned, do install scripts run arbitrary code?
- Does adding it expand or shrink the attack surface of the system it joins?
- Assessment method, record how the above was tested, network monitor used, platform, version, date.

## The Product or Service Itself

Lens: owner, community.

**Longevity.** Is this product, service, or idea more or less supported over the longer term? Consider institutional backing, funding model, contributor pool, release cadence, and commit activity, and rate what is observed, not what is hoped.

**Content endurance.** Would it make content behind the interface more or less likely to endure over time? For example, if it was removed, phased out, or replaced with a similar product, how would that affect stored content and data archives? Is content authored inside the tool, or merely enhanced by it? Enhancement layers leave content whole when they go, containers take content with them.

**Exit and portability.** **[GATE]** if no exit exists. Can data and content be exported in open formats? Does it rely on open standards or proprietary ones? What is the realistic migration path to a successor?

**Adjustability and support.** If there is a problem or a change needed, is it likely or unlikely that I could get support adjusting the product or service in ways that make it better? Consider the licence (is the fork-and-fix path open), the readability of the code, the quality of documentation, and the reachability of maintainers.

### Market Position

*New in v0.3.0, from the platform <--> ecosystem imbalance.* Lens: community, owner. Once a product becomes infrastructure — an app store, a search engine, a payment rail, a dominant framework, a de facto reference implementation — imbalance operates at the market level. The platform can tax, demote, or clone anything built on top of it.

- **Market concentration.** Simple market-share figures, or HHI if the data supports it. What share of the relevant ecosystem does the dominant operator control?
- **Take rate.** What is the platform's cut of transactions or value flowing through it, if any?
- **API stability and deprecation history.** How often has the platform broken things that depend on it?
- **Forkability.** Could the project realistically survive its steward turning hostile? This is a function of licence, governance structure, and bus factor together, not licence alone.
- **Contributor concentration.** What share of commits or merge authority sits with one company or entity? This is often the single most honest number available for this subsection — record it directly where commit history is public.

## Using these metrics in the lifecycle

These metrics attach to the SAT radar rings as follows.

- **Assess**, a light pass, ratings may carry Inferred and Claimed tags, gates are checked on available evidence.
- **Trial**, the gate pass, all gate criteria and the Security section must carry Verified tags before an item moves to trial. Findings during trial update the evaluation.
- **Adopt**, the evaluation is attached to the adoption record and migrates with the entry.
- **Re-review**, adopted items are re-evaluated on a schedule or on trigger events, a new major release, a licence change, a change of ownership or funding, or the appearance of telemetry in a point release. Products change, evaluations must too. A material shift in any Market Position proxy (e.g., a funding round, an acquisition, a governance change) is also a re-review trigger.

## Scorecard template

Copy this table into each evaluation and summarize one row per metric area.

| Metric area | Rating | Evidence | Notes |
|-------------|--------|----------|-------|
| Accessibility, alternative interaction | | | |
| Multilingual integration | | | |
| Economic and cognitive accessibility | | | |
| Representation | | | |
| Compatibility | | | |
| Resilience | | | |
| Agency, sovereignty & privacy | | | |
| Agency, power-imbalance proxies (exit cost, portability, ToS volatility, pricing asymmetry) | | | |
| Agency, interaction patterns | | | |
| Environment, direct and indirect | | | |
| Security | | | |
| Longevity | | | |
| Content endurance | | | |
| Exit and portability | | | |
| Adjustability and support | | | |
| Market position (concentration, take rate, API stability, forkability, contributor concentration) | | | |
| Gates | Pass / Fail (name any failed gate) | | |

## Further scaffolding

For citation, if wanted: Zuboff on surveillance asymmetries, Costanza-Chock's *Design Justice* on the designer/designed-for gap, the economics literature on switching costs and multi-homing, and the FSF/OSI tradition treating software freedom explicitly as a power question. Contract-theory language — "asymmetric bargaining power," "contracts of adhesion" — is also useful because it is legally established rather than rhetorical.

## License

This document, *Universal Cake Evaluation Metrics*, by **Christopher Steel**, with AI assistance from **Claude (Anthropic)**, is licensed under the [GNU Affero General Public License v3.0 or later](https://www.gnu.org/licenses/agpl-3.0.html).

## Changelog

| Version | Status | Notes |
|---------|--------|-------|
| 0.3.1 | Draft | Merged duplicate Data portability proxy (machine- and human-readable rated separately); relocated three dark-pattern examples to their correct rows (hostage-on-limit and MEGA example to Leaves you whole, undisclosed-limit-timing to Visible costs); pluralized Environment "system(s)" |
| 0.3.0 | Draft, version provisional | Integrated technological-power-imbalances proxies into Sovereignty & Privacy, new Representation subsection, new Market Position subsection, added measuring-power-asymmetry guidance and reversibility test, extended scorecard |
| 0.2.0 | Draft | Added Agency category (Sovereignty & Privacy, Interaction Patterns), Security section, rating scale, evidence tags, gates, stakeholder lenses, broadened accessibility, exit and portability, lifecycle guidance, scorecard template, housekeeping fixes |
| 0.1.0 | Draft | Initial incomplete draft |

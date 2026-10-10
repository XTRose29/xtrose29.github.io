# PolySearch public research page

Self-contained static HTML/CSS/JavaScript under `PolySearch/`, copied by the existing Jekyll GitHub Pages build. No runtime dependencies, backend, telemetry, model, or experiment collection. `_polysearch/` is maintenance tooling and is excluded by Jekyll's underscore-directory convention. The rest of the site is unchanged.

## Verified evidence export

From the website repository, with RESEARCH_ROOT pointing to the local Search_Agent checkout:

```sh
python3 _polysearch/export.py --research-root "$RESEARCH_ROOT"
python3 _polysearch/validate.py
node --check PolySearch/assets/app.js
bundle exec jekyll build
python3 _polysearch/validate.py _site/PolySearch
```

The export joins read-only immutable observations to the selected independent judgment version and the pilot report. It checks manifest/source hashes, raw and captured-artifact hashes, prompt fidelity, no-repair conditions, dimensions, atom scores and counts. Output is an allowlist; raw prompts, gold references, rationales, account identifiers and local paths never pass through. Earlier public exports remain in content-addressed `data/snapshots/` files.

The initial export includes eight observations, six answers and two quota blocks. Judgments are preliminary independent-AI review, with human audit pending. Replication progress is read from both evidence databases and is zero at publication. A planned date is never treated as an execution.

## Images and content rights

No third-party screenshots, UI assets, transcripts, benchmark texts or gold answers are included. Eight original pilot screenshot hashes and capture-day associations are listed in the public provenance manifest; publication permission has not been established. Source packets are also not redistributed. Explicit unavailable states replace media; no synthetic screenshot is used. Figures are original visualizations of recorded study measurements or clearly labeled proposed architecture. Tool names use neutral text branding. Official benchmark and tool links are in the page, not copied content.

## Future collection-day publishing

1. Finish collection and preserve immutable evidence using the existing research protocol. Do not collect through this website.
2. Obtain independent atomic grading, adjudicate disagreements, and record human-audit status accurately.
3. Review new observations for public release. The current exporter deliberately refuses new replication observations; extend its reviewed allowlist/schema and integrity checks in a separate publishing change. Do not remove that guard merely to make export succeed.
4. Verify each replication run and manifest, reconcile database observations with versioned judgments, and derive each day's actual count/status. Keep blocked outputs semantically null. Reassess narrative claims as evidence changes.
5. Regenerate latest JSON and preserve prior snapshots. Publish only approved measurements. Add screenshots/excerpts only after a documented rights/privacy review; record transformations and source hashes.
6. Run export, validation, JS syntax, full Jekyll build, browser keyboard/mobile checks and a complete public-output privacy scan. Verify existing pages still render.
7. Commit only `PolySearch/` and `_polysearch/`, push to the established `master` publishing branch, wait for `pages build and deployment`, and verify the live URL plus JSON/CSS/JS assets.

No automatic collection or unattended publishing jobs are installed. The first version's fail-closed guard is intentional; it prevents unreviewed future records becoming public findings.

## Local environment note

The existing lockfile uses legacy Jekyll/Liquid. Ruby 4 lacks several formerly bundled libraries and removed `tainted?`. Local validation used a temporary Gemfile adding installed csv/base64/logger/bigdecimal plus a temporary compatibility shim for removed no-op taint methods. Neither was committed; site Gemfile, lockfile, configuration and deployment remain unchanged. GitHub's existing Pages build is the authoritative deployment check. Use a compatible Ruby environment for ordinary `bundle exec jekyll build`.

# Joshua's AgencyThings Desktop Design

## Purpose

AgencyThings is Joshua's internal agency workspace: one dependable home for the tools, research environments, generators, and experiments he builds for agency work. It is not a public portfolio and it should not read like a marketing site. The first release is optimized for Joshua alone, while leaving room for collaborators and shared activity later.

## Core Principle

The AgencyThings desktop is a shared doorway, not a shared visual template. Every project must feel like its own bespoke world after launch.

- The hub provides common orientation, status, and launch behavior.
- Digital Task Brief Maker remains a focused guided production workflow.
- Problem Wall Lab remains a dense strategy command center.
- Gen Alpha Intelligence Lab remains an editorial living-research environment.
- Future projects may introduce entirely different visual systems when their subject matter calls for it.

The hub may preview each world's visual language, but it must not restyle the applications into one uniform dashboard.

## Information Architecture

The GitHub Pages root becomes the AgencyThings desktop instead of redirecting immediately to Digital Task Brief Maker.

```text
Joshua's AgencyThings
|-- Home
|   |-- Current work
|   |-- Recent things
|   `-- All things
|-- Digital Task Brief Maker
|   `-- /tools/digital-task-brief-maker/
|-- Problem Wall Lab
|   `-- https://agencythings-problem-wall.vercel.app
`-- Gen Alpha Intelligence Lab
    `-- https://agencythings-gen-alpha.vercel.app
```

The Task Brief Maker is published inside the GitHub Pages artifact. The two Next.js applications remain independent Vercel projects connected to their own directories in the same GitHub repository. This preserves each app's runtime needs without exposing that technical separation in the hub experience.

## Hub Experience

### Desktop Frame

The page uses a quiet agency-workspace composition rather than a landing-page hero:

- A compact left rail establishes the AgencyThings identity and primary navigation.
- The main workspace opens with `Joshua's AgencyThings` and a concise time-aware welcome.
- A current-work band surfaces the three active projects with one dominant featured project and two supporting entries.
- An all-things directory provides a durable home for every project and future addition.
- A small activity area reports useful, factual states such as deployment destination and project maturity without pretending to have live collaboration data.

### Project Entries

Each project entry includes:

- Project name and distinct monogram or mark
- Plain-language purpose
- Type such as `Workflow`, `Strategy Lab`, or `Living Research`
- State such as `Active` or `In development`
- A visual preview derived from the real application
- A single clear launch action
- Destination behavior that communicates when an app opens in a new tab

The project entries are not generic equal-sized cards. Their composition should preserve hierarchy and use preview treatments tailored to the project.

### Personalization

The hub uses Joshua's name directly and reflects his actual working set. Copy should be concise, familiar, and operational. Avoid portfolio language, audience claims, fake metrics, invented notifications, fake collaborators, or instructions explaining the interface.

## Visual Direction

The hub should feel like a refined creative-operations desktop:

- Neutral white and soft gray workspace surfaces
- Strong black typography and restrained borders
- Several project-specific accent colors rather than one dominant hue
- Compact navigation and controls
- Square or lightly rounded geometry, never pill-heavy styling
- Crisp visual previews that reveal the real tools
- No oversized marketing hero, gradients, decorative blobs, or nested card stacks

The hub typography should be clear and editorial enough to feel personal, while remaining compact enough for repeated internal use. Icons should come from one consistent outline set and include tooltips where their meaning is not familiar.

## Responsive Behavior

On desktop, the left rail stays visible and the project directory uses asymmetric space to establish priority. On mobile, navigation becomes a compact top bar, project previews stack in priority order, and launch actions remain immediately reachable. Text, preview frames, and controls must not overflow at 390px width.

## Interaction Model

- Selecting `Home`, `Current`, or `All things` scrolls or filters the hub without a page reload.
- Search filters project names, purposes, and types locally.
- Project launch controls open the correct application destination.
- The Task Brief Maker opens under the same GitHub Pages origin.
- Problem Wall and Gen Alpha open in new tabs because they are independent applications.
- A future `New thing` control may be added when there is a real creation workflow; the first release will not include an inert button.

## Deployment

The GitHub Pages workflow must publish the repository-level hub plus the complete `tools/digital-task-brief-maker/` directory. It must no longer copy only the Task Brief directory into the site root.

The existing Vercel projects retain these root directories:

- `apps/problem-wall-lab`
- `apps/gen-alpha-lab`

No iframe embedding is used. Each app owns its document, navigation, responsive behavior, and deployment.

## Failure Handling

- Every launch destination has a normal anchor link, so navigation still works without JavaScript.
- External launch links use `target="_blank"` and `rel="noreferrer"`.
- Preview assets have meaningful fallback colors and labels if an image fails.
- The hub does not claim a remote service is online based on a hard-coded badge; status labels describe project state, not live uptime.

## Verification

Completion requires all of the following evidence:

1. Hub links resolve to the Task Brief Maker, Problem Wall Lab, and Gen Alpha Intelligence Lab.
2. The GitHub Pages artifact contains both the hub root and Task Brief subdirectory.
3. Hub search and navigation work with keyboard and pointer input.
4. Desktop and 390px mobile screenshots show no overflow or incoherent overlap.
5. The hub is visually verified against its approved design concept.
6. Each destination is opened and its own distinct design is visible.
7. Existing tests for all three projects continue to pass.

## Future Expansion

Collaboration, authentication, shared activity, favorites, and project creation are intentionally deferred. The first release establishes the durable desktop and project registry those capabilities can later extend.

# Joshua's AgencyThings And Task Brief V2 Design

## Purpose

Joshua's AgencyThings is a private, portable workbench for the tools Joshua uses across agency jobs. It is not a public portfolio, a team dashboard, or a product catalog. The desktop should answer one question quickly: what am I here to do?

Digital Task Brief Maker remains a proven production workflow. V2 improves its visual quality and hosting without altering the behavior Joshua has already validated.

## Product Boundary

### AgencyThings may change

- Personal identity and navigation
- Tool labeling, color, motion, and hierarchy
- Tool organization and recent-return behavior
- Launch destinations
- Responsive layout and accessibility

### Digital Task Brief Maker may change

- Typography, spacing, color, borders, surfaces, and responsive composition
- Visual hierarchy across the existing five steps
- Upload-zone, review-row, source-panel, customization, and export presentation
- Header and progress treatment
- Deployment configuration

### Digital Task Brief Maker must not change

- File ingestion and parsing
- Five-step order and step gating
- Grouping and review decisions
- Source package generation
- Customization controls and stored options
- Clipboard, JSON, PowerPoint, Google Slides-ready, print, or PDF exports
- Existing DOM contracts relied on by `src/app-upgraded.js`

## AgencyThings Information Architecture

The existing `Current` and `All things` navigation is replaced by personal action modes:

- **Home**: pinned tools, recently opened tool, and search
- **Make**: production tools, beginning with Digital Task Brief Maker
- **Think**: strategy and idea tools, beginning with Problem Wall Lab
- **Learn**: intelligence and research tools, beginning with Gen Alpha Intelligence Lab

The desktop header and upper-left identity both read `Joshua's AgencyThings`.

The three primary tools remain visible on Home. The action-mode views filter the same registry rather than duplicating project content. A future tool only needs a registry entry with one of the modes.

## Tool Treatments

Each tool owns a color that appears consistently in its type label, accent rule, launch control, focus state, and hover response:

- Digital Task Brief Maker: cobalt blue
- Problem Wall Lab: signal coral-red
- Gen Alpha Intelligence Lab: acid green

Tool rows lift 4px on hover with a short shadow and accent-color response. Motion is subtle, stable, and disabled under `prefers-reduced-motion`. The preview image does not zoom independently from the row.

## Task Brief Visual Direction

The Task Brief world should feel like a current production application rather than a collection of form panels:

- Quiet white and cool-gray canvas
- Cobalt blue as the primary workflow color
- Compact persistent five-step navigation
- Stronger distinction between primary action, secondary action, and status
- Table-like review rows optimized for scanning
- Open sections with restrained boundaries instead of stacked rounded cards
- Clear upload state and file metadata
- More deliberate type scale for workflow chrome versus brief content
- Existing light/dark behavior retained and visually harmonized

No new marketing hero or explanatory feature copy is introduced.

## Hosting

Digital Task Brief Maker becomes its own Vercel project with root directory:

```text
tools/digital-task-brief-maker
```

The project receives a stable production alias. AgencyThings updates its Task Brief destination to that alias. The GitHub Pages nested path remains temporarily available as a fallback during rollout, but the hub launches Vercel after live verification.

Problem Wall and Gen Alpha continue using their existing independent Vercel projects.

## Verification

Completion requires:

1. Existing Task Brief tests pass unchanged.
2. A browser smoke test completes upload/sample, review, source, customize, and export navigation.
3. Export controls still produce their expected artifacts or clipboard state.
4. AgencyThings labels and hover behavior use each tool's accent color.
5. Home, Make, Think, Learn, search, and recent-return behavior work by keyboard and pointer.
6. Hub and Task Brief have no horizontal overflow at 390px.
7. The new Vercel Task Brief URL and legacy Pages fallback both open the correct tool.


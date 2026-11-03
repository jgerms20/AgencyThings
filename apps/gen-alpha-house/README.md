# Gen Alpha House (legacy entry point)

The House now lives inside the [Gen Alpha Intelligence Lab](https://agencythings-gen-alpha.vercel.app/house). This former standalone app redirects to that canonical route. Edit House data and UI in `apps/gen-alpha-lab` so the rooms and research always ship together.

## Local development

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Verification

```bash
npm test
npm run build
```

## Deployment

If the former standalone Vercel project is still connected, keep its project root at:

```text
apps/gen-alpha-house
```

The app does not require environment variables. It only redirects to the Lab; the existing `agencythings-gen-alpha` project must continue to use `apps/gen-alpha-lab` as its root.

## Generated artwork

- `public/gen-alpha-bedroom.jpg` is the boys’ room production scene.
- `public/gen-alpha-girls-bedroom.png` is the girls’ room production scene.

The assets were generated specifically for this project and contain no real brand logos or identifiable children.

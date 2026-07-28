# Gen Alpha House

An immersive companion to the [Gen Alpha Intelligence Lab](https://agencythings-gen-alpha.vercel.app). The experience maps 32 sourced research connections onto eight familiar objects in one Gen Alpha bedroom while keeping the Lab as the authoritative source for full insights and evidence.

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

Create a separate Vercel project from the `jgerms20/AgencyThings` repository and set the project root to:

```text
apps/gen-alpha-house
```

The app is static and does not require environment variables. Do not point the existing `agencythings-gen-alpha` project at this directory; the House is a companion deployment.

## Generated artwork

- `public/gen-alpha-bedroom.jpg` is the one-room production scene.

The assets were generated specifically for this project and contain no real brand logos or identifiable children.

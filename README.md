# Brandly

# BrandLy

A brand and product management system built with React, TypeScript, and Firebase.

### Features

- 🌓 Dark/Light mode
- 🔐 Authentication
- 📱 Responsive design
- 🏷️ Brand management
- 📦 Product management
- 🔍 Search functionality
- 🖼️ Image upload with Cloudinary

### Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Firebase
- Vite
- Cloudinary

### Environment Variables

Create a `.env` file in the root directory with the following variables:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_CLOUDINARY_CLOUD_NAME`

### Default Admin Credentials

- Email: `admin@brandly.com`
- Password: `Brandlyadmin`

### Development

To start the project locally, run:

```bash
npm run dev
```

Open `http://localhost:5173` with your browser to see the result.

## Documentation

### Requirements

- Node.js >= 20
- npm >= 10

### Directory Structure

- [`.github`](.github) — GitHub configuration including the CI workflow.<br>
- [`.husky`](.husky) — Husky configuration and hooks.<br>
- [`public`](./public) — Static assets such as robots.txt, images, and favicon.<br>
- [`src`](./src) — Application source code, including pages, components, styles.

### Scripts

- `npm run dev` — Starts the application in development mode at `http://localhost:5173`.
- `npm run build` — Creates an optimized production build of your application.
- `npm run type-check` — Validate code using TypeScript compiler.
- `npm run lint` — Runs ESLint for all files in the `src` directory.
- `npm run format` — Runs Prettier for all files in the `src` directory.

### Path Mapping

TypeScript are pre-configured with custom path mappings. To import components or files, use the `@` prefix.

```tsx
// To import images or other files from the public folder
import avatar from '@/public/avatar.png'

import { Button } from '@/components/Button'
```

### Switch to Yarn/pnpm

This starter uses npm by default, but this choice is yours. If you'd like to switch to Yarn/pnpm, delete the `package-lock.json` file, install the dependencies with Yarn/pnpm, change the CI workflow, and Husky Git hooks to use Yarn/pnpm commands.

> **Note:** If you use Yarn, make sure to follow these steps from the [Husky documentation](https://typicode.github.io/husky/troubleshoot.html#yarn-on-windows) so that Git hooks do not fail with Yarn on Windows.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for more information..

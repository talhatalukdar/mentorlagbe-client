# MentorLagbe — Client

A modern, responsive frontend for **MentorLagbe**, a tuition and mentorship marketplace developed for **Programming Hero Assignment 9 — Category 001**.

Built with Next.js App Router and TypeScript, MentorLagbe provides dedicated experiences for Students, Tutors, and Administrators. Students can discover and apply for tuition opportunities, tutors can manage listings and applicants, and administrators can manage platform activities. The application also integrates Stripe subscriptions for Student Pro and Tutor Pro.

## Project Links

| Resource | Link |
|---|---|
| Live Application | [MentorLagbe](https://mentorlagbe-client-two.vercel.app) |
| Backend API | [Live Backend](https://mentorlagbe-server-mjsd.onrender.com) |
| Client Repository | [GitHub](https://github.com/talhatalukdar/mentorlagbe-client) |
| Server Repository | [GitHub](https://github.com/talhatalukdar/mentorlagbe-server) |

**Demo credentials:** Administrator and tutor test credentials are provided separately through the assignment submission form. They are intentionally not stored in this repository.

## Technology Stack

| Category | Technologies |
|---|---|
| Framework | Next.js 16, App Router |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | Radix UI |
| Animations | Motion |
| Icons | Lucide |
| Notifications | Sonner |
| Theme Management | next-themes |
| Forms & Validation | React Hook Form, Zod |
| Data Fetching | TanStack Query |
| Charts | Recharts |
| Authentication | BetterAuth, JWT Plugin |
| Utility Libraries | clsx, tailwind-merge, class-variance-authority |

## Features

### Public Experience
- Animated landing page with responsive sections.
- Browse approved tuition listings.
- Server-side search, filtering, sorting, and pagination.
- Tuition details with tutor information and pricing.
- How It Works and About pages.
- Responsive navigation and page layouts.

### Authentication
- Student and Tutor registration.
- Email and password sign-in through BetterAuth.
- Role selection during registration.
- Validated authentication forms.
- Session persistence across page reloads.
- Toast notifications for user feedback.

### Student Dashboard
- Dashboard overview and statistics.
- View submitted tuition applications.
- Cancel pending applications.
- Browse saved tuition listings.
- Submit reviews after application acceptance.
- Upgrade to Student Pro through Stripe Checkout.

### Tutor Dashboard
- Dashboard overview and statistics.
- Create new tuition listings.
- Direct ImgBB banner image uploads.
- Manage existing tuition listings.
- Edit, delete, and close or reopen listings.
- View student applicants.
- Accept or reject applications.
- Free-plan limit of two tuition posts.
- Upgrade to Tutor Pro through Stripe Checkout.

### Admin Dashboard
- Dashboard overview with statistics and charts.
- User management and role updates.
- Tutor verification management.
- Tuition approval and rejection.
- Transaction management.

### Additional Application Features
- Profile management and profile-picture uploads.
- Stripe Checkout success and cancellation pages.
- Dark, light, and system theme support.
- Responsive layouts for different screen sizes.
- Loading skeletons and error handling.
- Custom 404 page.
- Subject-themed image placeholders and fallbacks.

## Authentication & API Architecture

The frontend communicates with the Express backend through same-origin API requests.

### API Request Flow

The application uses Next.js rewrites configured in `next.config.ts` to forward `/api/*` requests to the Express backend through the `API_URL` environment variable.

This approach allows the browser to communicate with its own application origin while the Next.js server forwards API requests to the backend.

### Authentication Flow

- BetterAuth handles email and password authentication.
- Authentication cookies remain first-party through the same-origin API setup.
- The dashboard layout resolves the authenticated session on the server and enforces the required user role.
- Server-side requests forward the necessary cookies to the Express API.
- The Express backend independently verifies JWTs and user roles for protected API requests.
- `src/proxy.ts` performs a lightweight session-cookie pre-check.

**Security note:** The frontend role checks are not treated as a replacement for backend authorization. Protected operations are independently verified by the Express server.

## Installation & Local Setup

### Prerequisites
- Node.js
- npm
- A running MentorLagbe backend API
- Required environment configuration

### 1. Clone the Repository

```bash
git clone https://github.com/talhatalukdar/mentorlagbe-client.git
cd mentorlagbe-client
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a local environment file from the example:

```bash
cp .env.example .env.local
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Configure the following variables in `.env.local`:

| Variable | Description |
|---|---|
| `API_URL` | Base URL of the Express backend API |
| `NEXT_PUBLIC_SITE_URL` | Public URL of the frontend application |

For local development, configure `API_URL` to point to your running backend.

### 4. Start the Development Server

```bash
npm run dev
```

The frontend will be available at:

```text
http://localhost:3000
```

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create a production build |
| `npm start` | Start the production server |
| `npm run lint` | Run the configured lint checks |

## Environment Configuration

The application uses environment variables to configure the backend connection and public site URL.

- `API_URL` is used by the Next.js server for backend API rewrites.
- `NEXT_PUBLIC_SITE_URL` identifies the frontend application's public URL.

Keep environment-specific configuration in `.env.local`.

**Security notice:** Never commit `.env.local`, private credentials, or secret API keys to the repository.

## Deployment — Vercel

The frontend is deployed on Vercel.

### Required Environment Variables

Configure the following variables in the Vercel project settings:

| Variable | Production Configuration |
|---|---|
| `API_URL` | Deployed Express backend URL |
| `NEXT_PUBLIC_SITE_URL` | Deployed frontend origin |

### Backend Configuration

The backend must also be configured with the correct production URLs:

- `CLIENT_URL` must match the deployed frontend origin.
- `BETTER_AUTH_URL` must point to the public backend URL.

Ensure that the frontend and backend environment configurations match before deploying.

## Browser Testing

The project includes browser automation scripts using **Selenium with headless Firefox**.

### Prerequisites

- Python
- Selenium
- Firefox browser
- GeckoDriver available on PATH, or configured through environment variables.

Install Selenium:

```bash
pip install selenium
```

If necessary, configure:

- `FIREFOX_BIN`
- `GECKODRIVER_BIN`

### Run Browser Tests

Start the backend with the required demo data and run the frontend locally on port `3000`.

Run the browsing test:

```bash
python e2e/browse.py
```

Run the application flow tests with the required test credentials:

```bash
E2E_ADMIN_EMAIL=your-admin-email \
E2E_ADMIN_PASSWORD=your-admin-password \
E2E_DEMO_PASSWORD=your-demo-password \
python e2e/flows.py
```

Use the appropriate environment-variable syntax for your operating system. Never commit test credentials to the repository.

The scripts provide browser-based testing support; they are not presented as a fully integrated CI testing pipeline.

## Design & User Interface

MentorLagbe uses a clean, modern interface with responsive layouts and subtle visual effects.

### Typography
- **Headings:** Barlow Condensed
- **Body Text:** Inter

Both fonts are self-hosted through `@fontsource`, avoiding external font requests.

### Visual Design
- Light background surfaces.
- Soft pastel corner gradients and section washes.
- Violet, pink, sky, amber, and mint accent colors.
- Dark, light, and system theme options.
- Consistent spacing and responsive page layouts.
- Subtle animations and interactive UI elements.

### Images & Fallbacks
- Subject-related images use free-to-use Pexels photography.
- Subject image data is maintained in `src/lib/subject-photos.ts`.
- Gradient fallbacks are displayed when images fail to load.
- Tuition listings without uploaded banners use subject-themed placeholders.

## Known Limitations & Content Notes

- The homepage hero illustration currently uses an original line drawing rather than a custom licensed illustration.
- Homepage testimonials are sample content and are labelled accordingly.
- Footer contact details in `src/lib/site.ts` are placeholders and should be updated with final contact information.
- Tuition listings without uploaded banners display subject-themed placeholders instead of stock photography.
- Browser automation scripts are available, but a fully integrated end-to-end CI test suite is not included.

---

**MentorLagbe — Connecting Students with the Right Tutors.**
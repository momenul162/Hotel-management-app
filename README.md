# Hotel Management App

A modern, full-featured hotel management system built with React, Redux Toolkit, TypeScript, Vite, and Tailwind CSS. This application streamlines hotel operations, including room management, reservations, guest tracking, staff, inventory, and reporting.

## Features

- **Dashboard**: Overview of hotel stats, recent bookings, and available rooms.
- **Room Management**: Add, edit, filter, and view room details and statuses.
- **Guest Management**: Track guest information, VIP status, and visit history.
- **Reservations**: Manage bookings, check-in/out, and booking statuses.
- **Staff Management**: Add, edit, and monitor staff members and their statuses.
- **Inventory**: Track inventory items, request restocks, and generate reports.
- **Reports**: Visualize revenue, occupancy, and other key metrics.
- **Settings**: Customize app preferences, theme, and more.
- **Authentication**: Secure login and registration for staff.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS
- **State Management**: Redux Toolkit
- **UI Components**: Radix UI, Lucide Icons, Chart.js, React Hook Form
- **Data Fetching**: Axios, React Query
- **Utilities**: Lodash, date-fns, xlsx, file-saver
- **Testing & Linting**: ESLint

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- pnpm (or npm/yarn)

### Installation

```sh
pnpm install
```

### Development

```sh
pnpm dev
```

### Build

```sh
pnpm build
```

### Preview

```sh
pnpm preview
```

## Project Structure

- `src/pages/` — Main app pages (Dashboard, Rooms, Guests, Reservations, etc.)
- `src/components/` — Reusable UI and feature components
- `src/redux/` — Redux store, slices, and services
- `src/types/` — TypeScript types and interfaces
- `src/utils/` — Utility functions and helpers
- `public/` — Static assets

## Customization

- Update hotel branding, images, and settings in the `public/` and `src/assets/` folders.
- Modify theme and UI in `src/components/ui/` and `src/App.css`.

## License

This project is for educational and demonstration purposes.

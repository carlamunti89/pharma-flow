# PharmaFlow | FEFO Inventory Management System

PharmaFlow is a high-performance, professional inventory management solution specifically designed for the pharmaceutical sector. It implements the **FEFO (First-Expired, First-Out)** methodology to optimize stock rotation and minimize financial losses due to expired medications.

---

## Project Goal

As a Frontend Developer, my goal with PharmaFlow was to build a production-ready application that solves a real-world business problem while maintaining high standards of **software craftmanship**, **type safety**, and **automated testing**.

## Key Features

- **Intelligent FEFO Logic:** Automatic sorting and visual prioritization based on expiration dates.
- **Data Integrity:** Strict schema validation using **Zod** before state updates.
- **Real-time Analytics:** Dynamic dashboard calculating total inventory value, global stock, and at-risk capital.
- **Professional Reporting:** Exportable inventory reports in **PDF** format (via `jsPDF-AutoTable`).
- **Advanced Filtering:** Multi-criteria search (Name, CN, Lot) and status-based filtering (At Risk, Expired).
- **Security & Persistence:** Protected routes simulation and session persistence via `localStorage`.
- **UI/UX:** Fully responsive design with **Dark Mode** support and accessible interface.

## Technical Stack

- **Core:** React 18 (Hooks: `useMemo`, `useEffect`, `useState`).
- **Language:** **TypeScript** (Advanced interfaces, Omit types, and strict typing).
- **Styling:** Tailwind CSS (Utility-first, responsive, and theme-switching).
- **Validation:** Zod (Schema-based validation).
- **Testing:** **Vitest & React Testing Library** (Unit and Integration testing) **Cypress** (End-to-End (E2E) testing).
- **Icons:** Lucide React.
- **PDF Engine:** jsPDF.

## Software Architecture

This project follows a modular architecture based on **Separation of Concerns (SoC)**:

- **`/core`**: Pure business logic (Analytics) and validation schemas. Completely decoupled from the UI to allow 100% testability.
- **`/services`**: Abstraction layer for external services (Mock API and PDF Generation).
- **`/components`**: Atomic and reusable UI components.
- **`/hooks`**: Custom hooks for shared logic (e.g., `useDarkMode`).

## Quality Assurance (Testing)

Reliability is non-negotiable in pharmaceutical software. This project includes a comprehensive test suite:

- **Unit Tests (Vitest):** Validating mathematical accuracy in FEFO logic and date-based stock prioritization.
- **Integration Tests (React Testing Library):** Ensuring UI components react correctly to user input, Zod validation errors, and state changes.
- **E2E Testing (Cypress):** Simulating real-world user journeys, including the full lifecycle: Login → Add Medication → Search → Delete, as well as session persistence via localStorage.
- **Edge Case Coverage:** Automated verification of empty states, invalid date formats, and zero-stock scenarios.

## Installation & Setup

1. **Clone the repository:**

   1. **Clone the repository:**

   ```typescript
   git clone https://github.com/carlamunti89/pharmaflow.git

   ```

2. **Install dependencies:**

   ```typescript
   npm install

   ```

3. **Launch development server:**

```typescript
npm run dev


```

---

## 👤 Author

- **LinkedIn:** [linkedin.com/in/carla-muntada-garcia](https:www.linkedin.com/in/carla-muntada-garcia)
- **Portfolio:** [tu-web-o-demo.vercel.app](https://tu-web-o-demo.vercel.app)

---

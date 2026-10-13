# 🚀 React Monorepo Cheat Sheet & Troubleshooting Guide

This guide covers the architecture, deployment rules, common failure modes, resolutions, and essential commands for managing your nested React monorepo deployed to GitHub Pages.

---

## 1. Monorepo Architecture Overview

* **Deployment Domain:** `https://itzrealsam.github.io/ultimate-react-course/`
* **Root Structure:** Standardized workspace configuration inside root `package.json` pointing to nested project folders:
  * `projects/create-react-apps/*`
  * `projects/vite-apps/*`
* **Static Entry Point:** Root `index.html` referencing each project's built subdirectory path.

---

## 2. Vite Workspaces Deployment Rules

### Rule 1: Set Absolute Base Path in `vite.config.js`
When deploying Vite sub-apps inside subdirectories on GitHub Pages, relative bases (`"./"`) break multi-route resolving. You must specify the exact repository path.

```javascript
// projects/vite-apps/11-worldwise/vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/ultimate-react-course/projects/vite-apps/11-worldwise/",
});
```

---

### Rule 2: Configure `basename` in `App.jsx`
Always pass `import.meta.env.BASE_URL` to your `<BrowserRouter>` so React Router knows the base subpath of the application.

```jsx
// projects/vite-apps/11-worldwise/src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter
      basename={import.meta.env.BASE_URL}
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="product" element={<Product />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

---

### Rule 3: Use Relative Paths in Navigation Components
Avoid leading slashes in your route links (`to="/pricing"`) because leading slashes force navigation to jump directly to the root domain (`itzrealsam.github.io/pricing`).

```jsx
// projects/vite-apps/11-worldwise/src/components/PageNav.jsx
import { NavLink } from "react-router-dom";

function PageNav() {
  return (
    <nav>
      <ul>
        <li>
          <NavLink to=".">Home</NavLink>
        </li>
        <li>
          <NavLink to="pricing">Pricing</NavLink>
        </li>
        <li>
          <NavLink to="product">Product</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default PageNav;
```

---

## 3. Create React App & Data Fetching Rules

### Rule 4: Handle Data Fetching Without `json-server`
GitHub Pages is a static host and cannot run dynamic backend servers (`json-server`).

* **Failure:** Fetching from `http://localhost:8000/questions` results in runtime errors on live sites.
* **Fix:** Place static `.json` files inside the project's `public/` directory (e.g., `public/questions.json`) and fetch directly:
  ```javascript
  useEffect(() => {
    fetch("./questions.json")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);
  ```

---

## 4. Bug & Error Resolution Log

| Issue / Symptom | Root Cause | Exact Fix |
| :--- | :--- | :--- |
| **Asset 404 & White Screen** (`index-<hash>.js 404`) | Vite defaults to root base (`/`), searching `itzrealsam.github.io/assets/`. | Set `base: "/ultimate-react-course/projects/vite-apps/[app-name]/"` in `vite.config.js`. |
| **Routing Jumps to Root** (`itzrealsam.github.io/pricing`) | Leading slashes in links (`to="/pricing"`) override the app's base route. | Remove leading slashes: use `<NavLink to="pricing">` and `<NavLink to=".">`. |
| **404 Not Found Page on Navigation** | React Router missing subpath context on page transitions. | Add `basename={import.meta.env.BASE_URL}` to `<BrowserRouter>`. |
| **Data Fetch Error on CRA Apps** | Attempting to connect to local `json-server` (`localhost:8000`) on static live hosting. | Move data to `public/data.json` and use relative path fetching (`./data.json`). |

---

## 5. Helpful NPM Commands

### Targeted Builds
Build a single project without recompiling the entire monorepo:
```bash
# Vite project targeted build
npm run build --workspace=projects/vite-apps/11-worldwise

# Create React App targeted build
npm run build --workspace=projects/create-react-apps/10-react-quiz
```

### Full Workspace Build
Build every workspace project before deploying:
```bash
npm run build --workspaces --if-present
```

### Deployment Commands
```bash
git add .
git commit -m "fix(worldwise): configure vite base path and router basename"
git push origin main
```
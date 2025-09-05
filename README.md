# 🔒 Secu Scan

**Secu Scan** is a responsive and modern frontend web application built with **React** and **TailwindCSS**, providing users with a clean dashboard to visualize various security metrics and logs. It features GitHub authentication, a light/dark theme toggle, and a suite of interactive UI components.

---

## 🚀 Features

- 🖥️ **Landing Page** with GitHub login
- 🔐 **GitHub OAuth Integration** — connect with your GitHub account to retrieve access tokens (handled by a frontend API call)
- 📊 **Dashboard** with:
  - Logs viewer
  - Pie charts and visual stats
  - Custom rule displays
  - Step-by-step progress indicators
- 🌗 **Dark & Light Theme** switcher
- 📱 Fully **Responsive** (Mobile & Desktop support)

---

## 🛠️ Tech Stack

- **React** — UI Library
- **TailwindCSS** — Utility-first CSS framework
- **React Router** — Client-side routing
- **Chart.js** — For visual components like pie charts

---

## 🔧 Project Structure

```bash
secu-scan/
├── public/
├── src/
│   ├── Api/
│   ├── assets/
│   ├── Component/              # GitHub connection handler
│   ├── HomePageComponent/
│   └── ...
├── composo.yml
├── Dockerfile
├── vite.config.ts
├── package.json
├── .env
└── README.md
````

---

## 🧪 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/pre-msc-2027/frontend.git
cd secu-scan
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

The app should now be running at `http://localhost:5173/` (or similar, depending on your dev setup).

---

## 🧩 GitHub OAuth Setup

To enable GitHub login, make sure to run the api:

1. ```bash
    node .\src\Api\server.js
    ```

---

🙌 Credits
Built with ❤️ using React & TailwindCSS
For any questions or suggestions, feel free create a issue, we will do our best to answer it.    

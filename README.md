# 🛡️ Hifazat Dojo: AI-Powered Multi-Level Scam aur Phishing Awareness Game
> **School STREAM Project Web Application**  
> *"Scam pehchano, apni hifazat karo, aur Community Guardian bano."*

---

## 🌟 Overview
**Hifazat Dojo** is a production-quality, responsive cybersecurity awareness game developed for school STREAM (Science, Technology, Reading/Research, Engineering, Arts, Mathematics) exhibitions and classroom training.

It educates students, teachers, and parents on identifying digital threats—specifically phishing, OTP verification fraud, impersonation, and financial scams—through 40 validated fictional scenarios across 4 progressive dojo levels.

---

## 🚀 Key Features

- **🥋 4 Dojo Levels (Progressive Unlock):**
  1. **Level 1: Aasaan Hifazat** (Easy — Class 6–7) • *Password Safety* • 🏅 Badge: `Password Protector`
  2. **Level 2: Hoshiyar Hifazat** (Medium — Class 8–9) • *Phishing Awareness* • 🏅 Badge: `Phish Finder`
  3. **Level 3: Expert Hifazat** (Hard — Class 10) • *Money Scams* • 🏅 Badge: `Scam Stopper`
  4. **Level 4: Community Guardian** (Very Hard — Teachers, Parents, Adults) • *Community Reporting* • 🏅 Badge: `Community Guardian`
- **🔓 Teacher Practice Mode:** Single-click toggle on the Level Select and Teacher screens that instantly unlocks all 4 levels, allowing instructors and exhibitors to jump to any scenario immediately without needing prerequisite scores.
- **📱 Authentic Platform Simulators (`ScenarioCard`):** Scenarios are rendered inside high-fidelity mock interfaces mirroring real-world communication channels:
  - 💬 **SMS Cellular Bubble** (Emergency & Lottery alerts)
  - 🟢 **WhatsApp / Mobile Chat** (Voice notes, fake group links & urgent help requests)
  - 📞 **Incoming Voice Call & Audio Transcript** (Bank impersonation, lottery callers)
  - 🏦 **Demo Bank Security Alert** (Card expiry & OTP phishing)
  - ✉️ **Secure Webmail Client** (Contest winning & attachment traps)
  - 📷 **Tactile QR Code Scanner Simulation** (Malicious parking/poster QR codes vs safe payment codes)
  - 🏫 **Official School Notice Board** (Verified educational announcements)
- **🎯 70% Mastery Unlocking:** Standard game progression requires scoring at least 7/10 (70%) to advance to the next rank.
- **🔄 Session Persistence & Resume:** Automatic client-side saving of student progress, scores, and completed levels with an instant **"Resume Last Session"** jump banner on the home screen.
- **🌐 Bilingual & RTL Support:** Seamless instant switching between **Urdu** (with Nastaliq styling and native RTL orientation) and **English**.
- **💡 Educational Feedback:** Every scenario provides immediate Safe/Scam validation, hint, Urdu explanation, English explanation, and a practical next action.
- **📜 Instant PDF & PNG Certificates & Pocket ID Cards:** 
  - Download official diplomas directly as high-resolution **PDF** or **PNG** using client-side rendering (`jspdf` + `html2canvas`).
  - **🪪 Student Dojo Pocket ID Badge:** Dedicated wallet/lanyard size (CR80 format) card generator featuring the student's name, school, rank badge, score, and personal cyber safety pledge.
  - School and instructor customization: input **Student Name**, **School / Institution Name**, select **Role** (Student, Teacher, Parent, Community Member), and customize **Instructor Name & Designation** with persistent saving.
  - Standard print layout (`@media print`) also fully supported.
- **🔊 Audio Narration & Accessibility (Web Speech API):** 
  - Interactive **"Listen / سنیں"** read-aloud button for every scenario in Urdu (`ur-PK`) and English (`en-US`), helping young learners and exhibition attendees listen to scenarios effortlessly.
- **🔇 Master Exhibition Audio Synthesizer:**
  - Built-in zero-asset Web Audio API tone generator for tactile chimes, correct answer melodies, gentle warning sounds, and victory fanfares.
  - Quick **Sound ON / Muted** toggle in the top navigation bar for noisy or quiet school exhibition halls.
- **📱 PWA & 100% Offline Installation:**
  - Progressive Web App with custom service worker (`sw.js`) and web manifest (`manifest.json`).
  - Pre-caches entire app shell, questions, and media so the booth can run without internet on Android tablets, laptops, and touch displays.
  - Direct 1-click **"Install App"** prompt when opened in modern browsers.
- **📖 Dedicated Guide & How-To Pages:**
  - **How to Play (`/how-to-play`):** Visual 4-step guide on analyzing sender identities, spotting red flags, and earning credentials.
  - **For Teachers / Classroom Guide (`/for-teachers`):** Lesson plans, learning objectives, and live demonstration tips for school exhibitions.
- **🏆 Ultimate Achievement:** Completing all 4 levels awards the prestigious **Hifazat Dojo Community Guardian Master Diploma**.
- **👨‍🏫 Protected Teacher Dashboard (`/teacher`):**
  - Passphrase-protected (`hifazat123` default)
  - Anonymous class analytics: participation by level, average score, pass rates
  - Common misconception and mistake category analysis
  - **1-Click CSV Export** for STREAM project evidence and portfolio submission
  - Printable **Family Safety Pledge Cards** for community engagement
  - LocalStorage reset and practice mode controls.
- **🔒 Zero-Data Privacy & Safety:**
  - 100% client-side, zero backend, zero paid APIs, no tracking, no cookies.
  - Prominent safety disclaimer on all screens:  
    *“Ye app sirf training ke liye hai. Asli OTP, password, CNIC ya bank details kisi ko share na karein.”*

---

## 📁 Project Architecture

```
STREAM PROJECT/
├── game-flow.md               # Product specification
├── questions.json             # Single source of truth question bank (40 questions)
├── vercel.json                # Root Vercel deployment configuration
├── README.md                  # Comprehensive documentation
└── app/                       # React + Vite application
    ├── package.json           # Dependencies & scripts
    ├── vite.config.js         # Vite & Tailwind v4 configuration
    ├── vercel.json            # SPA routing rewrite rules
    ├── index.html             # HTML shell with Google Fonts & SVG favicon
    ├── public/
    │   ├── favicon.svg        # App logo vector favicon
    │   ├── icons.svg          # PWA vector app icon
    │   ├── manifest.json      # PWA web app manifest
    │   ├── sw.js              # Offline precache Service Worker
    │   └── questions.json     # Static asset copy
    └── src/
        ├── index.css          # Tailwind CSS v4, custom theme & print rules
        ├── main.jsx           # App entry point & SW registration
        ├── App.jsx            # Router and base layout
        ├── utils/
        │   └── sound.js       # Web Audio API offline sound synthesizer
        ├── data/
        │   ├── questions.js   # Question bank loaders & level constants
        │   └── questions.json # Bundled JSON questions
        ├── store/
        │   └── GameContext.jsx# React Context + Reducer + LocalStorage engine
        ├── components/
        │   ├── Navbar.jsx         # Header navigation with sound & language sync
        │   ├── ShieldIcon.jsx     # Inline vector cyber-shield visual
        │   ├── SafetyWarning.jsx  # Standard bilingual disclaimer
        │   ├── ScenarioCard.jsx   # Realistic mock simulator for SMS, WhatsApp, Calls, Bank OTP, etc.
        │   └── DojoIdBadge.jsx    # Pocket & lanyard-sized Cyber Guardian ID card
        └── pages/
            ├── HeroPage.jsx       # Landing page with CTA, Resume Session & guides
            ├── HowToPlayPage.jsx  # Visual 4-step scam spotting guide
            ├── ForTeachersPage.jsx# Lesson plans & classroom demonstration strategies
            ├── LanguagePage.jsx   # Urdu / English / Sindhi selector
            ├── LevelSelectPage.jsx# 4-stage Dojo level grid + Practice Mode toggle
            ├── QuizPage.jsx       # Interactive scenario simulator + Audio speech + Result screen
            ├── CertificatePage.jsx# Customizable PDF / PNG certificate & ID badge hub
            ├── AboutPage.jsx      # Cyber safety pillars & official hotlines
            └── TeacherPage.jsx    # Analytics, CSV export, Practice Mode & family cards
```

---

## 💻 Local Run Instructions

### Prerequisites
- Node.js (version 18 or newer installed)
- npm (Node Package Manager)

### Steps to Run
1. Open a terminal / PowerShell in the project directory:
   ```bash
   cd "c:\Users\Noman\Downloads\STREAM PROJECT\app"
   ```

2. Dependencies are already installed. If running on a new machine, execute:
   ```bash
   npm install
   ```

3. Launch the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the local URL (typically `http://localhost:5173`).

---

## ☁️ Vercel Deployment Instructions

The application is completely static and ready for 1-click deployment on [Vercel](https://vercel.com):

### Option A: Via GitHub (Recommended)
1. Push the project repository to your GitHub account:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Hifazat Dojo STREAM Project"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```
2. Log in to your [Vercel Dashboard](https://vercel.com).
3. Click **Add New...** → **Project**.
4. Import your GitHub repository.
5. In the **Project Settings**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `app` (Click Edit and select the `app` folder, or leave as root if using the root `vercel.json`)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Click **Deploy**. Vercel will build the project and provide a live `https://<your-project>.vercel.app` URL within seconds!

### Option B: Via Vercel CLI
1. Open terminal inside the `app` folder:
   ```bash
   cd "c:\Users\Noman\Downloads\STREAM PROJECT\app"
   ```
2. Run:
   ```bash
   npx vercel
   ```
3. Follow the CLI prompts to link and deploy.

---

## 🔐 Teacher Passphrase

- **Default Teacher Passphrase**: `hifazat123`
- To access the dashboard: Navigate to `/teacher` or click **"For Teachers"** on the home page.
- You can export the class data as `.csv` at any time to include in your STREAM project binder or exhibition display board.

---

## 🏛️ Verified Public Hotlines Listed in App
- **FIA Cyber Crime Wing**: Helpline **1991** / [cybercrime.gov.pk](https://cybercrime.gov.pk)
- **Pakistan Telecommunication Authority (PTA)**: Toll-Free **0800-55055**
- **State Bank Fraud Helpline**: **111-727-273**

---

## 📄 License & Attribution
Created for the School STREAM Exhibition Project. Built with React, Vite, and Tailwind CSS.
All question scenarios are strictly fictional educational simulations.

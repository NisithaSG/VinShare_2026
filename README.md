# 🌌 VinShare | Dream Together

**VinShare** is a decentralized, anonymous creative vault where users can share *fragments* of their imagination—art, stories, or audio—inside a dreamy, star-lit interface.  
Built as a lightweight front-end app powered by **Supabase**, VinShare focuses on privacy, creativity, and collaboration.

---

## 🚀 Getting Started

### 1. Prerequisites

VinShare is a front-end–only project using **Supabase** as a Backend-as-a-Service (BaaS).  
No Node.js or local server setup is required.

You’ll need:
- A modern web browser (Chrome, Firefox, or Edge)
- A code editor (VS Code recommended)

---

### 2. Supabase Configuration

To enable uploads, bookmarks, and notifications, your Supabase project must include:

#### 📦 Database Tables
- **Projects**  
  Stores shared fragments  
  - `title`
  - `media_url`
  - `author_id`

- **notifications**  
  Stores collaboration offers between users

- **bookmarks**  
  Stores fragments saved by users

#### 🗂️ Storage
- A **public** bucket named `project-files`  
  Used for hosting uploaded images and audio files

---

### 3. Running the Project

1. **Clone or Download** the repository  
   Ensure these files are in the same directory:
   - `index.html`
   - `style.css`
   - `script.js`

2. **Launch the App**
   - **VS Code Live Server**:  
     Right-click `index.html` → *Open with Live Server*
   - **Manual**:  
     Double-click `index.html` to open it in your browser

---

## 🏗️ Code Structure Overview

VinShare follows a modular separation of content, style, and logic.

---

### 1. Content — `index.html`

- **Navigation Bar**
  - Search functionality
  - Theme toggle (Day / Night)
  - Logged-in tools (Profile & Notifications)

- **Modals**
  - Authentication
  - Fragment creation
  - Profile viewing

- **Dynamic Grid**
  - A `pinterest-grid` container
  - Populated dynamically via JavaScript

---

### 2. Styling — `style.css`

- **Theme Management**
  - CSS variables (e.g. `--night-bg`, `--pastel-pink`)
  - Smooth switching between Day and Night modes

- **Animations**
  - Twinkling star effects
  - Sliding **My Vault** sidebar transitions

- **Responsive Design**
  - CSS Grid–based Pinterest layout
  - Mobile-friendly card wrapping

---

### 3. Logic — `script.js`

The app logic is split into focused modules:

- **Auth Module**
  - Supabase authentication
  - Generates anonymous identities  
    (e.g. `StellarVoyager_1234`)

- **Upload Module**
  - Uploads files to Supabase Storage
  - Retrieves public URLs
  - Saves metadata to the database

- **Notification Module**
  - Polls the database every 10 seconds
  - Updates notification badges in real time

---

## 🛠️ Key Features

- 🌙 **Anonymous Identity**  
  No real names—users are represented by generated aliases

- 🎨 **Media Support**  
  Upload local files or share direct media links

- 🤝 **Collaboration System**  
  Send and receive creative offers via notifications

- 🌗 **Night / Day Mode**  
  Theme preference persists in the user’s browser

---

## ✨ Vision

VinShare is designed as a quiet corner of the internet—  
a place to share ideas without pressure, identity, or noise.  
Just imagination, floating among the stars.

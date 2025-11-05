# ✨ AstraEngine 2.0

**AstraEngine** is a hybrid **WebGL / HTML5 game engine and platform**, built with **TypeScript + Vite**.  
It offers a dual runtime system that lets you **build, render, and play** both native AstraEngine WebGL scenes and external HTML5/WebGL games dynamically — all in one framework.

---

## 🧠 Overview

AstraEngine introduces two powerful runtime modes:

1. 🎨 **Engine Mode**  
   Designed for internal AstraEngine rendering — handling WebGL2 pipelines, entities, and shaders.

2. 🌐 **Platform Mode**  
   Allows dynamic loading of external HTML5 / WebGL games directly inside an embedded sandbox (iframe runtime).

---

## 🎮 Screenshots

<p align="center">
  <img src="Game.png" width="850" alt="AstraEngine Engine Mode">
</p>

> *Example: Dual mode runtime with integrated WebGL scene and platform game loading.*

---

## ✨ Features

- 🧭 **Dual Runtime System**  
  Seamlessly switch between **engine** and **platform** modes without restarting.

- 🌐 **External Game Loader**  
  Load standalone HTML5 / WebGL games directly from `/public/games/...` dynamically.

- 🧩 **Game Hub Interface**  
  A centralized dashboard to browse, select, and launch all registered games.

- 💾 **Save Slot System**  
  Manage local saves per game with timestamped slots for quick progress recovery.

- 🏆 **Achievements & Player Profiles** *(planned)*  
  Future-ready system for tracking player stats, unlocks, and achievements.

- 🧠 **Modular Core Architecture**  
  Core modules like `ModeManager`, `ExternalGameLoader`, `Logger`, and `GameRegistry` ensure scalability.

- ⚡ **Built with TypeScript + Vite**  
  Offers hot-reload, modular build system, and type-safe development.

- 🧱 **Fully Extensible Design**  
  Extend engine features, register new games, or plug in your own WebGL runtimes easily.

---

## 🛠️ Installation & Setup

Follow these steps to run AstraEngine locally:

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/AstraEngine.git
cd AstraEngine

# 2. Install dependencies
npm install

# 3. Run in development mode
npm run dev

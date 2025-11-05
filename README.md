**AstraEngine** is a hybrid **WebGL / HTML5 game engine and platform**, built with **TypeScript + Vite**.  
It supports two runtime modes:
1. **Engine Mode** – for rendering internal AstraEngine scenes (WebGL2, entities, shaders, etc.)
2. **Platform Mode** – for loading and running external HTML5 / WebGL games dynamically inside an iframe.

   ![AstraEngine Screenshot](Screenshot (116).png)

## ✨ Features

- 🎮 **Dual Mode System**  
  Seamlessly switch between internal engine rendering and external HTML5 games.

- 🌐 **External Game Loader**  
  Load standalone HTML5 / WebGL games directly from `/public/games/...`.

- 🧩 **Game Hub Interface**  
  Centralized dashboard to browse, select, and launch registered games.

- 💾 **Save Slot System**  
  Local save management per game with timestamped slots.

- 🏆 **Achievements & Player Profiles**  
  (Planned) System for player stats, unlocks, and progression tracking.

- 🧠 **Modular Core**  
  Includes ModeManager, Logger, GameRegistry, ExternalGameLoader, and more.

- ⚡ **Built with TypeScript + Vite**  
  Fast development server, live reload, and type safety out of the box.

---
**INSTALLATION

```bash
### 1. Clone the Repository

git clone https://github.com/<your-username>/AstraEngine.git
cd AstraEngine

2. Install Dependencies
npm install

3. Run in Development Mode
npm run dev


Your app will be available at http://localhost:5173/

🧱 Build for Production

To generate a distributable production build:

npm run build


To preview the built version locally:

npm run preview


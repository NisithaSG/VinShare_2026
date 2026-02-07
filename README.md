# VinShare 🌌  
*Collecting the fragments of your imagination under the starlight.*

VinShare is a creative, anonymous sharing platform where users can collect and explore fragments of imagination—voices, ideas, notes, stories, and art—under a calming, star-lit interface. Built as a frontend web application with Supabase integration, VinShare focuses on creativity, privacy, and visual storytelling.

---

## Instructions for Running the Project

### Steps to Run
1. Download or clone this repository.
2. Ensure the following files are in the same directory:
   - `index.html`
   - `style.css`
   - `script.js`
3. Open `index.html` directly in your browser.
4. The application will automatically:
   - Load existing fragments from Supabase
   - Apply the saved theme (day/night)
   - Check authentication status
   - Render the starry background

---

## Code Structure and Functionality Overview

### `index.html`
- Defines the overall structure and layout of the application.
- Contains:
  - Navigation bar with search, theme toggle, authentication, and profile access
  - Category filters (Ideas, Voices, Notes, Stories, Art)
  - Grid styled main content
  - Modals for authentication and creating new fragments
- Loads Supabase via CDN for authentication and database access.

---

### `script.js`
Handles all application logic and user interactions.

**Key Features:**
- Supabase authentication (sign up, login, logout)
- Anonymous username generation using randomized names
- Fetching and rendering fragments from the Supabase database
- Creating new fragments with text, images, or audio
- Bookmarking fragments for signed-in users
- Category filtering and search functionality
- User profile views for individual creators
- Day/Night theme toggle with saved preference
- Audio playback with animated visualizer
- Dynamic starry background generation

---

### `style.css`
Responsible for the visual design and animations of VinShare.

**Includes:**
- Dark (night) and light (day) theme style
- Responsive masonry layout
- Animated stars, moon glow, and twinkling effects
- Custom-styled audio player with wave animation
- Smooth hover effects and transitions across UI elements

---

## Tech Used
- HTML5
- CSS3
- JavaScript
- Supabase (Authentication & Database)

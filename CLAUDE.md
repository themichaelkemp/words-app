# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Words Matter** is a full-featured lyric writing and songwriting application built with React and Vite. The app helps songwriters and lyricists create, organize, and refine their lyrics with tools for syllable counting, rhyme finding, song structure templates, and rhyme schemes.

## Development Commands

```bash
# Start development server with Hot Module Replacement
npm run dev

# Build for production (outputs to dist/)
npm run build

# Preview production build locally
npm run preview

# Run ESLint to check code quality
npm run lint
```

## Firebase Setup

### Configuration
- **Project ID**: `words-3c7fc` (hosting) / `words-398112` (SDK config)
- **Hosting**: Configured to deploy `dist/` folder with SPA routing
- **Services**: Firestore (database) and Authentication are initialized in `src/firebase.js`

### Firebase Deployment
```bash
# Deploy to Firebase Hosting
firebase deploy

# Deploy only hosting
firebase deploy --only hosting
```

### Firebase Configuration Files
- `.firebaserc` - Firebase project reference
- `firebase.json` - Hosting configuration with SPA rewrite rules
- `src/firebase.js` - Firebase SDK initialization with Firestore and Auth exports

**Note**: Firebase SDK is configured and ready for integration. Components currently use mock data and localStorage. To enable cloud sync, integrate the `db` and `auth` exports from `src/firebase.js`.

## Application Features

### 1. Write (Lyric Editor) - `src/components/Editor.jsx`
The main lyric writing interface with:
- **Per-line syllable counting**: Displays syllable count for each line on the right side
- **Clickable words**: Click any word to find rhymes in the Dictionary
- **Auto-save functionality**: Save button with visual feedback
- **Clean, focused interface**: Monospace font for lyrics, minimal distractions

**Key Implementation**: Uses an overlay approach with a hidden textarea for input and a styled display layer for syllable counts and clickable words.

### 2. Songbook - `src/components/Songbook.jsx`
Library of saved songs with:
- **Grid/List view toggle**: Switch between card grid and list views
- **Song metadata**: Title, line count, syllable count, date
- **Actions**: Edit, Share, and Delete buttons for each song
- **Empty state**: Friendly message when no songs are saved

**TODO**: Integrate Firebase Firestore to persist songs to database.

### 3. Forms - `src/components/Forms.jsx`
Song structure templates including:
- **Predefined templates**: Verse-Chorus, AABA, Verse-Chorus-Bridge, 12-Bar Blues
- **Section-based editing**: Fill in each section (Verse, Chorus, Bridge, etc.)
- **Import functionality**: Placeholder for importing from Songbook or device
- **Save feature**: Save completed forms

**Templates**: Each template includes structure array and description. Easy to add new templates.

### 4. Schemes - `src/components/Schemes.jsx`
Rhyme scheme creation and management:
- **Common patterns**: ABAB, AABB, ABCB, AAAA, ABBA, ABABCC
- **Visual indicators**: Color-coded rhyme letters (A, B, C, D)
- **Add stanza**: Duplicate the pattern for multiple stanzas
- **Line-by-line input**: Each line shows its rhyme designation

**Color coding**: A=purple, B=pink, C=green, D=orange gradients.

### 5. Dictionary - `src/components/Dictionary.jsx`
Comprehensive rhyming dictionary with:
- **Search functionality**: Find rhymes for any word
- **Four rhyme types**:
  - Perfect Rhymes (exact sound matches)
  - Near Rhymes (close but not exact)
  - Slant Rhymes (partial sound matches)
  - Similar Words (related/derivative words)
- **Tabbed interface**: Easy switching between rhyme types
- **Clickable results**: Click any word to search for its rhymes
- **Word click integration**: Automatically populates from clicked words in Editor

**TODO**: Replace mock data with real rhyming API (e.g., Datamuse API, RhymeZone API).

## Project Structure

```
words-app/
├── src/
│   ├── components/
│   │   ├── Header.jsx/.css       # Top navigation with Words Matter branding
│   │   ├── Sidebar.jsx/.css      # Left navigation menu
│   │   ├── Editor.jsx/.css       # Main lyric writing interface
│   │   ├── Songbook.jsx/.css     # Saved songs library
│   │   ├── Forms.jsx/.css        # Song structure templates
│   │   ├── Schemes.jsx/.css      # Rhyme scheme creator
│   │   └── Dictionary.jsx/.css   # Rhyming dictionary
│   ├── App.jsx          # Main app component with routing logic
│   ├── App.css          # App layout styles
│   ├── main.jsx         # React entry point with StrictMode
│   ├── index.css        # Global styles and resets
│   ├── firebase.js      # Firebase configuration and initialization
│   └── assets/          # Static assets (images, icons)
├── public/              # Static files served directly
├── dist/                # Production build output (generated)
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
├── eslint.config.js     # ESLint configuration
└── package.json         # Dependencies and scripts
```

## Component Architecture

### Navigation Flow
1. `App.jsx` manages global state including:
   - `currentView`: Which screen is active (write/songbook/forms/schemes/dictionary)
   - `searchWord`: Word to search in dictionary (set when clicking words in Editor)
2. `Sidebar.jsx` handles view switching
3. `Header.jsx` shows branding and user actions
4. Each view component is conditionally rendered in `App.jsx`

### Word Click Flow
```
Editor (word clicked)
  → App.handleWordClick
  → Set searchWord state
  → Navigate to dictionary view
  → Dictionary receives searchWord prop
  → Auto-search for rhymes
```

## Key Dependencies

### Production
- **React 19.1.1**: UI library for building components
- **Firebase 12.4.0**: Backend services (Firestore database, Authentication)

### Development
- **Vite 7.1.7**: Fast build tool and dev server with HMR
- **@vitejs/plugin-react 5.0.4**: Official Vite plugin for React (uses Babel for Fast Refresh)
- **ESLint 9.36.0**: Code quality and linting with React-specific rules

## Styling Approach

### Design System
- **Primary gradient**: Purple to pink (`#667eea` to `#764ba2`)
- **Secondary gradient**: Pink to red (`#f093fb` to `#f5576c`)
- **Success gradient**: Green (`#56ab2f` to `#a8e063`)
- **Layout**: Flexbox-based, full-height viewport design
- **Components**: White cards with subtle shadows on light gray background
- **Typography**: System fonts for UI, monospace (Courier New) for lyrics

### CSS Organization
- Each component has its own CSS file
- Global styles in `index.css`
- No CSS preprocessors or CSS-in-JS
- Follows BEM-like naming conventions

## Development Workflow

1. **Start dev server**: `npm run dev` → http://localhost:5173 (or 5174 if port is in use)
2. **Hot reloading**: All changes auto-refresh in browser
3. **Component development**: Create component + CSS in `src/components/`
4. **State management**: Use React hooks (useState, useEffect) - no external state library
5. **Build**: `npm run build` creates optimized production bundle in `dist/`

## Future Enhancements (TODOs)

1. **Firebase Integration**:
   - Save/load songs from Firestore
   - User authentication
   - Real-time sync across devices

2. **Dictionary API**:
   - Replace mock data with real rhyming API (Datamuse, RhymeZone)
   - Add word definitions and syllable pronunciation

3. **Editor Enhancements**:
   - Undo/redo functionality
   - Multiple song management
   - Song titles and metadata
   - Export to PDF/text

4. **Collaboration**:
   - Share songs with other users
   - Collaborative editing
   - Comments and feedback

5. **Audio Integration**:
   - Record voice memos
   - Add beats/instrumentals
   - Sync lyrics with audio

# Words Matter - AI-Powered Lyric Writing App

A professional songwriting application with intelligent rhyme analysis, structure detection, and creative writing tools.

🌐 **Live Demo**: [https://words-3c7fc.web.app](https://words-3c7fc.web.app)

## Features

### ✍️ Lyric Editor
- Real-time syllable counting per line
- Auto-save drafts (persists in localStorage)
- Keyboard shortcut: **Ctrl+S** to save
- Double-click any word to find rhymes instantly

### 📚 Rhyming Dictionary
- Powered by Datamuse API
- 4 types of rhymes: Perfect, Near, Slant, Similar
- Word definitions with part-of-speech labels
- Click-to-copy rhymes for easy use

### 📋 Song Forms
- Pre-built templates: Verse-Chorus, AABA, 12-Bar Blues
- **AI-powered structure detection** (automatically identifies verses, choruses, bridges)
- Import songs from Songbook for analysis
- Save and load your song forms

### 🎵 Rhyme Schemes
- ABAB, AABB, ABCB, and more patterns
- **Real-time rhyme validation** (green = matches, red = doesn't rhyme)
- See which words should rhyme together
- Import songs to check rhyme pattern compliance

### 📖 Songbook
- Save unlimited songs
- Edit, delete, and organize your work
- Grid and list view options
- LocalStorage persistence (no account needed)

### 🌙 Dark Mode
- Toggle between light and dark themes
- Smooth transitions
- Theme persists across sessions

### 📱 Mobile Optimized
- Responsive design for all screen sizes
- Touch-friendly interface
- Hamburger menu navigation

## Tech Stack

- **React 19.1.1** - Latest React with modern hooks
- **Vite 7.1.7** - Fast build tool and dev server
- **Firebase 12.4.0** - Hosting (Firestore ready but not yet connected)
- **Datamuse API** - Rhyming dictionary data

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/themichaelkemp/words-app.git
cd words-app

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

### Deploy to Firebase

```bash
# Install Firebase CLI (if not installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

## Project Structure

```
src/
├── components/      # React components
│   ├── Editor.jsx
│   ├── Dictionary.jsx
│   ├── Forms.jsx
│   ├── Schemes.jsx
│   ├── Songbook.jsx
│   ├── Header.jsx
│   └── Sidebar.jsx
├── context/         # React Context (Theme)
│   └── ThemeContext.jsx
├── hooks/           # Custom React hooks
│   ├── useLocalStorage.js
│   └── useKeyboardShortcut.js
├── firebase.js      # Firebase configuration
├── App.jsx          # Main app component
└── main.jsx         # Entry point
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features in Detail

### Intelligent Structure Detection
When you import a song into Song Forms, the AI analyzes your lyrics and automatically detects:
- **Choruses** (repeated sections)
- **Verses** (unique sections)
- **Bridges** (unique sections in the final 40% of the song)

### Rhyme Pattern Analysis
When you import a song into Rhyme Schemes, the app:
- Extracts the last word from each line
- Groups words by rhyme letter (A, B, C, D)
- Validates if they actually rhyme
- Shows visual feedback (✓ or ⚠️)

### Keyboard Shortcuts
- **Ctrl+S** (or Cmd+S) - Quick save in Editor
- **Double-click** any word - Find rhymes

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## Contributing

Contributions welcome! Please open an issue or submit a pull request.

## License

MIT License - feel free to use for personal or commercial projects.

## Feedback

Found a bug or have a suggestion? Email: [wordsmatterappfeedback@gmail.com](mailto:wordsmatterappfeedback@gmail.com)

## Author

Built with [Claude Code](https://claude.com/claude-code)

---

**Built with ❤️ for songwriters**

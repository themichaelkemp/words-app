# Words Matter - UI/UX Design Documentation

## Overview
Words Matter is a modern, clean, and minimal web application designed for amateur lyricists aspiring to become professionals. The design features a vibrant color palette and responsive layout that works seamlessly across all screen sizes.

## Design Philosophy

### Core Principles
1. **Clean & Minimal** - Uncluttered interface that lets creativity flow
2. **Vibrant & Energetic** - Bold colors that inspire creativity
3. **Accessible** - Inclusive design for all users
4. **Responsive** - Perfect experience on any device

## Color Palette

### Primary Colors
- **Primary Purple**: `#7C3AED` - Main brand color, vibrant and creative
- **Primary Light**: `#A78BFA` - Lighter purple for hover states
- **Primary Dark**: `#5B21B6` - Darker purple for emphasis

### Secondary Colors
- **Secondary Blue**: `#3B82F6` - Bright blue for accents
- **Secondary Light**: `#60A5FA` - Light blue variations
- **Secondary Dark**: `#1E40AF` - Dark blue for depth

### Accent Colors
- **Accent Pink**: `#EC4899` - Pink/Magenta for highlights
- **Success Green**: `#10B981` - Success states
- **Warning Orange**: `#F59E0B` - Warnings
- **Danger Red**: `#EF4444` - Error states

### Gradients
- **Primary Gradient**: Purple to Blue (135deg)
- **Accent Gradient**: Pink to Purple (135deg)

## Typography

### Font Family
- **Primary**: Inter (Google Fonts)
- **Monospace**: SF Mono, Monaco, Inconsolata, Fira Code

### Font Weights
- Light: 300
- Regular: 400
- Medium: 500
- Semi-Bold: 600
- Bold: 700
- Extra-Bold: 800

### Type Scale
- **Page Title**: 2rem (32px)
- **Section Header**: 1.5rem (24px)
- **Card Title**: 1.25rem (20px)
- **Body**: 1rem (16px)
- **Small**: 0.875rem (14px)

## Layout Structure

### Main Layout
```
┌─────────────────────────────────────────┐
│           Top Navigation Bar            │
├──────┬──────────────────────────────────┤
│      │                                  │
│  S   │       Main Content Area          │
│  i   │                                  │
│  d   │                                  │
│  e   │                                  │
│  b   │                                  │
│  a   │                                  │
│  r   │                                  │
│      │                                  │
└──────┴──────────────────────────────────┘
```

### Components

#### Top Navigation Bar
- **Position**: Sticky, always visible
- **Elements**:
  - Logo (left) - "Words Matter" with gradient text
  - User Profile icon (right)
  - Settings icon (right)
  - Mobile menu button (mobile only)
- **Height**: 73px
- **Background**: White with subtle shadow

#### Sidebar Navigation
- **Width**: 240px (desktop), 260px (mobile)
- **Elements**: 5 navigation buttons
  - ✏️ Write (Home/Lyric Editor)
  - 📖 Songbook
  - 📋 Forms
  - 🎵 Schemes
  - 📚 Dictionary
- **Behavior**:
  - Desktop: Fixed left sidebar
  - Mobile: Slide-in drawer
  - Active state: Gradient background
  - Hover: Slide effect

## Screen Designs

### 1. Home Screen - Lyric Writing Interface

#### Features
- **Dual-layer Editor**:
  - Transparent textarea for input
  - Overlay display showing line numbers and syllable counts
- **Line Number Display**: Left side, gray color
- **Syllable Counter**: Right side, pink accent color
- **Clickable Words**: Click any word to find rhymes
- **Auto-calculation**: Real-time syllable counting
- **Save Button**: Top right, gradient primary button

#### Layout
```
┌────────────────────────────────────────┐
│  Write Your Lyrics           [💾 Save] │
├────────────────────────────────────────┤
│                                        │
│  1  Start writing lyrics...     8 syl  │
│  2  Each line shows count       7 syl  │
│  3  Click words for rhymes      6 syl  │
│                                        │
│  [Text input area...]                  │
│                                        │
└────────────────────────────────────────┘
```

### 2. Songbook Screen

#### Features
- **Grid Layout**: Responsive cards (3 cols → 2 cols → 1 col)
- **Song Cards**:
  - Title and date
  - Preview of lyrics (3 lines max)
  - Action buttons: Edit, Share, Delete
- **New Song Button**: Top right
- **Hover Effects**: Lift and border highlight

#### Card Design
```
┌─────────────────────────────────┐
│ Song Title          2025-10-20  │
│                                 │
│ Preview of lyrics...            │
│ Up to three lines shown...      │
│                                 │
│                   [✎] [↗️] [🗑️] │
└─────────────────────────────────┘
```

### 3. Song Forms Screen

#### Features
- **Vertical List**: Full-width cards
- **Form Cards**:
  - Form name (large, bold)
  - Structure tag (gradient badge)
  - Description
  - Two action buttons
- **Custom Form Button**: Top right
- **Left Border**: Blue accent (4px)

#### Card Layout
```
┌──────────────────────────────────────┐
│ Verse-Chorus-Bridge  [V-C-V-C-B-C]  │
│                                      │
│ Classic pop song structure           │
│                                      │
│ [Use Template] [Import from Songbook]│
└──────────────────────────────────────┘
```

### 4. Rhyme Schemes Screen

#### Features
- **Grid Layout**: Responsive cards
- **Scheme Cards**:
  - Scheme name (centered)
  - Pattern display (large, gradient badge)
  - Example description
  - Use button
- **Custom Scheme Button**: Top right
- **Hover Effect**: Lift with pink border

#### Card Design
```
┌───────────────────┐
│     Couplet       │
│                   │
│   [AA BB CC]      │
│                   │
│ Two rhyming lines │
│ in succession     │
│                   │
│  [Use Scheme]     │
└───────────────────┘
```

### 5. Rhyming Dictionary Screen

#### Features
- **Search Bar**: Large, prominent at top
- **Rhyme Categories**: Four sections
  - Perfect Rhymes
  - Near Rhymes
  - Slant Rhymes
  - Similar Sounds
- **Word Tags**: Clickable pills
- **Hover Effects**: Color change and lift

#### Layout
```
┌──────────────────────────────────┐
│  🔍 Search for rhymes...         │
├──────────────────────────────────┤
│                                  │
│  Perfect Rhymes                  │
│  ─────────────────────────────── │
│  [day] [way] [say] [play] [stay]│
│                                  │
│  Near Rhymes                     │
│  ─────────────────────────────── │
│  [fade] [made] [paid] [shade]   │
│                                  │
└──────────────────────────────────┘
```

## Responsive Breakpoints

### Desktop (1024px+)
- Full sidebar visible (240px)
- Multi-column grids (3 columns for songbook)
- All features visible

### Tablet (768px - 1023px)
- Narrower sidebar (200px)
- 2-column grids
- Compact spacing

### Mobile (< 768px)
- Hidden sidebar (drawer menu)
- Single column layouts
- Mobile menu button visible
- Touch-friendly tap targets (44px min)
- Stacked buttons

### Small Mobile (< 480px)
- Reduced padding
- Smaller typography
- Full-width buttons
- Simplified layouts

## Accessibility Features

### Keyboard Navigation
- Full keyboard support for all interactive elements
- Visible focus indicators (3px purple outline)
- Logical tab order

### Screen Readers
- Semantic HTML elements
- ARIA labels on all buttons
- Descriptive link text
- Alt text for icons

### Visual Accessibility
- High contrast ratios (WCAG AA compliant)
- High contrast mode support
- Color is not the only indicator
- Resizable text support

### Motion
- Respects `prefers-reduced-motion`
- Optional animations
- No auto-playing content

## Interactive Elements

### Buttons

#### Primary Button
- Gradient background (purple to blue)
- White text
- Medium shadow
- Hover: Lift effect, larger shadow
- Use for: Main actions (Save, Create New)

#### Secondary Button
- Gray background
- Dark gray text
- Light border
- Hover: Darker gray
- Use for: Secondary actions (Use Template)

#### Outline Button
- Transparent background
- Purple border and text
- Hover: Purple background, white text
- Use for: Tertiary actions (Import)

#### Icon Button
- Square (40x40px)
- Gray background
- Icon centered
- Hover: Scale and color change
- Use for: Edit, Delete, Share, Profile, Settings

### Cards

#### Song Card
- White background
- Rounded corners (12px)
- Medium shadow
- 2px transparent border
- Hover: Lift, larger shadow, purple border

#### Form Card
- White background
- Blue left border (4px)
- Hover: Slide right

#### Scheme Card
- Centered content
- Hover: Lift, pink border

### Input Fields

#### Text Input/Textarea
- 2px border (gray)
- Rounded corners
- Medium shadow
- Focus: Purple border, larger shadow
- Placeholder: Gray text

#### Search Bar
- Large prominent input
- Icon on left
- Full width
- Enhanced focus state

## Animation & Transitions

### Timing
- Default: 0.2s ease
- Cards: 0.3s ease
- Page transitions: 0.3s ease

### Effects
- **Fade In**: Screen transitions (opacity + translateY)
- **Lift**: Hover on cards (translateY -4px)
- **Slide**: Navigation hover (translateX 4px)
- **Scale**: Icon buttons (scale 1.05)

### Reduced Motion
- All animations disabled if user prefers
- Instant transitions (0.01ms)

## Design Tokens

### Spacing Scale
- xs: 4px (0.25rem)
- sm: 8px (0.5rem)
- md: 16px (1rem)
- lg: 24px (1.5rem)
- xl: 32px (2rem)
- 2xl: 48px (3rem)

### Border Radius
- sm: 6px (0.375rem)
- md: 8px (0.5rem)
- lg: 12px (0.75rem)
- xl: 16px (1rem)

### Shadows
- sm: Subtle card shadow
- md: Default card shadow
- lg: Hover card shadow
- xl: Modal/drawer shadow

## Print Styles
- Hide navigation and actions
- Show only content
- Remove colors and shadows
- Page break avoidance on cards

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ JavaScript
- CSS Grid and Flexbox
- CSS Custom Properties

## Future Enhancements
- Dark mode toggle
- Custom color themes
- Font size adjustments
- Enhanced syllable detection
- API integration for rhyme dictionary
- Real-time collaboration
- Export to PDF/Word
- Audio pronunciation

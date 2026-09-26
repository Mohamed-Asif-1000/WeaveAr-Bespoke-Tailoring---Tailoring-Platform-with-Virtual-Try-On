# 🧥 WeaveAR Stitches - AI-Powered Bespoke Tailoring Platform

[![React](https://img.shields.io/badge/React-19.2-blue?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![TensorFlow](https://img.shields.io/badge/TensorFlow.js-4.22-orange?logo=tensorflow&logoColor=white)](https://www.tensorflow.org/js)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-7.3-purple?logo=vite&logoColor=white)](https://vitejs.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com)

A modern, full-featured e-commerce platform for custom bespoke tailoring with **AI-powered real-time virtual try-on**. See how garments fit your body in real-time using your webcam before customizing and ordering.

**[🌐 Live Demo](https://weave-ar-bespoke-tailoring-tailorin.vercel.app/)** | **[💻 GitHub Repo](https://github.com/Mohamed-Asif-1000/WeaveAr-Bespoke-Tailoring---Tailoring-Platform-with-Virtual-Try-On.git)**

---

## ✨ Key Features

### 🤖 Virtual Try-On (AI-Powered)

- **Real-time Pose Detection**: TensorFlow MoveNet detects 17 body keypoints in real-time
- **Live Shirt Overlay**: See shirts overlaid on your body with dynamic positioning
- **Multi-Angle Viewing**: View from 4 angles (front, back, left, right)
- **Smart Sizing**: Automatic shirt sizing based on shoulder width and body measurements
- **High Performance**: Real-time detection in the browser, with WebGL acceleration and a CPU fallback
- **Browser-Based**: All processing happens locally on your device - no data transmission

### 🛍️ Complete E-Commerce Features

- **Product Catalog**: Browse products by 6 categories (Bespoke Suits, Artisanal Shirts, Wedding Wear, Formal Wear, Casual Tailoring, Custom Design)
- **Fabric Selection**: Choose from premium fabric options with detailed descriptions
- **Measurement System**:
  - Manual measurement input with validation
  - AI-powered automatic measurements via virtual try-on
  - Size recommendations based on body dimensions
- **Wishlist**: Save favorite items for later
- **Shopping Cart**: Full cart management with quantity control
- **Complete Checkout Flow**: Product → fabric → measurements → review → checkout, ending in a simulated payment step (no payment processor is wired up)
- **Order Management**: Dashboard to view order history

### 🎨 User Experience

- **Premium Dark Theme**: Elegant dark background with gold accents (#1A1A1A with #D4AF37)
- **Smooth Animations**: GSAP-powered transitions and effects
- **Responsive Design**: Perfect on mobile, tablet, and desktop
- **Accessibility**: ARIA labels on key interactive controls, plus `prefers-reduced-motion` support across every GSAP animation
- **Real-time Feedback**: Status indicators and progress tracking

### 📱 Coming Soon Features

Professional "Coming Soon" UI for 5 additional categories:

- Bespoke Suits with custom tailoring
- Wedding Wear collection
- Formal Business Attire
- Casual Tailoring services
- Custom Design Services

---

## 🛠️ Tech Stack

| Category             | Technology              | Purpose                   |
| -------------------- | ----------------------- | ------------------------- |
| **Frontend**         | React 19 + TypeScript   | Modern, type-safe UI      |
| **Styling**          | Tailwind CSS + GSAP     | Beautiful, animated UI    |
| **AI/ML**            | TensorFlow.js + MoveNet | Real-time pose detection  |
| **Camera**           | WebRTC API              | Webcam access & streaming |
| **State Management** | Zustand                 | Lightweight, simple state |
| **Routing**          | React Router v7         | Client-side navigation    |
| **Icons**            | Lucide React            | Clean, modern icons       |
| **Build Tool**       | Vite                    | Fast, modern bundling     |
| **Deployment**       | Vercel                  | Serverless hosting        |

### Dependencies

```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-router-dom": "^7.13.0",
  "@tensorflow/tfjs": "^4.22.0",
  "@tensorflow-models/pose-detection": "^2.1.3",
  "@tensorflow/tfjs-backend-webgl": "^4.22.0",
  "zustand": "^5.0.15",
  "gsap": "^3.14.2",
  "lucide-react": "^0.563.0",
  "tailwindcss": "^4.1.18"
}
```

Dev tooling: `vite`, `typescript`, `@vitejs/plugin-react`, `@tailwindcss/vite`,
`eslint`, and `@playwright/test` for the responsive suite.

---

## 🚀 Live Demo & Deployment

### Live Website

**[Visit WeaveAR Stitches on Vercel](https://weave-ar-bespoke-tailoring-tailorin.vercel.app/)**

Try the virtual try-on feature:

1. Browse to any product
2. Click "Start Virtual Try-On"
3. Allow camera access
4. Stand 2-3 feet from camera
5. See real-time shirt overlay!

### Deployment Info

- **Platform**: Vercel (automatic deployment from GitHub)
- **Performance**: Auto-scaling, global CDN
- **SSL**: Automatic HTTPS

---

## 📊 Project Showcase

### Implemented Features (Shirts Category - 100% Complete)

✅ Full e-commerce platform with shopping cart  
✅ Virtual try-on with AI-powered pose detection  
✅ Real-time body measurements  
✅ Wishlist functionality  
✅ Multiple product variants  
✅ Responsive design (mobile, tablet, desktop)  
✅ Production-ready code with error handling

### Roadmap Features (Coming Soon - Professional UI)

🔜 Bespoke Suit customization  
🔜 Wedding Wear collection  
🔜 Formal Business Attire  
🔜 Casual Tailoring services  
🔜 Custom Design services

---

## 📸 How Virtual Try-On Works

### Technology Stack

1. **Pose Detection**: TensorFlow MoveNet (SINGLEPOSE_THUNDER model)
2. **Keypoint Recognition**: 17 body keypoints (shoulders, hips, joints, etc.)
3. **Shirt Positioning**: Dynamic calculation based on detected body dimensions
4. **Canvas Rendering**: 2D canvas API for real-time visualization
5. **Backend**: WebGL (with CPU fallback) for optimal performance

### Step-by-Step Flow

```
User enables camera
    ↓
Video stream captured
    ↓
TensorFlow detects pose
    ↓
Calculate shirt positioning
    ↓
Render shirt overlay on canvas
    ↓
Display the real-time preview
    ↓
User sees their virtual preview!
```

---

## 🎯 Quick Start

### Prerequisites

- Node.js 20.19 or higher (required by Vite 7)
- npm 10 or higher
- Modern browser with camera support
- HTTPS enabled (for production)

### Installation

```bash
# Clone the repository
git clone https://github.com/Mohamed-Asif-1000/WeaveAr-Bespoke-Tailoring---Tailoring-Platform-with-Virtual-Try-On.git
cd weavear-stitches

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

### Testing

The responsive suite runs every route at 9 viewports — 180 tests in total,
covering horizontal overflow, mobile navigation reachability, and content hidden
behind mobile browser chrome.

```bash
# First time only: download the browser Playwright drives
npx playwright install chromium

# Run the full suite
npm run test:e2e

# Interactive mode with the Playwright UI
npm run test:e2e:ui
```

---

## 📁 Project Structure

```
weavear-stitches/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── ProductCard.tsx
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── Experience.tsx
│   │   └── Layout.tsx
│   │
│   ├── pages/               # Route pages
│   │   ├── Home.tsx
│   │   ├── CategoryPage.tsx
│   │   ├── ProductDetails.tsx
│   │   ├── VirtualTryOnPreview.tsx  # 🤖 AI Feature
│   │   ├── FabricSelection.tsx
│   │   ├── Measurements.tsx
│   │   ├── ManualMeasurements.tsx
│   │   ├── MeasurementsReview.tsx
│   │   ├── FinalReview.tsx
│   │   ├── Cart.tsx
│   │   ├── CheckOut.tsx
│   │   ├── Payment.tsx
│   │   ├── Wishlist.tsx
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   └── NotFound.tsx
│   │
│   ├── data/                # Data files
│   │   ├── products.ts      # 18 sample products across 6 categories
│   │   └── fabrics.ts
│   │
│   ├── store/               # Zustand state management
│   │   ├── useAuthStore.ts
│   │   ├── useCartStore.ts
│   │   ├── useCustomizationStore.ts
│   │   ├── useOrdersStore.ts
│   │   └── useWishlistStore.ts
│   │
│   ├── collections/         # Product collection views
│   │   └── Shirts.tsx
│   │
│   ├── utils/               # Utility functions
│   │   ├── motion.ts        # withMotion() reduced-motion guard for GSAP
│   │   └── preloadModel.ts  # TF.js backend + MoveNet model preload
│   │
│   ├── assets/              # Images and static files
│   │   ├── front-view.png   # 4 transparent try-on overlays
│   │   ├── back-view.png
│   │   ├── left-view.png
│   │   ├── right-view.png
│   │   └── *.jpg            # 30 product & testimonial photos
│   │
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
│
├── public/                  # Static assets
├── README.md                # This file
├── LICENSE                  # MIT License
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── vite.config.ts           # Vite config (Tailwind is configured in src/index.css)
├── e2e/                     # Playwright responsive suite
└── playwright.config.ts     # Viewport matrix + web server
```

---

## 🔐 Privacy & Security

✅ **Local Processing**: All pose detection happens on your device
✅ **No Data Transmission**: Camera video is NOT sent to servers
✅ **No Storage**: Images/video are not stored or logged
✅ **No Analytics**: No tracking of camera or try-on usage  
✅ **User Control**: Users have full control over camera permissions  
✅ **HTTPS Only**: Encrypted connection in production  
⚠️ **One External Fetch**: The MoveNet model weights are downloaded once from Google's CDN. All pose *processing* then runs locally on your device.

---

## 📚 Features in Detail

### Virtual Try-On Component

**Location**: `src/pages/VirtualTryOnPreview.tsx`

**What it does**:

- Accesses user's webcam
- Detects body pose in real-time
- Calculates shirt positioning based on body dimensions
- Renders shirt overlay on canvas
- Supports 4 viewing angles
- Shows skeleton visualization (optional)
- Handles camera permissions and errors

**Technologies**:

- TensorFlow MoveNet for pose detection
- WebRTC for camera access
- Canvas 2D for rendering
- React hooks for state management

### Category System

**Location**: `src/pages/CategoryPage.tsx`

**Features**:

- 6 product categories (1 active, 5 coming soon)
- Product filtering by category
- Conditional UI rendering
- Coming soon badges for inactive categories
- Disabled state for non-available features

### Shopping Flow

**Complete e-commerce workflow**:

```
Home → Browse Products → Select Fabric → Take Measurements
→ Review Order → Checkout → Simulated Payment → Order saved to Dashboard history
```

---

## 🎓 Learning Outcomes

This project demonstrates:

### Frontend Development

- ✅ Modern React with Hooks
- ✅ TypeScript for type safety
- ✅ React Router for navigation
- ✅ Tailwind CSS for styling
- ✅ GSAP for animations

### AI/ML Integration

- ✅ TensorFlow.js implementation
- ✅ Real-time pose detection
- ✅ Canvas rendering optimization
- ✅ Performance optimization

### State Management

- ✅ Zustand for lightweight state
- ✅ Persisted store data
- ✅ Multi-store coordination

### E-Commerce Architecture

- ✅ Product catalog design
- ✅ Cart management
- ✅ Order flow implementation
- ✅ Wishlist functionality

### Full Stack Thinking

- ✅ Frontend only deployment
- ✅ Responsive design principles
- ✅ Accessibility standards
- ✅ Performance optimization

---

## 🚀 Deployment

### Vercel (Current)

```bash
# Automatic deployment
# 1. Connect GitHub repo to Vercel
# 2. Push to main branch
# 3. Vercel auto-builds and deploys
# 4. Live in ~5 minutes
```

### Alternative Options

- **Netlify**: `npm run build` → drag dist/ folder
- **GitHub Pages**: Free static hosting
- **AWS Amplify**: Full-featured hosting

---

## 🤝 Contributing

This is a personal portfolio project, but feel free to:

- ⭐ Star the repository
- 🍴 Fork for your own projects
- 📝 Suggest improvements via issues
- 💬 Discuss features in discussions

---

## 📝 License

MIT License - See [LICENSE](LICENSE) file for details

---

## 📞 Contact & Links

- **LinkedIn**: [linkedin.com/in/mohamed-asif-a-14162326atm](https://www.linkedin.com/in/mohamed-asif-a-14162326atm)
- **GitHub**: [https://github.com/Mohamed-Asif-1000](https://github.com/Mohamed-Asif-1000)
- **Live Demo**: [https://weave-ar-bespoke-tailoring-tailorin.vercel.app/](https://weave-ar-bespoke-tailoring-tailorin.vercel.app/)

---

## 🙏 Acknowledgments

- **Google Gemini** — Special thanks for generating custom, high-fidelity visual assets, including the testimonial avatars and realistic garment previews across the application.
- **Unsplash & Pixabay Contributors** — Heartfelt gratitude to the talented photographers and creators on Unsplash and Pixabay for sharing their high-quality, royalty-free photography. Their exceptional imagery brought our fabric textures, tailoring models, and UI categories to life.
- **TensorFlow.js Team** — For providing the MoveNet pose detection model that powers our real-time virtual try-on engine.
- **React & Web Development Community** — For providing excellent open-source tools, comprehensive documentation, and foundational libraries.
- **Tailwind CSS & GSAP** — For enabling modern utility styling and high-performance user interface animations.
- **Vercel** — For fast, reliable global edge hosting and seamless deployment workflows.

---

## 📊 Project Stats

- **Lines of Code**: ~6,200 across 37 files in `src/`
- **Components**: 8 UI components + 1 product collection view
- **Pages**: 16
- **State Stores**: 5
- **Product Categories**: 6
- **Sample Products**: 18
- **Responsive Tests**: 180 Playwright tests across 9 viewports
- **Build Size**: ~5.3 MB total (`dist/`), of which ~3.5 MB is imagery and ~1.9 MB is JS (~525 kB gzipped, dominated by TensorFlow.js) plus ~8 kB gzipped CSS

---

## 🎯 What's Next?

**Upcoming Features**:

- Backend API integration (Node.js + Express)
- Database (MongoDB/PostgreSQL)
- User authentication system
- Payment gateway integration
- Admin dashboard
- Order management system
- Email notifications
- Real measurements via ML video analysis
- AR features with 3D models
- Mobile app version


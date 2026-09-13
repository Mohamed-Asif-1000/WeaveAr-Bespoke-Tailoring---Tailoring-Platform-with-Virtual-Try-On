# WeaveAr Stitches - Bespoke Tailoring Platform with Virtual Try-On

[![React](https://img.shields.io/badge/React-18.2-blue?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org)
[![TensorFlow](https://img.shields.io/badge/TensorFlow.js-4.0-orange?logo=tensorflow)](https://www.tensorflow.org/js)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vite](https://img.shields.io/badge/Vite-5.0-purple?logo=vite)](https://vitejs.dev)

A modern e-commerce platform for custom bespoke tailoring with **AI-powered real-time virtual try-on** using TensorFlow.js.

## 🎯 Key Features

### Virtual Try-On (AI-Powered)

- ✅ Real-time pose detection with TensorFlow MoveNet
- ✅ Live shirt overlay on body
- ✅ Multi-angle visualization (front/back/left/right)
- ✅ 30-60 FPS performance

### E-Commerce Features

- ✅ Product catalog with categories
- ✅ Fabric selection & customization
- ✅ Measurement system (manual + AI)
- ✅ Wishlist functionality
- ✅ Complete checkout flow

### Design & UX

- ✅ Responsive (mobile, tablet, desktop)
- ✅ Premium dark theme with gold accents
- ✅ Smooth GSAP animations
- ✅ Full accessibility support

## 🛠️ Tech Stack

- **Frontend:** React 18 + TypeScript
- **Styling:** Tailwind CSS + GSAP
- **AI/ML:** TensorFlow.js + MoveNet
- **Camera:** WebRTC API
- **State:** Zustand
- **Build:** Vite

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Modern browser with camera

### Installation

```bash
# Clone repository
git clone
cd weavear-stitches

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` and allow camera access.

### Build for Production

```bash
npm run build
npm run preview
```

## 📱 How Virtual Try-On Works

1. Navigate to any product
2. Click "Start Virtual Try-On"
3. Allow camera permission
4. Stand 2-3 feet from camera facing straight
5. See shirt in 4 angles (front, back, left, right)

### Tips for Best Results

- ✓ Stand 2-3 feet away
- ✓ Face straight at camera
- ✓ Keep arms visible
- ✓ Good lighting helps

## ⚡ Performance

| Metric             | Value   |
| ------------------ | ------- |
| Load Time (First)  | 10-30s  |
| Load Time (Cached) | 2-3s    |
| Detection FPS      | 30-60   |
| CPU Usage          | 15-25%  |
| Mobile Support     | ✅ Full |

## 📊 Browser Support

| Browser | Status     |
| ------- | ---------- |
| Chrome  | ✅ Full    |
| Firefox | ✅ Full    |
| Safari  | ⚠️ Limited |
| Edge    | ✅ Full    |

## 🔐 Privacy & Security

- ✅ Camera access is local only
- ✅ No data transmission
- ✅ No analytics tracking
- ✅ User-controlled permissions

## 📁 Project Structure

src/
├── components/ # Reusable components
├── pages/ # Route pages
├── data/ # Data files
├── store/ # Zustand stores
├── utils/ # Utility functions
└── assets/ # Images & static files

```


## 📝 License

MIT License - See LICENSE file

## 👨‍💻 Author

Mohamed Asif.A
LinkedIn: www.linkedin.com/in/mohamed-asif-a-14162326atm
GitHub: https://github.com/Mohamed-Asif-1000

---

**Made with ❤️ using React, TensorFlow, and CSS Magic**
```

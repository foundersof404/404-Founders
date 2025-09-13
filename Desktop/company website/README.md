# Founders of 404 - Modern Tech Company Website

A cutting-edge, futuristic website for Founders of 404, featuring 3D animations, interactive elements, and a cyber-tech aesthetic. Built with React, Tailwind CSS, and Framer Motion.

## ✨ Features

- 🎨 **Modern Futuristic Design** - Dark theme with neon cyber accents
- 🌐 **3D Animations** - Interactive 3D elements and smooth transitions
- 📱 **Fully Responsive** - Optimized for all devices and screen sizes
- ⚡ **High Performance** - Optimized loading and smooth animations
- 🎯 **Interactive UI** - Hover effects, particle animations, and 3D transforms
- 🚀 **Modern Stack** - React 18, Tailwind CSS 3, Framer Motion

## 🏗️ Project Structure

```
src/
├── components/
│   ├── 3d/
│   │   └── Hero3D.js          # 3D hero background component
│   ├── layout/
│   │   ├── Header.js          # Navigation header
│   │   └── Footer.js          # Footer with links and info
│   └── ui/
│       ├── BackgroundElements.js    # Animated background
│       ├── ContactForm.js           # Interactive contact form
│       ├── ContactInfo.js           # Contact information cards
│       ├── FounderCard.js           # Team member cards
│       ├── ProcessStep.js           # Development process steps
│       ├── ProjectCard.js           # Portfolio project cards
│       ├── ProjectModal.js          # Detailed project modal
│       ├── ServiceCard.js           # Service offering cards
│       ├── ServicePreview.js        # Service preview cards
│       ├── StatsCounter.js          # Animated statistics
│       └── ValueCard.js             # Company values cards
├── pages/
│   ├── Home.js              # Landing page with hero section
│   ├── About.js             # Team and company information
│   ├── Services.js          # Service offerings and process
│   ├── Portfolio.js         # Project showcase with filtering
│   └── Contact.js           # Contact form and information
├── App.js                   # Main app component with routing
├── index.js                 # React app entry point
└── index.css                # Global styles and utilities
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ installed on your system
- npm or yarn package manager

### Installation

1. **Clone or download the project files**
   ```bash
   # If using git
   git clone <repository-url>
   cd "404 founder"

   # Or extract the downloaded files
   cd "404 founder"
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

4. **Open your browser**
   
   The website will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
# or
yarn build
```

The build files will be generated in the `build/` directory.

## 🎨 Design Features

### Color Palette
- **Primary Dark**: `#0a0a0f` - Main background
- **Secondary Dark**: `#1a1a2e` - Card backgrounds
- **Cyber Blue**: `#00f5ff` - Primary accent
- **Cyber Purple**: `#8b5cf6` - Secondary accent
- **Cyber Pink**: `#f73c7e` - Tertiary accent
- **Cyber Green**: `#00ff85` - Success/highlights
- **Cyber Orange**: `#ff8c00` - Warning/emphasis

### Typography
- **Primary Font**: Orbitron (Cyber/Tech headings)
- **Secondary Font**: Inter (Body text and UI)

### Animations
- **Framer Motion** - Page transitions and micro-interactions
- **3D Effects** - Three.js with React Three Fiber
- **Particle Systems** - Floating particles and neural networks
- **Hover Effects** - Interactive cards and buttons

## 📱 Pages Overview

### 🏠 Home Page
- 3D animated hero section with floating elements
- Services preview with interactive cards
- Statistics counter with scroll animations
- Call-to-action sections

### 👥 About Page
- Team member cards with social links
- Company values with 3D icons
- Interactive founder profiles
- Company story and mission

### 🛠️ Services Page
- Detailed service cards with features
- Development process visualization
- Pricing and technology information
- Client testimonials

### 💼 Portfolio Page
- Project filtering by category
- Interactive project cards
- Detailed project modals
- Technology tags and live demos

### 📞 Contact Page
- Interactive contact form with validation
- Contact information cards
- FAQ section
- Social media links

## 🔧 Customization

### Adding New Projects
Edit `src/pages/Portfolio.js` and add to the `projects` array:

```javascript
{
  id: 7,
  title: 'Your Project Name',
  subtitle: 'Project Subtitle',
  description: 'Brief description...',
  fullDescription: 'Detailed description...',
  category: 'Web', // Web, Mobile, AI, Systems, Academic
  image: 'project-image-url',
  technologies: ['React', 'Node.js', '...'],
  features: ['Feature 1', 'Feature 2', '...'],
  links: {
    live: 'https://live-demo.com',
    github: 'https://github.com/username/repo',
  },
  status: 'Completed', // Completed, In Development, Planning
  color: 'cyber-blue',
  gradient: 'from-cyber-blue to-cyber-purple',
}
```

### Updating Team Information
Edit `src/pages/About.js` and modify the `founders` array with your team details.

### Customizing Services
Edit `src/pages/Services.js` to update service offerings, pricing, and features.

### Contact Information
Update contact details in `src/pages/Contact.js` in the `contactInfo` array.

## 🌟 Performance Optimizations

- **Lazy Loading** - Images and components load on demand
- **Code Splitting** - Route-based code splitting
- **Optimized Animations** - Hardware-accelerated CSS transforms
- **Compressed Assets** - Minified CSS and JavaScript
- **CDN Fonts** - Google Fonts loaded efficiently

## 🛠️ Technologies Used

- **React 18** - Frontend framework
- **React Router DOM** - Client-side routing
- **Tailwind CSS 3** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Three.js** - 3D graphics library
- **React Three Fiber** - React renderer for Three.js
- **Lucide React** - Modern icon library

## 📝 License

This project is created for Founders of 404. All rights reserved.

## 🤝 Support

For support and questions, please contact:
- **Email**: foundersof404@gmail.com
- **Phone**: +1 (555) 404-FOUND

---

Built with 💙 by the Founders of 404 team. Pushing the boundaries of web development, one line of code at a time.

# NZ Mart Public Website

A modern, responsive public website for NZ Mart retail store built with React, TypeScript, and Tailwind CSS.

## Features

- **Modern Design**: Beautiful, responsive design with smooth animations
- **Hero Section**: Eye-catching landing section with animated elements
- **About Page**: Company information and statistics
- **Services**: Detailed service offerings and process flow
- **Products**: Dynamic product catalog with category filtering
- **Contact**: Contact form and business information
- **Smooth Scrolling**: Seamless navigation between sections
- **Animated Text**: Colorful gradient text animations
- **Mobile Responsive**: Optimized for all device sizes

## Technologies Used

- React 18 with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- Axios for API calls
- Lucide React for icons

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to the public-website directory:
   ```bash
   cd public-website
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Project Structure

```
public-website/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── Navbar.tsx          # Navigation component
│   │   ├── Hero.tsx            # Hero section
│   │   ├── About.tsx           # About section
│   │   ├── Services.tsx        # Services section
│   │   ├── Products.tsx        # Products section with filtering
│   │   ├── Contact.tsx         # Contact form and info
│   │   ├── Footer.tsx          # Footer component
│   │   └── LoadingSpinner.tsx  # Loading animation
│   ├── App.tsx                 # Main app component
│   ├── index.tsx               # App entry point
│   └── index.css               # Global styles and Tailwind
├── tailwind.config.js          # Tailwind configuration
└── package.json
```

## API Integration

The website connects to the backend API to fetch products and categories:

- **Products**: `GET /api/products` - Fetch all products
- **Categories**: `GET /api/products/categories` - Fetch product categories

## Customization

### Colors
The color scheme can be customized in `tailwind.config.js`:

```javascript
colors: {
  primary: {
    // Blue color palette
  },
  secondary: {
    // Green color palette
  }
}
```

### Animations
Custom animations are defined in `src/index.css`:

- `gradient-text`: Animated gradient text
- `float`: Floating animation
- `glow`: Glow effect

### Components
Each section is a separate component that can be easily customized or extended.

## Deployment

To build for production:

```bash
npm run build
```

This creates a `build` folder with optimized production files.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the NZ Mart POS System.

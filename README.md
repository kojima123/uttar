# Uttar - Self-Injection Record Tracking App

Uttar is a private logging application designed for managing self-injection records with a supportive community feed feature. The app prioritizes user privacy while providing a sense of connection with others practicing self-injection.

## Features

### Core Functionality
- **Body Part Selection** - Interactive human silhouette for selecting injection sites (arms, abdomen, thighs)
- **Record Tracking** - Automatic timestamp and location recording for each injection
- **History View** - Calendar-based visualization of injection history
- **Community Feed** - Anonymous sharing of recent injections (latest 30 records)
- **Minimizable UI** - Collapsible community feed for focused interaction

### User Experience
- **Light/Dark Theme** - Toggle between bright and dark color schemes
- **Multi-language Support** - English and Japanese interfaces
- **Responsive Design** - Optimized for both mobile and desktop
- **Nickname System** - Optional nickname for community feed (defaults to "Anonymous")
- **X (Twitter) Integration** - Optional automatic posting with customizable templates

### Privacy & Security
- **Local Storage** - All personal records stored locally on your device
- **No Tracking** - No personal information collected or tracked
- **Anonymous Sharing** - Community feed only shows nickname and injection site
- **Temporary Storage** - Server only retains latest 30 community records

## Technology Stack

### Frontend
- **React** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** for styling
- **Framer Motion** for animations
- **tRPC** for type-safe API calls

### Backend
- **Node.js** with Express
- **MySQL** database with Drizzle ORM
- **OAuth** authentication via Manus platform
- **tRPC** for API layer

## Getting Started

### Prerequisites
- Node.js 22.x or higher
- pnpm package manager
- MySQL database

### Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Database
DATABASE_URL=mysql://user:password@host:port/database

# OAuth (Manus Platform)
OAUTH_SERVER_URL=https://api.manus.im
OWNER_OPEN_ID=your_owner_open_id
JWT_SECRET=your_jwt_secret

# Forge API (for AI features)
BUILT_IN_FORGE_API_KEY=your_forge_api_key
BUILT_IN_FORGE_API_URL=https://forge.manus.im

# Frontend
VITE_APP_TITLE=Uttar
VITE_APP_LOGO=/logo.png
VITE_FRONTEND_FORGE_API_KEY=your_frontend_api_key
VITE_FRONTEND_FORGE_API_URL=https://forge.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im
VITE_APP_ID=your_app_id

# Analytics (optional)
VITE_ANALYTICS_ENDPOINT=your_analytics_endpoint
VITE_ANALYTICS_WEBSITE_ID=your_website_id
```

### Installation

```bash
# Install dependencies
pnpm install

# Push database schema
pnpm db:push

# Start development server
pnpm dev
```

The application will be available at `http://localhost:3000`

### Building for Production

```bash
# Build the application
pnpm build

# Preview production build
pnpm preview
```

## Project Structure

```
uttar/
├── client/              # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── contexts/    # React contexts (Language, Theme)
│   │   ├── lib/         # Utilities and helpers
│   │   └── pages/       # Main application pages
├── server/              # Backend Express application
│   ├── _core/           # Core server functionality
│   ├── routers.ts       # tRPC routers
│   └── db.ts            # Database operations
├── drizzle/             # Database schema and migrations
└── public/              # Static assets
```

## Security Considerations

### What is Public
- Application source code
- Database schema structure
- UI components and styling

### What is Private (via environment variables)
- Database credentials
- API keys and secrets
- OAuth configuration
- User data and records

### Best Practices
1. **Never commit `.env` files** - Use `.env.example` as a template
2. **Rotate secrets regularly** - Update API keys and JWT secrets periodically
3. **Use HTTPS in production** - Ensure all connections are encrypted
4. **Keep dependencies updated** - Regularly update packages for security patches

## Testing

```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test server/shared.test.ts
```

## Contributing

This is a personal health tracking application. If you'd like to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Medical Disclaimer

**This app does not provide medical advice.** It is a personal logging tool for tracking self-injection records. Always consult with healthcare professionals for medical guidance. The community feed is for emotional support only and should not be used for medical advice or diagnosis.

## Privacy Policy

- All injection records are stored locally on your device
- No personal health information is collected or transmitted to external servers
- The community feed only shares anonymous injection site information
- No tracking, analytics, or advertising is implemented
- You can delete your data at any time through your browser's storage settings

## License

This project is open source and available for personal use. Please respect user privacy when forking or modifying the application.

## Acknowledgments

- Built with [Manus](https://manus.im) platform
- Icons from [Lucide](https://lucide.dev)
- UI components inspired by modern health tracking applications

## Support

For questions or issues:
- Open an issue on GitHub
- Contact the maintainer through GitHub

---

**Remember**: This is a personal health tracking tool. Always follow your healthcare provider's instructions for self-injection procedures.

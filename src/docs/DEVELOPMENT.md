```markdown
# Development Guide

## 1. Project Setup

### Prerequisites
- Node.js 18+
- npm/yarn
- Git

### Installation
```bash
git clone [repository-url]
cd [project-directory]
npm install
npm run dev
```

## 2. Project Structure
```
src/
├── components/       # Reusable UI components
├── features/        # Feature-specific code
│   └── billing/
│       ├── components/
│       ├── utils/
│       ├── hooks/
│       └── types/
├── lib/            # Core utilities
├── pages/          # Route pages
└── docs/           # Documentation
```

## 3. Development Workflow

### Adding New Features
1. Create feature branch
2. Add types in `features/[feature]/types`
3. Implement utilities in `features/[feature]/utils`
4. Create components in `features/[feature]/components`
5. Update documentation

### Code Style
- Use TypeScript
- Follow ESLint rules
- Use Tailwind for styling
- Component-based architecture

### Testing
- Unit tests with Jest
- Component tests with React Testing Library
- E2E tests with Cypress (planned)

## 4. Deployment

### Build Process
```bash
npm run build
```

### Environment Variables
- `VITE_API_URL`: API endpoint
- `VITE_GST_API_KEY`: GST verification API key
```

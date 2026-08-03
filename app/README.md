# App Seed v2 - Production-Ready Player App

A production-ready scaffold for building Enplug Player applications using Angular 21 with standalone components, modern architecture, and Vite-powered build system.

## Build System

This project uses **Vite** as the build tool through Angular CLI's esbuild integration, providing:

- Fast development server with Hot Module Replacement (HMR)
- Optimized production builds with code splitting
- Native ESM support for faster module loading
- Improved build performance compared to Webpack

## Features

### Implemented and Ready to Use

- **Complete Lifecycle Management**: Start, hide, destroy with automatic cleanup
- **Robust Error Handling**: Error management across all critical flows
- **Play Time Recording**: Automatic playback time tracking
- **Multi-Asset Support**: Support for images, videos, and custom assets
- **4K and SignageOS Support**: Detection and handling of special configurations
- **Optimized Change Detection**: OnPush strategy for better performance
- **Service Worker**: Automatic registration for offline support
- **TypeScript Types**: Complete interfaces for type safety
- **Modular Architecture**: Services separated by responsibility

## Project Structure

```
app/src/app/
├── models/
│   ├── asset.interface.ts         # Asset interfaces
│   └── index.ts
├── services/
│   ├── enplug.service.ts          # Enplug SDK wrapper
│   ├── lifecycle.service.ts       # Lifecycle management (start/hide/destroy)
│   └── asset-manager.service.ts   # Asset and configuration management
├── app.ts                          # Main component
├── app.html                        # Template with states (loading/error/content)
└── app.scss                        # Modern styles with animations
```

## Key Dependencies

- **Angular 21.2**: Modern framework with standalone components
- **@enplug/components2 v1.0.1**: Enplug UI components (Angular 21 compatible)
- **@enplug/sdk-player v0.11.13**: Updated Player SDK
- **RxJS 7.8**: Reactive programming
- **TypeScript 6.0**: Complete type safety

## Getting Started

### Installation

This project uses **pnpm** as the package manager:

```bash
pnpm install
```

### Development Server

```bash
pnpm start                # Local development
pnpm run start:dev        # Development environment
pnpm run start:staging    # Staging environment
```

The application will be available at `https://localhost.enplug.in:50001/`

### Building

```bash
pnpm run build            # Production build
pnpm run build:dev        # Development build
pnpm run build:staging    # Staging build
```

Build artifacts will be stored in the `dist/` directory.

## Customization

### Custom Assets

Edit `app.ts` in the `handleCustomAsset()` method:

```typescript
private async handleCustomAsset(): Promise<void> {
  // Your custom logic here
  await this.lifecycle.startApp();
}
```

### Adding Video Player

1. Install the video component from @enplug/components2
2. Import in `app.ts`
3. Add to `app.html` in the video section

### Modifying Styles

Edit `app.scss` which includes:
- Loading states with animated spinner
- Error states
- Responsive image styles
- Customizable CSS variables

## Lifecycle Flow

```
ngOnInit()
  ↓
registerServiceWorker()
  ↓
initApp()
  ↓
getDisplayConfig() + getNextAsset()
  ↓
handleImageAsset() / handleVideoAsset() / handleCustomAsset()
  ↓
lifecycle.startApp() → Tracking starts
  ↓
[Asset displays]
  ↓
destroy event → reportPlaytime() → cleanup()
```

## Testing

Run unit tests with Karma:

```bash
pnpm test
```

## Code Quality

Format and lint code using Biome:

```bash
pnpm run format          # Format code
pnpm run lint            # Lint code
pnpm run check           # Format and lint
pnpm run check:ci        # Check without modifying files
```

## Additional Resources

For more information on Angular CLI, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Project Overview
This is a blog system built with SvelteKit, named svblog. The project uses the latest features of Svelte 5, including the new reactive state API ($state) and modern component rendering methods ($props). The project supports user login, creation, editing, publishing, and reading of blog posts.

## Tech Stack
- **Frontend Framework**: SvelteKit (Svelte 5)
- **UI Framework**: Bulma CSS
- **Markdown Processing**: svelte-exmarkdown
- **Icons**: @iconify/svelte
- **Backend Services**:
  - Tencent Cloud Development (@cloudbase/js-sdk)
- **Development Tools**: TypeScript, Vite

## Deployment Guide

### Environment Requirements
- Node.js 18.x or higher
- npm or yarn package manager

### Local Deployment
1. Clone the project to local:
   ```bash
   git clone <repository_url>
   cd svblog
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file and add the following environment variables:
   ```
   PUBLIC_TENCENT_CLOUD_APP_ID=<your_tencent_cloud_app_id>
   PUBLIC_TENCENT_CLOUD_SECRET_KEY=<your_tencent_cloud_secret_key>
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Access the application:
   Open your browser and visit http://localhost:5173

### Production Deployment

#### 1. Build the Application
```bash
npm run build
```

#### 2. Deployment Options

##### Vercel Deployment
1. Push the code to a GitHub repository
2. Import the project in Vercel
3. Configure environment variables
4. Complete deployment

##### Netlify Deployment
1. Build command: `npm run build`
2. Publish directory: `build`
3. Configure environment variables

##### Custom Server Deployment
1. Upload the build artifacts (build directory) to the server
2. Configure Nginx or Apache as a static file server
3. Set up reverse proxy if needed

#### 3. Environment Variables Configuration
The following environment variables need to be configured for production:
- `PUBLIC_TENCENT_CLOUD_APP_ID`: Tencent Cloud App ID
- `PUBLIC_TENCENT_CLOUD_SECRET_KEY`: Tencent Cloud Secret Key

### Common Issues

1. **Build Failure**: Ensure Node.js version meets requirements, and clear node_modules and reinstall

2. **Missing Styles**: Check if Bulma CSS is properly imported

3. **API Connection Failure**: Confirm environment variables are configured correctly and backend service is running normally

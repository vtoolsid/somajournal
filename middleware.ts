import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/auth/login(.*)',
  '/auth/signup(.*)',
  '/api/analyze-emotion',
  '/api/preview-analysis',
  '/api/chat-emotion-analysis',
  '/sso-callback'
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();
  
  // Protect all routes except public ones
  if (!isPublicRoute(req) && !userId) {
    return redirectToSignIn();
  }
  
  // Don't automatically redirect from home page - let AppLayout handle routing logic
  // This allows sign-out to work properly and assessment completion to be checked
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
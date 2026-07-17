import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

/**
 * Root HTML document for Expo web.
 * Sets the viewport so the browser preview matches a mobile device:
 *   - width=device-width  → fill the iframe/window width
 *   - initial-scale=1     → no zoom
 *   - maximum-scale=1     → prevent browser auto-zoom on input focus
 */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        {/*
         * Disable body scrolling on web so the root <ScrollView> in each screen
         * handles all scrolling. Prevents double-scrollbar issues.
         */}
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{
          __html: `
            html, body, #root {
              height: 100%;
              overflow: hidden;
            }
          `
        }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

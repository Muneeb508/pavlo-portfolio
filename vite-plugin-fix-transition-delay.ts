import type { Plugin } from 'vite';

/**
 * Vite plugin to fix W3C CSS validation issue:
 * Replaces invalid "transition-delay: 0" with "transition-delay: 0s"
 * This fixes issues from third-party libraries like AOS
 */
export function fixTransitionDelay(): Plugin {
  return {
    name: 'fix-transition-delay',
    enforce: 'post',
    generateBundle(options, bundle) {
      // Process all CSS files in the bundle
      Object.keys(bundle).forEach((fileName) => {
        const file = bundle[fileName];
        if (file.type === 'asset' && fileName.endsWith('.css')) {
          if (typeof file.source === 'string') {
            // Replace "transition-delay: 0" with "transition-delay: 0s"
            // Match: transition-delay: 0 followed by space, semicolon, comma, or end of line
            // But not followed by 's' (to avoid replacing "0s" or "0ms")
            file.source = file.source.replace(
              /transition-delay:\s*0(?![\d\w])/g,
              'transition-delay: 0s'
            );
            // Also handle cases where 0 is at the end of line or before semicolon
            file.source = file.source.replace(
              /transition-delay:\s*0(\s*[;,]|\s*!important|$)/gm,
              'transition-delay: 0s$1'
            );
          }
        }
      });
    },
    // Also handle CSS during transform phase for better coverage
    transform(code, id) {
      if (id.endsWith('.css')) {
        return {
          code: code.replace(
            /transition-delay:\s*0(?![\d\w])/g,
            'transition-delay: 0s'
          ),
          map: null,
        };
      }
    },
  };
}


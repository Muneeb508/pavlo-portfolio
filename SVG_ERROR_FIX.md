# SVG Data URI Error Fix

## Problem
The application was throwing the following error:
```
InvalidCharacterError: Failed to execute 'createElement' on 'Document': The tag name provided ('data:image/svg+xml,%3csvg...') is not a valid name.
```

## Root Cause
The error occurred because data URI strings (SVG data) from the backend/CMS were being passed as HTML tag names to React styled-components via the `as={}` prop or used as JSX element types.

This typically happens when:
1. The `tag` field from the database contains corrupted data (a data URI instead of a valid HTML tag like 'h1', 'h2', 'span', etc.)
2. The code directly used this value without validation: `<Component as={tag}>` or `<Tag></Tag>`
3. React tried to create an HTML element with an invalid tag name

## Solution
Added validation functions to ensure that tag values are valid HTML tag names before using them. The validation:
1. Checks if the tag is a string
2. Verifies it matches the pattern `/^[a-z][a-z0-9]*$/` (valid HTML tags)
3. Prevents data URIs by checking for `:` and `/` characters
4. Falls back to safe defaults (`'h2'`, `'span'`) if validation fails

## Files Modified

### 1. `src/components/CollectionComponent/CollectionComponent.tsx`
- Added `isValidTag()` validation function at component level
- Applied validation in three cases:
  - `TEXT_4SEC` block type (line ~569)
  - `TEXT_2SEC` block type (line ~593)
  - `TEXT_1SEC` / `TEXT_1SEC_LP` block types (line ~627)

### 2. `src/components/Footer/Footer.tsx`
- Added `isValidTag()` validation in the `renderItem()` helper function
- Applied validation before passing `tag` to `COLLECTION_4SEC_DESCRIPTION` component

### 3. `src/pages/Info/Info.tsx`
- Added `isValidTag()` validation in the static header section map
- Added `isValidTag()` validation in the dynamic content sections map

## Validation Function
```typescript
const isValidTag = (tag: any): tag is keyof JSX.IntrinsicElements => {
  if (typeof tag !== 'string') return false;
  // Prevent data URIs and other invalid tag names
  return /^[a-z][a-z0-9]*$/.test(tag) && !tag.includes(':') && !tag.includes('/');
};
```

## Fallback Behavior
- For `COLLECTION_4SEC_DESCRIPTION` components: Falls back to `'h2'`
- For inline `<Tag>` elements: Falls back to `'span'`

## Testing
To verify the fix:
1. The app should no longer throw the `InvalidCharacterError`
2. Pages with dynamic content should render without errors
3. Content with invalid tag values will gracefully fall back to default tags

## Prevention
To prevent future occurrences:
1. Validate data at the API/database level
2. Add stricter typing for the `tag` field in CMS
3. Implement data validation when fetching from Supabase

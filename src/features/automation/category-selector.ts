import 'server-only';

/**
 * Reads, parses, and validates the automation category IDs from environment variables.
 * Supports AUTOMATION_CATEGORY_IDS (comma-separated list) with fallback to
 * AUTOMATION_CATEGORY_ID.
 * 
 * @returns Array of unique and validated category ID strings.
 * @throws Error with descriptive message if no category IDs are configured.
 */
export function getAutomationCategories(): string[] {
  const idsEnv = process.env.AUTOMATION_CATEGORY_IDS;
  const idEnv = process.env.AUTOMATION_CATEGORY_ID;

  let categories: string[] = [];

  if (idsEnv !== undefined) {
    const parsed = idsEnv
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    // Remove duplicates preserving order
    categories = Array.from(new Set(parsed));
  }

  // Fallback to AUTOMATION_CATEGORY_ID if empty or missing
  if (categories.length === 0 && idEnv !== undefined) {
    const trimmed = idEnv.trim();
    if (trimmed.length > 0) {
      categories = [trimmed];
    }
  }

  if (categories.length === 0) {
    throw new Error(
      'Configuration Error: Neither AUTOMATION_CATEGORY_IDS nor AUTOMATION_CATEGORY_ID environment variables are configured with valid values.'
    );
  }

  return categories;
}

/**
 * Selects a random category ID from the pool and logs the selection.
 * 
 * @param categories Non-empty list of category IDs.
 * @returns The selected category ID string.
 */
export function selectRandomCategory(categories: string[]): string {
  if (categories.length === 0) {
    throw new Error('Category pool is empty.');
  }
  const randomIndex = Math.floor(Math.random() * categories.length);
  const selected = categories[randomIndex];
  console.log(`Selected automation category: ${selected}`);
  return selected;
}

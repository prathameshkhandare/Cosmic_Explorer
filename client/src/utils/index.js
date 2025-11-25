export const createPageUrl = (pageName) => {
  // Normalize page name → remove spaces & lower the first letter
  const clean = pageName.trim().replace(/\s+/g, '');

  return `/${clean.toLowerCase()}`;
};

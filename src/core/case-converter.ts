import { CaseType } from '../types/case-type';

const caseConverter = (
  identifier: string,
  caseType: CaseType = CaseType.PASCAL_CASE
): { tokens: string[], newIdentifier: string } => {
  // If already PascalCase and target is Pascal, return as-is
  if (caseType === CaseType.PASCAL_CASE && /^[A-Z][A-Za-z0-9]*$/.test(identifier)) {
    // Tokenize by capital letters
    const tokens = identifier.match(/[A-Z][a-z0-9]*|[A-Z]+(?![a-z])/g)!;
    return { tokens, newIdentifier: identifier };
  }

  // Split by common separators or camel boundaries
  const tokens =
        identifier
          .replace(/([a-z0-9])([A-Z])/g, '$1 $2') // separate camel boundaries
          .split(/[^A-Za-z0-9]+|(?=[A-Z][a-z])/)
          .filter(Boolean);

  // Transform tokens while retaining acronyms
  const newIdentifier = tokens
    .map((token, index) => {
      if (token === token.toUpperCase() && token.length > 1) return token; // preserve acronyms
      if (index === 0 && caseType === CaseType.CAMEL_CASE)
        return token.charAt(0).toLowerCase() + token.slice(1);
      return token.charAt(0).toUpperCase() + token.slice(1).toLowerCase();
    })
    .join('');

  return { tokens, newIdentifier };
};

export default caseConverter;

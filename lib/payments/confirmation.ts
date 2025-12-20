export function isConfirmation(text: string): boolean {
  return /^(yes|y|Y|yeah|yep|confirm|ok|sure)$/i.test(text.trim());
}

/**
 * Simple validation helpers
 */
function validateInputs( docText) {
  if (!docText || docText.trim().length < 10) {
    throw new Error('Document text too short or missing.');
  }
}

/**
 * Entry point: Sets up menu and sidebar
 */
function onOpen() {
  const ui = DocumentApp.getUi();
  ui.createAddonMenu()
    .addItem('Open AI Assistant', 'showSidebar')
    .addToUi();
}

function onInstall(e) {
  onOpen(e);
}

/**
 * Displays the sidebar UI
 */
function showSidebar() {
  const template = HtmlService.createTemplateFromFile('sidebar');
    var html = template.evaluate();
  DocumentApp.getUi().showSidebar(html);
}

/**
 * Runs AI review through backend using helpers
 */
function runAIReview(jurisdiction) {
  try {
    const docText = getDocumentText();
    validateInputs( docText);
    return callAIReview( docText, { jurisdiction });
  } catch (err) {
    return { success: false, error: err.message };
  }
}

function runExtractContext() {
  try {
    const docText = getDocumentText();
    validateInputs( docText);
    return callExtractContext( docText);
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Inserts a clause at the cursor using helpers
 */
function insertClauseAtCursor(clauseText) {
  insertClause(clauseText);
}

/**
 * Reads all text from the current Google Doc
 */
function getDocumentText() {
  return DocumentApp.getActiveDocument().getBody().getText();
}


/**
 * Inserts a given clause text at the current cursor position
 */
function insertClause(clauseText) {
  const doc = DocumentApp.getActiveDocument();
  const selection = doc.getSelection();
  const ui = DocumentApp.getUi();

  if (!selection) {
    ui.alert('Place your cursor where you want to insert the clause.');
    return;
  }

  selection.getRangeElements().forEach(rangeElem => {
    const element = rangeElem.getElement();
    if (rangeElem.isPartial()) {
      element.asText().deleteText(rangeElem.getStartOffset(), rangeElem.getEndOffset());
      element.asText().insertText(rangeElem.getStartOffset(), clauseText);
    } else {
      const parent = element.getParent();
      parent.insertParagraph(parent.getChildIndex(element) + 1, clauseText);
    }
  });
}

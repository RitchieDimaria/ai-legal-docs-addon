/**
 * POST /review
 */
const url = "https://ai-legal-docs-addon.onrender.com";
function callAIReview( documentText, context) {
  if (!documentText) throw new Error('Document text missing.');

  const payload = { documentText, context: context || {} };

  const response = UrlFetchApp.fetch(`${url}/api/review`, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });

  const code = response.getResponseCode();
  const data = JSON.parse(response.getContentText());

  if (code !== 200) {
    throw new Error(`Backend error (${code}): ${data.error || 'Unknown error'}`);
  }

  return data;
}

/** 
 * POST /extractContext
 */

function callExtractContext(documentText) {
  if (!documentText) throw new Error('Document text missing.');

  const payload = { documentText};

  const response = UrlFetchApp.fetch(`${url}/api/extractContext`, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });
  console.log(response);

  const code = response.getResponseCode();
  const data = JSON.parse(response.getContentText());

  if (code !== 200) {
    throw new Error(`Backend error (${code}): ${data.error || 'Unknown error'}`);
  }

  return data;
}
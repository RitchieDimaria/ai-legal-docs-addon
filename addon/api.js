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
  const apiUrl = `${url}/api/extractContext`;
  
  console.log('Calling extractContext API at:', apiUrl);
  console.log('Payload size:', JSON.stringify(payload).length);

  const response = UrlFetchApp.fetch(apiUrl, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });
  
  const code = response.getResponseCode();
  const responseText = response.getContentText();
  
  console.log('Response code:', code);
  console.log('Response headers:', response.getHeaders());
  console.log('Response text (first 500 chars):', responseText.substring(0, 500));

  try {
    const data = JSON.parse(responseText);
    
    if (code !== 200) {
      throw new Error(`Backend error (${code}): ${data.error || 'Unknown error'}`);
    }
    
    return data;
  } catch (parseError) {
    console.error('Failed to parse response as JSON:', parseError);
    console.error('Full response:', responseText);
    throw new Error(`Invalid JSON response from server. Status: ${code}. Error: ${parseError.message}`);
  }
}
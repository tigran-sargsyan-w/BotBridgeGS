/**
 * Handles HTTP GET requests in scripts configured as web applications and sends a notification to administrators.
 *
 * One of two built-in methods (`doGet(e)`, `doPost(e)`) that allow your script to accept and handle requests via a web interface.
 * 
 * This function is triggered when a GET request is received. It extracts the
 * `message` and `photoUrl` parameters from the URL and passes them to a function
 * that notifies administrators. A response is sent back to the user indicating
 * that the notification has been sent.
 *
 * @param {Object} e - The event object containing the URL parameters.
 * @param {string} e.parameter.message - The message to be sent to the administrators. Defaults to "Default Message".
 * @param {string} e.parameter.photoUrl - The URL of a photo to be attached to the notification. Defaults to an empty string.
 *
 * @return {TextOutput} The response indicating that the notification was sent.
 */
function doGet(e) {
  const message = e.parameter.message || "Default Message";
  const photoUrl = e.parameter.photoUrl || "";
  
  // Actions
  notify_admins(message, photoUrl);

  // Response to the user
  return ContentService.createTextOutput("Notification sent");
}

/**
 * Generates a URL to send a notification to administrators.
 *
 * This function creates a URL that can be used to trigger a notification to the administrators.
 * It appends the `message` and `photoUrl` parameters to the URL as query parameters. If no
 * `photoUrl` is provided, the URL will only include the `message` parameter.
 *
 * @param {string} message - The message to be sent to the administrators.
 * @param {string} [photoUrl] - The URL of a photo to be included with the notification. (Optional)
 *
 * @return {string} The generated URL with the message and photoUrl parameters (if provided).
 */
function get_notify_admins_url(message, photoUrl) {
  const baseUrl = ScriptApp.getService().getUrl();
  Logger.log(baseUrl);
  var url_copy = "YOUR_WEB_APP_URL";
  Logger.log(url_copy);
  var link = `${url_copy}?message=${encodeURIComponent(message)}`;
  
  // Check if photo exists
  if (photoUrl && photoUrl.trim() !== "") {
    link += `&photoUrl=${photoUrl}`;
  }
  return link;
}

/**
 * Tests the generation of the notification URL and sends a test request.
 *
 * This function tests the `get_notify_admins_url` method by generating a notification
 * URL with a sample `message` and `photoUrl`, then sending a GET request to that URL
 * using `UrlFetchApp.fetch`. The generated URL is logged for debugging purposes.
 */
function test_get_notify_admins_url() {
  var message = "Test";
  var photoUrl = "https://ibb.co/pykBKRr";
  var url = get_notify_admins_url(message,photoUrl);
  UrlFetchApp.fetch(url);
  Logger.log(url);
}

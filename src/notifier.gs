/**
 * Notifies administrators in a Telegram group with a message and optional photo.
 *
 * This function sends a notification message to a Telegram group of administrators, tagging them in chunks to avoid exceeding Telegram's message length limits.
 * If a photo is provided, it is sent with the main message; otherwise, only the text message is sent.
 *
 * @param {string} message - The main message to be sent to the administrators.
 * @param {string} photoUrl - The URL of a photo to be included in the notification. If not provided or empty, only the text message will be sent.
 */
function notify_admins(message,photoUrl) {
  const botToken = 'YOUR_BOT_TOKEN';
  const chatId = 'YOUR_CHAT_ID';

  var tags = get_admin_tags_as_HTML(botToken,chatId);
  var mainMessage = message;
  var photo = photoUrl;
  var tagList = tags.match(/<a href="tg:\/\/user\?id=\d+">.*?<\/a>/g) || [];
  var chunks = chunk_array(tagList, 5);

  // Sending a message with admin tags in chunks
  for (var i = 0; i < chunks.length; i++) {
    var secondaryMessage = `Mayday` + chunks[i].join(' ');
    send_message(botToken, chatId, secondaryMessage);
  }

  // Checking for photo availability and sending main message
  if (photo && photo.trim() !== "") {
    send_message_with_photo(botToken, chatId, photo, mainMessage);
  } else {
    send_message(botToken, chatId, mainMessage);
  }
}

/**
 * Retrieves the IDs of all administrators in a Telegram chat.
 *
 * This function uses the Telegram Bot API to fetch the list of chat administrators 
 * for a specified chat. It extracts their user IDs and returns them as an array of strings.
 *
 * @param {string} botToken - The bot token provided by the Telegram BotFather. 
 *                            It is used to authenticate the request.
 * @param {string|number} chatId - The unique identifier for the target chat or username 
 *                                 of the target supergroup or channel (in the format `@channelusername`).
 *
 * @return {string[]} An array of administrator user IDs as strings. Returns an empty array 
 *                    if the API call fails or the chat has no administrators.
 *
 * @throws {Error} If the Telegram API is unreachable or an unexpected error occurs, 
 *                 an exception might be thrown by `UrlFetchApp.fetch`.
 */
function get_telegram_admins_ids(botToken,chatId) {
  var url = `https://api.telegram.org/bot${botToken}/getChatAdministrators?chat_id=${chatId}`;
  var response = UrlFetchApp.fetch(url);
  var json = JSON.parse(response.getContentText());
  
  if (json.ok) {
    var admins = json.result;
    var adminIds = [];
    
    for (var i = 0; i < admins.length; i++) {
      var admin = admins[i].user;
      adminIds.push(admin.id.toString());
    }
    Logger.log(adminIds);
    return adminIds;
  } else {
    Logger.log("Error while receiving data: " + json.description);
    return [];
  }
}

/**
 * Generates an HTML string of Telegram admin links for a given chat.
 *
 * This function retrieves the list of administrator IDs for a specified Telegram chat
 * using the `get_telegram_admins_ids` function. It then creates an HTML string
 * containing `<a>` tags linking to each admin's Telegram profile via their ID.
 *
 * @param {string} botToken - The Telegram bot token used to authenticate API requests.
 * @param {string|number} chatId - The ID of the Telegram chat from which admin IDs are retrieved.
 *
 * @return {string} An HTML string with links to the Telegram profiles of the chat administrators.
 * Each link uses the `tg://user?id=<id>` format.
 */
function get_admin_tags_as_HTML(botToken,chatId){
  const ids = get_telegram_admins_ids(botToken,chatId); 
  const links = ids.map(id => {
    return `<a href="tg://user?id=${id}">⠀</a>`;
  }).join('');
  Logger.log(links);
  return links;
}

/**
 * Splits an array into smaller chunks of a specified size.
 *
 * This function divides the input array into smaller arrays (chunks),
 * each containing up to `chunkSize` elements. It modifies the original
 * array by removing elements as they are added to the chunks.
 *
 * @param {Array} array - The array to be split into chunks.
 * @param {number} chunkSize - The size of each chunk. Must be a positive integer.
 *
 * @return {Array<Array>} A new array containing the chunks. Each chunk is an array of up to `chunkSize` elements.
 */
function chunk_array(array, chunkSize) {
  var results = [];
  while (array.length) {
    results.push(array.splice(0, chunkSize));
  }
  return results;
}

/**
 * Sends a photo with a caption to a specified Telegram chat using the Telegram Bot API.
 *
 * This function sends a photo along with an optional caption to a Telegram chat. 
 * The caption supports basic HTML formatting for enhanced text styling.
 *
 * @param {string} botToken - The token of the Telegram bot used to authenticate the API request.
 * @param {string|number} chatId - The ID of the chat (or username for direct messages) where the photo will be sent.
 * @param {string} photo - The URL of the photo to be sent to the chat.
 * @param {string} message - The caption to accompany the photo. Supports basic HTML formatting.
 *
 * @return {void} Logs the response from the Telegram API and the action of sending the message with the photo.
 */
function send_message_with_photo(botToken, chatId, photo, message) {
  const url = `https://api.telegram.org/bot${botToken}/sendPhoto`;
  const options = {
    method: 'post',
    payload: {
      chat_id: chatId,
      photo: photo,
      caption: message,
      parse_mode: 'HTML'
    }
  };

  const response = UrlFetchApp.fetch(url, options);
  Logger.log("Send Message With Photo")
  Logger.log(response.getContentText());
  //return response;
}

/**
 * Sends a message to a specified Telegram chat using the Telegram Bot API.
 *
 * This function sends a message to a Telegram chat using the provided bot token and chat ID. 
 * The message is sent in HTML format, allowing for basic formatting.
 *
 * @param {string} botToken - The token of the Telegram bot used to authenticate the API request.
 * @param {string|number} chatId - The ID of the chat (or username for direct messages) where the message will be sent.
 * @param {string} message - The text of the message to be sent. Supports basic HTML formatting.
 *
 * @return {void} Logs the response from the Telegram API and the action of sending the message.
 */
function send_message(botToken, chatId, message) {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const options = {
    method: 'post',
    payload: {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML'
    }
  };

  const response = UrlFetchApp.fetch(url, options);
  Logger.log("Send Message")
  Logger.log(response.getContentText());
  //return response;
}

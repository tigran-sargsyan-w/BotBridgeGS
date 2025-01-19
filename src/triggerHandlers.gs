/**
 * Example function to demonstrate sending a notification to administrators.
 *
 * This function sends a predefined message and a photo URL to administrators using the `notify_admins` function.
 * The message provides an example notification, and the photo URL links to an image that will be included with the notification.
 */
function example(){
  var message = "Message to send!";
  var photo = "YOUR_PHOTO_URL";

  notify_admins(message,photo);
}
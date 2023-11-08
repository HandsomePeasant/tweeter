// Wait for the DOM to be ready, then add an event listener to the textarea
$(document).ready(function () {
  $('.tweet-text').on('input', function () {

    // Get the length of the text entered into the textarea
    let textLength = $(this).val().length;

    // Calculate how many more characters can be entered
    let remainingChars = 140 - textLength;

    // Update the counter's text with the calculated value
    $('#counter').text(remainingChars);

    // Check if the counter is in the negatives and add a CSS class if so
    if (remainingChars < 0) {
      $('#counter').css('color', 'red');
    } else {
      $('#counter').css('color', 'inherit');
    }
  });
});
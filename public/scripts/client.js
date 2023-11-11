/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

const createTweetElement = (data) => {
  const user = data.user.name;
  const avatar = data.user.avatars;
  const handle = data.user.handle;
  const text = data.content.text;
  const createdDate = new Date(data.created_at);
  const timeAgo = timeago.format(createdDate);

  // Creating each element that makes up a tweet
  const $tweet = $("<article>");
  const $header = $("<header>");
  const $userDiv = $("<div class='user'>");
  const $userImage = $(`<img src="${avatar}" class="avatar">`)
  const $handleDiv = $("<div>");
  const $text = $("<p>");
  const $footer = $("<footer>");
  const $createdDiv = $("<div>");
  const $iconsDiv = $("<div class='icons'>");
  const $iconFlag = $(`<i class="fa-solid fa-flag"></i>`);
  const $iconRetweet = $(`<i class="fa-solid fa-retweet"></i>`);
  const $iconHeart = $(`<i class="fa-solid fa-heart"></i>`);

  // Building the tweet, piece by piece -- using .text sterilizes any user input and ensures the site is protected from XSS
  $tweet.append($header);
  $header.append($userDiv);
  $userDiv.append($userImage);
  $userDiv.append(`${user}`);
  $header.append($handleDiv);
  $handleDiv.text(`${handle}`);
  $tweet.append($text);
  $text.text(`${text}`);
  $tweet.append($footer);
  $footer.append($createdDiv);
  $createdDiv.text(timeAgo);
  $footer.append($iconsDiv);
  $iconsDiv.append($iconFlag);
  $iconsDiv.append($iconRetweet);
  $iconsDiv.append($iconHeart);

  return $tweet;
}

const renderTweets = function(tweets) {
  for (const tweet of tweets) {
    const newTweet = createTweetElement(tweet);
    $("#feed").prepend(newTweet);
  }
};

// Function will disable the form's submit button if the textarea is empty, or if the text exceeds the character limit
const buttonState = () => {
  const tweetText = $('#tweet-text').val().trim();
  const tweetLength = tweetText.length;
  const maxChars = 140;
  const $sendTweet = $('#send-tweet');

  if (tweetText === "" || tweetLength > maxChars) {
    $sendTweet.prop('aria-disabled', 'true');
    $sendTweet.prop('disabled', true);
  } else {
    $sendTweet.prop('aria-disabled', 'false');
    $sendTweet.prop('disabled', false);
  }
};


const handleSubmit = (event) => {
  event.preventDefault();
  const formData = $(event.currentTarget).serialize();

  // Alerts for empty / too-long tweet are less useful now that the button simply does not work under those conditions, but still helpful in case of a user trying to circumvent use of the button
  const tweetText = $('#tweet-text').val().trim();
  const tweetLength = tweetText.length;
  const maxChars = 140;
  if (tweetText === "") {
    alert("Posting an empty Yeet is not very epic!");
    return;
  }

  if (tweetLength > maxChars) {
    alert("Your Yeet exceeds the character limit!");
    return;
  }
  
  $.ajax({
    method: "POST",
    url: "http://localhost:8080/tweets",
    data: formData
  })
  .done(() => {
    // Once the Ajax POST request has completed, clear the text field, re-render tweets, re-disable the submit button and reset the character counter
    $('#tweet-text').val('');
    loadTweets();
    buttonState();
    $('#counter').text("140");
  })
};

const loadTweets = () => {
  const tweetData = $.ajax({
    method: "GET",
    url: "http://localhost:8080/tweets",
  });
  Promise.all([tweetData])
  .then((res) => {
    const [tweetData] = res;
    renderTweets(tweetData);
  })
}

// Once the DOM is ready, disable the submit button (as the text field is empty), set event listeners for form submission & text input, and render tweets
$(document).ready(function () {
  buttonState();
  $('#tweet-text').on('input', buttonState);
  $("form").on("submit", handleSubmit);
  loadTweets();
});

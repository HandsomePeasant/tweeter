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
};

const renderTweets = (tweets) => {
  $("#feed").empty();
  for (const tweet of tweets) {
    const newTweet = createTweetElement(tweet);
    $("#feed").prepend(newTweet);
  }
};

const handleSubmit = (event) => {
  event.preventDefault();
  const formData = $(event.currentTarget).serialize();

  // If tweet is either too long or empty, an error message will slide down to inform the user. 
  const tweetText = $('#tweet-text').val().trim();
  const tweetLength = tweetText.length;
  const maxChars = 140;
  if (tweetText === "") {
    $('.error-message p').text("Posting an empty Yeet is not very epic!")
    $('.error-message').slideDown();
    return;
  }

  if (tweetLength > maxChars) {
    $('.error-message p').text("Your Yeet exceeds the character limit!")
    $('.error-message').slideDown();
    return;
  }

  $.ajax({
    method: "POST",
    url: "/tweets",
    data: formData
  })
    .done(() => {
      // Once the Ajax POST request has completed, clear the text field, re-render tweets, re-disable the submit button, hide any error message and reset the character counter
      $('#tweet-text').val('');
      $('.new-tweet').slideUp();
      $('.error-message').slideUp();
      loadTweets();
      $('#counter').text("140");
    });
};

const loadTweets = () => {
  const tweetData = $.ajax({
    method: "GET",
    url: "/tweets",
  });

  Promise.all([tweetData])
    .then((res) => {
      const [tweetData] = res;
      renderTweets(tweetData);
    })

    .catch((error) => {
      $('.error-message p').text("Uh oh, something went wrong while you were Yeeting!");
      $('.error-message').slideDown();
    });
};

// Once the DOM is ready, disable the submit button (as the text field is empty), set event listeners for form submission & text input, and render tweets
$(document).ready(function () {
  $('.error-message').slideUp();
  $('.new-tweet').slideUp();
  $('#tweet-text').on('input', function () {
    $('.error-message').slideUp();
  });

  $("form").on("submit", handleSubmit);
  $('.fa-xmark').on('click', function() {
    $('.new-tweet').slideUp();
    $('#tweet-text').val('');
  });
  
  // Clicking the "Write a new Yeet" text in the nav will enable the new-tweet form (and reset the counter), or focus the text field if the form is already visible
  $('.nav-tweet').on('click', function(event) {
    event.preventDefault();
    if ($('.new-tweet').is(':visible')) {
      $('.tweet-text').focus();
    } else {
      $('.new-tweet').slideDown();
      $('.tweet-text').focus();
      $('#counter').text('140');
      $('#counter').css('color', '#545149');
    }
  });

  loadTweets();
});
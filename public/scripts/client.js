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

  const $tweet = $("<article>");
  const $header = $("<header>");
  const $userDiv = $("<div class='user'>");
  const $userImage = $(`<img src="${avatar}">`)
  const $handleDiv = $("<div>");
  const $text = $("<p>");
  const $footer = $("<footer>");
  const $createdDiv = $("<div>");
  const $iconsDiv = $("<div class='icons'>");
  const $iconFlag = $(`<i class="fa-solid fa-flag"></i>`);
  const $iconRetweet = $(`<i class="fa-solid fa-retweet"></i>`);
  const $iconHeart = $(`<i class="fa-solid fa-heart"></i>`);

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
    $("#feed").append(newTweet);
  }
};

const handleSubmit = (event) => {
  event.preventDefault();
  const formData = $(event.currentTarget).serialize();

  $.ajax({
    method: "POST",
    url: "http://localhost:8080/tweets",
    data: formData
  })
}

$(document).ready(function () {
  $("form").on("submit", handleSubmit);
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
  loadTweets();
});

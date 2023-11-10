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
  const created = data.created_at;

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
  $createdDiv.text(`${created}`);
  $footer.append($iconsDiv);
  $iconsDiv.append($iconFlag);
  $iconsDiv.append($iconRetweet);
  $iconsDiv.append($iconHeart);

  return $tweet;
}

const tweetData = [
  {
    "user": {
      "name": "Newton",
      "avatars": "https://i.imgur.com/73hZDYK.png",
      "handle": "@SirIsaac"
    },
    "content": {
      "text": "If I have seen further it is by standing on the shoulders of giants"
    },
    "created_at": 1699450416226
  },
  {
    "user": {
      "name": "Descartes",
      "avatars": "https://i.imgur.com/nlhLi3I.png",
      "handle": "@rd"
    },
    "content": {
      "text": "Je pense , donc je suis"
    },
    "created_at": 1699536816226
  }
]

const renderTweets = function(tweets) {
  for (const tweet of tweets) {
    const newTweet = createTweetElement(tweet);
    $("#feed").append(newTweet);
  }
};

$(document).ready(function () {
  renderTweets(tweetData);
});

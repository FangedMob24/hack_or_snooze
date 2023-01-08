"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  console.debug("generateStoryMarkup", story);

  const checked = currentUser.isItChecked(story);

  const hostName = story.getHostName();
  return $(`

  
      <li id="${story.storyId}">
        <input type="checkbox" id="favBtn" ${checked}/>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

// adds a new story to the site


async function createNewStory(evt){
  evt.preventDefault();

  const author = $("#submit-author").val();
  const title = $("#submit-title").val();
  const url = $("#submit-url").val();
  const username = currentUser.username;

  let story = {
    author,
    title,
    url,
    username
  }

  const newStory = await storyList.addStory(currentUser,story);

  currentUser.addToUserStories(newStory);

  getAndShowStoriesOnStart();

  $addNewStory.hide();

}

//adds a event to the submit button for a new story

$addNewStory.on("submit", createNewStory);

// put favorite stories on page

function putFavsOnPage(){
  $favStoriesList.empty();

  for (let favs of currentUser.favorites) {
    const $favs = generateStoryMarkup(favs);
    $favStoriesList.append($favs);
  }

  $favStoriesList.show();
}

//loads the user posted stories into the dom

function loadMyPosts(){
  $listOfMyStories.empty();

  for (let myPost of currentUser.ownStories) {
    const $myPost = generateStoryMarkup(myPost);
  
    $listOfMyStories.append($myPost);
    
  }
  addDeleteBtn();
  $listOfMyStories.show();
}

//appends a delete button to user created post

function addDeleteBtn(){

  $("<button class='delete-btn' type='button'>Del</button>").appendTo(`#list-of-my-stories > li`);
}


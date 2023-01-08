"use strict";

// global to hold the User instance of the currently-logged-in user
let currentUser;

/******************************************************************************
 * User login/signup/login
 */

/** Handle login form submission. If login ok, sets up the user instance */

async function login(evt) {
  console.debug("login", evt);
  evt.preventDefault();

  // grab the username and password
  const username = $("#login-username").val();
  const password = $("#login-password").val();

  // User.login retrieves user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.
  currentUser = await User.login(username, password);

  $loginForm.trigger("reset");

  saveUserCredentialsInLocalStorage();
  updateUIOnUserLogin();
}

$loginForm.on("submit", login);

/** Handle signup form submission. */

async function signup(evt) {
  console.debug("signup", evt);
  evt.preventDefault();

  const name = $("#signup-name").val();
  const username = $("#signup-username").val();
  const password = $("#signup-password").val();

  // User.signup retrieves user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.
  currentUser = await User.signup(username, password, name);

  saveUserCredentialsInLocalStorage();
  updateUIOnUserLogin();

  $signupForm.trigger("reset");
}

$signupForm.on("submit", signup);

/** Handle click of logout button
 *
 * Remove their credentials from localStorage and refresh page
 */

function logout(evt) {
  console.debug("logout", evt);
  localStorage.clear();
  location.reload();
}

$navLogOut.on("click", logout);

/******************************************************************************
 * Storing/recalling previously-logged-in-user with localStorage
 */

/** If there are user credentials in local storage, use those to log in
 * that user. This is meant to be called on page load, just once.
 */

async function checkForRememberedUser() {
  console.debug("checkForRememberedUser");
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  if (!token || !username) return false;

  // try to log in with these credentials (will be null if login failed)
  currentUser = await User.loginViaStoredCredentials(token, username);
}

/** Sync current user information to localStorage.
 *
 * We store the username/token in localStorage so when the page is refreshed
 * (or the user revisits the site later), they will still be logged in.
 */

function saveUserCredentialsInLocalStorage() {
  console.debug("saveUserCredentialsInLocalStorage");
  if (currentUser) {
    localStorage.setItem("token", currentUser.loginToken);
    localStorage.setItem("username", currentUser.username);
  }
}

/******************************************************************************
 * General UI stuff about users
 */

/** When a user signs up or registers, we want to set up the UI for them:
 *
 * - show the stories list
 * - update nav bar options for logged-in user
 * - generate the user profile part of the page
 */

function updateUIOnUserLogin() {
  console.debug("updateUIOnUserLogin");

  $allStoriesList.show();

  updateNavOnLogin();
}

/**************************
 * adding articles to the users favorite bar
 */

$(".stories-list").on("click","#favBtn",function(evt){
  const selected = $(evt.target).parent();
  const id = selected[0].id;
console.log(selected);
  if(evt.target.checked === true){
    currentUser.addToUserFav(currentUser,id);
  }
  else{
    currentUser.removeUserFav(currentUser,id);
  }

  //
});

//adds a event to the delete button

$listOfMyStories.on("click",".delete-btn", function(evt){
  deleteStory(evt);
});

//will delete the story from the dom and api

async function deleteStory(evt){
  const selectedStory = $(evt.target).parent();
  const storyId = selectedStory[0].id;
  const token = currentUser.loginToken;

  for(let mine of currentUser.ownStories){
    if(storyId === mine.storyId){
      let index = currentUser.ownStories.indexOf(mine)
      currentUser.ownStories.splice(index,1);
    }
  }

  for(let mine of storyList.stories){
    if(storyId === mine.storyId){
      let index = storyList.stories.indexOf(mine)
      storyList.stories.splice(index,1);
    }
  }

  loadMyPosts();

  const res = await axios.delete(`${BASE_URL}/stories/${storyId}?token=${token}`);


}
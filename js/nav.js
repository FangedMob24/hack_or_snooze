"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

//shows the form to add a new story

$body.on("click","#new-story-form", updateNewStoryForm);

function updateNewStoryForm(){
  hidePageComponents();
  $addNewStory.show();

}

//allows you to click the nav bar to bring up the favorite list

$body.on("click","#userFavList",pullUpFavList);

function pullUpFavList(){
  hidePageComponents();

  putFavsOnPage();
}

//allows the nav bar to bring up the list of user created stories

($body).on("click","#my-posted-stories", pullMyPosts);

function pullMyPosts(){
  hidePageComponents();

  loadMyPosts()
}
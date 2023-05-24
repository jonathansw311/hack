"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
  $addStoryForm.hide();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
  $loggedInMenu.show()
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
  $loggedInMenu.show()
}


function addStory(e){
  $addStoryForm.show();

}

$body.on("click", "#submit", addStory);


function favoriteLinks(){
  $allStoriesList.empty() 
  $addStoryForm.hide()
  $signupForm.hide()
  console.log(storyList)
  console.log(currentUser.favorites)
  //reLogin()
  let favstories = new StoryList(currentUser.favorites)
  console.log(favstories)
  getAndShowStoriesForFavs(favstories);//this goes to the stories js. to load favs on page
}
$body.on("click", "#favoriteLinks", favoriteLinks);


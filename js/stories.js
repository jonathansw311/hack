"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();
 
  putStoriesOnPage();
}

async function getAndShowStoriesForFavs(Favs) {
  
 
  $storiesLoadingMsg.remove();
 
  putFavStoriesOnPage(Favs);
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);
console.log(story)
 const hostName = story.getHostName();
 
  return $(`
      <li id="${story.storyId}">
      <input type="checkbox" id="box${story.storyId}" class="favBox">
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
console.log(storyList)


  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

function putFavStoriesOnPage(Favs) {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();
console.log(Favs)


  // loop through all of our stories and generate HTML for them
  for (let story of Favs.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}



async function submitClicked() {
  const authInput = document.getElementById('authorInput').value;
  const titleInput = document.getElementById('titleInput').value;
  const urlInput = document.getElementById('urlInput').value;
  
let storey =

    {
         "author": authInput, 
         "title": titleInput,
          "url": urlInput
        }
  
   storyList = await storyList.addStory(currentUser, storey);
  $addStoryForm.hide();
  await getAndShowStoriesOnStart();
}
$body.on("click", '#storyFormButton', submitClicked)




async function submitFav(e){

let favId = $(this).closest('li').prop('id');
console.log(favId)

//console.log(favStory)
if (e.target.checked){
  console.log(currentUser)
currentUser.addFav(favId);// in the modals section line 220's
console.log(currentUser)

 console.log(currentUser)
}
if (!e.target.checked){
   currentUser.delFav(favId);

}
}

$body.on('click', '.favBox', submitFav)
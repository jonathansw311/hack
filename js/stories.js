"use strict";
let favIds = [];
// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();
 
  putStoriesOnPage();
}
// the following code is called from nav.js when either favorites or mystorys car called.  the list is pushed in and myStory is true if it was clicked from mystory link
async function getAndShowStoriesForFavs(Favs, myStory) {
  
 
  $storiesLoadingMsg.remove();
 
  putFavStoriesOnPage(Favs, myStory);
}

//async function getAndShowStoriesForOwn(Favs) {
  
 
 // $storiesLoadingMsg.remove();
 
//  putFavStoriesOnPage(Favs);
//}


/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, myStory) {
  // console.debug("generateStoryMarkup", story);
  favIds=[];
  
  
  if(currentUser != undefined){
   for(let favId of currentUser.favorites){
     favIds.push(favId.storyId)
 
}}
    
 const hostName = story.getHostName(story.url);//models 26

let checkedHTML="";
const checked = favIds.includes(story.storyId)//check if this instance of story is cheked as favorite
if(myStory){//checks to see if this is a current users story


  if(checked){//if this istance is in favorite a check mark is placed in the box
    checkedHTML = 'checked="true';
    }
      return $(`
          <li id="${story.storyId}">
         <button id="deleteStory">Delete</button> <input type="checkbox" id="box${story.storyId}" class="favBox" ${checkedHTML}">
            <a href="${story.url}" target="a_blank" class="story-link">
              ${story.title}
            </a>
            <small class="story-hostname">(${hostName})</small>
            <small class="story-author">by ${story.author}</small>
            <small class="story-user">posted by ${story.username}</small>
          </li>
        `);
       
      
      }





else{//loads both favorites and main page as they are displayed the same
if(checked){
checkedHTML = 'checked="true';
}
  return $(`
      <li id="${story.storyId}">
      <input type="checkbox" id="box${story.storyId}" class="favBox" ${checkedHTML}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);}
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

function putFavStoriesOnPage(Favs, myStory) {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();


  // loop through all of our stories and generate HTML for them
  for (let story of Favs.stories) {
    const $story = generateStoryMarkup(story, myStory);
    $allStoriesList.append($story);
  }

   $allStoriesList.show();
   
   
}


//below is the logic for clicking the submit button to submit a story
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
  
   storyList = await storyList.addStory(currentUser, storey);//the new story is submited to api in the storys modal
     currentUser.ownStories.push(storyList)
   $addStoryForm.hide();
  await getAndShowStoriesOnStart();// reloads main page with new story 
}
$body.on("click", '#storyFormButton', submitClicked)



//this is for adding favorites and removing storys to the current user
async function submitFav(e){

let favId = $(this).closest('li').prop('id');//listener for what is being clicked

if (e.target.checked){// if a check was added it adds the story
  
currentUser.addFav(favId);// in the modals section line 220's

}
if (!e.target.checked){//if a check was removed it removes the story
   currentUser.delFav(favId);// models section 260's

}
}

$body.on('click', '.favBox', submitFav)

//following is logic if the delete story button is pressed
function deleteStory(){
  let delStory = $(this).closest('li').prop('id');
  let delLine =$(this).closest('li');
  
currentUser.delStoryFunc(delStory)//the story is removed from both api and currentuser in Modal.js
delLine.remove();//its also removed from the dom

}
$body.on('click', '#deleteStory', deleteStory)
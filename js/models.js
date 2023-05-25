"use strict";

const BASE_URL = "https://hack-or-snooze-v3.herokuapp.com";

/******************************************************************************
 * Story: a single story in the system
 */

class Story {

  /** Make instance of Story from data object about story:
   *   - {title, author, url, username, storyId, createdAt}
   */

  constructor({ storyId, title, author, url, username, createdAt }) {
    this.storyId = storyId;
    this.title = title;
    this.author = author;
    this.url = url;
    this.username = username;
    this.createdAt = createdAt;
  }

  /** Parses hostname out of URL and returns it. */

  getHostName(url) {
    // UNIMPLEMENTED: complete this function!
      let stepOne= remFirstSlash(url)
      let stepTwo= remWWW(stepOne)
      let stepThree = clipEnd(stepTwo)
            
      function remFirstSlash(url){ 
      let idx = (url.indexOf('//')+2)
      let host = url.slice(idx, url.length)
      return host 
  }
      function remWWW(stepOne){
      let www = stepOne.indexOf('www')   
      if(www===0){
          let stripped = stepOne.slice(4, stepOne.length)
          return stripped
    }
    return stepOne
  }
  function clipEnd(stepTwo){
    let ending = stepTwo.indexOf('/')
    if (ending>0){
      let stripped = stepTwo.slice(0, ending)
      return stripped
    }
    return stepTwo;
  }     
  
  return stepThree;
  
  }
}


/******************************************************************************
 * List of Story instances: used by UI to show story lists in DOM.
 */

class StoryList {
  constructor(stories) {
    this.stories = stories;
  }

  /** Generate a new StoryList. It:
   *
   *  - calls the API
   *  - builds an array of Story instances
   *  - makes a single StoryList instance out of that
   *  - returns the StoryList instance.
   */

  static async getStories() {
    // Note presence of `static` keyword: this indicates that getStories is
    //  **not** an instance method. Rather, it is a method that is called on the
    //  class directly. Why doesn't it make sense for getStories to be an
    //  instance method?

    // query the /stories endpoint (no auth required)
    const response = await axios({
      url: `${BASE_URL}/stories`,
      method: "GET",
    });

    // turn plain old story objects from API into instances of Story class
    const stories = response.data.stories.map(story => new Story(story));

    // build an instance of our own class using the new array of stories
    return new StoryList(stories);
  }

  /** Adds story data to API, makes a Story instance, adds it to story list.
   * - user - the current instance of User who will post the story
   * - obj of {title, author, url}
   *
   * Returns the new Story instance
   */

  async addStory(user, newStory) {
    // UNIMPLEMENTED: complete this function!
 
 let res =  await axios.post(`${BASE_URL}/stories`, 

{
    "token": user.loginToken,
    "story": {
        "author": newStory.author, 
       "title": newStory.title,
        "url": newStory.url
    }
})
let story = res.data.story;

return new Story(
  {
    author: story.author,
    title: story.title,
    url: story.url,
    createdAt: story.createdAt,
    storyId: story.storyId,
    username: story.username
  })
  
}

}


/******************************************************************************
 * User: a user in the system (only used to represent the current user)
 */

class User {
  /** Make user instance from obj of user data and a token:
   *   - {username, name, createdAt, favorites[], ownStories[]}
   *   - token
   */

  constructor({
                username,
                name,
                createdAt,
                favorites = [],
                ownStories = []
              },
              token) {
    this.username = username;
    this.name = name;
    this.createdAt = createdAt;

    // instantiate Story instances for the user's favorites and ownStories
    this.favorites = favorites.map(s => new Story(s));
    this.ownStories = ownStories.map(s => new Story(s));

    // store the login token on the user so it's easy to find for API calls.
    this.loginToken = token;
  }

  /** Register new user in API, make User instance & return it.
   *
   * - username: a new username
   * - password: a new password
   * - name: the user's full name
   */

  static async signup(username, password, name) {
    const response = await axios({
      url: `${BASE_URL}/signup`,
      method: "POST",
      data: { user: { username, password, name } },
    });

    let { user } = response.data

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories
      },
      response.data.token
    );
  }

  /** Login in user with API, make User instance & return it.

   * - username: an existing user's username
   * - password: an existing user's password
   */

  static async login(username, password) {
    const response = await axios({
      url: `${BASE_URL}/login`,
      method: "POST",
      data: { user: { username, password } },
    });

    let { user } = response.data;

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories
      },
      response.data.token
    );
  }

  /** When we already have credentials (token & username) for a user,
   *   we can log them in automatically. This function does that.
   */

  static async loginViaStoredCredentials(token, username) {
    try {
      const response = await axios({
        url: `${BASE_URL}/users/${username}`,
        method: "GET",
        params: { token },
      });

      let { user } = response.data;

      return new User(
        {
          username: user.username,
          name: user.name,
          createdAt: user.createdAt,
          favorites: user.favorites,
          ownStories: user.stories
        },
        token
      );
    } catch (err) {
      console.error("loginViaStoredCredentials failed", err);
      return null;
    }
  }
// the below code adds favorite stories
  async addFav(favStoryId) {
    let response = await axios.post(`${BASE_URL}/users/${currentUser.username}/favorites/${favStoryId}`, {"token": currentUser.loginToken})// first we post fav stories to the API
  let usersNewFavList = response.data.user;// the response is put into a new list
  
   
   const lastAdded=(usersNewFavList.favorites.length-1)//the last story to be added in the api is loaded into an object
   
   let favs = {storyId: usersNewFavList.favorites[lastAdded].storyId,
                author: usersNewFavList.favorites[lastAdded].author,
                title: usersNewFavList.favorites[lastAdded].title,
                createdAt: usersNewFavList.favorites[lastAdded].createdAt,
                url: usersNewFavList.favorites[lastAdded].url,
                username: usersNewFavList.favorites[lastAdded].username
              }
  let favss = new Story(favs)//an instance of that story is made
   currentUser.favorites.push(favss);//and pushed into the current user so the webpage displays correctly
  
  }
//the follow function deletes a favorite story from the CurrentUser
  async delFav(favStoryId) {
    let newFavField = {}
    
    let response = await axios.delete(`${BASE_URL}/users/${currentUser.username}/favorites/${favStoryId}`, {data: {"token": currentUser.loginToken}})// the story to be deleted is pushed to the api
  
   
   newFavField =  response.data.user.favorites.map(c => c)//teh new favorites list is sent to make into instances of story and pushed into current user so website is updated
   let insertNewFavs=[];
   for(let refracNav of newFavField){
   let refracNavi = new Story(refracNav)
  insertNewFavs.push(refracNavi)}
   
  currentUser.favorites = insertNewFavs;
   
    
  }
// the following code deletes a user story from the list
  async delStoryFunc(delStoryID){
    let storyobj ={};
    // the story is delted from teh API. Unlike  calls to the favorites a new updated list is not sent back from the API, just conformation the story has been deleted
    await axios.delete(`https://hack-or-snooze-v3.herokuapp.com/stories/${delStoryID}` ,{data:{"token": currentUser.loginToken}})     
    let newOwnStoryList =currentUser.ownStories.filter(story =>story.storyId != delStoryID )//the story is removed from current User and sotryList
    let newstoryList = storyList.stories.filter(story => story.storyId != delStoryID)
    storyobj = new StoryList(newstoryList)
    storyList=storyobj;
    currentUser.ownStories = newOwnStoryList;
 
  }

}

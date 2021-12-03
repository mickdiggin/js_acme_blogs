function createElemWithText(elemType="p", theContent="", className)
{
    const myElem = document.createElement(elemType);
    myElem.textContent = theContent;

    if (className)
    {
        myElem.classList.add(className);
    }
    return myElem;
}

function createSelectOptions(userData)
{
    if (!userData)
    {
        return undefined;
    }

    let theData = JSON.parse(JSON.stringify(userData));

    let theArray = theData.map(function(user){
        let anElement = document.createElement("option");
        anElement.value = user.id;
        anElement.textContent = user.name;
        return anElement;
    });

    return theArray;
}

function toggleCommentSection(postId)
{
    if(!postId)
    {
        return undefined;
    }
    let theSection = document.querySelector(`section[data-post-id='${postId}']`);

    if (theSection)
    {
        theSection.classList.toggle(`hide`);
        return theSection;
    }
    else if (!theSection)
    {
        return null;
    }

}

function toggleCommentButton(postId)
{
    if (!postId) return undefined;
    
    let theButton = document.querySelector(`button[data-post-id='${postId}']`);

    if(!theButton) return null;

    theButton.textContent === "Show Comments" ? theButton.textContent = "Hide Comments" : theButton.textContent = "Show Comments";

    return theButton;
}

function deleteChildElements(parentElement) 
{
    if (!parentElement) return undefined;
    if (!parentElement.attributes) return undefined;

    let child = parentElement.lastElementChild;
    
    while (child) {
        parentElement.removeChild(child);
        child = parentElement.lastElementChild;
    }

    return parentElement;
}

function addButtonListeners()
{
    let allButtons = document.querySelectorAll("main > button");

    if (allButtons)
    {
        for (let i = 0; i < allButtons.length; i++)
        {
            let thePost = allButtons[i].dataset.postId;
            allButtons[i].addEventListener("click", (event) => toggleComments(event, thePost), false);
        }
        return allButtons;
    }

    return undefined;
}

function removeButtonListeners()
{
    let allButtons = document.querySelectorAll("main > button");

    if (allButtons)
    {
        allButtons.forEach(function (button){
            //let thePost = button.dataset.postId;
            button.removeEventListener("click", (event) => toggleComments(event, thePost));
        });
    }
    return allButtons;
}

function createComments(commentsData)
{
    if (!commentsData) return undefined;

    let theComments = JSON.parse(JSON.stringify(commentsData));

    if (theComments)
    {
        let theFragment = document.createDocumentFragment();

        theComments.forEach(function (comment){
            let anArticle = document.createElement("article");
            let theH3 = createElemWithText('h3', comment.name);
            let theBody = createElemWithText('p', comment.body);
            let theFrom = createElemWithText('p', `From: ${comment.email}`);
            anArticle.append(theH3, theBody, theFrom);
            theFragment.append(anArticle);
        });

        return theFragment;
    }

    return undefined;
}

function populateSelectMenu(userData)
{
    if (!userData) return undefined;

    let theData = JSON.parse(JSON.stringify(userData));

    if (theData)
    {
        let theMenu = document.getElementById("selectMenu");
        
        if (theMenu)
        {
            let theElements = createSelectOptions(theData);
            theElements.forEach(function (option) {
                theMenu.append(option);
            });
            return theMenu;
        }
        else
        {
            return undefined;
        }
    }
    return undefined;
}

async function getUsers()
{
    try
    {
        let theData = await fetch("https://jsonplaceholder.typicode.com/users");
        let finishedProduct = await theData.json();
        return finishedProduct;
    }
    catch (err)
    {
        return undefined;
    }
}

async function getUserPosts(theUserId)
{
    if (!theUserId) return undefined;

    try
    {
         let userPostsRaw = await fetch("https://jsonplaceholder.typicode.com/posts", {
            method: "GET"
        });
        
        let userPosts = await userPostsRaw.json();

        let finalArr = [];

        userPosts.forEach(function (post) {
            if (post.userId === theUserId)
            {
                finalArr.push(post);
            }
        });

        return finalArr;

    }
    catch (error)
    {
        return undefined;
    }
}

async function getUser(theUserId)
{
    if (!theUserId) return undefined;

    try
    {
        let userRaw = await fetch("https://jsonplaceholder.typicode.com/users", {
            method: "GET"
        });
        let users = await userRaw.json();

        if (!users) return undefined;

        let theUser;

        users.forEach(function (user) {
            if (user.id === theUserId)
            {
                theUser = user;
            }
        });

        if (theUser)
        {
            return theUser;
        }
        else
        {
            return undefined;
        }

    }
    catch(error)
    {
        return undefined;
    }
}

async function getPostComments(thePostId)
{
    if (!thePostId) return undefined;

    try
    {
        let commentsRaw = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${thePostId}`, {
            method: "GET"
        });

        let comments = await commentsRaw.json();

        if(comments) return comments;
        else return undefined;

    }
    catch (error)
    {
        return undefined;
    }
}

async function displayComments(thePostId)
{
    if(!thePostId) return undefined;

    commentsSection = document.createElement("section");
    commentsSection.dataset.postId = thePostId;
    commentsSection.classList.add("comments", "hide");

    let comments = await getPostComments(thePostId);
    let fragment = createComments(comments);
    commentsSection.append(fragment);

    return commentsSection;
}

async function createPosts(postsData)
{
    if (!postsData) return undefined;

    thePosts = JSON.parse(JSON.stringify(postsData));
    
    if (!thePosts) return undefined;

    fragment = document.createDocumentFragment();

    for (let i = 0; i < thePosts.length; i++)
    {
        let anArticle = document.createElement("article");
        let theTitle = document.createElement("h2");
        theTitle.textContent = thePosts[i].title;
        
        let theBody = document.createElement("p");
        theBody.textContent = thePosts[i].body;


        let displayedId = document.createElement("p");
        displayedId.textContent = `Post ID: ${thePosts[i].id}`;

        let author = await getUser(thePosts[i].userId);
        let authDeets = document.createElement("p");
        authDeets.textContent = `Author: ${author.name} with ${author.company.name}`;

        let coCatchphrase = document.createElement("p");
        coCatchphrase.textContent = author.company.catchPhrase;

        let showDemComments = document.createElement("button");
        showDemComments.textContent = "Show Comments";
        showDemComments.dataset.postId = thePosts[i].id;
        
        let section = await displayComments(thePosts[i].id);

        anArticle.append(theTitle, theBody, displayedId, authDeets, coCatchphrase, showDemComments, section);
        fragment.append(anArticle);
    }
    return fragment;
}

async function displayPosts(posts)
{
    let theMain = document.querySelector("main");

    let element;
    if(posts)
    {
        element = await createPosts(posts);
    }
    else if(!posts)
    {
        element = document.getElementsByClassName("default-text");
        element = element[0];
    }

    theMain.append(element);
    return element;
}

function toggleComments(event, postId)
{
    if (!event || !postId) return undefined;

    event.target.listener = true;
    let section = toggleCommentSection(postId);
    let button = toggleCommentButton(postId);

    return [section, button];
}

async function refreshPosts(postsData)
{
    if (!postsData) return undefined;
    let removeButtons = removeButtonListeners();

    let theMain = document.querySelector("main");

    let main = deleteChildElements(theMain);

    let fragment = await displayPosts(postsData);

    let addButtons = addButtonListeners();

    return [removeButtons, main, fragment, addButtons];
}

async function selectMenuChangeEventHandler(e)
{
    const selectMenu = document.querySelector('select');
    selectMenu.disabled = true;

    let userId = e?.target?.value || 1;
    let posts = await getUserPosts(userId);

    let refreshPostsArray = await refreshPosts(posts);


    selectMenu.disabled = false;
    return [userId, posts, refreshPostsArray];
}

async function initPage()
{
    let users = await getUsers();
    let select = populateSelectMenu(users);
    return [users, select];
}

function initApp()
{
    initPage();
    let selectMenu = document.getElementById("selectMenu");
    selectMenu.addEventListener("change", selectMenuChangeEventHandler);
}

document.addEventListener("DOMContentLoaded", initApp());
# Key Features
- Individual account registration and sign-ins
    - Lenders and Borrowers will communicate via email during book exchange process
    - All users have to indicate geographical area to facilitate book exchange (east, west, north, central)
- Landing Page
    - Provides a repository of books that have been listed by potential lenders
    - Title, author, sypnosis and book cover of each book is clearly displayed
- Search Function
    - Borrower can search books by their book title or ISBN
- Filter function
    - Borrower can filter books by categories, genre and area
- New book listing function
    - In a new menu, Lenders are prompted to fill in book information, namely title, author, sypnosis and book cover
    - Alternatively, Lenders can enter the book's ISBN. Information autofills.
- User Rating
    - Lenders can rate their experience with Borrowers and vice versa.
- "Borrow Now" button
    - Lenders will receive an email notification that an user wants to borrow their listed book
    - Lenders can reach out to the Borrower if they are interested to conduct a book exchange
# Design Consideration
- User registration
    - Build a personalised experience in the book-exchange community
    - Allow users to build reputation and credibility
- Use of Firebase
    - Simple, easy to integrate for POC purposes
- Use of ISBN
    - Minimise user errors when filling in book information
    - For Lenders: Shortens the amount of time for the book listing process
    - For Borrowers: Provides more precise way of searching for a desired book (hardcover and paperback have distinct ISBN)
    - Use of ISBN standardises book titles during listing
- Area filter
    - One major barrier to book exchanges is the lack of convenience
    - It is key for users to be able to easily meet up with one another without travelling long distances
    - Users would likely prioritise exchanges with those close in proximity
- User Rating
    - Users can build reputation based on past exchanges with other users
    - Promotes positive interactions between users
    - Empowers users to help the platform penalise unpleasant users
# Future Milestones
- Create more categories to include a larger range of reading material, eg. children books (filter by age range), non-English books, magazines, comic books, poetry, manga
- Provide function to sort books by popularity, recently added, currently available
- Curate AI-powered recommendations that suggest books that users can borrow based on their borrowing history
- Initiate regular book clubs or discussion forums to nurture a community around the project, forming a group of dedicated users who can introduce it to new users
- Improve search function (able to search by author, tolerate typos)
- Improve filter function (users should be able to apply more than one filter at one time (now limited by Firebase))
- Introduce Live Chat function to facilitate book exchange
- Add feature for users to indicate book condition (new, read once, well-loved, lightly annotated, heavily annotated)

# Versions
**Windows:** 10 Version 22H2 (OS Build 19045.4170)  
**Node :** v20.11.0  
**npm :** v10.2.3

### Browsers Tested
1. Opera GX : LVL5 (core: 107.0.5045.86)
2. Chrome : Version 123.0.6312.106 (Official Build) (64-bit)
3. Edge : Version 123.0.2420.81 (Official build) (64-bit)

# Getting Started

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## How To Run
### Install Node.js and npm
Node.js can be downloaded from [here](https://nodejs.org/en/download).  
Installation guide can be found in this [blog](https://radixweb.com/blog/installing-npm-and-nodejs-on-windows-and-mac).
### Check if Node.js and npm are installed properly
Go to command prompt (press `Win Key + X` , then press `a`). 

```
node -v  
npm -v
```
It should output the installed versions
```
v20.11.0
10.2.3
```
### Git Clone and Install Necessary Modules
Git clone this repo  
Go to the root project directory and run `npm install`
```shell
git clone https://github.com/Stygian84/BookSwap.git
cd BookSwap
npm install
```
### Place `.env` file and `npm start`
Place `.env` file in the root project directory (inside BookSwap folder).  
Then, to start development process, run 
```p
npm start
```
This should be the expected output
```
Compiled successfully!

You can now view BookSwap in the browser.        

  Local:            http://localhost:3000        
  On Your Network:  http://10.32.50.156:3000     

Note that the development build is not optimized.
To create a production build, use npm run build. 

webpack compiled successfully
```
### Finish
The web app should open automatically on your default browser.  
If it doesn't open automatically, 
open [http://localhost:3000](http://localhost:3000) to view it in your browser.


## Important Note
**Please Note:** The functionality may not be fully supported on iOS devices and the Safari browser. 
The web application is also designed to be compatible with laptop devices.

# FAQ
If you encounter the error below, ensure `.env` is stored in the root project directory.
```
Installations: Missing App configuration value: "projectId" (installations/missing-app-config-values).
FirebaseError: Installations: Missing App configuration value: "projectId" (installations/missing-app-config-values).
```
`.env` file should have these parameters
```js
REACT_APP_FIREBASE_API_KEY
REACT_APP_FIREBASE_AUTH_DOMAIN
REACT_APP_FIREBASE_PROJECT_ID
REACT_APP_FIREBASE_STORAGE_BUCKET
REACT_APP_FIREBASE_MESSAGING_SENDER_ID
REACT_APP_FIREBASE_APP_ID
REACT_APP_FIREBASE_MEASUREMENT_ID
```



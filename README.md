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
### 1. Install Node.js and npm
Node.js can be downloaded from [here](https://nodejs.org/en/download).  
Installation guide can be found in this [blog](https://radixweb.com/blog/installing-npm-and-nodejs-on-windows-and-mac).
### 2. Check if Node.js and npm are installed properly
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
### 3. Git Clone and Install Necessary Modules
Git clone this repo  
Go to the root project directory and run `npm install`
```shell
git clone https://github.com/Stygian84/BookSwap.git
cd BookSwap
npm install
```
### 4. Place `.env` file in root directory and Run `npm start`
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
### 5. Finish
The web app should open automatically on your default browser.  
If it doesn't open automatically, 
open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### 6. Live Chat
To simulate live chat feature, open another terminal and run `npm start`. When this prompt below appears, press `Y`.
```
? Something is already running on port 3000.

Would you like to run the app on another port instead? » (Y/n)
```
User A has to go to User B profile and then click the chat button.  
Live Demo of the live chat feature can be found in this [link](https://youtu.be/_mMSghv22YM). 
### Dummy Login Credentials
1. Email: `ghostkirito84@gmail.com` , Password: `admin1234`
2. Email: `nicholasgandhi84@gmail.com` , Password: `admin1234`
3. Email: `1005295@mymail.sutd.edu.sg` , Password: `admin1234`  

**Note :** You can also register your own email or any valid email to register as a user.  

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
- Live Chat feature
    - To reach out to borrowers/lenders, users can communicate and find a common time frame and place to do the exchange

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
- Improve Live Chat function to facilitate book exchange so that users can chat with any known other users
- Add feature for users to indicate book condition (new, read once, well-loved, lightly annotated, heavily annotated)


## Important Note
**Please Note:** The functionality may not be fully supported on iOS devices and the Safari browser. 
The web application is also designed to be compatible with laptop devices.

# FAQ
## 1. Missing App Configuration Error
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

## 2. `.env` Location
The `.env` file should be in the same level as `.gitignore` , `.package-lock.json` and `README.md`

## 3. Pixelated Images 
If the user filled in using ISBN, the web app auto-retrieves available thumbnail using [OpenLibrary ISBN API](https://openlibrary.org/dev/docs/api/search). This thumbnail is low in resolution. The user can upload his/her own image to override this thumbnail.

## 4. Greyed Images
The images that are greyed means the book has been booked by a user and cannot be booked by any other user.

## 5. How to log out?
Log out button is not implemented yet, but you can go back to `http://localhost:3000` and re-login using another account.




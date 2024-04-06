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
**Node :** v20.11.0  
**npm :** v10.2.3

### Browsers Tested
1. Opera GX : LVL5 (core: 107.0.5045.86)
2. Chrome : Version 123.0.6312.106 (Official Build) (64-bit)
3. Edge : Version 123.0.2420.81 (Official build) (64-bit)

# Getting Started

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

## Important Note
**Please Note:** The functionality may not be fully supported on iOS devices and the Safari browser.




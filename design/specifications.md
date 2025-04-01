# LeafyILS: Specifications

## User Authentication

### User Story

As a library user,
I want to log in to my account,
So that I can access my borrowed books and profile.

### Acceptance Criteria

- Scenario: Successful Login
    - Given I am a registered user,
    - When I enter valid credentials,
    - Then I should be logged into my account.

- Scenario: Failed Login due to Incorrect Credentials
    - Given I am a registered user,
    - When I enter incorrect credentials,
    - Then I should see an error message and be unable to log in.

## Book Search

### User Story

As a library user,
I want to search for books by title, author, or category,
So that I can easily find the books I need.

### Acceptance Criteria

- Scenario: Searching for a Book by Title
    - Given I am on the book search page,
    - When I enter a book title,
    - Then I should see a list of matching books.

- Scenario: Searching for a Book by Author
    - Given I am on the book search page,
    - When I enter an author's name,
    - Then I should see a list of books by that author.

## Borrowing a Book

### User Story

As a library user,
I want to borrow an available book,
So that I can read it at my convenience.

### Acceptance Criteria

- Scenario: Successful Borrowing
    - Given I am logged in and the book is available,
    - When I click the "Borrow" button,
    - Then the book should be marked as borrowed and assigned to my account.

- Scenario: Borrowing an Unavailable Book
    - Given the book is already borrowed by another user,
    - When I try to borrow it,
    - Then I should see a message indicating the book is unavailable.

## Returning a Book

### User Story

As a library user,
I want to return a borrowed book,
So that it becomes available for others.

### Acceptance Criteria

- Scenario: Successful Return
    - Given I have a borrowed book,
    - When I click the "Return" button,
    - Then the book should be marked as available and removed from my borrowed list.

## Managing Users (Admin)

### User Story

As a library administrator,
I want to manage users,
So that I can keep track of library members.

### Acceptance Criteria

- Scenario: Adding a New User
    - Given I am an admin,
    - When I enter user details and click "Add User",
    - Then a new user should be registered in the system.

- Scenario: Deleting a User
    - Given I am an admin and a user exists,
    - When I click "Delete" on a user's profile,
    - Then the user should be removed from the system.

## Managing Books (Admin)

### User Story

As a library administrator,
I want to add, update, and remove books,
So that I can manage the library's collection.

### Acceptance Criteria

- Scenario: Adding a New Book
    - Given I am an admin,
    - When I enter book details and click "Add Book",
    - Then the book should be added to the catalog.

- Scenario: Removing a Book
    - Given I am an admin and a book exists,
    - When I click "Remove" on the book,
    - Then the book should be deleted from the catalog.

## Generating Reports (Admin)

### User Story

As a library administrator,
I want to generate reports on book loans,
So that I can track borrowing trends.

### Acceptance Criteria

- Scenario: Viewing a Borrowing Report
    - Given I am an admin,
    - When I navigate to the "Reports" section and generate a borrowing report,
    - Then I should see statistics on borrowed books, due dates, and overdue books.

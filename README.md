# Bookstore "Chapter One" – Frontend (Angular)

This repository contains the frontend of the **Bookstore "Chapter One"** web application. It provides a modern, responsive UI for user authentication, profile management, browsing books, liking books, and handling cart operations.

---

## Features

### User Interface
- Login / Register pages
- User profile alert

### Book Catalog
- Display all books with:
  - Title
  - Author
  - Category
  - Rating
  - Description
  - Publication Date
- Categorized carousels for easy browsing

### Search
- Search books by title in real time

### Liked Books
- Users can like/unlike books
- Dedicated "My List" page
- Persistent storage via backend API

### Cart System
- Add/Remove books from cart
- View cart items
- Proceed to checkout (UI only)

---

## Technologies Used 
- Angular
- TypeScript
- RxJS
- Angular Router
- HTTPClient
- CSS

---

## Getting Started

### Prerequisites
- Node.js + npm
- Angular CLI

### Clone the Repository

```bash
git clone https://github.com/EleniMeliopoulou/bookstore-frontend.git
cd bookstore-frontend
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
ng serve
```

The app will run at:

http://localhost:4200

---

## Backend Connection 

Update the API base URL in `environment.ts`: 
```
export const environment = {
production: false,
apiUrl: 'http://localhost:8080'
};
```

---

## Future Enhancements

### Persistent Cart System
- Save cart items in the backend
- Restore cart after refresh or logout
- Provide endpoints similar to liked-books

---

## Contribution

This frontend was developed independently as part of the **Bookstore "Chapter One"** project and is an enhanced version of the Online Library project.

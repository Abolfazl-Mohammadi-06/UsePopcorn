# 🍿 usePopcorn

A React application built as part of my React learning journey. The app allows users to search for movies using the OMDb API, view detailed movie information, rate movies, and create a persistent watchlist.

## ✨ Features

- 🔍 Search movies by title
- 🎬 View detailed information about each movie
- ⭐ Rate movies with a custom star rating component
- 📋 Create and manage a personal watchlist
- 💾 Persist the watchlist using `localStorage`
- ⌨️ Keyboard shortcuts (Enter to focus search, Escape to close movie details)
- ⚡ Loading and error handling
- 📝 Dynamic document title based on the selected movie
- 🧩 Custom React Hooks for reusable logic
- 📱 Responsive layout


## 🛠️ Built With

- React
- JavaScript (ES6+)
- CSS
- OMDb API
- React Hooks (`useState`, `useEffect`)
- Browser Local Storage

## 📚 What I Learned

This project was created for learning purposes while studying React. During development, I practiced:

- Managing component state with `useState`
- Handling side effects with `useEffect`
- Creating reusable Custom Hooks
- Fetching data from an external API
- Using `AbortController` to cancel pending requests
- Persisting state with `localStorage`
- Keyboard event handling
- Working with `useRef`
- Component composition
- Cleanup functions in `useEffect`
- Building reusable React components


## 🪝 Custom Hooks

This project includes reusable custom hooks to keep the components clean and maintainable:

- **useMovie** – Fetches movie data from the OMDb API.
- **useLocalStorageState** – Synchronizes React state with `localStorage`.
- **useKey** – Handles keyboard shortcuts using event listeners.
## ⚠️ Note

The watchlist is automatically saved in the browser using **localStorage**, so it remains available even after refreshing the page or reopening the application.

## 🚀 Live Demo

https://abolfazl-mohammadi-06.github.io/UsePopcorn/

## 📷 Screenshot

![App Preview](./assets/img.png)

## 🙏 Acknowledgements

This project was built as part of my React learning journey while following **Jonas Schmedtmann's React course**. Movie data is provided by the **OMDb API**.
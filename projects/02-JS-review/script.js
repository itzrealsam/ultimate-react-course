const data = [
  {
    id: 1,
    title: "The Lord of the Rings",
    publicationDate: "1954-07-29",
    author: "J. R. R. Tolkien",
    genres: [
      "fantasy",
      "high-fantasy",
      "adventure",
      "fiction",
      "novels",
      "literature",
    ],
    hasMovieAdaptation: true,
    pages: 1216,
    translations: {
      spanish: "El señor de los anillos",
      chinese: "魔戒",
      french: "Le Seigneur des anneaux",
    },
    reviews: {
      goodreads: {
        rating: 4.52,
        ratingsCount: 630994,
        reviewsCount: 13417,
      },
      librarything: {
        rating: 4.53,
        ratingsCount: 47166,
        reviewsCount: 452,
      },
    },
  },
  {
    id: 2,
    title: "The Cyberiad",
    publicationDate: "1965-01-01",
    author: "Stanislaw Lem",
    genres: [
      "science fiction",
      "humor",
      "speculative fiction",
      "short stories",
      "fantasy",
    ],
    hasMovieAdaptation: false,
    pages: 295,
    translations: {},
    reviews: {
      goodreads: {
        rating: 4.16,
        ratingsCount: 11663,
        reviewsCount: 812,
      },
      librarything: {
        rating: 4.13,
        ratingsCount: 2434,
        reviewsCount: 0,
      },
    },
  },
  {
    id: 3,
    title: "Dune",
    publicationDate: "1965-01-01",
    author: "Frank Herbert",
    genres: ["science fiction", "novel", "adventure"],
    hasMovieAdaptation: true,
    pages: 658,
    translations: {
      spanish: "",
    },
    reviews: {
      goodreads: {
        rating: 4.25,
        ratingsCount: 1142893,
        reviewsCount: 49701,
      },
    },
  },
  {
    id: 4,
    title: "Harry Potter and the Philosopher's Stone",
    publicationDate: "1997-06-26",
    author: "J. K. Rowling",
    genres: ["fantasy", "adventure"],
    hasMovieAdaptation: true,
    pages: 223,
    translations: {
      spanish: "Harry Potter y la piedra filosofal",
      korean: "해리 포터와 마법사의 돌",
      bengali: "হ্যারি পটার এন্ড দ্য ফিলোসফার্স স্টোন",
      portuguese: "Harry Potter e a Pedra Filosofal",
    },
    reviews: {
      goodreads: {
        rating: 4.47,
        ratingsCount: 8910059,
        reviewsCount: 140625,
      },
      librarything: {
        rating: 4.29,
        ratingsCount: 120941,
        reviewsCount: 1960,
      },
    },
  },
  {
    id: 5,
    title: "A Game of Thrones",
    publicationDate: "1996-08-01",
    author: "George R. R. Martin",
    genres: ["fantasy", "high-fantasy", "novel", "fantasy fiction"],
    hasMovieAdaptation: true,
    pages: 835,
    translations: {
      korean: "왕좌의 게임",
      polish: "Gra o tron",
      portuguese: "A Guerra dos Tronos",
      spanish: "Juego de tronos",
    },
    reviews: {
      goodreads: {
        rating: 4.44,
        ratingsCount: 2295233,
        reviewsCount: 59058,
      },
      librarything: {
        rating: 4.36,
        ratingsCount: 38358,
        reviewsCount: 1095,
      },
    },
  },
];

// Turn on Quokka for this file!

function getBooks() {
  return data;
}

function getBook(id) {
  return data.find((d) => d.id === id);
}

/*
// == DESTRUCTURING ==

const book = getBook(2);
book;

// const title = book.title;
// const author = book.author;

const {
  id,
  title,
  publicationDate,
  author,
  genres,
  hasMovieAdaptation,
  pages,
  translations,
  reviews,
} = book;
console.log(title, author);

// REST OPERATOR

// const primaryGenre = genres[0];
// const secondaryGenre = genres[1];
// primaryGenre;
// secondaryGenre;

const [primaryGenre, secondaryGenre, ...otherGenres] = genres;
console.log(primaryGenre, secondaryGenre, otherGenres);

// Spread Operator

const newGenres = [...genres, "epic fantasy"];
console.log(newGenres);

const updatedBook = {
  ...book,

  // Adding a new property
  moviePublicationDate: "2021-10-22",

  // Overriding the title and pages properties
  pages: 1210,
  title: "Dune (Updated)",
};
console.log(updatedBook);

// == TEMPLATE LITERALS ==

const summary = `${title} is ${pages}-pages long book written by ${author} and was published in ${
  publicationDate.split("-")[0]
}. The book has ${hasMovieAdaptation ? "" : "not"} been adapted as a movie`;
console.log(summary);

// == TERNARY OPERATOR ==

const pagesRange =
  pages > 1000 ? "Over a thousand pages" : "less than 1000 pages";
console.log(`the book has ${pagesRange}`);

// == ARROW FUNCTIONS ==

const getYear = (str) => str.split("-")[0];
console.log(getYear(publicationDate));

const newSummary = `${title} is ${pages}-pages long book written by ${author} and was published in ${getYear(
  publicationDate,
)}. The book has ${hasMovieAdaptation ? "" : "not"} been adapted as a movie`;
console.log(newSummary);

// == SHOR-CIRCUITING AND LOGICAL OPERATORS ==

// falsy: 0, null, "", undefined

// AND Operator: &&
console.log(true && "Some string");
console.log(false && "Some string"); // short-circuit

console.log("jonas" && "Some string");
console.log("" && "Some string");

// OR Operator: ||
console.log(true || "Some string"); // short-circiut
console.log(false || "Some string");

console.log(book.translations.spanish);
const spanishTranslation = book.translations.spanish || "NOT TRANSLATED";
spanishTranslation;

console.log(book.reviews.librarything.reviewsCount);
const countWrong = book.reviews.librarything.reviewsCount || "NO DATA";
countWrong; // but 0 is a number = data

// NULLISH COALESCING Operator: ??
const countRight = book.reviews.librarything.reviewsCount ?? "NO DATA";
countRight; // but 0 is a number = data

console.log(true ?? "Some string"); // short-circiut
console.log(false ?? "Some string"); // short-circuit

// == OPTIONAL CHAINING ==
// function getTotalReviewCount(book) {
//   const goodreads = book.reviews.goodreads.reviewsCount;
//   console.log(goodreads);
//   const librarything = book.reviews.librarything.reviewsCount;
//   console.log(librarything);
//   return goodreads + librarything;
// }

// const book3 = getBook(3);
// console.log(
//   book3.reviews, // book3.reviews does not have property: librarything.
// );
// console.log(getTotalReviewCount(book3)); // would fail as book3.reviews.librarything does not exist.

function safelyGetTotalReviewCount(book) {
  const goodreads = book.reviews?.goodreads?.reviewsCount ?? 0;
  console.log(goodreads);
  const librarything = book.reviews?.librarything?.reviewsCount ?? 0;
  console.log(librarything);
  return goodreads + librarything;
}

const book3 = getBook(3);
console.log(
  book3.reviews, // book3.reviews does not have property: librarything.
);
console.log(safelyGetTotalReviewCount(book3));
*/

/*
// == ARRAY METHODS ==

// Map

const books = getBooks();
books;

const titles = books.map((book) => book.title);
console.log(titles);

const essentialData = books.map((book) => ({
  title: book.title,
  author: book.author,
}));
console.log(essentialData);

// Filter

const longBooks = books.filter((book) => book.pages > 500);
console.log(longBooks);

const adventureBooks = books
  .filter((book) => book.genres.includes("adventure"))
  .map((book) => book.title);
console.log(adventureBooks);

// Reduce

const pagesAllBooks = books.reduce((sum, book) => sum + book.pages, 0);
console.log(pagesAllBooks);

// Sort

const arr = [5, 2, 1, 4, 3];
const sortedArr = arr.sort((a, b) => a - b); // mutates the original array, ascending order, use slice() to avoid mutation
console.log(sortedArr);
console.log(arr);

const arr1 = [2, 5, 6, 1, 4, 3];

const sortedArr1 = arr1.slice().sort((a, b) => b - a); // b - a, descending order
console.log(sortedArr1);

const sortedArr2 = arr1.slice().sort((a, b) => a - b); // a - b, ascending order
console.log(sortedArr2);

console.log(arr1);

// == WORKING WITH IMMUTABLE ARRAYS ==

// 1) Add book object to array
const newBook = {
  id: 6,
  title: "Harry Potter and the Chamber of Secrets",
  author: "J. K. Rowling",
};

const booksAfterAdd = [...books, newBook];
console.log(booksAfterAdd);

// 2) Delete book object from array
const booksAfterDelete = booksAfterAdd.filter((book) => book.id !== 3);
console.log(booksAfterDelete);

// 3) Update book object in array
const booksAfterUpdate = booksAfterDelete.map((book) =>
  book.id === 2 ? { ...book, pages: 350 } : book,
);
console.log(booksAfterUpdate);
*/

// == ASYNC JAVASCRIPT ==

// 1) Promises
// fetch("https://jsonplaceholder.typicode.com/todos")
//   .then((response) => response.json())
//   .then((data) => console.log(data));

// console.log("realsam");

// 2) Async/Await

async function fetchTodos() {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos");
  const data = await res.json();
  console.log(data);
}

fetchTodos();

console.log("don't wait!");

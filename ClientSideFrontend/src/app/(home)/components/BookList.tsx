import React from "react";
import { Book } from "@/types/index";
import BookCard from "./BookCard";

const bookList = async () => {
  const res = await fetch(`${process.env.BACKEND_URL}/books/all`, {
    cache: "no-store",
  });
  console.log("response", res);
  const bookList = await res.json();
  console.log("bookList", bookList);
  if (!res.ok) {
    return new Error("Failed to load books");
  }

  return (
    <div className="grid grid-cols-1 place-items-center gap-8 max-w-7xl mx-auto sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 mb-8">
      {!bookList.books && <h1>No books found</h1>}
      {bookList?.books?.map((book: Book) => {
        return <BookCard key={book._id} book={book} />;
      })}
    </div>
  );
};

export default bookList;

const quoteList = document.querySelector("#quote-list");
const form = document.querySelector("#new-quote-form");

//initial render of page
window.addEventListener("DOMContentLoaded", (e) => {
  fetch("http://localhost:3000/quotes?_embed=likes")
    .then((res) => res.json())
    .then((data) => displayQuotes(data))
    .catch((error) => console.error(error));
});

//Function to display the quotes
function displayQuotes(data) {
  data.forEach((quote) => {
    const li = document.createElement("li");
    li.classList.add("quote-card");
    li.innerHTML = `
    <blockquote class="blockquote">
        <p class="mb-0">${quote.quote}</p>
        <footer class="blockquote-footer">${quote.author}</footer>
        <br>
        <button class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
        <button class='btn-danger'>Delete</button>
      </blockquote>
`;
    quoteList.appendChild(li);

    //handle likes increment
    const likesBtn = li.querySelector(".btn-success");
    likesBtn.addEventListener("click", () => {
      const likes = parseInt(likesBtn.querySelector("span").textContent);
      const newLikes = likes + 1;
      likesBtn.querySelector("span").textContent = newLikes;
      console.log(likes);
      fetch(`http://localhost:3000/likes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quoteId: quote.id }),
      })
        .then((res) => res.json())
        .then((data) => console.log(data))
        .catch((error) => console.error(error));
    });

    //handel quote delete
    const deleteBtn = li.querySelector(".btn-danger");
    deleteBtn.addEventListener("click", () => {
      fetch(`http://localhost:3000/quotes/${quote.id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => console.log(data))
        .catch((error) => console.error(error));
      li.remove();
    });
  });
}

//function to add new quote
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const newQuote = form.querySelector("#new-quote").value;
  const author = form.querySelector("#author").value;
  const object = {
    quote: newQuote,
    author: author,
  };

  fetch("http://localhost:3000/quotes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(object),
  });
});

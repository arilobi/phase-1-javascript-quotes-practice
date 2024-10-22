document.addEventListener("DOMContentLoaded", () => {
    fetchQuotes();
  
    const quoteForm = document.querySelector("#new-quote-form");
    quoteForm.addEventListener("submit", createQuote);
  });

  function fetchQuotes() {
    fetch('http://localhost:3000/quotes?_embed=likes')
      .then(resp => resp.json())
      .then(quotes => {
        quotes.forEach(quote => {
          renderQuote(quote);
        });
      });
  }
  
  function renderQuote(quote) {
    const quoteList = document.querySelector("#quote-list");
    const quoteCard = document.createElement("li");
    quoteCard.classList.add("quote-card");
  
    quoteCard.innerHTML = `
      <blockquote class="blockquote">
        <p class="mb-0">${quote.quote}</p>
        <footer class="blockquote-footer">${quote.author}</footer>
        <br>
        <button class='btn btn-success'>Likes: <span>${quote.likes ? quote.likes.length : 0}</span></button>
        <button class='btn btn-danger'>Delete</button>
      </blockquote>
    `;
  
    // Add delete and like button 
    const deleteBtn = quoteCard.querySelector(".btn-danger");
    deleteBtn.addEventListener("click", () => deleteQuote(quote.id, quoteCard));
  
    const likeBtn = quoteCard.querySelector(".btn-success");
    likeBtn.addEventListener("click", () => likeQuote(quote));
  
    quoteList.append(quoteCard);
  }
  
  function createQuote(e) {
    e.preventDefault();
    
    const quoteText = document.querySelector("#new-quote").value;
    const authorText = document.querySelector("#author").value;
  
    fetch('http://localhost:3000/quotes', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        quote: quoteText,
        author: authorText
      })
    })
      .then(resp => resp.json())
      .then(newQuote => {
        renderQuote(newQuote); 
      });
  
    // Clear form inputs after submission
    e.target.reset();
  }
  
//  deleting a quote
  function deleteQuote(quoteId, quoteCard) {
    fetch(`http://localhost:3000/quotes/${quoteId}`, {
      method: "DELETE"
    })
      .then(resp => resp.json())
      .then(() => {
        quoteCard.remove(); 
      });
  }
  
//   Liking a quote
  function likeQuote(quote) {
    fetch('http://localhost:3000/likes', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        quoteId: quote.id,
        createdAt: Math.floor(Date.now() / 1000)
      })
    })
      .then(resp => resp.json())
      .then(() => {
        const likeBtn = document.querySelector(`li[data-id="${quote.id}"] .btn-success span`);
        let currentLikes = parseInt(likeBtn.innerText);
        likeBtn.innerText = currentLikes + 1; 
      });
  }
  
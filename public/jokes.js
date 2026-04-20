// jokes.js

// This function fetches a random joke from the Joke API
async function fetchJoke() {
    try {
        const response = await fetch('https://official-joke-api.appspot.com/jokes/random');
        const data = await response.json();
        displayJoke(data);
    } catch (error) {
        console.error('Error fetching joke:', error);
    }
}

// This function displays the joke in the console or on the web page
function displayJoke(joke) {
    const jokeText = `${joke.setup} - ${joke.punchline}`;
    console.log(jokeText);
    // Optionally, you can also display it on the web page
    // document.getElementById('jokeDisplay').textContent = jokeText;
}

// Call the fetchJoke function to get and display a joke
fetchJoke();
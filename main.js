document.addEventListener('DOMContentLoaded', () => {
    const getPokemonButton = document.getElementById('get-pokemon');
    const searchPokemonInput = document.getElementById('search-pokemon');
    const suggestionsContainer = document.getElementById('suggestions');
    let pokemonNames = [];

    // Fetch all Pokémon names for autocomplete
    async function fetchPokemonNames() {
        try {
            const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=898');
            const data = await response.json();
            pokemonNames = data.results.map(pokemon => pokemon.name);
        } catch (error) {
            console.error("Error fetching Pokémon names from the API:", error);
        }
    }

    // Call fetchPokemonNames on load
    fetchPokemonNames();

    // Handle search input
    searchPokemonInput.addEventListener('input', () => {
        const query = searchPokemonInput.value.toLowerCase();
        suggestionsContainer.innerHTML = '';
        if (query) {
            const filteredNames = pokemonNames.filter(name => name.startsWith(query));
            filteredNames.forEach(name => {
                const suggestion = document.createElement('div');
                suggestion.textContent = name;
                suggestion.classList.add('suggestion');
                suggestion.addEventListener('click', () => {
                    searchPokemonInput.value = name;
                    suggestionsContainer.innerHTML = '';
                });
                suggestionsContainer.appendChild(suggestion);
            });
        }
    });

    // Handle Enter and Tab key press in search input
    searchPokemonInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent form submission if inside a form
            const pokemonName = searchPokemonInput.value.toLowerCase();
            if (pokemonNames.includes(pokemonName)) {
                fetchAndDisplayPokemon(pokemonName);
                suggestionsContainer.innerHTML = '';
                searchPokemonInput.value = ''; // Clear the search input
            } else {
                console.error("Pokémon not found in the list!");
            }
        } else if (event.key === 'Tab') {
            event.preventDefault(); // Prevent default tab behavior
            const query = searchPokemonInput.value.toLowerCase();
            if (query) {
                const closestMatch = pokemonNames.find(name => name.startsWith(query));
                if (closestMatch) {
                    searchPokemonInput.value = closestMatch;
                    suggestionsContainer.innerHTML = '';
                }
            }
        }
    });

    // Fetch and display Pokémon data by name
    async function fetchAndDisplayPokemon(pokemonName) {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
            const pokemon = await response.json();
            displayPokemonData(pokemon);
        } catch (error) {
            console.error("Error fetching Pokémon data from the API:", error);
        }
    }

    // Random Pokémon button click handler
    getPokemonButton.addEventListener('click', async () => {
        try {
            const getRandomID = Math.floor(Math.random() * 898) + 1;
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${getRandomID}`);
            const pokemon = await response.json();
            displayPokemonData(pokemon);
            
            // Clear the search input field
            searchPokemonInput.value = '';
            suggestionsContainer.innerHTML = '';
        } catch (error) {
            console.error("Error fetching Pokémon data from the API:", error);
        }
    });

    // Function to display Pokémon data
    function displayPokemonData(pokemon) {
        const leftSide = document.querySelector('#left-side');
        const top = document.querySelector('#top');
        leftSide.innerHTML = '';
        top.innerHTML = '';

        const imageElement = document.createElement('img');
        const spriteURL = pokemon.sprites.front_default;
        imageElement.classList.add('pokemon-img');

        if (spriteURL) {
            imageElement.src = spriteURL;
            imageElement.alt = pokemon.name;
            leftSide.appendChild(imageElement);
        } else {
            const placeholderText = document.createElement('p');
            placeholderText.textContent = "No sprite found for this Pokémon!";
            leftSide.appendChild(placeholderText);
        }

        // Create shadow img element
        const shadow = document.createElement('img');
        shadow.src = '../shadow.png';
        shadow.classList.add('shadow');
        const container = document.getElementById('image-container');
        leftSide.appendChild(shadow);   

        const nameElement = document.createElement('h2');
        nameElement.textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
        top.appendChild(nameElement);

        const pokemonIDElement = document.createElement('p');
        pokemonIDElement.textContent = `ID: ${pokemon.id}`;
        top.appendChild(pokemonIDElement);

        const heightElement = document.createElement('p');
        heightElement.textContent = `Height: ${pokemon.height / 10} m`;
        top.appendChild(heightElement);

        const weightElement = document.createElement('p');
        weightElement.textContent = `Weight: ${pokemon.weight / 10} kg`;
        top.appendChild(weightElement);

        const typeElement = document.createElement('p');
        const types = pokemon.types.map(typeInfo => typeInfo.type.name).join(', ');
        typeElement.textContent = `Type: ${types}`;
        top.appendChild(typeElement);

        const statElement = document.createElement('p');
        const stats = pokemon.stats.map(statInfo => `${statInfo.stat.name}: ${statInfo.base_stat}`).join(', ');
        statElement.textContent = `Stats: ${stats}`;
        top.appendChild(statElement);
    }
});

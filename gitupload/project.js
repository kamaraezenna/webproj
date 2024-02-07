function searchCountries() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const apiUrl = `https://restcountries.com/v3.1/name/${searchTerm}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayCountries(data, searchTerm);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function displayCountries(countries, searchTerm) {
    const countryListElement = document.getElementById('country-list');
    countryListElement.innerHTML = '';

    if (countries.length === 0) {
        countryListElement.innerHTML = '<p>No results found</p>';
        return;
    }

    countries.forEach(country => {
        const countryName = country.name.common.toLowerCase();
        const officialName = country.name.official.toLowerCase();

        // Check if either the common name or official name is an exact match
        if (countryName === searchTerm || officialName === searchTerm) {
            const countryCard = document.createElement('div');
            countryCard.classList.add('country-card');

            const countryFlag = country.flags.png || 'N/A';
            const countryCapital = country.capital || 'N/A';
            const countryPopulation = country.population || 'N/A';
            const countryArea = country.area || 'N/A';
            const countryRegion = country.region || 'N/A';
            const countrySubregion = country.subregion || 'N/A';

            countryCard.innerHTML = `
                <h2>${officialName}</h2>
                <img src="${countryFlag}" alt="Country Flag" class="country-flag">
                <p><strong>Capital:</strong> ${countryCapital}</p>
                <p><strong>Population:</strong> ${countryPopulation}</p>
                <p><strong>Area:</strong> ${countryArea} sq km</p>
                <p><strong>Region:</strong> ${countryRegion}</p>
                <p><strong>Subregion:</strong> ${countrySubregion}</p>
            `;

            countryListElement.appendChild(countryCard);
        }
    });

}

// Defining global variables
let currentQuestionIndex = 0;
let score = 0;
let questions = [];

function playQuiz() {

    // Start the quiz
    startQuiz();

    function startQuiz() {
        fetch('https://restcountries.com/v3.1/all')
            .then(response => response.json())
            .then(data => {

                const shuffledData = shuffleArray(data);[]
                questions = shuffledData.slice(0, 5).map(country => {
                    return {
                        question: `What is the capital of ${country.name.common}?`,
                        options: [
                            country.capital || 'N/A',
                            getRandomCapital(shuffledData, country.capital) || 'N/A',
                            getRandomCapital(shuffledData, country.capital) || 'N/A',
                            getRandomCapital(shuffledData, country.capital) || 'N/A'
                        ],
                        correctAnswer: country.capital || 'N/A'
                    };
                });

                showQuestion();
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    function showQuestion() {
        const questionContainer = document.getElementById('question-container');
        const optionsContainer = document.getElementById('options-container');
        const currentQuestion = questions[currentQuestionIndex];

        questionContainer.textContent = currentQuestion.question;
        optionsContainer.innerHTML = '';

        currentQuestion.options.forEach((option, index) => {
            const optionButton = document.createElement('button');
            optionButton.textContent = option;
            optionButton.addEventListener('click', () => checkAnswer(option));
            optionsContainer.appendChild(optionButton);
        });


    }

    function checkAnswer(selectedOption) {
        const currentQuestion = questions[currentQuestionIndex];

        if (selectedOption === currentQuestion.correctAnswer) {
            score++;
        }

        // Move to the next question
        currentQuestionIndex++;

        // Check if there are more questions
        if (currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            endQuiz();
        }

    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function endQuiz() {
        alert(`Quiz completed!\nYour score: ${score} out of ${questions.length}\nRestart to play again`);
    }



    function getRandomCapital(data, excludeCapital) {
        // Getting a random capital excluding the provided one
        const capitals = data.map(country => country.capital).filter(capital => capital !== excludeCapital);
        return capitals[Math.floor(Math.random() * capitals.length)];
    }


    document.addEventListener('DOMContentLoaded', () => {
        // Display the "Play Quiz" button initially
        document.getElementById('quiz-container').innerHTML = '<button onclick="playQuiz()">Play Quiz</button>';
    });

    const playButton = document.querySelector('#quiz-container button');
    playButton.disabled = true;
}


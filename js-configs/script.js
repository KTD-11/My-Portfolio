// Defining the header, the h1 with the typewriter effect, the word that would be involved with the typewriter effect,
// an index for the effect, and the <div> that contains the repos
let header = document.querySelector('header');
const typerDisplay = document.getElementById('typer');
const word = 'Who Am I?';
let i = 0;
const parent = document.getElementById('projectsContainer');

const logos = {
    'JavaScript' : "assets/images/icons/javascript-original.svg",
    'CSS' : "assets/images/icons/css3-original.svg",
    'HTML' : "assets/images/icons/html5-original.svg",
    'My profile' : 'assets/images/icons/me.svg'
}

function animate() {
    // Setting a random position for the background
    let xPosition = Math.floor(Math.random() * 100);
    let yPosition = Math.floor(Math.random() * 100);

    // Animating the background position to the new one over 42 seconds
    header.animate([
        { 
            backgroundPosition: `${xPosition}% ${yPosition}%`
        }
    ], {
        duration: 42000,
        iterations: 1,
        fill: "forwards",
    });
}

// Starting the animation once the contents of the page have been loaded and then calling the function every 42 seconds
document.addEventListener('DOMContentLoaded', () => {
    animate();
    setInterval(animate, 42000);
});

// Defining the typewriter effect
function Typer() {
    if (i === 0) {
        typerDisplay.innerHTML = ''; // Clear existing text
    }

    if (i < word.length) {
        typerDisplay.innerHTML += word.charAt(i);
        i++;
        setTimeout(Typer, 200);
    }
}

// Checking if the <h1> of the effect is seen, and then calling the previous function 
const typeWriterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            Typer(); // Start typing when the element is in view
            typeWriterObserver.unobserve(entry.target); // Stop observing after it starts typing
        }
    });
}, {
    root: null, // Use the viewport as the root
    threshold: 1.0 // The whole element must be visible
});

// Assigning the observer to the <h1> tag
typeWriterObserver.observe(typerDisplay);

// Defining a function for the starry effect
function triggerStars() {
    const fireworksContainer = document.getElementById("fireworks-container"); // Defining the container that would hold the stars
    fireworksContainer.innerHTML = ""; // Clear any existing fireworks

    for (let i = 0; i < 40; i++) {
        // Generate 40 fireworks
        const firework = document.createElement("div");
        firework.className = "firework";
        // Assigning attributes to the stars
        firework.style.left = `${Math.random() * 100}%`;
        firework.style.top = `${Math.random() * 100}%`;

        // Adding the stars to the container
        fireworksContainer.appendChild(firework);
    }
}

// Initializing a function that would call the starry effect once loaded and then every three seconds
function initStars() {
    triggerStars(); 
    setInterval(() => {
        triggerStars();
    }, 3000);
}

// Calling the initialization function
initStars();

// Defining an observer to check if the skillset <div> is visible in the viewport
const skillSetObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        // If the element is visible: call the function, else: keep the opacity = 0
        entry.isIntersecting ? skillSetObserverAnimation(entry) : entry.target.style.opacity = '0';
    });
}, {
    root: null,
    threshold: 1
});

// Assigning the observer to the skillset <div>
skillSetObserver.observe(document.getElementById('skillSetWrapper'));
// Assigning the observer to the my projects <h1>
skillSetObserver.observe(document.getElementById('myProjectsHeader'));

// Defining a function that would animate the skillset <div>
function skillSetObserverAnimation(entry) {
    entry.target.style.opacity = '1'; // Making it visible
    entry.target.style.transform = 'translateY(-30px)'; // Animating it to the top
    skillSetObserver.unobserve(entry.target); // Stopping the observation once the animations start
}

// Fetching all of the repos
async function fetchRepos() {
    try {
        let response = await fetch(`https://api.github.com/users/ktd-11/repos`);

        if (!response.ok) {
            // Returning null if the response is bad
            console.error(`Response error, status: ${response.status}`);
            return [response.status, null];
        }

        // Returning the response
        return await response.json();
    } catch (err) {
        // Catching the error
        console.error(`Fetching error, status: ${err}`);
        // Returning null if an error is caught
        return [err, null];
    }
}

// Displaying all of the data from the previous function
async function displayRepos() {
    try {
        // Awaiting the response
        let data = await fetchRepos();

        // Checking if the response is null and displaying an error message
        if (data[1] === null) {
            console.error(`Couldn't find repos: status ${data[0]}`);

            // Defining the elements
            const repoContainer = document.createElement('div');
            let errMsg = document.createElement('h1');

            // Giving attributes to the elements
            repoContainer.classList.add('repoContainer');
            errMsg.innerText = `Error status: ${data[0]} Couldn't find repo`;

            // Adding the error message to the container
            repoContainer.appendChild(errMsg);

            // Adding the container to the page
            parent.appendChild(repoContainer);
        } else {
            console.log(data);

            data.forEach(element => {
                // Defining the elements
                const repoContainer = document.createElement('div');
                let repoName = document.createElement('h1');
                let repoLanguage = document.createElement('p');
                let logo = document.createElement('img');

                // Giving attributes to the elements
                repoContainer.classList.add('repoContainer');
                repoName.innerText = element.name;
                repoLanguage.innerText = (element.name === 'KTD-11') ?  "My profile" : element.language;
                logo.classList.add('projectImgRepo')
                logo.src = logos[repoLanguage.innerText]

                // Adding the elements to the container
                repoContainer.appendChild(repoName);
                repoContainer.appendChild(repoLanguage);
                repoContainer.appendChild(logo)

                // Adding the container to the page
                parent.appendChild(repoContainer);

                // Redirecting you to the page of the repo if you click on it
                repoContainer.addEventListener('click', () => {
                    window.location.href = element.html_url;
                });

                //detecting if the repoContainers are visible
                const repoContainerObserver = new IntersectionObserver(entries => {
                    entries.forEach(entry => {

                        //If repocontaier is visible: the function animateRepoContainer() will be called
                        entry.isIntersecting ? animateRepoContainer(entry) : entry.target.style.opacity = '0';
                    });
                }, {
                    threshold: 0.5,
                    root: null
                });

                //assinging the observer to the repoContainer
                repoContainerObserver.observe(repoContainer);


                function animateRepoContainer(entry) {

                    //making repoContainer visible
                    entry.target.style.opacity = '1';

                    //assinging a random number to define the trajectory of the animation
                    const randomNumber = Math.floor(Math.random() * 4);

                    //declaring the distance and the path
                    let direction = (randomNumber === 0 || randomNumber === 3) ? -20 : 20;;

                    //declaring the motion
                    entry.target.style.transform = (randomNumber === 0 || randomNumber === 1) ? `translateY(${direction}px)` : `translateX(${direction}px)`;

                    //stopping the observation aftet the animation
                    repoContainerObserver.unobserve(entry.target);
                }
                
            });
        }
    } catch (error) {
        console.error(error);
    }
}

displayRepos();

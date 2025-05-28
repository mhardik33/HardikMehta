document.addEventListener('DOMContentLoaded', function () {
    const projectsContainer = document.getElementById('projects-container');
    const certificatesContainer = document.getElementById('certificates-container');
    const popout = document.getElementById('popout');
    const popoutImages = document.querySelector('.popout-images');
    const closeButton = document.querySelector('.close');
    const prevButton = document.querySelector('.nav-button.prev');
    const nextButton = document.querySelector('.nav-button.next');

    let currentProjectImages = [];
    let currentIndex = 0;

    // Fetch projects from the JSON file
    fetch('projects.json')
        .then(response => response.json())
        .then(projects => {
            // Generate HTML for each project
            projects.reverse().forEach(project => { // Reverse the array
                fetch(`projects/${project.id}/info.txt`)
                    .then(response => response.text())
                    .then(text => {
                        const [titleLine, descriptionLine] = text.split('\n');
                        const title = titleLine.replace('Title - ', '').trim();
                        const description = descriptionLine.replace('Description - ', '').trim();

                        const projectHTML = `
                        <article class="work-item">
                            <div class="project-thumbnail">
                                <h3>${title}</h3>
                                <img src="${project.thumbnail}" alt="${title}" class="image fit thumb" />
                                <p>${description}</p>
                                <button class="view-button" data-images='${JSON.stringify(project.images)}'>View</button>
                            </div>
                        </article>
                    `;
                    projectsContainer.insertAdjacentHTML('beforeend', projectHTML);
                    });
            });

            // Add event listeners to view buttons
            document.addEventListener('click', function (event) {
                if (event.target.classList.contains('view-button')) {
                    currentProjectImages = JSON.parse(event.target.getAttribute('data-images'));
                    currentIndex = 0;
                    loadImage(currentIndex);
                    popout.style.display = 'block';
                    updateNavigationButtons();
                }
            });
        });

    // Fetch certificates from the JSON file
// Fetch certificates from the JSON file
fetch('certificates.json')
    .then(response => response.json())
    .then(certificates => {
        certificates.forEach(certificate => {
            fetch(`certificates/${certificate.id}/info.txt`)
                .then(response => response.text())
                .then(text => {
                    const [titleLine, descriptionLine] = text.split('\n');
                    const title = titleLine.replace('Title - ', '').trim();
                    const description = descriptionLine.replace('Description - ', '').trim();

                    // Adjust the image path
                    const certificateImage = `certificates/${certificate.id}/01.png`;

                    const certificateHTML = `
                        <article class="work-item">
                            <div class="project-thumbnail">
                                <h3>${title}</h3>
                                <img src="${certificateImage}" alt="${title}" class="image fit thumb" />
                                <p>${description}</p>
                                <button class="view-button" data-images='["${certificateImage}"]'>View</button>
                            </div>
                        </article>
                    `;
                    certificatesContainer.insertAdjacentHTML('beforeend', certificateHTML);
                });
        });
    });

    // Close popout
    closeButton.addEventListener('click', function () {
        popout.style.display = 'none';
    });

    // Previous image
    prevButton.addEventListener('click', function () {
        if (currentIndex > 0) {
            currentIndex--;
            loadImage(currentIndex);
            updateNavigationButtons();
        }
    });

    // Next image
    nextButton.addEventListener('click', function () {
        if (currentIndex < currentProjectImages.length - 1) {
            currentIndex++;
            loadImage(currentIndex);
            updateNavigationButtons();
        }
    });

    // Load image into popout
    function loadImage(index) {
        const imgElement = popoutImages.querySelector('img');
        imgElement.src = currentProjectImages[index];
        imgElement.classList.add('active');
    }

    // Update navigation buttons
    function updateNavigationButtons() {
        if (currentProjectImages.length <= 1) {
            prevButton.style.display = 'none';
            nextButton.style.display = 'none';
        } else {
            prevButton.style.display = currentIndex > 0 ? 'block' : 'none';
            nextButton.style.display = currentIndex < currentProjectImages.length - 1 ? 'block' : 'none';
        }
    }
});

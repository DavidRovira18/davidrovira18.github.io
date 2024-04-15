import BACKGROUND from './background.js';

BACKGROUND.init().then(() =>{
    BACKGROUND.animate();
})

document.addEventListener('DOMContentLoaded', function() {
    const projectList = document.querySelectorAll('.project-list');
    const projectCards = document.querySelectorAll('.project-card');
    const toggleForm = document.querySelector(".toggle-form");

    projectList.forEach(project => {
        project.addEventListener('click', function(event) {
            const targetId = this.getAttribute('data-target');

            // Display the target project card
            const targetCard = document.getElementById(targetId);
            if(targetCard.classList.contains("hidden"))
            {
                targetCard.classList.remove("hidden")
                
                // Hide all project list
                projectList.forEach(link => {
                    if(link != this)
                        link.classList.add('hidden'); // Hide all list except the shown one
                });
            }

            else{
                targetCard.classList.add("hidden");
                // Show all project list
                projectList.forEach(link => {
                    if(link != this)
                        link.classList.remove('hidden'); // Hide all links except the shown one
                });
            }
            

        });
    });

    toggleForm.addEventListener('click', function(event)
    {
        const contactForm = document.getElementById("contact-form");
        contactForm.classList.remove("hidden");
        toggleForm.remove();
    });
});
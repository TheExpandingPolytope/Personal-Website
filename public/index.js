//templates
const projectTemplate = (project) => {
    return `
        <div class='project'>
        </div>
    `;
};

const resumeTemplate = (resume) => {
    return `
        <div class="resume">
        </div>
    `;
}

const contactTemplate = (contact) => {
    return `
        <div class="contact">
        </div>
    `;
};


//init elements
var headerLogo = document.getElementById("header-logo"),
    headerName = document.getElementById("header-name"),
    headerIntro = document.getElementById("header-intro"),

    navProjects = document.getElementById("nav-projects"),
    navResume = document.getElementById("nav-resume"),
    navContact = document.getElementById("nav-contact"),

    mainProjects = document.getElementById("main-projects"),
    mainResume = document.getElementById("main-resume"),
    mainContact = document.getElementById("main-contact");


//set values
var name = config.header.name;
headerName.innerHTML = name;

var intro = config.header.intro;
headerIntro.innerHTML = intro;

var projects = config.main.projects;
mainProjects.innerHTML = "";
projects.forEach((project)=>
    mainProjects.innerHTML += projectTemplate(project)
);

var resume = config.main.resume;
mainResume.innerHTML = resumeTemplate(config.main.resume);

var contact = config.main.contact;
mainContact.innerHTML = contactTemplate(config.main.contact);


//set onClicks
navContact


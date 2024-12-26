let menuIcon  = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x')
    navbar.classList.toggle('active');
}


function sendEmail() {
    let parms = {
        name : document.getElementById("name").value,
        email : document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        subject : document.getElementById("subject").value,
        message : document.getElementById("message").value
    }

    emailjs.send("service_4503i55", "template_4j1btrw", parms).then(alert("Email sent!"))
}
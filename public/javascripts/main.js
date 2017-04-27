function handleButtonClick(evt) {
    //alert('clicked');
    evt.preventDefault();
    const req = new XMLHttpRequest();
    req.open('POST', '/finalProject/messages');
    req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    const message = document.querySelector('#message').value;
    const from = document.querySelector('#from').value;
    const gender = document.querySelector("#gender").value;

    const data = `message=${message}&from=${from}&gender=${gender}`;
    req.send(data);
}
function getMessages() {
    const req = new XMLHttpRequest();
    req.open('GET', '/finalProject/messages');
    req.addEventListener('load', function handleMessages() {
        if(req.status >= 200 && req.status < 400) {
            const div = document.querySelector('#messages');
            div.innerHTML = '';
            const messages = JSON.parse(req.responseText);
            messages.forEach((m) => {
                const user = document.createElement('div');
                user.setAttribute('class', 'username');
                if (m.gender === 'female'){
                    user.innerHTML =  "👧 "+ m.from + ":";

                }
                else if (m.gender === "male"){
                    user.innerHTML =  "👦 "+ m.from + ":";

                }

                else{
                    user.innerHTML = "😊 "+ m.from + ":";

                }
                
                div.appendChild(user); 

                
                const words = document.createElement('div');
                words.setAttribute('class', 'words');
                words.innerHTML = m.message;
                div.appendChild(words);

            });
            setTimeout(getMessages, 2000);
        }
    });
    req.send();
}

function main() {
   console.log('loaded');
   const btn = document.querySelector('input[type="submit"]');
   console.log(btn);
   btn.addEventListener('click', handleButtonClick);
   getMessages();

}
document.addEventListener("DOMContentLoaded", main);

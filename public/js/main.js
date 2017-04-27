function handleButtonClick(evt) {
    //alert('clicked');
    evt.preventDefault();
    const req = new XMLHttpRequest();
    req.open('POST', '/api/message');
    req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    const message = document.querySelector('#message').value;
    const from = document.querySelector('#from').value;

    // looks like query string (but will be sent in post body)
    // name=val&name2=val2
    const data = `message=${message}&from=${from}`;
    //alert(data);
    req.send(data);
}
function getMessages() {
    const req = new XMLHttpRequest();
    req.open('GET', '/api/messages');
    req.addEventListener('load', function handleMessages() {
        if(req.status >= 200 && req.status < 400) {
            const div = document.querySelector('#messages');
            div.innerHTML = '';
            const messages = JSON.parse(req.responseText);
            messages.forEach((m) => {
                const p = document.createElement('p');
                div.appendChild(p).textContent = m.message + ' from ' + m.from;
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

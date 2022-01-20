function init() {

    document.getElementById('btn').addEventListener('click', e => {
        e.preventDefault();

        const data = {
            username: document.getElementById('username').value,
            password: document.getElementById('password').value
        };
        if(validate(data)){
            fetch('http://127.0.0.1:9000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
                .then( res => res.json() )
                .then( el => {
                    if (el.msg) {
                        alert(el.msg);
                    } else {
                        document.cookie = `token=${el.token};SameSite=Lax`;
                        window.location.href = 'index.html';
                    }
                });
        }
    });
}

function validate(data){

    if(data.username.length <= 4 || data.username.length >= 15){
        alert("Username must be between 4 and 15 characters");
        return false;
    }
    if(data.password.length <= 5){
        alert("Password must have more than 5 characters");
        return false;
    }

    return true;
}
function init() {
    

    
    document.getElementById('btn').addEventListener('click', e => {
        e.preventDefault();

        var roles = document.getElementsByName('role');
        var role_value;
        for(var i = 0; i < roles.length; i++){
        if(roles[i].checked){
            role_value = roles[i].value;
            }
        }
        const data = {
            name: document.getElementById('name').value,
            username: document.getElementById('username').value,
            password: document.getElementById('password').value,
            role: role_value
        };
        //console.log(data.name + data.username + data.password + role_value);
        if(validate(data)){
            fetch('http://127.0.0.1:9000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
                .then( res => res.json() )
                .then( el => {
                    document.cookie = `token=${el.token};SameSite=Lax`;
                    window.location.href = 'login.html';
                });
        }
    });
}

function validate(data){

    if(data.name.length <= 4 || data.name.length >= 32 ){
        alert("Name must be between 4 and 32 characters");
        return false;
    }
    if(data.username.length <= 4 || data.username.length >= 15){
        alert("Username must be between 4 and 15 characters");
        return false;
    }
    if(data.password.length <= 5){
        alert("Password must have more than 5 characters");
        return false;
    }
    if(!document.getElementById('admin').checked && !document.getElementById('moderator').checked){
        alert("Please select a role for the new user");
        return false;
    }
    return true;
}
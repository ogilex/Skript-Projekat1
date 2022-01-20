function init() {

    const cookies = document.cookie.split('=');
    const token = cookies[cookies.length - 1];

    document.getElementById('userAddButton').addEventListener('click', e => {
        e.preventDefault();
        var roles = document.getElementsByName('role');
        var role_value;
        for(var i = 0; i < roles.length; i++){
        if(roles[i].checked){
            role_value = roles[i].value;
            console.log(role_value);
            }
        }
        const data = {
            name: document.getElementById('name').value,
            username: document.getElementById('username').value,
            password: document.getElementById('password').value,
            role: role_value
        };
        console.log(role_value.stringify + ' ' + data.role.stringify);

 
        if(validate(data)){
            fetch('http://localhost:8080/admin/users', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            })
                .then( res => res.json() )
                .then( el => {
                    if(el.msg){
                        alert(el.msg)
                }});
                document.getElementById('name').value='';
                document.getElementById('username').value='';
                document.getElementById('password').value='';
        }


    });

}

function returnRoleValue(){
    var roles = document.getElementsByName('role');
    var role_value;
    for(var i = 0; i < roles.length; i++){
    if(roles[i].checked){
        role_value = roles[i].value;
        return role_value;
        }
    }
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
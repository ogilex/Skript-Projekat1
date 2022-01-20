function init() {

    const cookies = document.cookie.split('=');
    const token = cookies[cookies.length - 1];

    fetch('http://localhost:8080/admin/users', {
        headers: {
            'Authorization': `Bearer ${token}`,
            
        },   
    })
        .then( res => res.json() )
        .then( data => {
            const lst = document.getElementById('userTable');

            if(data.msg){
                alert(data.msg);
            }else{
            data.forEach( el => {
                lst.innerHTML += `<tr><td>${el.id}</td> <td>${el.name}</td> <td>${el.username}</td> <td>${el.role}</td> <td>${el.password}</td> <td>${el.createdAt}</td> <td>${el.updatedAt}</td></tr>`;
            });
    }
    });


}

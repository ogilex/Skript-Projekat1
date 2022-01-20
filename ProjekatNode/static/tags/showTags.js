function init() {

    const cookies = document.cookie.split('=');
    const token = cookies[cookies.length - 1];

    fetch('http://localhost:8080/admin/tags', {
        headers: {
            'Authorization': `Bearer ${token}`,
            
        },   
    })
        .then( res => res.json() )
        .then( data => {
            const lst = document.getElementById('tagTable');

            if(data.msg){
                alert(data.msg);
            }else{
            data.forEach( el => {
                lst.innerHTML += `<tr><td>${el.id}</td><td>${el.title}</td><td>${el.createdAt}</td> <td>${el.updatedAt}</td></tr>`;
            });
    }
    });


}
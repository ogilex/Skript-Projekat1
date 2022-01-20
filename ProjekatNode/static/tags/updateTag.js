function init() {

    const cookies = document.cookie.split('=');
    const token = cookies[cookies.length - 1];

    document.getElementById('tagUpdateButton').addEventListener('click', e => {
        e.preventDefault();

        const id = document.getElementById('id').value;

        const data = {
            title: document.getElementById('title').value,
        };


 
        if(validate(data) && id != null){
            fetch('http://localhost:8080/admin/tags/' +id, {
                method: 'PUT',
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
                document.getElementById('id').value='';
                document.getElementById('title').value='';
        }

    });

}

function validate(data){



    if(data.title.length <= 1 || data.title.length >= 15 ){
        alert("Title must be between 1 and 15 characters");
        return false;
    }
    return true;
}
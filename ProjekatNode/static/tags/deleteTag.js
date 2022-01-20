function init() {

    const cookies = document.cookie.split('=');
    const token = cookies[cookies.length - 1];

    document.getElementById('tagDeleteButton').addEventListener('click', e => {
        e.preventDefault();
        const id = document.getElementById('id').value;

        if(id != null){
            fetch('http://localhost:8080/admin/tags/' +id, {
                method: 'DELETE',
                headers: { 
                    'Authorization': `Bearer ${token}`
                },
            })
                .then( res => res.json() )
                .then( el => {
                    if(el.msg){
                        alert(el.msg)
                }});
            document.getElementById('id').value='';

        }else{
            alert('ID cant be null');
        }

    });
    
}

function validate(id){
    if(id == null){
        return false;
    }
    return true;
}
function init() {

    const cookies = document.cookie.split('=');
    const token = cookies[cookies.length - 1];

    document.getElementById('postAddButton').addEventListener('click', e => {
        e.preventDefault();

        const data = {
            title: document.getElementById('title').value,
            content: document.getElementById('content').value,
            tagId: document.getElementById('tagId').value
        };
 
        if(validate(data)){
            fetch('http://localhost:8080/admin/posts', {
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
                document.getElementById('title').value='';
                document.getElementById('content').value='';
                document.getElementById('tagId').value='';
        }

    });

}

function validate(data){

    if(data.title.length <= 4 || data.title.length >= 40 ){
        alert("Title must be between 4 and 40 characters");
        return false;
    }
    if(data.content.length>= 500){
        alert("Content cant have more than 500 characters");
        return false;
    }
    if(data.tagId == null){
        alert("Tag cant be null");
        return false;
    }
    return true;
}
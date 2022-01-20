function init() {

    const cookies = document.cookie.split('=');
    const token = cookies[cookies.length - 1];

    document.getElementById('commentAddButton').addEventListener('click', e => {
        e.preventDefault();

        const data = {
            postId: document.getElementById('postId').value,
            content: document.getElementById('content').value
        };
 
        if(validate(data)){
            fetch('http://localhost:8080/admin/comments', {
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
                document.getElementById('postId').value='';
                document.getElementById('content').value='';
        }

    });

}

function validate(data){

    if(data.content.length >= 200 &&  data.content.length != null){
        alert("Comment must be below 200 characters and cannot be null");
        return false;
    }
    return true;
}
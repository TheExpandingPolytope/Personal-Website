<script>
    const content_id = "content";

    function change_page(url, id){
        //remove all selected class tags
        var selected = document.getElementsByClassName('selected');
        for (let index = 0; index < selected.length; index++) {
            const element = selected[index];
            element.classList.remove('selected');
        }

        //set class of element
        document.getElementById(id).classList.add('selected');

        //request page data
        var html = "";
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = ()=>{
            if(xhr.readyState !== 4){
                html = "error";
                document.getElementById(content_id).innerHTML = html;
                return false;
            }
            if(xhr.readyState  == 4 && xhr.status == 200) {
                html = xhr.responseText;
                document.getElementById(content_id).innerHTML = html;
                return true;

            }else{
                html = "error";
                document.getElementById(content_id).innerHTML = html;
                return false;
            }
        }
        xhr.open('GET',url);
        xhr.send();
    }
</script>

<h1><?php echo $name ?></h1>
<p><?php echo $header ?></p>
<div id="tabs">
    <div class="tab selected" id="home" onclick = "change_page('pages/home.php', this.id)"><h3>Home</h3></div>
    <div class="tab" id="projects" onclick = "change_page('pages/projects.php', this.id)"><h3>Projects</h3></div>
    <div class="tab" id="resume" onclick = "change_page('pages/resume.php', this.id)"><h3>Resume</h3></div>
    <div class="tab" id="contact" onclick = "change_page('pages/contact.php', this.id)"><h3>Contact</h3></div>
</div>

<?php
include $_SERVER['DOCUMENT_ROOT'].'/app/includes.php';

//connect to database
$data = new DB\Connection();
$data->connect();

$projects =  $data->projects();

?>

<!--NEW PROJECT -->
<h1>Add new project</h1>
<form method="get" action='cms/newproject.php'>
    <h3>name</h3>
    <input type="text" name="name">
    <h3>description</h3>
    <textarea name="description" id="" cols="30" rows="10"></textarea>
    <h3>technologies</h3>
    <input type="text" name="technologies"> <br> <br>
    <input type="submit" value="add project">
</form>

<!-- EDIT PROJECTS-->
<h1>Edit projects</h1>
<?php
foreach ($projects as $project) {
    $name = $project['name'];
    $technologies = $project['technologies'];
    $description = $project['description'];
    $id = $project['id'];
    echo <<< EOT
    <form method="get" action='cms/editproject.php'>
    <h3>name</h3>
    <input type='text' name='id' value='$id' hidden>
    <input type="text" name="name" value="$name">
    <h3>description</h3>
    <textarea name="description" value="$description" id="" cols="30" rows="10"></textarea>
    <h3>technologies</h3>
    <input type="text" name="technologies" value="$technologies"> <br> <br>
    <input type="submit" value="edit project">
    </form>

EOT;
}
?>

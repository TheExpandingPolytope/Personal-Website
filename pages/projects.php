<p>Below are some of the projects i have worked on.</p>
<?php
include $_SERVER['DOCUMENT_ROOT'].'/app/includes.php';

//connect to database
$data = new DB\Connection();
$data->connect();

$projects =  $data->projects();

foreach ($projects as $project) {
    $name = $project['name'];
    $technologies = $project['technologies'];
    $description = $project['description'];
    echo <<< EOT
    <h1>$name</h1>
    <p>$technologies</p>
    <p>$description</p>
EOT;
}
?>


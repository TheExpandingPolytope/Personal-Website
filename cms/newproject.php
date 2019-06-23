<?php
include $_SERVER['DOCUMENT_ROOT'].'/app/includes.php';

//connect to database
$data = new DB\Connection();
$data->connect();

$name = $_GET['name'];
$description = $_GET['description'];
$technologies = $_GET['technologies'];

if($data->add_project($name, $description, $technologies)){
    echo "you have successfully added a new project";
}else{
    echo "error has occurred";
}

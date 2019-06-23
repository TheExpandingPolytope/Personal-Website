<?php
include $_SERVER['DOCUMENT_ROOT'].'/app/includes.php';

//connect to database
$data = new DB\Connection();
$data->connect();

$id = $_GET['id'];
$name = $_GET['name'];
$description = $_GET['description'];
$technologies = $_GET['technologies'];

if($data->edit_project($id, $name, $description, $technologies)){
    echo "you have successfully edited a project";
}else{
    echo "error has occurred";
}
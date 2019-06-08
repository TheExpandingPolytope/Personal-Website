<?php
include 'app/includes.php';

//connect to database
$db = new DB\Connection();
$db->connect();

//init webpage data
$title = $db->head('title');
$name = $db->head('name');
$header = $db->head('header');

$page = array_key_exists('page',$_GET) ? $_GET['page'] : 0;
?>

<html lang="en">

<head>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title><?php echo $title ?></title>

</head>

<body>

    <div id="header">
        <?php include "pages/header.php" ?>
    </div>

    <div id="content">
        <?php
        switch ($page) {

            case 'home':
                include "pages/home.php";
                break;

            case 'projects':
                include "pages/projects.php";
                break;

            case 'contact':
                include "pages/contact.php";
                break;
            
            default:
                include "pages/home.php";
                break;

        }
        ?>
    </div>

</body>

</html>

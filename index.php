<?php
//init webpage data
$title = "Jesse Engerman";
$name = "Jesse Engerman";
$header = "Welcome to my website";
?>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <div id="header">
        <?php include "header.php" ?>
    </div>
    <div id="content">
        <?php
        switch ($content) {

            case 'home':
                include "content/home.php";
                break;

            case 'projects':
                include "content/projects.php";
                break;

            case 'contact':
                include "content/contact.php";
                break;
            
            default:
                include "content/home.php";
                break;
        }
        ?>
    </div>
</body>
</html>

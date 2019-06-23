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
    <link rel="stylesheet" type='text/css' href='main.css'></link>
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
    <script id="vertex-shader" type="x-shader/x-vertex">
        attribute vec3 aVertexPosition;
        uniform vec2 uScalingFactor;
        uniform float rad;
        uniform mat4 perspective;
        uniform mat4 view;
        mat4 model = mat4(cos(rad),0,sin(rad),0,
                          0, 1, 0, 0,
                          -sin(rad),0,cos(rad),0,
                          0,0,0,1);
     

        void main() {
      
          gl_Position = model*vec4(vec3(1)*aVertexPosition.xyz, 1.0);
        }
      </script>
    <script id="fragment-shader" type="x-shader/x-fragment">
        #ifdef GL_ES
          precision highp float;
        #endif
        
        uniform vec4 uGlobalColor;
        
        void main() {
           gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        }
      </script>

    <script src="main.js"></script>
</body>

</html>

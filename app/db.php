<?php

namespace DB;

class Config {

    const PATH = 'db/main.db';

}

class Connection {

    private $pdo;

    public function head( $name ){
        $stmt = $this->pdo->prepare('SELECT value from head WHERE name = :name;');
        $stmt->execute([ ':name'=> $name ]);
        
        while($row = $stmt->fetch(\PDO::FETCH_ASSOC)){
            return $row['value'];
        }
    }
    public function connect(){

        if ($this->pdo == null) {

            $this->pdo = new \PDO("sqlite:" . Config::PATH);

        }

        return $this->pdo;
        
    }

}
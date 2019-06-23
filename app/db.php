<?php
namespace DB;
class Config {
    const PATH = '/db/main.db';
}
class Connection {

    private $pdo;

    public function add_project($name, $description, $technologies){
        $stmt = $this->pdo->prepare('INSERT INTO projects(name, description, technologies) VALUES(:name, :description, :technologies)');
        $stmt->execute([
            ':name' => $name,
            ':description' => $description,
            ':technologies' => $technologies,
        ]);
        return true;
    }

    public function edit_project($id, $name, $description, $technologies){
        $stmt = $this->pdo->prepare('UPDATE projects SET name = :name, description = :description, technologies = :technologies WHERE id = :id');
        $stmt->execute([
            ':name' => $name,
            ':description' => $description,
            ':technologies' => $technologies,
            ':id' => $id,
        ]);
        return true;
    }

    public function projects(){
        $stmt = $this->pdo->prepare('SELECT * from projects');
        $stmt->execute();
        return $stmt->fetchAll();
    }
    
    public function project( $id ){
        $stmt = $this->pdo->prepare('SELECT * from projects WHERE id = :id;');
        $stmt->execute([ ':id'=> $id ]);
        return $stmt->fetchAll();
    }

    public function head( $name ){
        $stmt = $this->pdo->prepare('SELECT value from head WHERE name = :name;');
        $stmt->execute([ ':name'=> $name ]);
        
        while($row = $stmt->fetch(\PDO::FETCH_ASSOC)){
            return $row['value'];
        }
    }
    
    public function connect(){
        if ($this->pdo == null) {
            $this->pdo = new \PDO("sqlite:" . $_SERVER['DOCUMENT_ROOT'] . Config::PATH);
        }
        return $this->pdo;
        
    }
}
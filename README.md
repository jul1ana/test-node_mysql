COMO RODAR O PROJETO BAIXADO
Instalar todas as dependências indicada pelo package.json
### npm install

Rodar o projeto usando o nodemon
### nodemon app.js




SEQUÊNCIA PARA CRIAR O PROJETO
Criar o arquivo package
### npm init

Gerencia as requisições, rotas e URLs, entre outras funcionalidades
### npm install express

Rodar o projeto
### node app.js

Acessar o projeto no navegador
### http://localhost:8080

Instalar o módulo para reiniciar o servidor sempre que houver alterações no código fonte, g significa globalmente
### npm install -g nodemon

Instalar o banco de dados MySQL

Verificar o banco de dados MySQL no pront de comando
### mysql -h localhost -u root -p

Instalar o Workbench para gerenciar o banco de dados de forma gráfica

Comandos básicos de MySQL
Criar a base de dados 
### create database celke character set utf8mb4 collate utf8mb4_unicode_ci;

Criar a tabela
### CREATE TABLE `users`(
###	  `id` int NOT NULL AUTO_INCREMENT,
###   `name` varchar(220) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
###   `email` varchar(220) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
###   PRIMARY KEY (`id`)    
### ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

Selecionar registro no banco de dados
### SELECT id, name, email FROM users;

Cadastrar registro no banco de dados
### INSERT INTO users (name, email) VALUES ('Gracie', 'gracie@gmail.com');

Limitar a quantidade de registros selecionados no banco de dados
### SELECT id, name, email FROM users LIMIT 3;

Limitar a quantidade de registros selecionados no banco de dados e indicar o início (paginação)
### SELECT id, name, email FROM users LIMIT 2 OFFSET 4;

Acrescentar condição na busca de registros
### SELECT id, name, email FROM users WHERE email = 'sadie@gmail.com' LIMIT 1;

Acrescentar mais de uma condição na busca de registros
### SELECT id, name, email FROM users WHERE email = 'sadie@gmail.com' AND name = 'Sadie' LIMIT 1;
### SELECT id, name, email FROM users WHERE email = 'sadie@gmail.com' OR name = 'Sadie' LIMIT 1;

Ordenar os registros retornados do banco de dados
### SELECT id, name, email FROM users ORDER BY id ASC;
### SELECT id, name, email FROM users ORDER BY id DESC;

Editar registro no banco de dados
### UPDATE users SET name = 'Taylor', email='taylor@gmail.com' WHERE id = 7;

Apagar registro no banco de dados
### DELETE FROM users WHERE id=4;

Sequelize é uma biblioteca JavaScript que facilita o gerenciamento de um banco de dados SQL
### npm install --save sequelize

Instalar o drive do banco de dados 
### npm install --save mysql2

Instalar o módulo para criptografar a senha
### npm install --save bcryptjs

Instalar a dependência para JWT
### npm install --save jsonwebtoken

Gerenciar variáveis de ambiente
### npm install --save dotenv

Permitir acesso a API
### npm install --save cors

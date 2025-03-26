# Componente de Login e Registro de Usuarios

### 1 - Instale das dependências

```shell
    npm installl
```

---

### 2 - Crie o Token do Auth.js

```shell
    npx auth secret
```

---

### 3 - Inicie o servidor de Desenvolvimento

```shell
    npm run dev
```

---

### 4 - Criar banco de dados e usuario ROOT

- Dentro do arquivo prisma/schema.prisma altere o provider para o banco de dados desejado

```shell
datasource db {
    provider = "mysql"
    url = env("DATABASE_URL")
}
```

- Altere o string de conexão com o banco de dados no arquivo .env

```shell
DATABASE_URL="mysql://root@localhost:3306/sistema"
```

- Execute o comando o para criar um Prisma Client no projeto

```shell
npx prisma generate
```

- Crie o banco de dados e sincronize com o projeto

```shell
npx prisma db push
```

- Para criar um usuario ROOT altere as variáveis de ambiente com email, nome e senha desejados

```shell
ROOT_DATABASE_EMAIL="root@mail.com"
ROOT_DATABASE_NAME="Administrador"
ROOT_DATABASE_PASSWORD="123456789"
```

- Instale os Types no seu projeto

```shell
 npm install -D typescript ts-node @types/node
```

- Rode o seeder para criar o usuario no banco de dados

```shell
npx prisma db seed
```

---

### 5 - Configurar servidor SMTP e Alterar visual do email enviado

- O servidor SMTP deverá ser configurado dentro do Dashboard - Definições - Email

- Alterar visual de email

    - Acesse a pasta Packages

```shell
    cd src/packages/
```

- Iniciar Servidor para visualização da Prévia de email

```shell
    npm run dev
```

---

<br>
<br>
<br>

### Caso queira excluir os dados do banco (CUIDADO)

- Resetar banco de dados (irá excluir todos os dados do banco)

```shell
npx prisma migrate reset
```

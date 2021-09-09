# index.html

```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css"
        integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
    <link href="https://fonts.googleapis.com/css?family=Arvo&display=swap" rel="stylesheet">

</head>

<body style="background: #eef2fe; font-family: 'Arvo', serif;">
    <div class="container">
        <h1>Contador!</h1>

        <!-- Parte que será mostrada somente se o usuário não estive logado -->
        <div class="sign-in" style="display: none;">
            <div class="mb-5">
                <p>É necessário fazer login para acessar o contador:</p>
                <button class="btn btn-primary" style="background-color: #0072CE;">Sign In</button>
            </div>
        </div>

        <!-- Parte que será mostrada se o usuário estiver logado -->
        <div class="after-sign-in" style="display: none;">
            <div class="container">
                <div id="show" class="number"></div>
                
                <div class="mb-5 row">
                    <button id="plus" class="btn btn-success col-1 m-2">+</button>
                    <button id="minus" class="btn btn-danger col-1 m-2">-</button>
                </div>
    
                <div class="sign-out">
                    <button class="btn btn-primary" style="background-color: #0072CE;">Sign Out</button>
                </div>
            </div>
        </div>
    </div>
    <script src="./main.js"></script>
</body>

</html>
```
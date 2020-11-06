<h1>MONGO</h1>

<h2>Install</h2>

    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"

    brew update

    sudo brew install mongodb

    brew install mongodb-community@4.4   

    brew services start mongodb/brew/mongodb-community

<h2>Initalize db</h2>

    node db/initDB.js

<h2>Start mongodb</h2>  

    mongo

    use apiDev

    show collections

    db.player.find();

<h1>MONGO</h1>

<h2>Install</h2>

    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"

    brew update

    brew tap mongodb/brew

    brew install mongodb-community@4.4   

    brew services start mongodb/brew/mongodb-community

<h2>GIT</h2>

    git checkout feature/mongo-db

    git checkout -b student/<GITHUB_TUNNARI>-db

    git push --set-upstream origin student/<GITHUB-TUNNARI>-db

<h2>Initalize db</h2>

    node db/initDB.js

<h2>Start mongodb</h2>  

    mongo

    use apiDev

    show collections

    db.player.find();

<h2>Mongo docs</h2>

    Basic queries and crud: https://docs.mongodb.com/manual/crud/ 

    Simple intro: https://www.youtube.com/watch?v=-56x56UppqQ 
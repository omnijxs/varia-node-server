<h1>GIT</h1>

<h2>Setup</h2>

    git clone https://github.com/omnijxs/varia-node-server.git 

    cd varia-node-server
    
    git checkout -b student/<GITHUB-TUNNARI>

    git commit -a -m "Initial commit"

    git push --set-upstream origin student/<GITHUB-TUNNARI>

<h2>Kun olet tehnyt itse muutoksia</h2>

    git commit -a -m "Kuvaava viesti tähän"

    git push

<h2>Hae opettajan muutoksia</h2>

    git commit -a -m "Kuvaava viesti tähän"

    git push

    git checkout develop

    git pull

    git checkout student/<GITHUB-TUNNARI>

    git merge develop
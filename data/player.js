class Player {
    
    constructor(uuid, name, score, teamName, createdAt){
         this.uuid = uuid;
         this.name = name;
         this.score = score;
         this.teamName = teamName;
         this.createdAt = createdAt;
     }
};

module.exports = Player;
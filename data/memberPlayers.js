class Member {
    
    constructor(uuid, name, createdAt){
         this.uuid = uuid;
         this.name = name;
         const createdAtYear = createdAt.getFullYear()
         this.createdAtYear = createdAtYear;
     }
};

module.exports = Member;
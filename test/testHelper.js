class TestHelper {
    
    static playersEqual(p1, p2){
        return p1.name === p2.name &&
                p1.score === p2.score &&
                p1.teamName === p2.teamName &&
                p1.uuid === p2.uuid

    }
    
    static playerFound(player, players) {
        return players.find(p => (p.uuid == player.uuid));
    }

    static arraysEqual(a, b){
        return JSON.stringify(a) === JSON.stringify(b);
    }
    static arraysEqualSort(a, b){
        let equal = a.length === b.length;
 
    a.map(p1 => {
    const found = b.find(p2 => this.playersEqual(p1, p2));
    
    if(!found) {
    equal = false;
    }
    
    });
    
    return equal;
        }

    };

module.exports = TestHelper;
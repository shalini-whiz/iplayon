// args: e (array of json of entries), r (key string for rank in player object)
const sortRankings = (e,r) => {
    let sorted = [];
    e.map((x) => {
        !x.hasOwnProperty(r) ? x[r]=9999 : 
                               isNaN(x[r]) ? x[r]=9999 : x[r]=x[r];
        sorted = [...sorted, x];
    })
    return (sorted.sort((a,b) => {return (a[r]<b[r])?-1 : (a[r]>b[r])?1 : 0;}));
}
// args: s (sorted-array), g (num of groups), n (num of player per group)
// r (key for rank in player object), f (key for name in player object)
const applyPadding = (s,g,n,r,f) => {
    if (g*n == s.length) return s;
    let x = [];
    let d = 9000;
    for(let i=0; i<(g*n)-s.length; i++) {
        let y = {[f]: 'bye'};
        y[r] = d++;
        x = [...x, y];
    }
    return [...s, ...x];
}
// args: g (group-assigned entries)
const formatGroups = (e,r) => {
    let z = {};
    return (e.reduce((z,v) => {
        const {GroupNumber} = v;
        z[GroupNumber] = z[GroupNumber] ? [...z[GroupNumber], v] : [v];
        z[GroupNumber].sort((a,b) => {return (a[r]<b[r])?-1 : (a[r]>b[r])?1 : 0;})
        z[GroupNumber].sort((a,b) => {return (a[r]<b[r])?-1 : (a[r]>b[r])?1 : 0;})

        return z;
    }, {}));
}

const formatGroupsRank = (e,r) => {
  
  e.sort(
   function(a, b) {          
      if (a.GroupNumber === b.GroupNumber) {
         // Price is only important when cities are the same
         return a[r] - b[r];
      }
      return a.GroupNumber > b.GroupNumber ? 1 : -1;
   });
    return e
}

// args: s (rank-sorted entries), g (num of groups)
const createGroups = (s,r,g) => {
    let s1 = s.slice(0,g);
    let s2 = s.slice(g,s.length).reverse();
    s = [...s1, ...s2];
    s.map((x,i) => {
        s[i]['GroupNumber'] = (i%g) + 1;
    });
    return formatGroupsRank(s,r);
};
// args: e (entries), g (num groups), n (num players per group)
// optional args:
// r (key for rank in the object), m (key for player's name in the object)
export const createDraws = (e,g,n, r='rank',m='name') => {
    let sorted  = sortRankings(e, r);
    let padded  = applyPadding(sorted,g,n,r,m);
    let groups  = createGroups(padded,r,g);
    return groups;
};

/*module.exports = {
    createDraws: createDraws
};*/
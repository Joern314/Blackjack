// COLOR-ALGORITHMS
let ChatColor = (function () {
    /**
     * map of all name: color pairs that are known and stored
     * @type map
     */
    let nameToColor = {};
    /**
     * maps {suffix: %, color: %} to {name} where toSuffix(name)= suffix
     * @type map
     */
    let suffixAndColorToName = {};

    function remember(name, color) {
        nameToColor[name] = color;
        suffixAndColorToName[{suffix: toSuffix(name), color: color}] = name;
    }
    
    function toSuffix(name) {
        return name.trim();
    }
    
    /**
     * respects inverted color-designs
     * @param {string} name the name
     * @returns {string} the colorHex
     */
    function get(name) {
        let old = nameToColor[name];
        if (old !== undefined){
            return old;
        }
        
        let neu = calc(name);
        remember(name, neu);
        return neu;
    }
    
    function getWithLayout(name) {
        return PostColor({'color': get(name)});
    }
    
    function channel(a, name) {
        let hash = md5(a + name + a);
        let subint = hash.slice(2 * 12, 2 * 16);
        return (parseInt(subint, 16) & 0x0FFFFFFF) % 156 + 100;
    }

    function calc(name) {

        let color = (channel('a', name) << 16) | (channel('b', name) << 8) | (channel('c', name));

        return color.toString(16);
    }

    function getCurrent() {
        let name = document.getElementById('name');
        return getWithLayout(name.value);
    }

    /**
     * searches for a collision. very costly.
     * @param {string} name the suffix of the name.
     * @param {string} color the hex-value (no #) of the color
     * @returns {string} name with prefix which has this color up to precision. null if error, undefined if invalid color
     */
    function findCollision(name, color) {
        // check exact
        let old = suffixAndColorToName[{suffix: toSuffix(name), color: color}];
        if (old !== undefined) {
            return old;
        }
        let neu = calcCollision(toSuffix(name), color);
        if(neu !== null) {
            remember(neu, color);
            return neu;
        } else {
            return null;
        }
    }
    
    // calculate collision
    function calcCollision(suffix, color) {
        // check if no whitespaces is enough
        if(calc(suffix) === color) {
            return suffix;
        }
        // at least one whitespace
        
        let red = parseInt(color.slice(0, 2), 16);
        let green = parseInt(color.slice(2, 4), 16);
        let blue = parseInt(color.slice(4, 6), 16);

        const MAX_TRIES = 1<<10;
        
        const whitespaces = [' ', '\t'];
        const N = whitespaces.length;

        for(let i=0; i<MAX_TRIES; i++) {
            let prefix = i.toString(N);
            for(let j=0; j<N; j++) {
                prefix = prefix.replace(j.toString(), whitespaces[j]);
            }
            
            let total = prefix+suffix;
            if(channel('a', total) === red 
                    && channel('b', total) === green
                    && channel('c', total) === blue) {
                return total;
            }
        }
        return null;
    }

    return {
        get: get,
        getWithLayout: getWithLayout,
        getCurrent: getCurrent,
        findCollision: findCollision,
        calc: calc
    };
})();

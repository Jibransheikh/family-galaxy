const data = {
    "Jaffer Khan": { 
        gender: "male", spouse: "Kulthum Janbeck", loc: "🇰🇪", gen: 1,
        children: ["Hanif", "Shakila", "Munawar", "Nasreen", "Mohamed Ali", "Naheeda"],
        parent: null 
    },
    // GEN 2
    "Hanif": { gender: "male", loc: "🇰🇪", gen: 2, parent: "Jaffer Khan", children: [] },
    "Shakila": { gender: "female", spouse: "Mahmoud", loc: "🇺🇸", gen: 2, parent: "Jaffer Khan", children: ["Marjaan", "Kamran", "Arman"] },
    "Munawar": { gender: "male", spouse: "Kausar", loc: "🇰🇪", gen: 2, parent: "Jaffer Khan", children: ["Misbah", "Sybha", "Jibran", "Anzal"] },
    "Nasreen": { gender: "female", spouse: "Murad", loc: "🇮🇪", gen: 2, parent: "Jaffer Khan", children: ["Sameer", "Nabeel", "Waleed", "Dadkarim", "Jaffer", "Junaid"] },
    "Mohamed Ali": { gender: "male", status: "passed", loc: "🇰🇪", gen: 2, parent: "Jaffer Khan", children: [] },
    "Naheeda": { gender: "female", spouse: "Jalal", loc: "🇰🇪", gen: 2, parent: "Jaffer Khan", children: ["Nabeeha", "Iman"] },
    // GEN 3
    "Marjaan": { gender: "female", spouse: "Jabraan", loc: "🇺🇸", gen: 3, parent: "Shakila", children: ["Sumaiya", "Saad", "Baby Daughter"] },
    "Sybha": { gender: "female", spouse: "Judheim", loc: "🇹🇿", gen: 3, parent: "Munawar", isDnaMarriage: true, children: ["Kahrimaan", "Larissah", "Liyaan"] },
    "Anzal": { gender: "female", spouse: "Imaad", loc: "🇰🇪", gen: 3, parent: "Munawar", children: ["Ainoor"] },
    "Sameer": { gender: "male", loc: "🇮🇪", gen: 3, parent: "Nasreen", children: [] },
    "Nabeel": { gender: "male", loc: "🇮🇪", gen: 3, parent: "Nasreen", children: [] },
    "Waleed": { gender: "male", loc: "🇮🇪", gen: 3, parent: "Nasreen", children: [] },
    "Dadkarim": { gender: "male", loc: "🇮🇪", gen: 3, parent: "Nasreen", children: [] },
    "Jaffer": { gender: "male", loc: "🇮🇪", gen: 3, parent: "Nasreen", children: [] },
    "Junaid": { gender: "male", loc: "🇮🇪", gen: 3, parent: "Nasreen", children: [] },
    "Nabeeha": { gender: "female", loc: "🇰🇪", gen: 3, parent: "Naheeda", children: [] },
    "Iman": { gender: "female", loc: "🇰🇪", gen: 3, parent: "Naheeda", children: [] },
    "Kamran": { gender: "male", loc: "🇺🇸", gen: 3, parent: "Shakila", children: [] },
    "Arman": { gender: "male", loc: "🇺🇸", gen: 3, parent: "Shakila", children: [] },
    "Misbah": { gender: "female", loc: "🇰🇪", gen: 3, parent: "Munawar", children: [] },
    "Jibran": { gender: "male", loc: "🇰🇪", gen: 3, parent: "Munawar", children: [] },
    // GEN 4
    "Sumaiya": { gender: "female", loc: "🇺🇸", gen: 4, parent: "Marjaan", children: [], father: "Father 1" },
    "Saad": { gender: "male", loc: "🇺🇸", gen: 4, parent: "Marjaan", children: [], father: "Father 1" },
    "Baby Daughter": { gender: "female", loc: "🇺🇸", gen: 4, parent: "Marjaan", children: [], father: "Jabraan" },
    "Ainoor": { gender: "female", loc: "🇰🇪", gen: 4, parent: "Anzal", children: [] },
    "Kahrimaan": { gender: "male", loc: "🇹🇿", gen: 4, parent: "Sybha", children: [] },
    "Larissah": { gender: "female", loc: "🇹🇿", gen: 4, parent: "Sybha", children: [] },
    "Liyaan": { gender: "female", loc: "🇹🇿", gen: 4, parent: "Sybha", children: [] }
};

function buildUniverse(name) {
    const person = data[name];
    if (!person) return;

    document.getElementById('sunName').innerText = name.toUpperCase();
    document.getElementById('sunSpouse').innerText = person.spouse ? "CONNECTED TO: " + person.spouse : "";

    const layer = document.getElementById('node-layer');
    layer.innerHTML = '';

    const radius = window.innerWidth < 600 ? 140 : 280; 
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    person.children.forEach((childName, i) => {
        let childData = data[childName] || { gender: "male", loc: "❓", gen: 2 };

        const angle = (i / person.children.length) * (Math.PI * 2) - (Math.PI / 2);
        const randomOffset = (Math.random() - 0.5) * 20; 
        const x = centerX + Math.cos(angle) * (radius + randomOffset);
        const y = centerY + Math.sin(angle) * (radius + randomOffset);

        const wrap = document.createElement('div');
        wrap.className = 'node-wrapper';
        wrap.style.left = `${x}px`;
        wrap.style.top = `${y}px`;

        const node = document.createElement('div');
        node.className = 'planet';

        if (childData.status === "passed") {
            node.classList.add('passed');
        } else if (childData.isDnaMarriage) {
            node.classList.add('marriage-dna');
        } else {
            const type = (childData.spouse && childData.spouse !== "None") ? 'spouse-' : '';
            node.classList.add(type + (childData.gender || 'male'));
        }

        node.innerHTML = `<b>${childName}</b><span>${childData.loc || ""}</span>`;
        node.onclick = (e) => {
            e.stopPropagation();
            buildUniverse(childName);
        };

        wrap.appendChild(node);
        layer.appendChild(wrap);
    });
}

function goUp() {
    const current = document.getElementById('sunName').innerText;
    const nameKey = Object.keys(data).find(key => key.toUpperCase() === current);
    const parent = data[nameKey]?.parent;
    if (parent) buildUniverse(parent);
}

function resetGalaxy() { buildUniverse("Jaffer Khan"); }

window.onload = () => buildUniverse("Jaffer Khan");
window.onresize = () => buildUniverse(document.getElementById('sunName').innerText);

document.getElementById('searchInput').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    if (term.length < 2) return; // Don't search for single letters

    // Look for name, location, or gender in the data object
    const match = Object.keys(data).find(name => {
        const person = data[name];
        return name.toLowerCase().includes(term) || 
               person.loc.toLowerCase().includes(term) || 
               person.gender.toLowerCase() === term;
    });

    if (match) {
        // Automatically rebuild the universe around the matched person
        buildUniverse(match);
    }
});
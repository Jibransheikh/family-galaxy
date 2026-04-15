const data = {
    "Jaffer Khan": { gender: "male", spouse: "Kulthum Janbeck", loc: "🇰🇪", gen: 1, children: ["Hanif", "Shakila", "Munawar", "Nasreen", "Mohamed Ali", "Naheeda"], parent: null },
    "Kulthum Janbeck": { gender: "female", spouse: "Jaffer Khan", loc: "🇰🇪", gen: 1, children: ["Hanif", "Shakila", "Munawar", "Nasreen", "Mohamed Ali", "Naheeda"], parent: null },
    "Munawar": { gender: "male", spouse: "Kausar", loc: "🇰🇪", gen: 2, parent: "Jaffer Khan", children: ["Misbah", "Sybha", "Jibran", "Anzal"] },
    "Kausar": { gender: "female", spouse: "Munawar", loc: "🇰🇪", gen: 2, parent: "Rafik", children: ["Misbah", "Sybha", "Jibran", "Anzal"] },
    "Shakila": { gender: "female", spouse: "Mahmoud", loc: "🇺🇸", gen: 2, parent: "Jaffer Khan", children: ["Marjaan", "Kamran", "Arman"] },
    "Nasreen": { gender: "female", spouse: "Murad", loc: "🇮🇪", gen: 2, parent: "Jaffer Khan", children: ["Sameer", "Nabeel", "Waleed", "Dadkarim", "Jaffer", "Junaid"] },
    "Mohamed Ali": { gender: "male", status: "passed", loc: "🇰🇪", gen: 2, parent: "Jaffer Khan", children: [] },
    "Naheeda": { gender: "female", spouse: "Jalal", loc: "🇰🇪", gen: 2, parent: "Jaffer Khan", children: ["Nabeeha", "Iman"] },
    "Rafik": { gender: "male", spouse: "Sarwari", loc: "🇮🇳", gen: 1, parent: null, children: ["Kausar", "Parvez", "Mansoor"] },
    "Sarwari": { gender: "female", spouse: "Rafik", loc: "🇮🇳", gen: 1, parent: null, children: ["Kausar", "Parvez", "Mansoor"] },
    "Parvez": { gender: "male", spouse: "Rasia", loc: "🇮🇳", gen: 3, parent: "Rafik", children: ["Saim", "Sauban"], isDnaMarriage: true },
    "Mansoor": { gender: "male", spouse: "Nadia", loc: "🇮🇳", gen: 3, parent: "Rafik", children: ["Fatima", "Amina", "Aisha"], isDnaMarriage: true },
    "Sybha": { gender: "female", spouse: "Judheim", loc: "🇹🇿", gen: 3, parent: "Munawar", children: ["Kahrimaan", "Larissah", "Liyaan"] },
    "Judheim": { gender: "male", spouse: "Sybha", loc: "🇹🇿", gen: 3, parent: null, children: ["Kahrimaan", "Larissah", "Liyaan"] },
    "Anzal": { gender: "female", spouse: "Imaad", loc: "🇰🇪", gen: 3, parent: "Munawar", children: ["Ainoor"] },
    "Jibran": { gender: "male", loc: "🇰🇪", gen: 3, parent: "Munawar", children: [] },
    "Misbah": { gender: "female", loc: "🇰🇪", gen: 3, parent: "Munawar", children: [] },
    "Ainoor": { gender: "female", loc: "🇰🇪", gen: 4, parent: "Anzal", children: [] }
};

let fieldX = 0, fieldY = 0;
const viewport = document.getElementById('galaxy-viewport');
const field = document.getElementById('galaxy-field');

// PANNING
let isPanning = false;
viewport.addEventListener('mousedown', (e) => { if (e.target === viewport || e.target.id === 'galaxy-field') isPanning = true; });
window.addEventListener('mousemove', (e) => {
    if (!isPanning) return;
    fieldX += e.movementX;
    fieldY += e.movementY;
    field.style.transform = `translate(${fieldX}px, ${fieldY}px)`;
});
window.addEventListener('mouseup', () => isPanning = false);

// CARD DRAG
const card = document.getElementById('details-card');
const handle = card.querySelector('.drag-handle');
handle.onmousedown = (e) => {
    let shiftX = e.clientX - card.getBoundingClientRect().left;
    let shiftY = e.clientY - card.getBoundingClientRect().top;
    function moveAt(pageX, pageY) {
        card.style.left = pageX - shiftX + 'px';
        card.style.top = pageY - shiftY + 'px';
    }
    function onMouseMove(e) { moveAt(e.pageX, e.pageY); }
    document.addEventListener('mousemove', onMouseMove);
    document.onmouseup = () => document.removeEventListener('mousemove', onMouseMove);
};

// BUILDER
function buildUniverse(name) {
    const person = data[name];
    if (!person) return;

    document.getElementById('card-name').innerText = name.toUpperCase();
    document.getElementById('sunName').innerText = name.toUpperCase();
    
    // Parent info
    const relEl = document.getElementById('card-relation');
    if (person.parent) {
        const p1 = person.parent;
        const p2 = data[p1]?.spouse;
        relEl.innerHTML = `Child of <span class="clickable-link" onclick="buildUniverse('${p1}')">${p1}</span>` + 
                          (p2 ? ` & <span class="clickable-link" onclick="buildUniverse('${p2}')">${p2}</span>` : "");
    } else { relEl.innerText = "Family Root"; }

    document.getElementById('card-spouse').innerHTML = person.spouse ? 
        `<span class="clickable-link" onclick="buildUniverse('${person.spouse}')">${person.spouse}</span>` : "—";
    document.getElementById('card-loc').innerText = person.loc || "📍";

    const renderCircles = (id, list) => {
        const container = document.getElementById(id);
        container.innerHTML = '';
        list.forEach(m => {
            const node = document.createElement('div');
            node.className = `mini-node ${data[m]?.gender || 'male'} ${data[m]?.status === 'passed' ? 'passed' : ''}`;
            node.innerText = m.substring(0, 2).toUpperCase();
            node.onclick = () => buildUniverse(m);
            container.appendChild(node);
        });
    };
    renderCircles('card-siblings', person.parent ? data[person.parent].children.filter(s => s !== name) : []);
    renderCircles('card-children', person.children || []);

    // GALAXY NODES
    const layer = document.getElementById('node-layer');
    layer.innerHTML = '';
    const kids = person.children || [];
    const radius = kids.length > 6 ? 340 : 250;

    kids.forEach((childName, i) => {
        const childData = data[childName] || { gender: "male" };
        const angle = (i / kids.length) * (Math.PI * 2) - (Math.PI / 2);
        
        const wrap = document.createElement('div');
        wrap.className = 'node-wrapper';
        wrap.style.left = `calc(50% + ${Math.cos(angle) * radius}px)`;
        wrap.style.top = `calc(50% + ${Math.sin(angle) * radius}px)`;
        wrap.style.animationDelay = `${i * 0.05}s`; // Staggered entrance

        const node = document.createElement('div');
        let type = childData.gender;
        if (childData.status === 'passed') type = 'passed';
        else if (childData.isDnaMarriage) type = 'dna';

        node.className = `planet ${type}`;
        node.innerHTML = `<b>${childName}</b><span>${childData.loc || "📍"}</span>`;
        node.onclick = () => buildUniverse(childName);

        wrap.appendChild(node);
        layer.appendChild(wrap);
    });
}

window.goUp = () => {
    const current = document.getElementById('card-name').innerText;
    const key = Object.keys(data).find(k => k.toUpperCase() === current);
    if (data[key]?.parent) buildUniverse(data[key].parent);
};
window.resetGalaxy = () => { fieldX = 0; fieldY = 0; field.style.transform = `translate(0,0)`; buildUniverse("Jaffer Khan"); };

window.onload = () => buildUniverse("Jaffer Khan");
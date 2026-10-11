const controls=['peer','language','reasoning','content'].map(id=>document.getElementById(id));
const scene=document.getElementById('scene'), speech=document.getElementById('speech'), prompt=document.getElementById('prompt'), eyes=[...document.querySelectorAll('.eye')];
function update(){const [peer,language,reasoning,content]=controls.map(el=>Number(el.value));controls.forEach(el=>document.getElementById(el.id+'Value').value=el.value+'%');
scene.style.setProperty('--gaze',(.12+peer/125).toFixed(2));eyes.forEach((eye,i)=>eye.style.opacity=peer>i*24?(.18+peer/125).toFixed(2):'0');
speech.style.setProperty('--spacing',(language*.0009)+'em');speech.classList.toggle('wobble',reasoning>15);speech.style.setProperty('--waver',(2.8-reasoning*.018)+'s');prompt.style.opacity=(1-content*.006).toFixed(2);}
controls.forEach(el=>el.addEventListener('input',update));update();

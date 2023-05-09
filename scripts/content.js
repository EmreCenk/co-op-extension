

console.log("WE ARE HERE RIGHT FMLFMLFML")

const collumheaders = document.getElementsByTagName("th");
let orgCollumIndex = 3;
for (let i = 0; i < collumheaders.length; i++){
    if ( collumheaders[i].innerText.toLowerCase().includes( "org" ) ) {
        orgCollumIndex = i;
        break;
    }
}
console.log("INDEX:", orgCollumIndex)
// TODO: Check if you're actually on the postings table
//      -> "for my program", "viewed", etc. usually implies you're not on the right page
// TODO: If you sort by the default buttons, that resets the collum we manually added :(
// TODO: Make compatible with other waterloo works extension

console.log("12312123.js running");


function getPostingRows(){
    const rows = document.getElementsByTagName("tr");
    return rows;
}

function getNumberOfEntries(){
    return getPostingRows().length; // rows[0] is the header row
}

const azureMode = true;
let headerIndex = 0;
if ( azureMode ) headerIndex = 1;

function getCollumIndex( collumName ){
    const collumheaders = document.getElementsByTagName("th");
    let orgCollumIndex = -2; // -1 by default (+1 at end)
    let leftShift = 0; // waterlooworks extension hides some collums, shifting things to the left
    for (let i = 0; i < collumheaders.length; i++){
        // console.log(i, "->", window.getComputedStyle(collumheaders[i]).display, "->", collumheaders[i].innerText);
        // if ( window.getComputedStyle(collumheaders[i]).display === 'none' ) leftShift++;
        if ( collumheaders[i].innerText.toLowerCase().includes( collumName.toLowerCase() ) ) {
            orgCollumIndex = i - leftShift;
            break;
        }
    }
    return orgCollumIndex + !azureMode; // +1 because the first header is empty
}

function mapJobIdToPercentage(rows){
    let applicantNumIndex = getCollumIndex("application")
    if ( applicantNumIndex < 0 ) applicantNumIndex = getCollumIndex("apps");

    let openingNumIndex = getCollumIndex("opening");
    if (openingNumIndex < 0 ) openingNumIndex = getCollumIndex("open");

    const idIndex = getCollumIndex("id");

    let jobIdToPercentage = {}; 
    for ( currentRow of rows ){
        const applicantNum = parseInt( currentRow.children[applicantNumIndex].innerText );
        const openingNum = parseInt( currentRow.children[openingNumIndex].innerText );
        const jobId = currentRow.children[idIndex].innerText;
        // console.log(jobId, openingNum, applicantNum);
        if (jobId === "ID") continue; // header (aka first row)
        jobIdToPercentage[jobId] = openingNum / (applicantNum + 1); // +1 to include you in the probability, and to avoid division by 0
    }
    return jobIdToPercentage;
}

function sort2dArray(array1, array2, index = 0){
    // descending order*
    if ( array2[index] > array1[index] ) return 1;
    if ( array1[index] > array2[index] ) return -1;
    return 0;
}

function sortJobsByHiringProbability(){
    const rows = getPostingRows();
    const jobToPercentage = mapJobIdToPercentage(rows);
    let jobArray = [];
    for (job in jobToPercentage) jobArray.push( [job, jobToPercentage[job]] )
    jobArray = jobArray.sort( (x, y) => sort2dArray(x, y, index = 1) );
    return jobArray;
}

function insertPercentageCollums( collumToInsertBefore ){
    const rows = getPostingRows();
    const collumIndex = getCollumIndex( collumToInsertBefore );

    // adding probabilities:
    const getJobProbability = mapJobIdToPercentage(rows);
    const idIndex = getCollumIndex("id");
    
    let i = 0;
    for ( currentRow of rows ){
        const currentId = currentRow.children[idIndex].innerText;
        console.log(currentId.includes("ID"));
        if (currentId.includes("ID")) continue; //header row;

        const currentProbability = getJobProbability[currentId];
        const header = currentRow.children[2];
        const headerCopy = header.cloneNode();
        headerCopy.innerText = `${  (currentProbability * 100).toFixed(2)  }%`;
        const referenceCell = currentRow.children[ collumIndex ];
        currentRow.insertBefore( headerCopy, referenceCell );
        i++;
    }

    // we have to update the header at the end, otherwise it shifts everything, making getCollumIndex(_) unreliable
    const header = rows[ headerIndex ].children[2];
    const childCopy = document.createElement("a");
    childCopy.innerText = "Hiring Probability";
    childCopy.style = "cursor: pointer";
    const headerCopy = header.cloneNode();
    headerCopy.style.color = "#0C4A7B";
    if (azureMode) headerCopy.style.width = "9%";   

    headerCopy.replaceChildren( childCopy );
    const referenceCell = rows[headerIndex].children[ collumIndex ];
    rows[headerIndex].insertBefore( headerCopy, referenceCell );
    if (azureMode) fixWidths();
}

function getWidth(element){
    const previousDisplay = window.getComputedStyle(element).display;
    currentHeader.style.display = 'none';
    const answer = window.getComputedStyle(element).width;
    currentHeader.style.display = previousDisplay;
    return answer;
}

function fixWidths(){
    // only for azure 
    const headers = getPostingRows()[headerIndex];
    let visibleHeaders = [];
    for (h of headers.children){
        if (window.getComputedStyle(h).display !== 'none') visibleHeaders.push(h);
    }

    let widths = [ "", "",  "5%", "15%", "5%", "9%", "", "6%", "10%", "5%", ]
    // for (let i = 0; i < visibleHeaders.length; i++){
        // widths.push( getWidth(headers.children[i]) );
    // }

    for (let i = 0; i < visibleHeaders.length; i++){
        visibleHeaders[i].style.width = widths[i];
    }
}

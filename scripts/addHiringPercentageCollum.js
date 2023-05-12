// TODO: Check if you're actually on the postings table
//      -> "for my program", "viewed", etc. usually implies you're not on the right page
// TODO: If you sort by the default buttons, that resets the collum we manually added :(

console.log("12312123.js running");


function getPostingRows(){
    const rows = document.getElementsByTagName("tr");
    return rows;
}

function getNumberOfEntries(){
    return getPostingRows().length; // rows[0] is the header row
}


function getCollumIndex( collumName ){
    const collumheaders = document.getElementsByTagName("th");
    let orgCollumIndex = 0;
    for (let i = 0; i < collumheaders.length; i++){
        if ( collumheaders[i].innerText.toLowerCase().includes( collumName.toLowerCase() ) ) {
            orgCollumIndex = i;
            break;
        }
    }
    return orgCollumIndex + 1; // +1 because the first header is empty
}

function mapJobIdToPercentage(rows){
    const applicantNumIndex = getCollumIndex("application");
    const openingNumIndex = getCollumIndex("opening");
    const idIndex = getCollumIndex("id");
    let jobIdToPercentage = {}; 
    for ( currentRow of rows ){
        const applicantNum = parseInt( currentRow.children[applicantNumIndex].innerText );
        const openingNum = parseInt( currentRow.children[openingNumIndex].innerText );
        const jobId = currentRow.children[idIndex].innerText;
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

function insertPercentageCollums( collumToInsertBefore = "Internal Status" ){
    const rows = getPostingRows();
    const collumIndex = getCollumIndex( collumToInsertBefore );

    // adding probabilities:
    const getJobProbability = mapJobIdToPercentage(rows);
    const idIndex = getCollumIndex("id");
    
    let i = 0;
    for ( currentRow of rows ){
        const currentId = currentRow.children[idIndex].innerText;
        if (currentId == "ID") continue; //header row;

        const currentProbability = getJobProbability[currentId];
        const header = currentRow.children[2];
        const headerCopy = header.cloneNode();
        headerCopy.innerText = `${  (currentProbability* 100).toFixed(2)  }%`;
        const referenceCell = currentRow.children[ collumIndex ];
        currentRow.insertBefore( headerCopy, referenceCell );
        i++;
    }

    // we have to update the header at the end, otherwise it shifts everything, making getCollumIndex(_) unreliable
    const header = rows[0].children[2];
    const childCopy = document.createElement("a");
    childCopy.innerText = "Hiring Probability";
    childCopy.style = "cursor: pointer";
    const headerCopy = header.cloneNode();
    headerCopy.style.color = "#0C4A7B";
    headerCopy.replaceChildren( childCopy );
    const referenceCell = rows[0].children[ collumIndex ];
    rows[0].insertBefore( headerCopy, referenceCell );
}

insertPercentageCollums("ID");
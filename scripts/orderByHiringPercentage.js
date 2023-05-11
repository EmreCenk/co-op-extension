
console.log("orderByHiringPercentage.js running");

function getCollumIndex( collumName ){
    const collumheaders = document.getElementsByTagName("th");
    let orgCollumIndex = 0;
    for (let i = 0; i < collumheaders.length; i++){
        if ( collumheaders[i].innerText.toLowerCase().includes( collumName ) ) {
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

function getNumberOfEntries(){
    return getPostingRows().length; // rows[0] is the header row
}

function getPostingRows(){
    const rows = document.getElementsByTagName("tr");
    return rows;
}

console.log("SORTED:\n\n", sortJobsByHiringProbability())



function getProbabilityHeader(){
    const rows = getPostingRows();
    return rows[0].children[ getCollumIndex('probability') ];
}

function getRowPercentage( row ){
    const probabilityIndex = getCollumIndex("probability");
    const percentageString = row.children[probabilityIndex].innerText;
    return parseFloat(percentageString);
}

function sort2dArray(array1, array2, index = 0){
    // descending order*
    if ( array2[index] > array1[index] ) return 1;
    if ( array1[index] > array2[index] ) return -1;
    return 0;
}

function getOrderedRows(){
    const rows = getPostingRows();
    let rowsToSort = [];
    for (row of rows){
        const percentage = getRowPercentage(row);
        if ( isNaN(percentage) ) continue; // header row
        rowsToSort.push( [row, percentage] );
    }
    const sortedRows = rowsToSort.sort( (x, y) => sort2dArray(x, y, index = 1) );
    return sortedRows;
}

function correctScrollbarWidth(){
    const tableWidth = document.getElementById("postingsTableDiv").scrollWidth;
    const scrollBar = document.getElementsByClassName("scrollboxContent")[0];
    scrollBar.style.width = `${tableWidth}px`
}

function replaceTable(rowsOnly){
    const tableElement = document.getElementsByTagName("tbody")[0];
    tableElement.replaceChildren(...rowsOnly);
    correctScrollbarWidth();
}

// function rowsAreSorted(){
//     const rows = getPostingRows();
//     const getJobProbability = mapJobIdToPercentage(rows);
//     const idIndex = getCollumIndex("id");
//     for (let i = 0; i < rows.length - 1; i++){
//         const currentId = rows[i].children[idIndex].innerText;
//         const nextId = rows[i+1].children[idIndex].innerText;
//         if (currentId == "ID") continue; //header row;
//         const currentProbability = getJobProbability[currentId];
//         const nextProbablity = getJobProbability[nextId];
//         if ( nextProbablity > currentProbability ) return false;
//     }
//     return true;
// }

let isSorted = false;
function handleTableSorting(){
    if (!isSorted){
        const sortedRows = getOrderedRows();
        const rowsOnly = [];
        for ( [row, percentage] of sortedRows ) rowsOnly.push( row );
        replaceTable(rowsOnly);
    }
    else{
        const jobButton = getTagsWithText("a", "organization")[0];
        jobButton.click();
    }

    isSorted = !isSorted;

}

function setHeaderOnclick( onclickFunction = function() {alert('clicked');} ){
    const header = getProbabilityHeader();
    header.onclick = function(){ onclickFunction(); };
}

function bindToTableUpdates(){
    const observer = new MutationObserver((mutations, observer) => {
        if ( mutations.length >= postingsOnPage ) return
        if ( getCollumIndex("probability") == 1 ){ // 1 is the default output if it doesn't find anything
            insertPercentageCollums("ID"); // defined in addHiringPercentateCollum.js 
            setHeaderOnclick( handleTableSorting );
        }
      });

    observer.observe(document, {
        subtree: true,
        childList: true
    });
}

function getTagsWithText(tag, text){
    const tagElements = document.getElementsByTagName( tag );
    let finalElements = []
    for (elem of tagElements){ 
        if ( elem.innerText.toLowerCase().includes( text.toLowerCase() ) )
            finalElements.push(elem);
    }
    return finalElements;
}

// function handleShortlisting(){
//     // shortlisting rerenders the page, which means we need to re-render our custom collum and the state it's in
//     const shortListButtons = getTagsWithText("a", "shortlist");
//     for (currentElem of shortListButtons){
//         // if it used to be sorted, we need to restore that state:
//         currentElem.addEventListener( "click",  function(){
//                 console.log("clicked!", isSorted);
//                 if (isSorted) handleTableSorting();
//             }
//         );
//     }
// }

const postingsOnPage = getPostingRows().length;
bindToTableUpdates();
insertPercentageCollums("ID");
setHeaderOnclick( handleTableSorting );
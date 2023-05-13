


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

function handleTableSorting(){
    const sortedRows = getOrderedRows();
    const rowsOnly = [];
    for ( [row, percentage] of sortedRows ) rowsOnly.push( row );
    replaceTable(rowsOnly);
}
function setHeaderOnclick( onclickFunction = function() {alert('clicked');} ){
    const header = getProbabilityHeader();
    header.onclick = function(){ onclickFunction(); };
}


function bindToTableUpdates(){
    const observer = new MutationObserver((mutations, observer) => {
        if ( mutations.length >= postingsOnPage ) return;
        if ( getCollumIndex("probability") != 1 ) return;
        insertPercentageCollums("ID"); // defined in addHiringPercentateCollum.js 
        setHeaderOnclick( handleTableSorting );
      });
    observer.observe(document, {
        subtree: true,
        childList: true
    });    
}

const postingsOnPage = getPostingRows().length;
bindToTableUpdates()
insertPercentageCollums("ID");
setHeaderOnclick( handleTableSorting )
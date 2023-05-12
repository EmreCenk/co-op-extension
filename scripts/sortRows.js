
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


function getPostingRows(){
    const rows = document.getElementsByTagName("tr");
    return rows;
}

function getProbabilityHeader(){
    const rows = getPostingRows();
    return rows[0].children[13]
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

function insertSortedRows(){
    const sortedRows = getOrderedRows();
    const rowsOnly = [];
    for ( [row, percentage] of sortedRows ) rowsOnly.push( row );
    const tableElement = document.getElementsByTagName("tbody")[0];
    tableElement.replaceChildren(...rowsOnly);
    // for (let i = 0; i < tableElement.children.length; i++){
    //     const currentChild = tableElement.children[i];
    //     tableElement.replaceChild()
    //     console.log(currentChild);
    // }
}
function setHeaderOnclick( onclickFunction = function() {alert('clicked');} ){
    const header = getProbabilityHeader();
    header.onclick = onclickFunction();
}

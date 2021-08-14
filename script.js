

let defaultProperties={
    text:"",
    "font-style":"",
   "font-weight":"",
   "text-decoration":"",
   "text-align":"left",
   "background-color":"#ffffff",
   "color":"#000000",
   "font-family":"Courier New",
   "font-size":"14px"
}

let cellData={
    "Sheet1":{}
}
let selectedSheet="Sheet1"
let totalSheets=1
let lastlyAddedSheet=1;




$(document).ready(function () {

    for (let i = 1; i <= 30; i++) {
        let ans = ""
        n = i;
        while (n > 0)
        {
            let rem = n % 26;
            if (rem == 0) {
                ans = "z" + ans;
                n = Math.floor(n / 26) - 1;
            }
            else {
                ans = String.fromCharCode(rem - 1 + 65) + ans;
                n = Math.floor(n / 26);
            }
        }

        let col=$(`<div class="column-name colId-${i}" id="colCode-${ans} ">${ans}</div>`);
        $(".column-name-container").append(col);

        let row=$(`<div class="row-name" id="rowId-${i}">${i}</div>`)
        $(".row-name-container").append(row)


    }

    for(let i=1;i<=36;i++)
    {
        let row=$(`<div class="cell-row"></div>`);
        for(let j=1;j<=30;j++)
        {
            let colCode=$(`.colId-${j}`).attr("id").split("-")[1];
            let col=$(`<div class="input-cell"  contenteditable="false" id="row-${i}-col-${j}" data="colCode-${colCode}"></div>`);
            // $(".cell-row").append(col);
            row.append(col);
        }
        $(".input-cell-container").append(row);
    }

    $('.align-icon').click(function(){
        $('.align-icon.selected').removeClass("selected")
        $(this).addClass("selected")
    })

    $('.style-icon').click(function ()
    {
        $(this).toggleClass("selected")
    })

    $('.input-cell').click(function (e)
    {
        if(e.ctrlKey)
        {
           let [rowId,colId]= getRoWCol(this);
           if(rowId>1)
           {
               let topClassSelected=$(`#row-${rowId-1}-col-${colId}`).hasClass("selected")
               if(topClassSelected)
               {
                $(this).addClass("top-cell-selected");
                $(`#row-${rowId-1}-col-${colId}`).addClass("bottom-cell-selected");
 
               }
              
           }
           if(rowId<30)
           {
               let bottomClassSelected=$(`#row-${rowId+1}-col-${colId}`).hasClass("selected")
               if(bottomClassSelected)
               {
                $(this).addClass("bottom-cell-selected");
                $(`#row-${rowId+1}-col-${colId}`).addClass("top-cell-selected");
 
               }
              
           }
           if(colId>1)
           {
               let leftClassSelected=$(`#row-${rowId}-col-${colId-1}`).hasClass("selected")
               if(leftClassSelected)
              {
                $(this).addClass("left-cell-selected");
                $(`#row-${rowId}-col-${colId-1}`).addClass("right-cell-selected");
              }

           }
           if(colId<30)
           {
               let rightClassSelected=$(`#row-${rowId}-col-${colId+1}`).hasClass("selected")
              if(rightClassSelected)
              {
                $(this).addClass("right-cell-selected");
                $(`#row-${rowId}-col-${colId+1}`).addClass("left-cell-selected");
 
              }
           }
           $(this).addClass("selected")
        }
        else{
            $('.input-cell.selected').removeClass("selected");
        $(this).addClass("selected")
        }
        changeHeader(this)
    })


       function changeHeader(ele)
       {
           let [rowId,colId]=getRoWCol(ele)
           let cellInfo=defaultProperties
           if(cellData[selectedSheet][rowId] && cellData[selectedSheet][rowId][colId])
           {
            cellInfo=cellData[selectedSheet][rowId][colId]

           }
           cellInfo['font-weight'] ? $(".icon-bold").addClass("selected"):$(".icon-bold").removeClass('selected')
           cellInfo['font-style'] ? $(".icon-italic").addClass("selected"):$(".icon-italic").removeClass('selected')
           cellInfo['text-decoration'] ? $(".icon-underline").addClass("selected"):$(".icon-underline").removeClass('selected')
           let alignment=cellInfo["text-align"];
           $(".align-icon.selected").removeClass("selected");
           $(".icon-align-" + alignment).addClass("selected");

           $(".background-color-picker").val(cellInfo["background-color"])
           $(".text-color-picker").val(cellInfo["color"])
           $(".font-size-selector").val(cellInfo["font-size"])
           $(".font-family-selector").val(cellInfo["font-family"])
           $(".font-family-selector").css('font-family',cellInfo["font-family"])
           


        
       }


    $('.input-cell').dblclick(function ()
    {
        $('.input-cell.selected').removeClass("selected");
        $(this).addClass("selected")
        $(this).attr('contenteditable','true');
        $(this).focus();
    })

    $(".input-cell").blur(function()
    {

        $(".input-cell.selected").attr("contenteditable","false")
        console.log($(this).text())
        updateCell("text",$(this).text())
    })

    $(".input-cell-container").scroll(function()
    {
        $('.column-name-container').scrollLeft(this.scrollLeft);
        $(".row-name-container").scrollTop(this.scrollTop);
    })




});
function getRoWCol(ele)
{
    
    let idArray=$(ele).attr("id").split("-");
    let rowId=parseInt(idArray[1]);
    let colId=parseInt(idArray[3]);
    // console.log(rowId);
    // console.log(colId);
    return [rowId,colId];
   
}

function updateCell(property,value, defaultPossible)
{
    $(".input-cell.selected").each(function(){
        $(this).css(property,value);
        let [rowId,colId]=getRoWCol(this);
        if(cellData[selectedSheet][rowId])
        {
            if(cellData[selectedSheet][rowId][colId])
            {
                cellData[selectedSheet][rowId][colId][property] = value;

            }
            else
            {
                cellData[selectedSheet][rowId][colId] = {...defaultProperties};
                cellData[selectedSheet][rowId][colId][property] = value;
            }
        }
        else
        {
            cellData[selectedSheet][rowId]={};
            cellData[selectedSheet][rowId][colId] = {...defaultProperties};
            cellData[selectedSheet][rowId][colId][property]=value;
        }
        console.log(defaultPossible,JSON.stringify(cellData[selectedSheet][rowId][colId])===JSON.stringify(defaultProperties))
        if( defaultPossible && (JSON.stringify(cellData[selectedSheet][rowId][colId]) === JSON.stringify( defaultProperties)))
        {
            console.log("hello");
            delete cellData[selectedSheet][rowId][colId];
            if(Object.keys(cellData[selectedSheet][rowId].length == 0)) 
            {
                delete cellData[selectedSheet][rowId];
            }
        }
       console.log(cellData)
    });


}




$(".icon-bold").click(function(){
    if($(this).hasClass("selected"))
    {
        updateCell("font-weight","",true);
    }
    else{
        updateCell("font-weight","bold",false)
    }
})

$(".icon-italic").click(function(){
    if($(this).hasClass("selected"))
    {
        updateCell("font-style","",true);
    }
    else{
        updateCell("font-style","italic",false)
    }
})

$(".icon-underline").click(function(){
    if($(this).hasClass("selected"))
    {
        updateCell("text-decoration","",true);
    }
    else{
        updateCell("text-decoration","underline",false)
    }
})
$(".icon-align-left").click(function(){
    if(!$(this).hasClass("selected"))
    {
        updateCell("text-align","left",true)
    }
})
$(".icon-align-center").click(function(){
    if(!$(this).hasClass("selected"))
    {
        updateCell("text-align","center",true)
    }
})

$(".icon-align-right").click(function(){
    if(!$(this).hasClass("selected"))
    {
        updateCell("text-align","right",true)
    }
})

$(".color-fill-icon").click(function(){
    $(".background-color-picker").click()
})

$(".color-fill-text").click(function(){
    $(".text-color-picker").click()
})


$(".background-color-picker").change(function(){
    updateCell("background-color",$(this).val())
})

$(".text-color-picker").change(function(){
    updateCell("color",$(this).val())
})

$(".font-family-selector").click(function()
{
    updateCell("font-family",$(this).val())
    $(".font-family-selector").css('font-family',$(this).val())
})

$(".font-size-selector").click(function(){
    updateCell("font-size",$(this).val())
})

function emptySheet()
{
    let sheetInfo=cellData[selectedSheet]
    for(i of Object.keys(sheetInfo))
    {
        for(j of Object.keys(sheetInfo[i]))
        {
            $(`#row-${i}-col-${j}`).text("");
            $(`#row-${i}-col-${j}`).css("background-color","#ffffff")
            $(`#row-${i}-col-${j}`).css("color","#000000")
            $(`#row-${i}-col-${j}`).css("text-decoration","")
            $(`#row-${i}-col-${j}`).css("text-align","left");
            $(`#row-${i}-col-${j}`).css("font-family","Courier New")
            $(`#row-${i}-col-${j}`).css("font-size","14px")
            $(`#row-${i}-col-${j}`).css("font-weight","")
            $(`#row-${i}-col-${j}`).css("font-style","")

            
    
        }
    }
}

function loadSheet()
{
    let sheetInfo=cellData[selectedSheet]
    for(i of Object.keys(sheetInfo))
    {
        for(j of Object.keys(sheetInfo[i]))
        {
            let cellInfo=cellData[selectedSheet][i][j]
            $(`#row-${i}-col-${j}`).text(cellInfo["text"]);
            $(`#row-${i}-col-${j}`).css("background-color",cellInfo["background-color"])
            $(`#row-${i}-col-${j}`).css("color",cellInfo["color"])
            $(`#row-${i}-col-${j}`).css("text-decoration",cellInfo["text-decoration"])
            $(`#row-${i}-col-${j}`).css("text-align",cellInfo["text-align"]);
            $(`#row-${i}-col-${j}`).css("font-family",cellInfo["font-family"])
            $(`#row-${i}-col-${j}`).css("font-size",cellInfo["font-size"])
            $(`#row-${i}-col-${j}`).css("font-weight",cellInfo["font-weight"])
            $(`#row-${i}-col-${j}`).css("font-style",cellInfo["font-style"])

            
    
        }
    }
}

$(".icon-add").click(function(){
    emptySheet()
    $(".sheet-tab.selected").removeClass("selected")
    let sheetName="Sheet"+(lastlyAddedSheet+1)
    cellData[sheetName]={}
    totalSheets+=1
    lastlyAddedSheet+=1
    selectedSheet=sheetName
    $(".sheet-tab-container").append(`<div class="sheet-tab selected">${sheetName}</div>`)
    addSheetEvent()

    
})
function addSheetEvent(){
    
    $(".sheet-tab").click(function(){
        if(!$(this).hasClass("selected"))
        {
            selectSheet(this)
    
        }
    })
    $(".sheet-tab.selected").contextmenu(function(e){
        e.preventDefault();
        // console.log("njdijwj")
      $(this).addClass("selected")
      cellData[selectedSheet]=$(this).text();
        if($(".sheet-option-modal").length==0)
        {
            $(".container").append(`<div class="sheet-option-modal">
            <div class="sheet-rename">Rename</div>
            <div class="sheet-delete">Delete</div>
        </div>`)
        $(".sheet-rename").click(function(){
            $(".container").append(`<div class="sheet-rename-modal">
            <h4 class="modal-title">Rename sheet To:</h4>
            <input type="text" class="new-sheet-name" placeholder="Sheet Name">
            <div class="action-buttons">
                <div class="submit-button">Rename</div>
                <div class="cancel-button">Cancel</div>
            </div>

        </div>`)
        $(".cancel-button").click(function(){
            $(".sheet-rename-modal").remove()
        });
        $(".submit-button").click(function(){
            let newSheetName=$(".new-sheet-name").val();
            $('.sheet-tab.selected').text(newSheetName)
            let newCellData={};
            for(key in cellData)
            {
                if(key!=selectedSheet)
                {
                    newCellData[key]=cellData[key]
                }
                else
                {
                    newCellData[newSheetName]=cellData[key]
                }
            }
            
            cellData[newSheetName]=cellData[selectedSheet]
            delete cellData[selectedSheet]
            selectedSheet=newSheetName
            $(".sheet-rename-modal").remove()
            console.log(cellData)

        });
        })
        }
        $(".sheet-option-modal").css("left",e.pageX+"px")
      
    })

}
$(".container").click(function(){
    $(".sheet-option-modal").remove();
})
addSheetEvent()


function selectSheet(ele)
{
    $(".sheet-tab.selected").removeClass("selected")
    $(ele).addClass("selected")
    emptySheet()
    selectedSheet=$(ele).text()
    loadSheet();

}



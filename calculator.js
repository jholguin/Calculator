/**
 * @description Calculator prototype.
 * @constructor Calculator
 */
function Calculator()
{
    /**
     * @description Assign this to variable for scope scenarios.
     * @type {Calculator}
     */
    var self = this
        ,numMap = [1,2,3,4,5,6,7,8,9,"clear",0,"="]
        ,operands = [
            {
                icon: '+',
                iconname: 'icon-plus'
            },
            {
                icon: '-',
                iconname: 'icon-minus'
            },
            {
                icon: '*',
                iconname: 'icon-multiplication'
            },
            {
                icon: '/',
                iconname: 'icon-division'
            },
            {
                icon: '^',
                iconname: 'icon-icon-chevron-up'
            }
        ]
        ,opWindow
        ,equalSelected = false
        ,equationsStore = []
        ,baseNum
        ,powNum;


    /**
     * @description Init function builds the calculator.
     */
    this.init = function() {
        initLocalStorage();
        var container = document.createElement("div");
        container.id = "main";

        opWindow = document.createElement("div");
        opWindow.id = "opWindow";
        container.prepend(opWindow);

        buildOperands(container);
        buildNumbers(container);

        document.body.prepend(container);
        
    };
    
    /**
     * @description initLocalStorage function checks if local storage is valid and sets the equation store to
     * value stored in localStorage
     */
    function initLocalStorage(){
        if(typeof(Storage) !== "undefined"){
            equationsStore = (localStorage.hasOwnProperty('equations')) ? JSON.parse(localStorage.equations) : [];
            populateSavedEquations();
        }else{
            console.log("No Local Storage for you!!!")
        }
    }

    /**
     * @description populateSavedEquations function builds Stored equations container 
     */
    function populateSavedEquations(){
        var savedContainer = document.createElement("section");
        savedContainer.className = "equations-stored";
        var title = document.createElement("h3");
        title.innerHTML = "Saved Equations";
        savedContainer.append(title);

        
        equationsStore.forEach(function(val){
            var eq = document.createElement("span");
            if(val.indexOf("^") != -1){
                var pow = val.split("^");
                eq.innerHTML = val + "=" + Math.pow(pow[0], pow[1]); 
            }
            else
                eq.innerHTML = val + '=' + eval(val);

            savedContainer.append(eq);
        });

        if(equationsStore.length == 0){
            var eq = document.createElement("span");
            eq.innerHTML = "No saved equations";
            eq.className = "no-equations";
            savedContainer.append(eq);
        }

        document.body.prepend(savedContainer);

    }
    
    /**
     * @description buildOperands function Builds Operands section
     */
    function buildOperands(container){
        var operandsContainer = document.createElement("div");
        operandsContainer.id = "ops-container";

        operands.forEach(function(val){
            var button = document.createElement("button");
            button.className = val.iconname;
            button.value = val.icon;
            button.addEventListener("click", handleClick);
            operandsContainer.append(button);
        });

        container.append(operandsContainer);
    }

    /**
     * @description buildNumbers function Builds Number keys
     */
    function buildNumbers(container){
        var numberContainer = document.createElement("section");
        numberContainer.id = "number-container";


        numMap.forEach(function(val,index){
            
            var button = document.createElement("button");
            button.innerHTML = val;
            button.value = val;
            button.addEventListener("click", handleClick);

            numberContainer.append(button);
        });

        container.append(numberContainer);
    }

     /**
     * @description saveEquation function utilitzes local stroage to save equations that are being solved
     */
    function saveEquation(equation){
        equationsStore.push(equation);

        if(typeof(Storage) !== "undefined"){
            localStorage.equations = JSON.stringify(equationsStore);
        }else{
            console.log("No Local Storage for you!!!")
        }
    }


    /**
     * @description clearOpWindow function clears output window
     */
    function clearOpWindow(){
        opWindow.innerHTML = "";
        equalSelected = false;
    }

    /**
     * @description handleClick function handles button clicks
     */
    function handleClick(event){
        event.preventDefault();
        
        switch(event.target.value){
            case "=":
                if(opWindow.innerHTML.indexOf("^") != -1){
                    var pow = opWindow.innerHTML.split("^");
                    var base = pow[0];
                    var pow = pow[1];
                    saveEquation(opWindow.innerHTML);
                    opWindow.innerHTML = Math.pow(base, pow);
                    equalSelected = true;
                    break;
                }
                
                if(!equalSelected){
                    saveEquation(opWindow.innerHTML);
                    opWindow.innerHTML = eval(opWindow.innerHTML);
                    equalSelected = true;
                }else {
                    clearOpWindow();
                }
                break;
            case "clear":
                clearOpWindow();
                break;
            default:

                if(opWindow.innerHTML.length > 20){
                    alert("Too many number");
                    break;
                }

                if(!equalSelected)
                    opWindow.innerHTML += this.value;
                else {
                    opWindow.innerHTML = this.value;
                    equalSelected = false;
                }
        }
    }

}
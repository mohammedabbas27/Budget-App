var BudgetController = (function () {
    //Budget Controller

    //Expense Object
    var Expenses = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    //Income Object
    var Incomes = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    //Data Structure
    var Data = {
        allItems: {
            expense: [],
            income: []
        },
        totals: {
            expense: 0,
            income: 0,
            budget: 0,
            percentage: 0.0
        }
    }

    //Calculate the Totals (Income, expense, budget, percentage) of the Data Structure
    var calculate = function (type) {
        Data.totals[type] = 0
        Data.allItems[type].forEach(function (currentValue) {
            Data.totals[type] += currentValue.value;
        })
        Data.totals['budget'] = Data.totals['income'] - Data.totals['expense'];
        Data.totals['percentage'] = Math.round(eval(Data.totals['expense'] / Data.totals['income'] * 100));
        return Data;
    }

    return {
        addItem: function (type, desc, val) {
            console.log(type)
            var newItem, ID;
            //Create new ID's
            if (Data.allItems[type].length <= 0)
                ID = 0;
            else
                ID = Data.allItems[type][Data.allItems[type].length - 1].id + 1;

            //Create new item
            if (type === 'income') {
                newItem = new Incomes(ID, desc, val);
            } else if (type === 'expense') {
                newItem = new Expenses(ID, desc, val);
            }

            //Push the newly created item into the corressponding data structure(incomes or expenses)
            Data.allItems[type].push(newItem);

            //return the new Element
            return newItem;

        },
        deleteItem: function (type, id) {
            var index, ids;
            ids = Data.allItems[type].map(function (currentValue) {
                return currentValue.id;
            });
            index = ids.indexOf(id);
            if (index != -1) {
                Data.allItems[type].splice(index, 1);
            }
        },
        calcBudget: function (type) {
            Data = calculate(type);//Call calculate 2 times if neccassry
            console.log(Data.totals.budget);
            return Data;
        },
        testing: function () {
            console.log(Data);
            return Data;
        },
        getData: function () {
            return data;
        },
    }
})();

var UIController = (function () {
    //UI Controller
    var DomStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        budgetValue: '.budget__value',
        budgetIncome: '.budget__income--value',
        budgetExpense: '.budget__expenses--value',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        expensePercentage: '.budget__expenses--percentage',
        container: '.container'
    }

    var updateExpensePercentage = function (Data) {
        var elem, op;
        Data.allItems['expense'].forEach(function (currentValue) {
            elem = document.getElementById("expense-" + currentValue.id)
            console.log(elem)
            if (Data.totals.budget > 0) {
                console.log("Current value :" + currentValue.value);
                console.log("income :" + Data.totals.income);
                op = Math.round(eval(currentValue.value / Data.totals.income * 100)) + "%"
            }
            else
                op = "---"
            elem.querySelector(".item__percentage").textContent = op;
        });
    }
    var formatNumber = function (num) {
        var numSplit, int, dec;
        num = Math.abs(num);
        num = num.toFixed(2);
        numSplit = num.split('.');
        int = numSplit[0];
        dec = numSplit[1];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }
        return int + '.' + dec;
    };
    return {
        //Clear the input fields
        clr: function () {
            var fields, fieldsArrays;
            fields = document.querySelectorAll(DomStrings.inputDescription + ', ' + DomStrings.inputValue);
            console.log(fields);
            fieldsArrays = Array.prototype.slice.call(fields);

            fieldsArrays.forEach(function (currentValue, currentIndex, entireArray) {
                currentValue.value = "";
            });
            console.log(fieldsArrays)
            fieldsArrays[0].focus();
            document.querySelector(DomStrings.inputType).value = "income";
        },
        //Fetch the input from the screen
        fetchInput: function () {
            return {
                Description: document.querySelector(DomStrings.inputDescription).value,
                Value: parseFloat(document.querySelector(DomStrings.inputValue).value),
                Operation: document.querySelector(DomStrings.inputType).value,

            }
        },
        //Add Income Item or Expense Item
        addListItem: function (obj, type, Data) {
            var Html, newHtml, element;
            //Income Item
            if (type === 'income') {
                element = DomStrings.incomeContainer;
                Html = '<div class="item clearfix" id="income-%ID%"> <div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">+ %value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div></div>'

            }
            //Expense Item
            else if (type === 'expense') {
                element = DomStrings.expenseContainer;
                Html = '<div class="item clearfix" id="expense-%ID%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">- %value%</div> <div class="item__percentage">%percentage%%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>'

                Html = Html.replace('%percentage%', Math.round(eval(obj.value / Data.totals.income * 100)));
            }
            newHtml = Html.replace('%ID%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value));

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        //Return the Data Structure
        getDomStrings: function () {
            return DomStrings;
        },

        //Delete the item from the container
        deleteItem: function (id) {
            var elem = document.getElementById(id);
            elem.parentNode.removeChild(elem);
        },

        //Update the budget onto the UI
        updateBudget: function (Data) {
            var op = null;
            op = Data.totals.budget < 0 ? "- " : "+ ";
            if (op == "+ ")
                document.querySelector(DomStrings.budgetValue).textContent = op + formatNumber(Data.totals.budget);
            else
                document.querySelector(DomStrings.budgetValue).textContent = Data.totals.budget;
            document.querySelector(DomStrings.budgetIncome).textContent = "+ " + formatNumber(Data.totals.income);
            document.querySelector(DomStrings.budgetExpense).textContent = "- " + formatNumber(Data.totals.expense);
            if (Data.totals.budget > 0)
                document.querySelector(DomStrings.expensePercentage).textContent = Data.totals.percentage + "%";
            else
                document.querySelector(DomStrings.expensePercentage).textContent = "---"
            updateExpensePercentage(Data);
        },

        //Update the Current Month and Year
        updateDate: function () {
            var now, month, year, months;
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            now = new Date();
            month = months[now.getMonth()];
            year = now.getFullYear();
            document.querySelector('.budget__title--month').textContent = month + " " + year;
        }
    };
})();

var AppController = (function (budCtrl, uiCtrl) {
    //AppController

    var DomStrings = uiCtrl.getDomStrings();
    var ctrl = function () {
        var inputObject, newItem, Data;

        //Fetch the values from the input fields
        inputObject = uiCtrl.fetchInput();
        if (inputObject.Description != "" && inputObject.Value > 0) {
            //Clear the input fields
            uiCtrl.clr();
            //Add the Item to the Data Structure
            newItem = budCtrl.addItem(inputObject.Operation, inputObject.Description, inputObject.Value);
            //Calculate the budget and update the Data Structure
            Data = budCtrl.calcBudget(inputObject.Operation);
            //Update the UI with the newly added item
            uiCtrl.addListItem(newItem, inputObject.Operation, Data);
            //Update the UI with the newly calculated budget
            uiCtrl.updateBudget(Data);
        }
    };

    //Event Listeners
    var setupEventListeners = function () {
        //Event Listener for the adding new item
        document.querySelector('.add__btn').addEventListener('click', ctrl);
        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrl();
            }
        });
        //Event Listener for deleting the item
        document.querySelector(DomStrings.container).addEventListener('click', ctrldeleteItem);
    };

    //Method for carrying out the deletion process
    var ctrldeleteItem = function (event) {
        var itemId, splitId, type, id, Data;
        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
        splitId = itemId.split('-');
        type = splitId[0];
        id = parseInt(splitId[1]);
        budCtrl.deleteItem(type, id);
        Data = budCtrl.calcBudget('income');
        Data = budCtrl.calcBudget('expense');
        uiCtrl.updateBudget(Data);
        uiCtrl.deleteItem(itemId);
    }

    //Initialisation Methods
    return {
        init: function () {
            var Data = {
                allItems: {
                    expense: [],
                    income: []
                },
                totals: {
                    expense: 0,
                    income: 0,
                    budget: 0,
                    percentage: 0.0
                }
            }
            uiCtrl.updateBudget(Data)
            setupEventListeners();
            uiCtrl.updateDate();
        }
    }

})(BudgetController, UIController);

AppController.init();

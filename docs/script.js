document.addEventListener('DOMContentLoaded',()=>{

     if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
        .then(registration => {
            console.log('Service Worker registered successfully:', registration);
        })
        .catch(error => {
            console.log('Service Worker registration failed:', error);
        });
  });
 }


    const expenseForm = document.getElementById("expense-form");
    const expenseNameinput = document.getElementById("expense-name");
    const expenseAmountInput = document.getElementById("expense-amount");
    const expenseList = document.getElementById("expense-list");
    const totalAmountDisplay = document.getElementById("total-amount");

     let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
     let TotalAmount = calculateTotal(); 
     
     RenderExpenses();
     upDateTotal();



     expenseForm.addEventListener('submit',(e)=>{
        e.preventDefault();
        const name = expenseNameinput.value.trim();
        const amount = parseFloat(expenseAmountInput.value.trim());

        if(name !== "" && !isNaN(amount) && amount >0){
            const newExpense = {
                id: Date.now(),
                name:name,
                amount: amount
            }
            expenses.push(newExpense);
            saveExpensesTolocal();
            RenderExpenses();
            upDateTotal();

            expenseNameinput.value="";
            expenseAmountInput.value="";
        }
     });

function RenderExpenses(){
       expenseList.innerHTML="";
       
       expenses.forEach((expense)=>{
           const li = document.createElement("li");
           // This line below is the only part that changes
           li.className = 'relative group bg-gray-700 flex justify-between items-center p-3 my-2 rounded-md border-r-4 border-red-600'; // Removed hover:bg-gray-600 for consistency
           
           li.innerHTML = `
                <span class="text-gray-100">${expense.name}</span>
                <span class="font-semibold text-white">$${parseFloat(expense.amount).toFixed(2)}</span>
                
                <button data-id="${expense.id}" class="delete-btn absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full ml-2 bg-red-600 hover:bg-red-700 text-white font-bold w-6 h-6 rounded-full transition-opacity duration-200 flex items-center justify-center text-sm">x</button>
                `;
           expenseList.appendChild(li);
       })
       upDateTotal();
    }

     function calculateTotal(){
        return expenses.reduce((sum,expense)=>sum+expense.amount,0) 
     }
     function saveExpensesTolocal(){
        localStorage.setItem("expenses",JSON.stringify(expenses));
     }

     function upDateTotal(){
        const TotalAmount = calculateTotal();
        totalAmountDisplay.textContent= TotalAmount.toFixed(2);
     }

     expenseList.addEventListener('click',(e)=>{
        if(e.target.tagName === 'BUTTON'){
            const expenseID= parseInt(e.target.getAttribute('data-id'));
            expenses = expenses.filter((expense)=> expense.id !== expenseID );
            saveExpensesTolocal();
            RenderExpenses();
            upDateTotal();
        }
     });

});
//elements
let index=0;
let addBtn = document.getElementById("stickybutton");
let closeBtn = document.getElementById("crossBtn");
let lastDiv = document.getElementById("lastDiv");
let historyDiv=document.getElementById("historyDiv");
let textInput=document.getElementById("textInput");
let amountInput=document.getElementById("amountInput");
let transactionBtn=document.getElementById("transactionBtn");
let totalCredit=document.getElementById('totalCredit');
let totalDebit=document.getElementById('totalDebit');
let totalExpense=document.getElementById('totalExpense');
let progressBarMainDiv=document.getElementById('progressBarMainDiv');
let progressBar=document.getElementById('progressBar')


let transactions=JSON.parse(localStorage.getItem('transactions')) || [];

if(transactions != []){
    transactions.forEach((data)=>{
        createTransactionHistory(data);
        index=data.id+1;
    })
}

// increase credit value function
function increaseCreditValue(transaction){
    let temp = parseFloat(totalCredit.innerHTML)
    totalCredit.innerHTML= Math.round((parseFloat(transaction.amount) + parseFloat(temp))*100)/100;
    totalExpenseLogic()
}

// increase debit value function
function increaseDebitValue(transaction){
    let temp = parseFloat(totalDebit.innerHTML)
    totalDebit.innerHTML=Math.round((parseFloat(transaction.amount) + parseFloat(temp))*100)/100;
    totalExpenseLogic()
}
// decrease credit value function
function decreaseCreditValue(transaction){
    let temp = parseFloat(totalCredit.innerHTML)
    totalCredit.innerHTML=Math.round((parseFloat(temp) - parseFloat(transaction.amount))*100)/100;
    totalExpenseLogic()
}
// decrease debit value function
function decreaseDebitValue(transaction){
    let temp = parseFloat(totalDebit.innerHTML)
    totalDebit.innerHTML=Math.round((parseFloat(temp) - parseFloat(transaction.amount))*100)/100;
    totalExpenseLogic()
}

//total expense logic 
function totalExpenseLogic(){
    let temp =Math.round((parseFloat(totalCredit.innerHTML) - parseFloat(totalDebit.innerHTML))*100)/100;
    if(temp > 0){
        totalExpense.innerHTML='$'+temp;
    }else if(temp<0){
        totalExpense.innerHTML='-$'+Math.abs(temp)
    }else if(temp==0){
        totalExpense.innerHTML='0.00';
    }
    progressBarLogic(parseFloat(totalCredit.innerHTML),parseFloat(totalDebit.innerHTML));
}

//add close button logic
function openAddBtnCloseLastDiv(){
    addBtn.style.display="block";
    lastDiv.style.display="none";
}

// storing string in local storage

function storingTransactionsInLocalStorage(transaction){
    transactions.push(transaction);
    localStorage.setItem('transactions',JSON.stringify(transactions));
}

addBtn.addEventListener('click',()=>{
    addBtn.style.display="none";
    lastDiv.style.display="block";
})
closeBtn.addEventListener('click',()=>{
    openAddBtnCloseLastDiv();
})

//transaction btn logic and adding transaction in dom

transactionBtn.addEventListener('click',()=>{
    if(textInput.value != "" && amountInput.value != "" && textInput.value.replace(/\s/g, '').length && amountInput.value.replace(/\s/g, '').length){
        let transaction={
            id:null,
            name:null,
            amount:null,
            type:null
        } 
        transaction.id=index++;
        transaction.name=textInput.value;
        if(amountInput.value>0){
            transaction.amount=parseFloat(amountInput.value);
            transaction.type='credit';
            createTransactionHistory(transaction);
        }else if(amountInput.value<0){
            transaction.amount=Math.abs(amountInput.value);
            transaction.type='debit';
            createTransactionHistory(transaction);
         }
         textInput.value="";
         amountInput.value="";
         openAddBtnCloseLastDiv();
         storingTransactionsInLocalStorage(transaction);
    }else{
        alert("please fill all elements");
    }
})

function createTransactionHistory(transaction){
    let tempDiv=document.createElement('div');
    let childDiv=document.createElement('div');
    let innerDiv1=document.createElement('div');
    let innerDiv2=document.createElement('div');
    let innerDiv3=document.createElement('div');
    let span1=document.createElement('span');
    let deleteBtn=document.createElement('i')

    deleteBtn.classList.add('fa','fa-trash')
    innerDiv3.classList.add('text-right','btn')
    innerDiv3.appendChild(deleteBtn);

    if(transaction.type=='credit'){
        innerDiv2.classList.add('text-success');
        tempDiv.classList.add('bg-success');
        innerDiv2.innerHTML="+$";
        increaseCreditValue(transaction);
    }else{
        innerDiv2.classList.add('text-danger');
        tempDiv.classList.add('bg-danger');
        innerDiv2.innerHTML="-$";
        increaseDebitValue(transaction);
    }
    tempDiv.classList.add('rounded','d-flex','justify-content-center','pl-2','pr-2','mt-1');
    childDiv.classList.add('col-12','row','d-flex','justify-content-between','align-items-center','bg-light','pt-3','pb-3')
    innerDiv1.innerText=transaction.name;
    span1.innerText=transaction.amount;
    innerDiv2.appendChild(span1);
    childDiv.append(innerDiv1,innerDiv2,innerDiv3);
    tempDiv.append(childDiv);
    historyDiv.append(tempDiv);

    //delete button logic
    deleteBtn.addEventListener('click',()=>{
        deleteBtn.parentElement.parentElement.parentElement.remove();
        deleteLogic(transaction.id);
    })
}


// delete logic 

function deleteLogic(val){
    let temp=transactions.filter((data)=>{
        if(data.id!=val){
            return data;
        }else{
          if(data.type=='credit'){
            decreaseCreditValue(data);
          }else if(data.type=='debit'){
            decreaseDebitValue(data);
          }
        }
    })
    transactions=temp;
    localStorage.setItem('transactions',JSON.stringify(transactions));
}

//progressbar logic 

function progressBarLogic(val1,val2){
    if(totalCredit.innerHTML==0 && totalDebit.innerHTML==0){
        progressBarMainDiv.classList.remove('bg-success');
        progressBarMainDiv.classList.add('bg-light');
        progressBar.style.width='0%';
    }else{
        progressBarMainDiv.classList.remove('bg-light')
        progressBarMainDiv.classList.add('bg-success')
        let temp = (val2/val1)*100;
        progressBar.style.width=`${temp}%`;
        console.log(temp);
    }
}
import {useContext} from 'react';
import {ExpenseTrackerContext} from './context/context';
import {incomeCategories, expenseCategories, resetCategories} from './constants/categories'

const useTransactions = (title) => {
    resetCategories();
    const {transactions} = useContext(ExpenseTrackerContext);
    console.log("transactions: ", transactions);
    
    //# transactions = [{amount, category, type, date, id}, {...}, {...}]
        //# transactions.type = [Income, Expenses]
        //# transactions.category = [Business, Investments, Extra Income, Pets]

    const transactionsOfAType = transactions.filter((t) => t.type === title);
    const total = transactionsOfAType.reduce((acc, currentVal) => acc += currentVal.amount, 0)

    const categories = title === "Income" ? incomeCategories : expenseCategories;
    //# incomeCategories/expenseCategories = [{type, amount, colour}, {...}]
        //# incomeCategories.type = [Business, Investments, Extra Income]



    transactionsOfAType.forEach((t) => {
        const category = categories.find((c) => c.type === t.category);
        if(category) category.amount += t.amount;
       
    })

    const filteredCategoriesAbove0 = categories.filter((c) => c.amount > 0);

    const chartData = {
        datasets: [{
            data: filteredCategoriesAbove0.map((c) => c.amount),
            backgroundColor: filteredCategoriesAbove0.map((c) => c.color)
        }],
        labels: filteredCategoriesAbove0.map((c) => c.type)
    }

    console.log({transactionsOfAType, total, categories, chartData});

    return {total, chartData}
}

export default useTransactions;


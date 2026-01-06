import React, { createContext, useState } from "react";

export const ExpenseContext=createContext();

const ContextProvider=(props)=>{
    const [expenseData,setExpenseData]=useState([]);

    const addData=(expense)=>{
        setExpenseData((prev)=>[...prev,expense])
    }

    const removeData=(id)=>{
        setExpenseData((prev)=>prev.filter((item)=>item.id!==id));
    }

    return(
        <ExpenseContext.Provider value={{
            addData,
            removeData,
            expenseData,

        }}>
            {props.children}
        </ExpenseContext.Provider>
    )
}

export default ContextProvider;
import React, {useState, useContext, useEffect} from 'react'
import {Grid, FormControl, InputLabel, Typography, TextField, Select, MenuItem, Button} from "@material-ui/core"
import useStyles from './styles'
import {ExpenseTrackerContext} from '../../../context/context';
import {v4 as uuidv4} from 'uuid'
import {incomeCategories, expenseCategories} from '../../../constants/categories'
import formatDate from '../../../utils/formatDate';
import {useSpeechContext} from '@speechly/react-client'
import CustomizedSnackbar from '../../Snackbar/Snackbar';
import Alert from '@material-ui/lab/Alert';


const initialState = {
    amount: "",
    category:"",
    type:"Income",
    date: formatDate(new Date())
}

const Form = () => {

    const [formData, setFormData] = useState(initialState);
    const [open, setOpen] = useState(false);
    const {addTransaction, deleteTransaction, balance} = useContext(ExpenseTrackerContext);

    const {segment} = useSpeechContext();

  

    const createTransaction = () => {
      
        if(formData.category === "" || formData.category === "") {
            return alert("Please all the fields.")
    }

        if(Number.isNaN(Number(formData.amount)) || !formData.date.includes("-")) return;
        const transaction = {
            ...formData, 
            amount: Number(formData.amount), 
            id: uuidv4()
        }
        setOpen(true);
        addTransaction(transaction);
        setFormData(initialState);
    }

    useEffect(() => {
        if(segment) {
            if(segment.intent.inent === "add_expense") {
                setFormData({...formData, type:"Expense"})
            } else if (segment.intent.intent === "add_income") {
                setFormData({...formData, type: "Income"})
            } else if (segment.isFinal && segment.intent.intent === "create_transaction") {
                createTransaction();
            } else if(segment.isFinal && segment.intent.intent === "cancel_transaction") {
                setFormData(initialState)
            }

            segment.entities.forEach((e) => console.log(e.value))


            segment.entities.forEach((e) => {

                const category = `${e.value.charAt(0)}${e.value.slice(1).toLowerCase()}`
                switch(e.type) {
                    case "amount":
                        setFormData({...formData, amount: e.value});
                        break;
        
                        case "category":
                            if(incomeCategories.map((iC) => iC.type).includes(category)) {
                                setFormData({...formData, type:"Income", category});
                            } else if(expenseCategories.map((eC) => eC.type).includes(category)){
                                setFormData({...formData, type:"Expense", category})
                            }
                       
                        break;
        
                        case "date":
                        setFormData({...formData, date: e.value});
                        break;
        
                        default:
                            break;  
        
                    
                }
            })
            if (segment.isFinal && formData.amount && formData.category && formData.type && formData.date) {
                createTransaction();
              }
        }
    }, [segment])

   
    const selectedCateogries = formData.type === "Income" ? 
    incomeCategories : expenseCategories;

    
    const classes = useStyles();
    return (
        <Grid container spacing={2}>    
            <CustomizedSnackbar open={open} setOpen={setOpen} />
            <Grid item xs={12}>
                <Typography align="center" variant="subtitle2" gutterBottom>
                {segment? (
                    <>
                        {segment.words.map((w) => w.value).join(" ")}
                    </>
                ): null}
                </Typography>
            </Grid>

            <Grid item xs={6}>
                <FormControl fullWidth>
                    <InputLabel>Type</InputLabel>
                    <Select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} >
                        <MenuItem value="Income">Income</MenuItem>
                        <MenuItem value="Expense">Expense</MenuItem>
                    </Select>
                </FormControl>
            </Grid>

            <Grid item xs={6}> 
                <FormControl fullWidth>
                    <InputLabel shrink id="catDef">Category</InputLabel>
                    <Select labelId="catDef" id="catDef-x" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} >
                        {selectedCateogries.map((c) => 
                           <MenuItem  value={c.type} key={c.type}> {c.type} </MenuItem>
                        )}
                    </Select>
                </FormControl>  
            </Grid>

            <Grid item xs={6}>
                <TextField value={formData.amount} onChange = {(e) => setFormData ({...formData, amount: e.target.value})} type="number" label="Amount" fullWidth />
            </Grid>

            <Grid item xs={6}>
                <TextField value={formData.date} onChange = {(e) => setFormData ({...formData, date: formatDate(e.target.value)})} type="date" label="Date" fullWidth />
            </Grid> 
  
            <Button
              className={classes.button}
              variant="outlined"
              color="primary"
              fullWidth
              onClick={createTransaction} >Create</Button>

        </Grid> //? Grid container --end--
    )
}

export default Form

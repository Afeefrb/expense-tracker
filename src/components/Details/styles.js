import {makeStyles} from '@material-ui/core'
//This is a styles hook
export default makeStyles(() => ({
    income:{ //income class
        borderBottom: "10px solid rgba(0, 255, 0, 0.5)",
    }, expense:{
        borderBottom: "10px solid rgba(255, 0, 0, 0.5)",
    }
}));
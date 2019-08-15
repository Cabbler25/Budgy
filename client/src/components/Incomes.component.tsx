import React, { useState, useEffect, Fragment } from 'react';
import { IUserState, IState, IUiState } from '../redux';
import { connect } from 'react-redux';
import NewIncome from './NewIncomesDialog';
import { Col, Container, Row } from 'reactstrap';
import Axios from 'axios';
import { IncomesTable } from './IncomeTablesComponent';
import { Grid, Paper, Button } from '@material-ui/core';
import DonutGraph from './data/DonutGraph';
import { Link, Redirect } from 'react-router-dom';



interface IIncomeProps {
  user: IUserState;
  ui: IUiState;
  type: number;
  description: string;
  amount: number;
}


function Incomes(props: IIncomeProps) {
  const [incomes, setIncomes] = useState();
  const [incomeTypes, setIncomeTypes] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [incomesByUserAndType, setIncomeByUserIdAndTypeId] = useState([]);


useEffect(() => {
  getAllIncomes();
  getAllIncomeTypes();
}, [])

async function getAllIncomes() {
  const url = `http://localhost:8080/income/user/${props.user.id}`;
  await Axios.get(url)
      .then((payload: any) => {
        // console.log(payload.data);
        setIncomes(payload.data);
      }).catch((err: any) => {
        // Handle error by displaying something else
      });
}

async function getAllIncomeTypes() {
  const url = `http://localhost:8080/income/types`;
  await Axios.get(url)
    .then((payload: any) => {
      // console.log(payload.data);
      setIncomeTypes(payload.data);
    }).catch((err: any) => {
      // Handle error by displaying something else
    });
}

function createGraphData() {
  return incomes.map((i: any) => {
    return { key: i.incomeType.type, data: i.amount }
  });
}

function createGraphLabels() {
  return incomeTypes.map((i: any) => {
    return i.type;
  });
}

async function handleElementClick(label: string) {
  const type = incomeTypes.find((type: any) => type.type == label);

  if (type) {
    const matchedIncomes = incomes.filter((income: any) =>
      JSON.stringify(income.incomeType) == JSON.stringify(type))
    console.log(matchedIncomes);
    setIncomeByUserIdAndTypeId(matchedIncomes);
    setShowTable(true);
  }
}

//   Request function for new income here
async function createNewIncome(newType: any, newDescripion: string, newAmount: number) {
  // Prepare request setup
  const url = 'http://localhost:8080/income';
  const data = {
    userId: props.user.id,
    incomeType: newType,
    description: newDescripion,
    amount: newAmount
  };
  const response = await Axios.post(url, data);
  try {
    // console.log(response.status);
    getAllIncomes();
  } catch {
    console.log("ERRORS: ", response.data);
  }
}

return (
  <div style={{textAlign: 'center'}}>
    {!props.user.isLoggedIn && <Redirect to="/login" />}
    <Paper style={{opacity: .75, margin: '5px auto', padding: '10px', width: props.ui.isMobileView ? "90%" : showTable ? '80%' : '48%',
                  height: props.ui.isMobileView ? "90%" : "60%"}}>
    {//<Container style={{ textAlign: 'center'}}> 
    }
      <h2>Manage your income, {props.user.first}</h2>
      <br/>
      <NewIncome
        types={incomeTypes}
        createIncome={createNewIncome} />
      <br />
      
      {//<Grid item xs={12} md={9}>
      }
      <div>
            {showTable ? (
              <Fragment>
                <Button
                  color="secondary"
                  onClick={() => setShowTable(false)}>
                  Back
                </Button>
                <IncomesTable incomes={incomesByUserAndType} />
              </Fragment>
            ) : (
                <Fragment>
                  {incomes && (<DonutGraph data={createGraphData()} labels={createGraphLabels()} important='Emergency'
                    isMobileView={props.ui.isMobileView}
                    handleElementClick={handleElementClick} />)}
                </Fragment>
              )}
            {//
           // <br />
           // <NewIncome
           //   types={incomeTypes}
           //   createIncome={createNewIncome} />
           // <br />
            }
          </div>
        {//</Grid>
        }
    {//</Container>
    }
    </Paper>
  </div>
);
            }
            

//Redux
const mapStateToProps = (state: IState) => {
  return {
    user: state.user,
    ui: state.ui
  }
}

export default connect(mapStateToProps)(Incomes);
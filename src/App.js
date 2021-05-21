import React, { Component } from 'react';
import axios from 'axios';
import { useState } from 'react';

const Bank = props => (
  <tr>
    <td>{props.bank.bank_id}</td>
    <td>{props.bank.bank_name}</td>
    <td>{props.bank.branch}</td>
    <td>{props.bank.district}</td>
  </tr>
)

const excludeColumns = ["bank_id", "ifsc"];

var banks = []

export default class ExercisesList extends Component {

  
  constructor(props) {
    super(props);
    
    this.state = { copyBanks:[], searchText: ''};
  }

  componentDidMount() {
    axios.get('https://vast-shore-74260.herokuapp.com/banks?city=MUMBAI')
      .then(response => {
        //this.setState({ banks: response.data })
        banks = response.data
        console.log(banks)
        this.setState({copyBanks: banks})
      
      })
      .catch((error) => {
        console.log(error);
      })
  }


  bankList() {
    return this.state.copyBanks.map(currentbank => {
      return <Bank bank={currentbank} key={currentbank._id}/>;
    })
   
  }

  filterData = (value) => {
    console.log("yesss")
    const lowercasedValue = value.toLowerCase().trim();
    if (lowercasedValue === ""){
      this.setState({ copyBanks: banks});
      console.log(this.state.copyBanks)
    }
    else {
      const filteredData = banks.filter(item => {
        return Object.keys(item).some(key =>
          excludeColumns.includes(key) ? false : item[key].toString().toLowerCase().includes(lowercasedValue)
        );
      });
      console.log(filteredData)
      this.setState({ copyBanks: filteredData });
      
    }
  }

  handleChange = (value) => {
    this.setState({ searchText: value})
    //setSearchText(value);
    this.filterData(value);
  };

  render() {
    return (
      <div>
      Search: <input
        style={{ marginLeft: 5 }}
        type="text"
        placeholder="Type to search..."
        value={this.state.searchText}
        onChange={e => this.handleChange(e.target.value)}
      />
        <h3>Tasks Created</h3>
        <table className="table">
          <thead className="thead-light">
            <tr>
              <th>Bank id</th>
              <th>Bank name</th>
              <th>Branch</th>
              <th>district</th>
            </tr>
          </thead>
          <tbody>
            { this.bankList() }
          </tbody>
        </table>
      </div>
    )
  }
}
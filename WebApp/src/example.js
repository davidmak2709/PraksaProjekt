import React from 'react';


class example extends React.Component {
  state = {
    selectedOption: null,
  }
  handleChange = (selectedOption) => {
    this.setState({ selectedOption });
    console.log(`Option selected:`, selectedOption);
  }
  render() {


    return (
        <div></div>

    )
  }
}

export default example;

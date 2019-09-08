import React from 'react';

export default class BlogPost extends React.Component {
  render(){
    return (
      <div>
        <h2>{this.props.content.title}</h2>
        <p>{this.props.content.description} </p>
        <img src={this.props.content.image}/>
      </div>
    )
  }
}

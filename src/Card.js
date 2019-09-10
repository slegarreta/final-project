import React from 'react';


export default class Card extends React.Component {
  state = {
    value: ''
  }

  handleUpdateChange = (e) => {
		this.setState({
			value: e.target.value
		})
	}

	triggerUpdateChange = (e) => {
		this.props.update(e, this.props.key, this.state.value)
	}


render(){
  return (
        <div className="card col-lg-4 p-2 m-1">
             <p className="row justify-content-center title">{this.props.place.title}</p>
             <img src="https://image.shutterstock.com/image-photo/rome-october-4-2012-tourists-260nw-147643949.jpg"/>
             <p className="row justify-content-center location">{this.props.place.city}, {this.props.place.country}</p>
             <button className="btn btn-success" size="sm" onClick={(e) => this.props.favoriteClick(this.props.place)}>Favorite this</button>
             <input type="text" value={this.state.value} onChange={this.handleUpdateChange} />
				     <button onClick={(e) => this.triggerUpdateChange(e)}>
					        Update Me
				     </button>
         </div>
      );
}
}

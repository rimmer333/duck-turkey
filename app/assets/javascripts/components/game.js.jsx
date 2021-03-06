window.Game = React.createClass({
	getInitialState: function(){
	    return {
	    	"score":0,
	    	"write_to_last_frame":false,
	    	"frames":[{
	          rolls: [],
	          score: 0
	        }],
	    	"over":false
    	};
	},
	handleChange: function(event){
		// locate form from event.target
		$form = $(event.target).closest('form.game__form');
		// serialize form and send AJAX request to server. 
		$.post(
			$form.attr('action'), 
			$form.serialize()
		).done($.proxy(function(result){
				// replace state with result
				this.replaceState(this.newFrameWhenNecessary(result));
			}, this) 
		);
	},
	frames: function() {
		var result = [];
		for (var frameNum in this.state.frames) {
			let frameProps = {
				key: frameNum,
				num: parseInt(frameNum, 10) + 1,
				frame: this.state.frames[frameNum]
			};
			if (frameNum == 9) {
				frameProps.is_final = true;
			}
			result.push(<Game.Frame {...frameProps} />);
		}
		return result;
	},
	newFrameWhenNecessary: function(state) {
		if (!state.write_to_last_frame && !state.over) {
			// push a new empty frame to state.frames
			state.frames.push({
	          rolls: [],
	          score: 0
	        });
		}
		return state;
	},
	errorMessage: function() {
		if (this.state.error > '') {
			return (
				<div className="game__output game__output--error">{this.state.error}</div>
			);
		}
	},
	render: function(){
		return (
			<div className="game">
				<div className="game__output game__output--score">{this.state.score}</div>
				{this.errorMessage()}
				<form action={this.props.url} onChange={this.handleChange} className="game__form">
					{this.frames()}
				</form>
			</div>
		);
	}
});
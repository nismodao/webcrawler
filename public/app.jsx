class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jobs: []
    };
  }
  updateList(e) {
    e.preventDefault();
    var url = this.refs.url.value;
    var context = this;
    $.post('/', {"message":url}, function(data) {
      console.log(data.status);
      if (data.status === 'pending') {
          console.log('data.url', data.url);
          context.state.jobs.push(data);
          context.setState({jobs: context.state.jobs});  
      } else if (data.status === 'complete') {
          window.location.assign('http://www.localhost:3000/page.html')
      } else {
        alert('Robots are fetching the page -- please check back later');
      }
    })
  }
  render() {
    return (
      <div>
        <form id="url" onSubmit={this.updateList.bind(this)}>
            <input ref="notes" type="text" id="query" ref="url" placeholder="Enter Url - e.g., www.nytimes.com or Job ID"/>
            <input type="submit" className="button"/>
        </form>
        <ul className="list">
          {this.state.jobs.map((page, index) => (
            <li key={index}> {page.url + " -- " + "job ID" + " " + page.jobId + "-- " + "status is " + page.status} </li> 
          ))}
        </ul>
      </div>
    );
  }
}

ReactDOM.render(
  <App/>,
  document.getElementById('list')
);



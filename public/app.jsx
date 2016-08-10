class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jobs: [{url: "www.google.com", jobId: 1234, status: 'pending'}, {url: "www.espn.com", jobId: 4579, status: 'pending'}]
    };
  }
  updateList(e) {
    e.preventDefault();
    var url = this.refs.url.value;
    console.log(url);
    var context = this;
    $.post('/', {"message":url}, function (data) {
    context.state.jobs.push(data);
    context.setState({jobs: context.state.jobs});
    console.log('this state after post', context.state.jobs);
    });
  }

  updateJob() {
    //when user clicks on JobID
    //
  }
  render() {
    return (
      <div>
        <form id="url" onSubmit={this.updateList.bind(this)}>
            <input type="text" name="yolo" id="query" ref="url"/>
            <input type="submit"/>
        </form>
        <ul>
          {this.state.jobs.map((page, index) => (
            <li key={index}> {page.url + " " + page.jobId + " " + page.status} </li> 
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



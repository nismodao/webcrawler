
$("#btn").on("click", function (e) {
  e.preventDefault();
  var url = $("#query").val();
  console.log(url);
  $.post('/', {"message":url}, function (data) {
    console.log(data);
  });
})


class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jobs: [{url: "www.google.com", jobId: 1234, status: 'pending'}, {url: "www.espn.com", jobId: 4579, status: 'pending'}]
    };
  }
  updateList() {
    //when user add new link
    //fetch
    //this.setState
  }
  updateJob() {
    //when user clicks on JobID
    //
  }
  render() {
    return (
      <div>
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
  <List/>,
  document.getElementById('list')
);



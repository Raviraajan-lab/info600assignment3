/* document.addEventListener('DOMContentLoaded', assignClickHandler) */

function test(){

(function() {
    var httpRequest;
    
    document.getElementById("loaddata").addEventListener('click', makeRequest);
    
    $("#addRec").click(function(){
      const startYear = document.getElementById('startYear').value
      if (startYear < 2000) {
        window.alert('Incorrect year: ' + startYear)
        return
      }
    
      const fullName = document.getElementById('fullName').value
      const major = document.getElementById('major').value
      
      const date = new Date()
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      const time = hours + ':' + minutes
      
      document.getElementById('inputs').reset()
      
      data = {fullName : fullName, startYear : startYear, major: major,time : time}
      $.post("/user", data, function(data){
        const newEntry = time + ' - ' + fullName + ', ' + major + ', ' + startYear
        const enteredRecords = document.getElementById('enteredRecords')
        let newRow = document.createElement('tr')
        let newUserElement = document.createElement('td')
        newUserElement.appendChild(document.createTextNode(newEntry))
        newRow.appendChild(newUserElement);
        newRow.id = data.id
        let deleteButton = document.createElement('button');
        deleteButton.appendChild(document.createTextNode('delete'))
        deleteButton.addEventListener('click', function(){
          deleteUser(data.id);
        })
        newRow.appendChild(deleteButton)
        enteredRecords.appendChild(newRow)
      });
    });

    function deleteUser(id){

      $.ajax({           
        type: "DELETE",
        url: "/user/" + id,
      }).done(function( msg ) {
        /* $('#' + id).remove();
        alert('deleted user ' + id) */
        makeRequest();
      });

    }
    function makeRequest() {
      httpRequest = new XMLHttpRequest();
  
      if (!httpRequest) {
        alert('Giving up :( Cannot create an XMLHTTP instance');
        return false;
      }
      httpRequest.onreadystatechange = loadContent;
      httpRequest.open('GET', 'users');
      httpRequest.send();
    }
  
    function alertContents() {
      if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
          alert(httpRequest.responseText);
        } else {
          alert('There was a problem with the request.');
        }
      }
    }

    function loadContent() {
      if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
          users = JSON.parse(httpRequest.responseText);
          $('#enteredRecords').empty();
          /*const date = new Date()
          const hours = date.getHours().toString().padStart(2, '0')
          const minutes = date.getMinutes().toString().padStart(2, '0')
          const time = hours + ':' + minutes*/
          const records = document.getElementById('enteredRecords');
          users.records.forEach(element => {
          let newEntry =''
            if(element.time) 
              newEntry+= element.time + ' - '
            newEntry+= element.fullName + ', ' + element.major + ', ' + element.startYear
            
            let newRow = document.createElement('tr')
            let newUserElement = document.createElement('td')
            newUserElement.appendChild(document.createTextNode(newEntry))
            newRow.appendChild(newUserElement);
            newRow.id = element.id;
            
            let deleteButton = document.createElement('button');
            deleteButton.appendChild(document.createTextNode('delete'))
            deleteButton.addEventListener('click', function(){
              deleteUser(element.id);
            })
            newRow.appendChild(deleteButton)
            records.appendChild(newRow);
          });
                    
        } else {
          alert('There was a problem with the request.');
        }
      }
    }
   
   
})();
}

window.onload = function(){
  test();
};
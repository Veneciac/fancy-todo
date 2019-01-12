$(document).ready(
    isLogin()
)
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1
var yyyy = today.getFullYear();

if(dd < 10){
    dd ='0'+ dd
} 
if(mm < 10){
    mm ='0'+ mm
} 

today = yyyy+'-'+mm+'-'+dd;

document.getElementById("taskDate").setAttribute("min", today);
document.getElementById("taskDate").setAttribute("value", today);

document.getElementById("taskDateEdit").setAttribute("min", today);
document.getElementById("taskDateEdit").setAttribute("value", today);

let taskList = null

function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
    $.ajax({
        type: 'post',
        url: `http://localhost:3000/users/signin`,
        data: {
            token: id_token
        }
    })
    .done(response => {
        localStorage.setItem('token', response.token)
        $('#body').show()
        getAllTask()
        $('#form').modal('hide');
        $('#notif').empty()
    })
    .fail(err => {
        $('#notif').empty()
        $('#notif').append(
            `
            <div class="alert alert-dismissible alert-danger">
                <button type="button" class="close" data-dismiss="alert">&times;</button>
                <strong>Oh snap!</strong> Something went wrong 
            </div>
            `
        )
        console.error(err)
    })
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
        localStorage.removeItem('token');
        $('#body').hide()
        $('#form').modal({
            backdrop: 'static',
            keyboard: false
        }, 'show')
        $('.card-list').empty()
        $('#notif').empty()
    });
}

function isLogin() {
    if (!localStorage.getItem('token')){
        $('#body').hide()
        $('#form').modal({
            backdrop: 'static',
            keyboard: false
        }, 'show')
        
    } else {
        $('#body').show()
        $('#form').modal('hide');
        $('#notif').empty()
        getAllTask()
    }
}

$('#formRegis').submit(e => {
    e.preventDefault()
    $.ajax({
        type: 'post',
        url: `http://localhost:3000/users`,
        data: {
            email: $('#email').val(),
            password: $('#password').val()
        }
    })
    .done(response => {
        localStorage.setItem('token', response.token)
        $('#body').show()
        $('#form').modal('hide');     
        getAllTask()  
    })
    .fail(err => {
        $('#notifRegis').empty()
        $('#notifRegis').append(
            `
            <div class="alert alert-dismissible alert-danger">
                <button type="button" class="close" data-dismiss="alert">&times;</button>
                <strong>Oh snap!</strong> ${err.responseJSON.msg}
            </div>
            `
        )
        console.error(err)
    })
})

$('#formaddTask').submit(e => {
    e.preventDefault()
    $.ajax({
        type: 'post',
        url: `http://localhost:3000/tasks`, 
        data: {
            task: $('#taskName').val(),
            description: $('#taskDesc').val(),
            dueDate: $('#taskDate').val()
        },
        headers: {
            token: localStorage.token
        }
    })
    .done(success => {
        $('#addTaskModal').modal('hide')
        $('#notif').empty()
        $('#notif').append(
            `
            <div class="alert alert-dismissible alert-success">
                <button type="button" class="close" data-dismiss="alert">&times;</button>
                <strong>Well done!</strong> You successfully add ${success.data.task}
            </div>
            `
        )
        getAllTask()
    })
    .fail(err => {
        $('#notif').empty()
        $('#notif').append(
            `
            <div class="alert alert-dismissible alert-danger">
                <button type="button" class="close" data-dismiss="alert">&times;</button>
                <strong>Oh snap!</strong> Something went wrong ${err.responseJSON.msg}
            </div>
            `
        )
        console.error(err)
    })
})

function getAllTask() {
    $.ajax({
        type: `get`,
        url: `http://localhost:3000/tasks`,
        headers: {
            token: localStorage.token,
            type: 'me'
        }
    })
    .done(response => {
        taskList = response.data
        displayTask(response.data)
    })
    .fail(err => {
        $('#notif').empty()
        $('#notif').append(
            `
            <div class="alert alert-dismissible alert-danger">
                <button type="button" class="close" data-dismiss="alert">&times;</button>
                <strong>Oh snap!</strong> Something went wrong ${err.responseJSON.msg}
            </div>
            `
        )
        console.error(err)
    })
}

$('#searchTodo').keyup(e => {
    e.preventDefault()
    $.ajax({
        type: 'get',
        url: `http://localhost:3000/tasks?search=${$('#searchInput').val()}`,
        headers: {
            token: localStorage.token
        }
    })
    .done(success => {
        displayTask(success.data)                
    })
    .fail(err => {
        $('#notif').empty()
        $('#notif').append(
            `
            <div class="alert alert-dismissible alert-danger">
                <button type="button" class="close" data-dismiss="alert">&times;</button>
                <strong>Oh snap!</strong> Something went wrong 
            </div>
            `
        )
        console.error(err)
    })
})


function delTask(id) {
    $(`#deleteTask${id}`).submit(e => {
        e.preventDefault()
        $.ajax({
            type: "delete",
            url: `http://localhost:3000/tasks/${id}`,
            headers: {
                token: localStorage.token,
                type: 'me'
            }
        })
        .done(response => {
            $('#notif').empty()
            $('#notif').append(
                `
                <div class="alert alert-dismissible alert-success">
                    <button type="button" class="close" data-dismiss="alert">&times;</button>
                    <strong>Well done!</strong> You successfully delete task
                </div>
                `
            )
            getAllTask()
        })
        .fail(err => {
            $('#notif').empty()
            $('#notif').append(
                `
                <div class="alert alert-dismissible alert-danger">
                    <button type="button" class="close" data-dismiss="alert">&times;</button>
                    <strong>Oh snap!</strong> Something went wrong 
                </div>
                `
            )
            console.error(err)
        })
    })
}


function displayTask(list) {
    $('.card-list').empty()
    list.forEach(e => {
        $('.card-list').append(
            `
            <div id="card${e._id}" class="card text-white bg-primary mb-3" style="max-width: 20rem;">
                    <div class="card-header" >
                    <div id="taskStatus${e._id}" ></div>
                        <form id="deleteTask${e._id}" >
                            <button onclick="delTask('${e._id}')" type="submit" class="close float-right" >
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </form>
                        </div>
                    <div class="card-body">
                        <h4 class="card-title">${e.task}</h4>
                        <small class="text-muted">  ${new Date(e.dueDate).toDateString()}</small>
                        <span onclick="setTask('${e._id}')" data-toggle="modal" data-target="#editTaskModal" style="cursor: pointer;" class="badge badge-pill badge-secondary">edit</span>
                        <p class="card-text">${e.description}</p>
                    </div>
            </div>
            `
        )
        if (e.status == false) {
            $(`#taskStatus${e._id}`).append(`<span class="float-left badge badge-pill badge-danger ">!</span>`)
        } else {
            $(`#taskStatus${e._id}`).append(`<span class="float-left badge badge-pill badge-info">done</span>`)
        }
        if (e.dueDate) {
            if (new Date(e.dueDate) <= new Date()) {
                document.getElementById(`card${e._id}`).setAttribute('class', `card  bg-secondary mb-3`)
            }
        }
        
    })
}

function setTask(id) {
    $('#notif').empty()
    $.ajax({
            type: 'get',
            url: `http://localhost:3000/tasks/${id}`,
            headers: {
                token: localStorage.token
            }
        })
        .done(response => {
            document.getElementById("taskNameEdit").value = response.data.task
            document.getElementById("taskDescEdit").value = response.data.description

            $('#formeditTask').submit(e => {
                e.preventDefault()
                let data = {
                    task: $('#taskNameEdit').val(),
                    description: $('#taskDescEdit').val(),
                    status: $('#taskStatusEdit').val(),
                    dueDate: $('#taskDateEdit').val()
                }

                $.ajax({
                    type: 'put',
                    url: `http://localhost:3000/tasks/${id}`,
                    headers: {
                        token: localStorage.token
                    },
                    data
                })
                .done(succEdit => {
                    $('#editTaskModal').modal('hide')
                    $('#notif').empty()
                    $('#notif').append(
                        `
                        <div class="alert alert-dismissible alert-success">
                            <button type="button" class="close" data-dismiss="alert">&times;</button>
                            <strong>Well done!</strong> You successfully edit task.
                        </div>
                        `
                    )
                    getAllTask()
                })
                .fail(errEdit => {
                    $('#notif').empty()
                    $('#notif').append(
                        `
                        <div class="alert alert-dismissible alert-danger">
                            <button type="button" class="close" data-dismiss="alert">&times;</button>
                            <strong>Oh snap!</strong> Something went wrong ${errEdit.responseJSON.msg}
                        </div>
                        `
                    )
                    console.error(errEdit)
                })
            
            })
        })
        .fail(err => {
            $('#notif').empty()
            $('#notif').append(
                `
                <div class="alert alert-dismissible alert-danger">
                    <button type="button" class="close" data-dismiss="alert">&times;</button>
                    <strong>Oh snap!</strong> Something went wrong 
                </div>
                `
            )
            console.error(err)
        })
  
}

$('.testNotif').click(e => {
    e.preventDefault()
    $('#notif').empty()

})

function sort() {
    taskList.sort(function(a, b){
        return new Date(a.dueDate) - new Date(b.dueDate);
    });
    displayTask(taskList)
}
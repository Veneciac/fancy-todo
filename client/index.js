$(document).ready(
    isLogin()
)

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
            <div class="card text-white bg-dark mb-3" style="max-width: 20rem;">
                    <div class="card-header" >
                        <form id="deleteTask${e._id}" >
                            <button onclick="delTask('${e._id}')" type="submit" class="close" >
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </form>
                        <div id="taskStatus${e._id}" ></div>
                    </div>
                    <div class="card-body">
                        <h4  onclick="setTask('${e._id}')" data-toggle="modal" data-target="#editTaskModal" style="cursor: pointer;" class="card-title">${e.task}</h4>
                        <p class="card-text">${e.description}</p>
                    </div>
            </div>
            `
        )
        if (e.status == false) {
            $(`#taskStatus${e._id}`).append(`<span class="badge badge-pill badge-danger"><i style='font-size:24px' class='fas'>&#xf068;</i></span>`)
        } else {
            $(`#taskStatus${e._id}`).append(`<span class="badge badge-pill badge-info"><i style='font-size:24px' class='fas'>&#xf00c;</i></span>`)
        }
        
    })
}

function setTask(id) {
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
                    status: $('#taskStatusEdit').val()
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
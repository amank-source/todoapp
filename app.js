let allToDos = [ ];
let pendingTodos, completedTodos, expiredTodos;
let editModeTodo = null;
let todoData = null;

function createElementFromTodo(todo){
    let element = $(`<div class="todo">
    <h3><span class="title">${todo.title}</span><span class="due-date">${todo.dueDate}</span></h3>
    <pre>${todo.description}</pre>
    <footer class="actions"> ${todo.isComplete ? "" : '<button class="action complete">Complete</button>'}
    <button class="action edit">Edit</button>
  <button class="action delete">Delete</button>
  </footer></div>`); 
  element.data('todo',todo); 
  return element;

}
function renderTodos(){
  $('main .content').empty();
  
  splitTodos();
 completedTodos.forEach(function(entry) {
   $('.completed-todos').append(createElementFromTodo(entry));
 });
 pendingTodos.forEach(function(entry){
   $('.pending-todos').append(createElementFromTodo(entry));

 });
 expiredTodos.forEach(function(entry){
   $('.expired-todos').append(createElementFromTodo(entry));
 }); 
 
}

$('.left-drawer ').on('click', function(event){

if ($(event.target).hasClass('left-drawer')) {

 $('#app').toggleClass('drawer-open');
}
});
$('.add-todo').on('click',function(){

$('.modal').addClass('open');
});

function createTodo(){
let newElement = createTodoFromForm();
allToDos.unshift(newElement);
$('.todo-form').trigger('reset');
$('.modal').removeClass('open');
storeData();
splitTodos();
renderTodos();

}

$('.create-todo').on('click', function(eventObj){
eventObj.preventDefault();

createTodo();

});
$('.save-todo').on('click',function(){
  if(editModeTodo !== null){
  editModeTodo.title = $('#todo-title').val();
  editModeTodo.dueDate = $('#todo-due-date').val();
  editModeTodo.description = $('#todo-description').val();
  $('.modal').removeClass('open');
  $('.todo-form').trigger('reset');
  editModeTodo = null;
  } else {
    $('.cancel-create-todo').click(function(){
      editModeTodo = null;
    
    });
  }
  storeData();
  renderTodos();

});

$('main').on('click', '.action.edit', function(){
  $('.create-todo').hide();
  $('.save-todo').show();
  $('.modal').addClass('open');
  editModeTodo = $(this).closest('.todo').data('todo');
  console.log('editModeTodo',editModeTodo);
             $('#todo-title').val(editModeTodo.title);
             $('#todo-due-date').val(editModeTodo.dueDate);
              $('#todo-description').val(editModeTodo.description);


});



$('.cancel-create-todo ').on('click', function(){
  $('.modal').removeClass('open');
  
  });

  function createTodoFromForm(){
    let form = $('.todo-form');
    let newForm = {
                      title : $('#todo-title').val(),
                      dueDate :$('#todo-due-date').val(),
                       description :$('#todo-description').val(),
                       isComplete :false

                      };
     return newForm;
    
  }

  $('main').on('click', '.action.complete', function(){
    let el = $(this).closest('.todo');
    el.data('todo').isComplete = true;
    el.slideUp(function(){
      storeData();
      splitTodos();
      renderTodos();

    });
    });
    
      function isCurrent(todo) {
        const todoDueDate = new Date(todo.dueDate);
        const now = new Date();
      
        return now < todoDueDate;
      }

    function splitTodos(){
      pendingTodos = allToDos.filter(function(entry){
        return !entry.isComplete && isCurrent(entry);
      });
      completedTodos = allToDos.filter(function(entry){
        return entry.isComplete;
      });
       expiredTodos = allToDos.filter(function(entry){
         return !entry.isComplete && !isCurrent(entry);

       });
    
    }

    function storeData(){
     
     localStorage.setItem("allToDos", JSON.stringify(allToDos));

    
    }

    function retrieveData(){
    

             allToDos = JSON.parse(localStorage.getItem('allToDos')) === null
                            ? fetchDefaultTodos()
                                : JSON.parse(localStorage.getItem('allToDos'));
    }

    function fetchDefaultTodos(){
      
     let dummyArray =  [ { 
      
           title : 'shopping',
           dueDate : '8021-08-31',
            description : 'shopping for an event',
            isComplete :false

           },
          
           {
            title : 'Assignment',
             dueDate: '2021-08-31',
             description : 'This assignment is about building todo app',
             isComplete : false
            }];
            return dummyArray; 
    }
    $('main').on('click', '.action.delete',function(){
      let el = $(this).closest('.todo');
      let el2 = el.data('todo');
      allToDos.splice(allToDos.indexOf(el2),1);
      storeData();
      splitTodos();
      renderTodos();
    });

   $('.remove-completed').on('click',function(){
allToDos = allToDos.filter(function(entry){
  return  !entry.isComplete; 
});
storeData();

renderTodos();
    });

    $('.remove-expired').on('click',function(){
      allToDos = allToDos.filter(function(entry){
        return  !entry.isComplete && isCurrent(entry); 
      });
  storeData();

renderTodos();

      }); 
      $('main').on('click','.todo .title',function(){
        todoData = $(this).closest('.todo').data('todo');
        $('#todo-title').val(todoData.title);
             $('#todo-due-date').val(todoData.dueDate);
              $('#todo-description').val(todoData.description);
              
             
      console.log(todoData);
        
        storeData();
        renderTodos();

      });
      $('.list-title').on('click',function(){
        let el = ('.content');
      todoData.title = $('#todo-title').val();
       todoData.dueDate = $('#todo-due-date').val();
        todoData.description = $('#todo-description').val();
        todoData.isComplete = $('.content').text()==='Completed Todos' ? todoData.isComplete: !todoData.isComplete;
      
   $('.todo-list').append(todoData); 
    console.log(todoData);
    todoData = null;
        storeData();
        splitTodos();
        renderTodos();
      });  
retrieveData();
splitTodos();
renderTodos();
















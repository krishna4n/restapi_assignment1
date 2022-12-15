const express = require("express");
const app = express();
app.use(express.json());
const path = require("path");
const dbPath = path.join(__dirname, "todoApplication.db");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const format = require("date-fns/format");
const isValid = require("date-fns/isValid");
let db = null;
const initiateDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB error ${e.message}`);
  }
};
initiateDBAndServer();
categoryList = ["WORK", "HOME", "LEARNING"];
statusList = ["TO DO", "IN PROGRESS", "DONE"];
priorityList = ["HIGH", "MEDIUM", "LOW"];

const isStatusValid = (status) => {
  return statusList.includes(status);
};
const isCategoryValid = (category) => {
  return categoryList.includes(category);
};
const isPriorityValid = (priority) => {
  return priorityList.includes(priority);
};

hasProperty = (property) => {
  return property !== undefined;
};

hasPriorityAndStatusProperty = (query) => {
  return hasProperty(query.priority) && hasProperty(query.status);
};

hasCategoryAndStatusProperty = (query) => {
  console.log(query);
  return hasProperty(query.category) && hasProperty(query.status);
};

hasCategoryAndPriorityProperty = (query) => {
  return hasProperty(query.category) && hasProperty(query.priority);
};

app.get("/todos/", async (request, response) => {
  const { status, category, priority, search_q } = request.query;
  console.log(status);
  switch (true) {
    case hasPriorityAndStatusProperty(request.query):
      if (isPriorityValid(priority) && isStatusValid(status)) {
        const apiQuery = `select * from todo where priority='${priority}' and status='${status}'`;
        const data = await db.all(apiQuery);
        const dataList = data.map((each) => ({
          id: each.id,
          todo: each.todo,
          priority: each.priority,
          status: each.status,
          category: each.category,
          dueDate: each.due_date,
        }));
        response.send(dataList);
      } else {
        response.status(400);
        response.send("Invalid Priority and Status");
      }

      break;
    case hasCategoryAndStatusProperty(request.query):
      if (isCategoryValid(category) && isStatusValid(status)) {
        apiQuery = `select * from todo where category='${category}' and status='${status}'`;
        const data = await db.all(apiQuery);
        console.log(data);
        const dataList = data.map((each) => ({
          id: each.id,
          todo: each.todo,
          priority: each.priority,
          status: each.status,
          category: each.category,
          dueDate: each.due_date,
        }));
        response.send(dataList);
      } else {
        response.status(400);

        response.send("Invalid Category and Status");
      }
      break;
    case hasCategoryAndPriorityProperty(request.query):
      if (isCategoryValid(category) && isPriorityValid(priority)) {
        apiQuery = `select * from todo where category='${category}' and priority='${priority}'`;
        const data = await db.all(apiQuery);
        const dataList = data.map((each) => ({
          id: each.id,
          todo: each.todo,
          priority: each.priority,
          status: each.status,
          category: each.category,
          dueDate: each.due_date,
        }));
        response.send(dataList);
      } else {
        response.status(400);
        response.send("Invalid Category and Priority");
      }
      break;
    case hasProperty(priority):
      console.log(priority);
      if (isPriorityValid(priority)) {
        console.log(priority);
        apiQuery = `select * from todo where priority='${priority}'`;
        const data = await db.all(apiQuery);
        const dataList = data.map((each) => ({
          id: each.id,
          todo: each.todo,
          priority: each.priority,
          status: each.status,
          category: each.category,
          dueData: each.due_date,
        }));
        response.send(dataList);
      } else {
        response.status(400);
        response.send("Invalid Todo Priority");
      }

      break;
    case hasProperty(status):
      console.log(isStatusValid(status));
      if (isStatusValid(status)) {
        apiQuery = `select * from todo where status='${status}'`;
        const data = await db.all(apiQuery);
        const dataList = data.map((each) => ({
          id: each.id,
          todo: each.todo,
          priority: each.priority,
          status: each.status,
          category: each.category,
          dueData: each.due_date,
        }));
        response.send(dataList);
      } else {
        response.status(400);
        response.send("Invalid Todo Status");
      }
      break;
    case hasProperty(category):
      if (isCategoryValid(category)) {
        apiQuery = `select * from todo where category='${category}'`;
        const data = await db.all(apiQuery);
        const dataList = data.map((each) => ({
          id: each.id,
          todo: each.todo,
          priority: each.priority,
          status: each.status,
          category: each.category,
          dueData: each.due_date,
        }));
        response.send(dataList);
      } else {
        response.status(400);
        response.send("Invalid Todo Category");
      }
      break;
    case hasProperty(search_q):
      apiQuery = `select * from todo where todo like '%${search_q}%'`;
      console.log(apiQuery);
      const data = await db.all(apiQuery);
      const dataList = data.map((each) => ({
        id: each.id,
        todo: each.todo,
        priority: each.priority,
        status: each.status,
        category: each.category,
        dueData: each.due_date,
      }));
      response.send(dataList);
      break;
    default:
      break;
  }
});

app.get("/todos/:todoId", async (request, response) => {
  const { todoId } = request.params;
  apiQuery = `select * from todo where id=${todoId}`;
  const data = await db.all(apiQuery);
  const dataList = data.map((each) => ({
    id: each.id,
    todo: each.todo,
    priority: each.priority,
    status: each.status,
    category: each.category,
    dueData: each.due_date,
  }));
  response.send(dataList);
});

app.get("/agenda/", async (request, response) => {
  const { date } = request.query;
  if (isValid(new Date(date))) {
    apiQuery = `select * from todo where due_date ='${date}' `;
    console.log(apiQuery);
    const data = await db.all(apiQuery);
    const dataList = data.map((each) => ({
      id: each.id,
      todo: each.todo,
      priority: each.priority,
      status: each.status,
      category: each.category,
      dueDate: each.due_date,
    }));
    response.send(dataList);
  } else {
    response.status(400);
    response.send("Invalid Due Date");
  }
});

app.post("/todos/", async (request, response) => {
  const { id, todo, priority, status, category, dueDate } = request.body;
  const formattedDate = format(new Date(dueDate), "yyyy-MM-dd");
  if (!isCategoryValid(category)) {
    response.status(400);
    response.send("Invalid Todo Category");
  }
  if (!isStatusValid(status)) {
    response.status(400);
    response.send("Invalid Todo Status");
  }
  if (!isPriorityValid(priority)) {
    response.status(400);
    response.send("Invalid Todo Priority");
  }
  if (!hasProperty(todo)) {
    response.status(400);
    response.send("Invalid Todo");
  }
  if (!isValid(new Date(dueDate))) {
    response.send(400);
    response.send("Invalid Due Date");
  }

  if (
    isCategoryValid(category) &&
    isStatusValid(status) &&
    isPriorityValid(priority) &&
    isValid(new Date(dueDate))
  ) {
    apiQuery = `insert into todo(id,todo,priority,status,category,due_date) values(${id},'${todo}','${priority}','${status}','${category}','${formattedDate}')`;
    const savedStatus = await db.run(apiQuery);
    response.send("Todo Successfully Added");
  }
});

app.put("/todos/:todoId", async (request, response) => {
  const { id } = request.query;
  const { status, category, dueDate, priority, todo } = request.body;

  switch (true) {
    case hasProperty(status):
      if (isStatusValid(status)) {
        apiQuery = `update todo set status='${status}' where id='${id}'`;
        await db.run(apiQuery);
        response.send("Status Updated");
      } else {
        response.status(400);
        response.send("Invalid Todo Status");
      }

      break;

    case hasProperty(category):
      if (isCategoryValid(category)) {
        apiQuery = `update todo set category='${category}' where id='${id}'`;
        await db.run(apiQuery);
        response.send("Category Updated");
      } else {
        response.status(400);
        response.send("Invalid Todo Category");
      }

      break;
    case hasProperty(priority):
      if (isPriorityValid(priority)) {
        apiQuery = `update todo set priority='${priority}' where id='${id}'`;
        await db.run(apiQuery);
        response.send("Priority Updated");
      } else {
        response.status(400);
        response.send("Invalid Todo Priority");
      }

      break;
    case hasProperty(dueDate):
      if (isValid(new Date(dueDate))) {
        const formattedDate = format(new Date(dueDate), "yyyy-MM-dd");
        apiQuery = `update todo set due_date='${formattedDate}' where id='${id}'`;
        await db.run(apiQuery);
        response.send("Due Date Updated");
      } else {
        response.status(400);
        response.send("Invalid Due Date");
      }

      break;
    case hasProperty(todo):
      apiQuery = `update todo set todo='${todo}' where id='${id}'`;
      await db.run(apiQuery);
      response.send("Todo Updated");

    default:
      break;
  }
});

app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const deleteQuery = `delete from todo where id = '${todoId}'`;
  await db.run(deleteQuery);
  response.send("Todo Deleted");
});

module.exports = app;

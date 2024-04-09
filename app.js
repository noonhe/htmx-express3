import express from 'express';

const courseGoals = [];

function renderGoalListItem(id , newGoal){
  return `
    <li id="${id}">
      <span>${newGoal}</span>
      <button hx-delete="/goal/${id}" hx-target="closest li" hx-confirm="Are you sure?">Remove</button>
    </li>
  `
}

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Learn HTMX</title>
      <link rel="stylesheet" href="/main.css" />
      <script src="/htmx.min.js" defer></script>
    </head>
    <body>
      <main>
        <h1>Manage your course goals</h1>
        <section>
          <form 
            hx-trigger="submit" 
            hx-post="/goal" 
            hx-target="#goals" 
            hx-swap="beforeend" 
            hx-on::after-request="this.reset()" 
            hx-disabled-elt="form button"
            id="goal-form"
          >
            <div>
              <label htmlFor="goal">Goal</label>
              <input type="text" id="goal" name="goal" />
            </div>
            <button  type="submit">Add goal</button>
          </form>
        </section>
        <section>
          <ul id="goals" hx-swap="outerHTML">
          ${courseGoals.map(
            (goal) => renderGoalListItem(goal.id , goal.title)
          ).join('')}
          </ul>
        </section>
      </main>
    </body>
  </html>
  `);
});

app.post('/goal', (req, res) => {
  let newGoal = req.body.goal;
  const id = `g-${new Date().getTime()}`;
  courseGoals.push({id:id ,title:newGoal});
  setTimeout(() => {
    res.send(renderGoalListItem(id , newGoal));
  }, 1000);
 
})

app.delete('/goal/:id' , (req , res)=>{
  const id = req.params.id;
  console.log(id);
  let index = courseGoals.findIndex(goal => goal.id === id);
  courseGoals.splice(index,1);
  res.send();
})

app.listen(3000);
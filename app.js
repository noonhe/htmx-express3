import express from 'express';

const courseGoals = [];

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
          <form hx-trigger="submit" hx-post="/goal" hx-target="#goals" hx-swap="beforeend"  id="goal-form">
            <div>
              <label htmlFor="goal">Goal</label>
              <input type="text" id="goal" name="goal" />
            </div>
            <button type="submit">Add goal</button>
          </form>
        </section>
        <section>
          <ul id="goals" hx-swap="outerHTML">
          ${courseGoals.map(
            (goal) => `
            <li id="${goal.id}">
              <span>${goal.title}</span>
              <button hx-delete="/goal/${goal.id}" hx-target="#${goal.id}" >Remove</button>
            </li>
          `
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
  res.send(
    `
      <li id="${id}">
        <span>${newGoal}</span>
        <button hx-delete="/goal/${id}" hx-target="#${id}">Remove</button>
      </li>
    `
  )

})

app.delete('/goal/:id' , (req , res)=>{
  const id = req.params.id;
  console.log(id);
  let index = courseGoals.findIndex(goal => goal.id === id);
  courseGoals.splice(index,1);
  res.send();
})

app.listen(3000);
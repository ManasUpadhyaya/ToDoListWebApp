import express from "express";
import mongoose from "mongoose";

mongoose.connect("mongodb+srv://<username>:<password>@cluster0.48ysq9y.mongodb.net/ToDo-List-Data-Base",{useNewUrlParser: true});
const app = express();
const port = 3000;
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));





//DataBase
const TaskSchema = {
  name: String,
  description: String,
  dueDate: String,
  category: String,
};

const ListSchema = {
  name: String,
};

const Tasks = mongoose.model("task", TaskSchema);
const Lists = mongoose.model("list" , ListSchema);
let tasks = [];
let lists = [];

app.get("/", async (req, res) => {
  try {
    const items = await Lists.find({});
    lists = items;
    res.render("index.ejs", { task: lists });
  } catch (error) {
    console.error(error);
    // Handle the error appropriately, e.g., by sending an error response
  }
});

app.post("/addCategory", (req,res)=>{
  console.log(req.body);
  const x = {
    name: req.body.newCategory,
  }
  Lists.insertMany([x]);
  const url = "/"+ req.body.newCategory;
  res.redirect(url);
});

app.get("/:category", async (req, res) => {
  try {
    // const items = ;
    // tasks = items;
    // res.render("index.ejs", { task: tasks });
    const items1 = await Lists.find({});
    lists = items1;
    const items2 = await Tasks.find({ category: req.params.category}).exec();
    tasks = items2;

    res.render("daily.ejs",{heading: req.params.category, task: lists, data: tasks});
  } catch (error) {
    console.error(error);
    // Handle the error appropriately, e.g., by sending an error response
  }
});

app.post("/:category", async (req, res) => {
  try {
    const x= {
      name: req.body["task-name"],
      description: req.body.description,
      dueDate: req.body["due-date"],
      category: req.params.category,
    }

    Tasks.insertMany([x]);
    const url = "/"+req.params.category;
    res.redirect(url);
  } catch (error) {
    console.error(error);
    // Handle the error appropriately, e.g., by sending an error response
  }
});

app.post("/delete/:category",(req,res)=>{

  console.log(req.body); 
    Tasks.findByIdAndDelete(req.body.id)
    .then(() => {
      console.log("Succesfully deleted checked item from the database");
    })
    .catch((err) => {
      console.log(err);
    });
    
    const url = "/"+req.params.category;
    res.redirect(url);
});

app.post("/deletelist/:category",(req,res)=>{ 
    Lists.deleteMany({name: req.params.category})
    .then(() => {
      console.log("Succesfully deleted checked items from the database");
    })
    .catch((err) => {
      console.log(err);
    });

    Tasks.deleteMany({category: req.params.category})
    .then(() => {
      console.log("Succesfully deleted checked tasks from the database");
    })
    .catch((err) => {
      console.log(err);
    });
    
    const url = "/";
    res.redirect(url);

});


app.listen(port,()=>{
    console.log(`Listening to port ${port}`)
});



const express = require("express");
const bodyParser = require("body-parser");
//const date = require(__dirname+"/date.js");
const _ = require("lodash");
const mongoose = require("mongoose");

const app = express();

// const items=[];
// const workItems=[];

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://jai0651:shankarj952@cluster0.6ogv0.mongodb.net/todolistDB");

const itemsSchema = {
    name:String
};

const  Item   = mongoose.model("Item",itemsSchema);
const add = new Item({
    name:"add item using plus sign"
});

const del = new Item({
    name:"<--checkbox to delete items"
});

const access = new Item({
    name:"access different sections using different route"
});

const defaultItems = [add,del,access];

const listSchema = {
    name:String,
    items: [itemsSchema]
};

const List = mongoose.model("List",listSchema);


app.get("/",function(req,res){
   // let day =date.getDate();
   // res.render("list",{listTitle: day,newListItems:items});
   
   Item.find({},function(err,foundItems){

    if(foundItems.length===0){
      Item.insertMany(defaultItems,function(err){
        if(err){
            console.log(err);
        }else{
            console.log("successfully inserted deafult items to database");
         }
       });
       res.redirect("/");
    }else{
        res.render("list",{listTitle: "Today",newListItems:foundItems});
    }
   }); 
});

app.get("/:customListName",function(req,res){
    const customListName = _.capitalize(req.params.customListName);
    List.findOne({name:customListName},function(err,foundList){
        if(!err){
            if(!foundList){
                //create new list
                const list = new List({
                    name:customListName,
                    items:defaultItems
                });
                
                list.save();
                res.redirect("/" + customListName);
            }else{
                //show the existing list
                res.render("list",{listTitle:foundList.name ,newListItems:foundList.items})
            }
        }
    });
});



app.post("/" , function(req,res){
    let itemName= req.body.newItem; 
    const listName = req.body.list;
    let item = new Item({
        name:itemName
    })
    if(listName==="Today"){
        item.save();
        res.redirect("/");
    }else{
        List.findOne({name:listName}, function(err,foundList){
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        });
    }
       
});

app.post("/delete",function(req,res){
   const checkedItemId = req.body.checkbox;
   const listName = req.body.listName;

   if(listName==="Today"){
    Item.findByIdAndRemove(checkedItemId,function(err){
        if(err){
            console.log(err);
        }else{
            console.log("successfully deleted the item");
            res.redirect("/");
        }
    })
   }else{
       List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}},function(err,foundList){
           if(!err){
               res.redirect("/"+listName);
           }
       })
   }

   
})



// app.get("/work",function(req,res){
//     res.render("list",{listTitle:"Work List",newListItems:workItems});
// })

// app.get("/about",function(req,res){
//     res.render("about"); 
// })

// let port = process.env.PORT;
// if (port == null || port == "") {
//   port = 3000;
// }

// app.listen(port,function(){
//     console.log("server started successfully");
// });
const server = app.listen(process.env.PORT || 5000, () => {
    const port = server.address().port;
    console.log(`Express is working on port ${port}`);
  });
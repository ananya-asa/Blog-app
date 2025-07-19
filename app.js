import express from "express";
import bodyParser from "body-parser";
import fs, { readFileSync } from "fs";

const app=express();
const port=5000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

let Posts=[];

try{
    const data=fs.readFileSync("posts.json","utf8");
    Posts=JSON.parse(data);
    console.log("posts loaded!!")
}
catch{
    console.log("No posts found!!!")
}

function savePostsync(){
    fs.writeFileSync("posts.json",JSON.stringify(Posts,null,2));
}

app.get("/",(req,res)=>{
    res.render("home.ejs",{posts:Posts});
})

app.get("/new",(req,res)=>{
    
    res.render("new.ejs");
});

app.post("/new",(req,res)=>{
    let date = new Date();
    
    let post1=req.body["title"]
    let post2=req.body["Content"]
    
    let newpost={
    title:post1,
    Content:post2,
    id:date.toISOString(),
};
Posts.push(newpost);
  savePostsync();
res.redirect("/");
console.log(Posts)

})


app.post("/edit",(req,res)=>{
    let foundPost=null;
    const thatPost=req.body["id"]
    Posts.forEach(function(post){
        if (post.id==thatPost){
            foundPost=post;
        }
    })
        if (foundPost){
            res.render("edit.ejs",{post:foundPost})
            
        }
        else{
            console.log("Post not found!!")
            res.send("Post not found!!")
        }
    })


app.post("/delete",(req,res)=>{
const DeletePostId=req.body.id;
const index=Posts.findIndex(post=>post.id==DeletePostId);
if(index!==-1){
    Posts.splice(index,1);
      savePostsync();

    res.redirect("/")
}
else{
    res.send("Post is not found to delete");
}
})


app.post("/update",(req,res)=>{
   const {id,title,Content}=req.body;
   const UpdatePost=Posts.find(post=>post.id==id);

if(UpdatePost){
    UpdatePost.title=title;
    UpdatePost.Content=Content;
    savePostsync();
    res.redirect("/")
}
   else{
    res.send("Post  not found for Update!!")
   }
})

app.listen(port,()=>{
    console.log(`The server is running at port ${port}.`);
})
const http=require("http");
//const mysql2=require("mysql2");
const fs=require("fs");
const path=require("path");
const url=require("url");
const hbs=require("hbs");

// create a connection to database
// const connection=mysql2.createConnection({
//     host:'localhost',
//     user:'root',
//     password:'lakshmi',
//     database:'nodedb1'
// })
//  //connect to mysql database

//  connection.connect((err)=>{
//     if(err){
//         console.error("Error connecting to MySQL:",err)
//     }
// else{
//     console.log("connected to MySQL Database");

// }
// });


//create http server
http.createServer((req,res)=>{
    const reqUrl=url.parse(req.url,true);
    if(reqUrl.pathname==='/'){
        const filePath=path.join(__dirname,"home.html");
        fs.readFile(filePath,"utf8",(err,data)=>{
            if(err){
                res.writeHead(500).end("Error loading home page");
            }else{
                
                res.writeHead(200,{"Content-Type":"text/html"});
                console.log("success")
                res.end(data);
            }
        })
    }

 else if(reqUrl.pathname==="/form"){
   
        const filePath=path.join(__dirname,"form.html");
        fs.readFile(filePath,"utf8",(err,data)=>{
            if(err){
                res.writeHead(500).end("Error loading form");
            }else{
                
                res.writeHead(200,{"Content-Type":"text/html"});
                console.log("success")
                res.end(data);
            }
        
        })
    }
    else if(req.method=== 'POST' && reqUrl.pathname=== '/submit-form'){
       let body='';
       req.on('data',chunk=>{
        body=body+chunk.toString();
       });
       req.on('end'.at,()=>{
        const formData=new URLSearchParams(body);
        const name=formData.get('name');
        const email=formData.get('email');
        const message=formData.get('message');
        const createTableQuery="create table if not exists fromdata(id int auto_increament primnary key,name varchar(255),email varchar(255),message text)";
        db.query(createTableQuery,(error,results)=>{
         if(error){
            console.error("error creating table:",error);
            res.writeHead(500).end("error creating table");
         }
         else{
            console.log("Table created successfully")
         }
        });
    })

         const insertTableQuery=`insert into formdata(name,email,message) values(?,?,?)`;
         db.query(insertTableQuery,[name,email,message],(error,results)=>{
          if(error){
             console.error("error creating table:",error);
             res.writeHead(500).end("error creating table");
          }
          else{
             console.log("data inserted successfully")
          res.writeHead(302,{'Location':'/'});
          res.end();
            }
         })
        }
   
         else if(reqUrl.pathname==='/display-data'){
            db.query("select * from formdata",(error,results)=>{
                if(error){
                    console.error("Error fetching data:",error);
                    res.writeHead(500).end("Error fetching data");
               }
               else{
                fs.readFile('template.html','utf8',(err,templateData)=>{
                if(err){
                res.writeHead(500).end("Error reading template file");
            }else{
                //using a template engine like Handlebars
                const template=hbs.compile(templateData);
                const renderedPage=template({data:results});
                res.writeHead(200,{"content-type":text/html});
                res.end(renderedPage);
            }
            });
            }
         })
        }
        else if(reqUrl.pathname==='/data-updation'){
            db.query("select name from formdata",(error,results)=>{
                if(error){
                    console.error("Error fetching names:",error);
                    res.writeHead(500).end("Error fetching names");
               }
               else{
                const name=results.map(row=>row.name);
                const filePath=path.join(__dirname,"update.html");
                fs.readFile(filePath,'utf8',(err,data)=>{
                if(err){
                res.writeHead(500).end("Error loading form");
            }else{
                //using a template engine like Handlebars
                const template=hbs.compile(data);
                const renderedForm=template({name:name});
                res.writeHead(200,{"content-type":text/html});
                res.end(renderedForm);
            }
            });
            }
         })
        }
    
        else if(req.method=== 'POST' && reqUrl.pathname=== '/updata-data'){
            let body='';
            req.on('data',chunk=>{
             body=body+chunk.toString();
            });
            req.on('end'.at,()=>{
             const formData=new URLSearchParams(body);
             const id=formData.get('id');
             const name=formData.get('name');
             const email=formData.get('email');
             const message=formData.get('message');
             const updateTableQuery="update formdata set email=?,message=? where name=?";
             db.query(updateTableQuery,[email,message,name],(error,results)=>{
              if(error){
                 console.error("error updating table:",error);
                 res.writeHead(500).end("error updating table");
              }
              else{
                 console.log("Data updated successfully");
                 res.writeHead(302,{'Location':'/'});
                 res.end();
              }
             });
         })
        }

    else if(reqUrl.pathname==='/data-delete'){
            db.query("select name from formdata",(error,results)=>{
                if(error){
                    console.error("Error fetching data:",error);
                    res.writeHead(500).end("Error fetching data");
               }
               else{
                const name=results.map(row=>row.name);
                const filePath=path.join(__dirname,"delete.html");
                fs.readFile(filePath,'utf8',(err,templateData)=>{
                if(err){
                res.writeHead(500).end("Error loading form");
            }else{
                //using a template engine like Handlebars
                const template=hbs.compile(templateData);
                const renderedPage=template({name:name});
                res.writeHead(200,{"content-type":text/html});
                res.end(renderedForm);
            }
            });
            }
         })
        }
         
        else if(req.method=== 'POST' && reqUrl.pathname=== '/delete-data'){
            let body='';
            req.on('data',chunk=>{
             body=body+chunk.toString();
            });
            req.on('end',()=>{
             const formData=new URLSearchParams(body);
            
             const name=formData.get('name');
             
             const deleteTableQuery="delete from formdata  where name=?";
             db.query(deleteTableQuery,[name],(error,results)=>{
              if(error){
                 console.error("error deleting data:",error);
                 res.writeHead(500).end("error deleting data");
              }
              else{
                 console.log("Data deleted successfully");
                 res.writeHead(302,{'Location':'/'});
                 res.end();
              }
             });
         })
        }

        else if(reqUrl==='/' || reqUrl.pathname==='/home'){
            //serve the home page
            const homeFilePath=path.join(__dirname,"home.html");
            fs.readFile(homeFilePath,'utf8',(err,data)=>{
                if(err){
                    res.writeHead(500).end("Error loading home Page");
                }
                else{
                    res.writeHead(200,{"content-type":"text/html"});
                    res.end(data);
                }
            });
        }
        else{
            res.writeHead(404).end('Not Found');
        }
  
    }).listen(8000,()=>{
        console.log("Server is running on http://localhost:8000");
    })
 
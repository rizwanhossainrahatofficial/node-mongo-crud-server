const express=require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors=require('cors');
const ObjectId=require('mongodb').ObjectId;


const app=express();
const port=5000;

// middle wear
app.use(cors());
app.use(express.json());


// user:mydbuser1
// pass:UTdh8uUcndBUwbBu



const uri = "mongodb+srv://mydbuser1:UTdh8uUcndBUwbBu@cluster0.iwcqk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


// async await use kore data mongo db te pathano
async function run() {
    try {
      await client.connect();
      const database = client.db("foodMaster");
      const usersCollection = database.collection("users");

    //   get api server site thake client site a data dakhanor jonno
        app.get('/users',async(req,res)=>{
            const cursor=usersCollection.find({});
            const users=await cursor.toArray();
            res.send(users)
        });

        // update status  id diye route a pathanor jonno
        app.get('/users/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)}
            const user=await usersCollection.findOne(query)
            console.log(id)
            res.send(user)
        });

        // update  state ,state take niye update korar jonno
        app.put('/users/:id',async(req,res)=>{
            const id=req.params.id;
            const updatedUser=req.body;
            const filter={_id:ObjectId(id)};
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                 name:updatedUser.name,
                 email:updatedUser.email
                },
              };
              const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result)
        })


    //   post api load data client site to server site
    app.post('/users',async(req,res)=>{
        const newUser=req.body;
        const result=await usersCollection.insertOne(newUser);
                console.log('got new user',req.body);
            console.log('added new user',result);
        res.json(result);
    });

    // delete api
    app.delete('/users/:id',async(req,res)=>{
        const id=req.params.id;

        const query={_id:ObjectId(id)};
        const result=await usersCollection.deleteOne(query);

        console.log('deleted id ',result)

        res.json(result)
    })

    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);


// simple vhabe data mongodb te pathanor system
// client.connect(err => {
//   const collection = client.db("foodMaster").collection("users");
//   // perform actions on the collection object
//   console.log('hiting the database')
//   const user={name:'sakib',email:'sakib@gmail.com',phone:'01520485211'}
//   collection.insertOne(user)
//     .then(()=>{
//         console.log('insert success')
//     })
// //   client.close();
// });



app.get('/',(req,res)=>{
    res.send('running my crud')
});

app.listen(port,()=>{
    console.log('running server on port',port)
});

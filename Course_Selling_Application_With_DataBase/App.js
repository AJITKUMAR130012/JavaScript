
const express=require("express")
const jwt=require("jsonwebtoken")
const mongoose=require("mongoose")
const app=express()

app.use(express.json());
const SECRET='my-scret-key'; //This should be in an enviroment variable

const userScema= new mongoose.Schema({
    username:{type:String},
    password:{type:String},
    purchasedCourses:[{type:mongoose.Schema.Types.ObjectId, ref:'Course'}]
})

const adminScema= new mongoose.Schema({
    username:String,
    password:String,
})

const courseSchema= new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    imageLink: String,
    published: Boolean
})
//Define mongoose model
const User=mongoose.model('User', userScema)
const Admin=mongoose.model('Admin', adminScema)
const Course=mongoose.model('Course', courseSchema)

const authenticateJwt = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      jwt.verify(token, SECRET, (err, user) => {
        if (err) {
          return res.sendStatus(403);
        }
        req.user = user;
        next();
      });
    } else {
      res.sendStatus(401);
    }
  };

  //mongoose.connect('mongodb+srv://Ajit:gADV25GP%5Fm.M3@y@cluster0.idimbk5.mongodb.net/Courses', { dbName: "Courses" });

  mongoose.connect('mongodb+srv://Ajit:Qr3oipzkXf20hj1v@cluster0.idimbk5.mongodb.net/', {
    
  dbName: "Courses"
});

   app.post('/admin/signup', async (req, res) => {
    const { username, password } = req.body;
    const admin=await Admin.findOne({ username });
    
      if (admin) {
        res.status(403).json({ message: 'Admin already exists' });
      } else {
        const obj = { username: username, password: password };
        const newAdmin = new Admin(obj);
        await newAdmin.save();
        const token = jwt.sign({ username, role: 'admin' }, SECRET, { expiresIn: '1h' });
        res.json({ message: 'Admin created successfully', token });
      }
  
    })

    app.get('/admin/list', async (req, res) => {
      try {
          const allAdmins = await Admin.find();
          res.json(allAdmins);
      } catch (error) {
          // Handle the error, e.g., send an error response
          res.status(500).json({ error: 'Internal Server Error' });
      }
  });

  app.delete('/admin/delete/:id', async (req, res) => {
    const adminId = req.params.id;

    try {
        const deletedAdmin = await Admin.deleteOne({ _id: adminId });

        if (deletedAdmin.deletedCount === 1) {
            res.json({ message: 'Admin deleted successfully' });
        } else {
            res.status(404).json({ error: 'Admin not found' });
        }
    } catch (error) {
        // Handle the error, e.g., send an error response
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


    app.post('/admin/login', async (req, res) => {
        const {username, password} = req.headers;
        
        const admin = await Admin.findOne({username, password });
       
        if (admin) {
          const token = jwt.sign({ username, role: 'admin' }, SECRET, { expiresIn: '1h' });
          res.json({ message: 'Logged in successfully', token });
        } else {
          res.status(403).json({ message: 'Invalid username or password' });
        }
      });
      app.post('/admin/courses', authenticateJwt, async (req, res) => {
        const newCourse=req.body;
        const isCoursePresent = Course.findOne(newCourse)
        if(isCoursePresent)
        {
        res.status(403).json({ message: 'Course Already Exist' });
        }
        else{
          const course = new Course(newCourse);
        await course.save();
        res.json({ message: 'Course created successfully', courseId: course.id });

        }
        
      
      });

      app.put('/admin/courses/:courseId', authenticateJwt, async (req, res) => {
        console.log(req.params.courseId)
        const course = await Course.findByIdAndUpdate(req.params.courseId, req.body, { new: true });
        if (course) {
          res.json({ message: 'Course updated successfully' });
        } else {
          res.status(404).json({ message: 'Course not found' });
        }
      });

      // User routes
app.post('/users/signup', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user) {
      res.status(403).json({ message: 'User already exists' });
    } else {
      const newUser = new User({ username, password });
      await newUser.save();
      const token = jwt.sign({ username, role: 'user' }, SECRET, { expiresIn: '1h' });
      res.json({ message: 'User created successfully', token });
    }
  });

  app.post('/users/login', async (req, res) => {
    const { username, password } = req.headers;
    const user = await User.findOne({ username, password });
    if (user) {
      const token = jwt.sign({ username, role: 'user' }, SECRET, { expiresIn: '1h' });
      res.json({ message: 'Logged in successfully', token });
    } else {
      res.status(403).json({ message: 'Invalid username or password' });
    }
  });
  // User get all the published list of the course
  app.get('/users/courses', authenticateJwt, async (req, res) => {
    const courses = await Course.find({published: true});
    console.log(courses)
    res.json({ courses });
  });
  // User buy the course by giving the courseId
  app.post('/users/courses/:courseId', authenticateJwt, async (req, res) => {
    const course = await Course.findOne({_id:req.params.courseId, published: true});
     console.log(course)
    if (course) {
      const user = await User.findOne({ username: req.user.username });
      console.log("User")
      console.log(user)
      if (user) {
        let isPurchased= user.purchasedCourses.find(courseId => courseId.toString() === req.params.courseId);
        console.log(isPurchased)

        if(isPurchased)
        {
          res.json({ message: 'Course already purchased'});
        }
        else{
          user.purchasedCourses.push(course);
          await user.save();
          res.json({ message: 'Course purchased successfully' });
        }
      } else {
        res.status(403).json({ message: 'User not found' });
      }
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  });
  
  app.get('/users/purchasedCourses', authenticateJwt, async (req, res) => {
    const user = await User.findOne({ username: req.user.username }).populate('purchasedCourses');
    if (user) {
      res.json({ purchasedCourses: user.purchasedCourses || [] });
    } else {
      res.status(403).json({ message: 'User not found' });
    }
  });
  
  app.listen(3000, () => console.log('Server running on port 3000'));

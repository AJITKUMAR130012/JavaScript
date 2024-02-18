const express = require('express');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const adminAuthentication=(req, res,next)=>{
    const admin=req.headers.username;
    const pass=req.headers.password;
    console.log(admin)
    console.log(pass)
 // const admin = ADMINS.find(a => a.username === username && a.password === password);

    const isValidAdmin=ADMINS.find((a)=> a.username=== admin && a.password===pass)
    //console.log(isValidAdmin)
    if(isValidAdmin)
    {
        next();
    }
    else
    {
        res.status(403).json({message:"Admin does't exist"})
    }
}

//body Structure
/*
{ username: 'admin', password: 'pass' }
*/
// Admin routes
app.post('/admin/signup', (req, res) => {
    const admin=req.body;
    const isAdminExist=ADMINS.find(a=>a.username===admin.username)
    if(isAdminExist)
    {
        res.status(403).json({ message: 'User of this name already exist' });
    }
    else{
        ADMINS.push(admin)
        res.json({ message: 'Admin created successfully' })
    }
  // logic to sign up admin
});

app.post('/admin/login', adminAuthentication, (req, res) => {
  // logic to log in admin
  res.json({ message: 'Logged in successfully' })
});
let cn=0
app.post('/admin/courses', adminAuthentication, (req, res) => {
  // logic to create a course
   course=req.body;
   const courseExist=COURSES.find((a)=> a.imageLink===course.imageLink)
   if(courseExist)
   {
    res.status(403).json("Subject Already exist!Please add the new subject")
    return;
   }
   course.id=cn++;
   COURSES.push(course)
   res.json({message: 'Course created successfully', courseId: cn })
});

app.put('/admin/courses/:courseId',adminAuthentication, (req, res) => {
  // logic to edit a course
  //We have to mes.json("User Already exist")odify the existing objet
  course=req.params.courseId;
  console.log(course)
  courseExist=COURSES.find((a)=> a.id==course)
  console.log(courseExist)
  if(!courseExist)
  {
    res.status(403).json("Object does't exist")
  }
  else{
    Object.assign(courseExist, req.body)
    res.json(COURSES)
  }
});

app.get('/admin/courses',adminAuthentication, (req, res) => {
  res.json(COURSES)
  // logic to get all courses
  
});

const userAuthentication=(req,res,next)=>
{
  
  let user=req.headers.username;
  let pass=req.headers.password;
  console.log(user)
  console.log(pass)
   user=USERS.find((a)=> a.username===user && pass===a.password)
  console.log(user)
  if(user)
  {
    req.user = user; 
    next()
    return;
  }
  else{

    res.json("Invalid User")
    return;
  }

}


// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  user={
    username:req.body.username,
    password:req.body.password,
    purchasedCourses:[]
  }
  userExist=USERS.find((a)=> user.username===a.username)
  if(userExist)
  {
    res.json("User Already Exist of this name")
    return
  }
  else{
    USERS.push(user)
    res.json(USERS)
  }
});

app.post('/users/login', userAuthentication, (req, res) => {
  // logic to log in user
  res.json("Login Successfull")

});

app.get('/users/courses', userAuthentication,(req, res) => {
  // logic to list all courses
  let filterdCourse=[]
  for(let i=0;i<COURSES.length;i++)
  {
    if(COURSES[i].published)
    {
      filterdCourse.push(COURSES[i])
    } 
  }
  res.json(filterdCourse)
});
//This is the function to buy to the courses by the user by the given courseId
app.post('/users/courses1/:courseId', userAuthentication, (req, res) => {
  // logic to purchase a course
  let user = req.user;
  let courseId = Number(req.params.courseId); // Use req.query for query parameters
  course=COURSES.find((x)=> courseId==x.id)
  if(course)
  {
    user.purchasedCourses.push(courseId);
    res.json(USERS);
    return;
  }
  else{
    res.json("There is no course")
  }
});

app.get('/users/purchasedCourses',userAuthentication, (req, res) => {
  // logic to view purchased courses
  const user=req.user;
  purched=user.purchasedCourses;
  let n=purched.length;
  res.json(purched)
});
app.listen(3001, () => {
  console.log('Server is listening on port 3000');
});
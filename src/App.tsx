import { Routes, Route } from "react-router-dom";
import './globals.css';
import AuthLayout from "./_auth/AuthLayout";
import SigninForm from "./_auth/forms/SigninForm";
import SignupForm from "./_auth/forms/SignupForm";
import { Home } from "./_root/pages";
import RootLayout from "./_root/RootLayout";



const App = () => {
  return (
    <main className="flex h-screen">
      <h1>Hello dan</h1>
       <Routes>
        {/* public routes */}
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SigninForm />} />
          <Route path="/sign-up" element={<SignupForm />} />
        </Route>

        {/* <Route element={<RootLayout />}> */}
        {/* private routes */}
          {/* <Route index element={<Home />} /> */}
          {/* <Route path="/explore" element={<Explore />} /> */}
          {/* <Route path="/saved" element={<Saved />} /> */}
          {/* <Route path="/all-users" element={<AllUsers />} /> */}
          {/* <Route path="/create-post" element={<CreatePost />} /> */}
          {/* <Route path="/update-post/:id" element={<EditPost />} /> */}
          {/* <Route path="/posts/:id" element={<PostDetails />} /> */}
          {/* <Route path="/profile/:id/*" element={<Profile />} /> */}
          {/* <Route path="/update-profile/:id" element={<UpdateProfile />} /> */}
        {/* </Route> */}
      </Routes>  
       {/* <Toaster /> */}
    </main>
  );
};

export default App;
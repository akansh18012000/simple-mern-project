import React, { Suspense, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate} from "react-router-dom";
import Users from "./users/pages/Users";
// import NewPlace from "./places/pages/NewPlace";
// import UsersPlaces from "./places/pages/UsersPlaces";
// import UpdatePlace from "./places/pages/UpdatePlace";
// import Auth from "./users/pages/Auth";
import Header from "./shared/components/Header";
import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/useAuth";

// Lazy Loading the Pages which doesn't have to loaded on the first load. This way we get a smaller main chunk which is downloaded everytime we load a page.

const NewPlace = React.lazy(() => import('./places/pages/NewPlace'));
const UsersPlaces = React.lazy(() => import('./places/pages/UsersPlaces'));
const UpdatePlace = React.lazy(() => import('./places/pages/UpdatePlace'));
const Auth = React.lazy(() => import('./users/pages/Auth'));

const App = () => {
  
  const [token, login, logout, userId] = useAuth()

  return (
    <AuthContext.Provider value={{isLoggedIn: !!token, login: login, logout: logout, userId: userId, token: token}}>
      <Router>
        <Header/>
        {/* Suspense component is required to Lazy Load the components and show a fallback component if the component is still loading */}
        <Suspense fallback={<div className="flex justify-center w-full">Loading</div>}>
          <Routes>
            <Route path="/" element={<Users/>}/>
            <Route path="/places/new" element={<NewPlace/>}/>
            <Route path="/places/:placeId" element={<UpdatePlace/>}/>
            <Route path="/:userId/places" element={<UsersPlaces/>}/>
            <Route path="/auth" element={<Auth/>}/>
            <Route path="*" element={<Navigate to = "/"/>}/>
          </Routes>
        </Suspense>
      </Router>

    </AuthContext.Provider>
  );
}

export default App;

import React, { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";

import { store } from "./redux/store";
import ability from "./configs/acl/ability";
import { AbilityContext } from "./utility/context/Can";
import Spinner from "./@core/components/spinner/Fallback-spinner";
import "./index.scss"
const LazyApp = lazy(() => import("./App"));

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  // <StrictMode>
      <BrowserRouter>
        <Provider store={store}>
          <Suspense fallback={<Spinner />}>
             <AbilityContext.Provider value={ability}>
                <LazyApp />
                <Toaster position={'top-right'} toastOptions={{ className: "react-hot-toast" }} />
             </AbilityContext.Provider>
          </Suspense>
         </Provider>
      </BrowserRouter>
  // </StrictMode>
);


import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import PriceTracker from "./components/PriceTracker.tsx"
function App() {


  return (
    <div>
      <PriceTracker/>
    </div>
  )
}

export default App

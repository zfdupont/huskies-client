import './App.css';
import * as React from 'react';
import MainTab from './common/MainTabPanel';
import Box from '@mui/material/Box';
import MainDrawer from './common/MainDrawer';


function App() {
  return (
      <Box sx={{position:"absolute", width: '100%', height:"100%"}}>
          <Box sx={{position:"relative", height:"100%", marginLeft: '240px'}}>
              <MainTab/>
          </Box>
          <MainDrawer/>
      </Box>
  );
}

export default App;

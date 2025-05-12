import { Routes, Route } from 'react-router-dom';
import PlanChange from './components/PlanChange/PlanChange';
import PlanDetails from './components/PlanDetails/PlanDetails';
import './App.css';

function App() {
    return (
        <div className="app">
            <Routes>
                <Route path='/' element={<PlanChange />} />
                <Route path='/plan/:planId' element={<PlanDetails />} />
            </Routes>
        </div>
    );
}

export default App;
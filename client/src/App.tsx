import { Routes, Route } from 'react-router-dom';
import PlanChange from './components/PlanChange/PlanChange';
import CreatePlan from './components/CreatePlan/CreatePlan';
import EditPlan from './components/EditPlan/EditPlan';
import TestPlan from './components/TestPlan/TestPlan';
import PreviewPrompt from './components/Preview Prompt/PreviewPrompt';
import './App.css';

function App() {
    return (
        <div className="app">
            <Routes>
                <Route path='/' element={<PlanChange />} />
                <Route path='/plan/new' element={<CreatePlan />} />
                <Route path='/plan/:planId' element={<EditPlan />} />
                <Route path='/test/:planId' element={<TestPlan />} />
                <Route path='/preview/:planId' element={<PreviewPrompt />} />
            </Routes>
        </div>
    );
}

export default App;
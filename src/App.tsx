import React, { useState } from "react";
import { Select, SelectOption } from "./Select";
import options from './mockOptions';

function App () {
    const [singleSelectValue, setSingleSelectValue] = useState<SelectOption | undefined>(options[0]);
    const [multiSelectValue, setMultiSelectValue] = useState<SelectOption[] | []>([options[0]]);
    return (
        <>
            <h1 style={{margin: '2em 0 .75em', fontSize: '1.5em'}}>Accessible single/multiselect component in React.js/TypeScript</h1>
            <p style={{margin: '0 0 .1em',}}>Space or Enter to open/close or select option</p>
            <p style={{margin: '0 0 1.5em',}}>Arrow Up/Arrow Down to navigate between options</p>
            <Select value={singleSelectValue} options={options} onChange={option => setSingleSelectValue(option)} />
            <br/>
            <Select multiple value={multiSelectValue} options={options} onChange={option => setMultiSelectValue(option)} />
        </>
    );
}

export default App;

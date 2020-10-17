import React, {useEffect, useState} from 'react';
import {setHours, addDays, format, parse, startOfWeek , getDay} from 'date-fns';
import {enUS} from 'date-fns/locale';
import {Calendar, dateFnsLocalizer} from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import logo from './logo.svg';
import './App.css';
import {readSpreadsheet} from './Sheets';



const locales = {
  'en-US': enUS,
}

function hour2datetime(date, hour){
  if(hour){
    return setHours(date, hour)
  }
}

function row2event(row){
  
}

function parseRowData(rowData){
  return {
    name: rowData.name,
    note: rowData.note,
    possible: rowData.possible,
    moFrom: rowData['mo-from'],
    moUntil: rowData['mo-until'],
    moBreak: rowData['mo-break'],
    moH: rowData['mo-h'],
    tuFrom: rowData['tu-from'],
    tuUntil: rowData['tu-until'],
    tuBreak: rowData['tu-break'],
    tuH: rowData['tu-h'],
    weFrom: rowData['we-from'],
    weUntil: rowData['we-until'],
    weBreak: rowData['we-break'],
    weH: rowData['we-h'],
    thFrom: rowData['th-from'],
    thUntil: rowData['th-until'],
    thBreak: rowData['th-break'],
    thH: rowData['th-h'],
    frFrom: rowData['fr-from'],
    frUntil: rowData['fr-until'],
    frBreak: rowData['fr-break'],
    frH: rowData['fr-h'],
  }
}

function Row(row){
  const rowData=row.row;
  const parsedRow = parseRowData(rowData);
return (<p>{`Name ${parsedRow.name} from:${parsedRow.moFrom} to: ${parsedRow.moUntil}`}</p>);
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

const MyCalendar = props => (
  <div>
    <Calendar
      localizer={localizer}
      events={[]}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 1200 }}
    />
  </div>
)

function App() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    readSpreadsheet().then(rows=>setRows(rows));
  }, [])


  return (
    <div className="App">
      <MyCalendar/>
        {rows.map((row, idx)=><Row key={idx} row={row}/>)}
    </div>
  );
}

export default App;

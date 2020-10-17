import React, {useEffect, useState} from 'react';
import {setHours, addDays, format, parse, startOfWeek , getDay, addHours} from 'date-fns';
import {enUS} from 'date-fns/locale';
import {Calendar, dateFnsLocalizer} from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import './App.css';
import {readSpreadsheet} from './Sheets';



const locales = {
  'en-US': enUS,
}

function parseRowData(rowData){
  return {
    name: rowData.name,
    note: rowData.note,
    possible: rowData.possible,
    resource:rowData.resource,
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
return (<p>{`Name ${parsedRow.name} from:${parsedRow.moFrom} to: ${parsedRow.moUntil} This week start: ${startOfWeek(new Date())}`}</p>);
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

const resourceMap = [
  { resourceId: 'visual', resourceTitle: 'Visual' },
  { resourceId: 'store', resourceTitle: 'Store' },
  { resourceId: 'warehouse', resourceTitle: 'Warehouse' },
  { resourceId: 'managers', resourceTitle: 'Managers' },
  { resourceId: 'cashier', resourceTitle: 'Cashier' },
]

const MyCalendar = props => (
  
  <div>
    <Calendar
      localizer={localizer}
      events={props.events}
      defaultView={'week'}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 1200 }}
      resources={resourceMap}
      resourceIdAccessor="resourceId"
      resourceTitleAccessor="resourceTitle"
    />
  </div>
)

const workdays =[1,2,3,4,5,6];
const workdayMap= {1:'mo',2:'tu',3:'we',4:'th',5:'fr',6:'sa'}
const workday2label=((day,label)=>`${workdayMap[day]}${label}`);

function row2event(firstDayWeek, row){
  const parsedRow = parseRowData(row);
  const events = 
  workdays.map(day=>{

    const fromHours=parseInt(parsedRow[(workday2label(day,'From'))]);
    const untilHours=parseInt(parsedRow[(workday2label(day,'Until'))]);
    return {
      title: parsedRow.name,
      start: addHours(addDays(firstDayWeek,day),fromHours),
      end: addHours(addDays(firstDayWeek,day),untilHours),
      resourceId: parsedRow.resource,
    }
  })

  return events;
}

function App() {
  const [rows, setRows] = useState([]);
  
  useEffect(() => {
    readSpreadsheet().then(rows=>setRows(rows));
  }, [])

  const firstDayWeek = startOfWeek(new Date());
  const events = rows.map(row=>row2event(firstDayWeek, row)).flat();

  return (
    <div className="App">
      <MyCalendar events={events}/>
        {rows.map((row, idx)=><Row key={idx} row={row}/>)}
    </div>
  );
}

export default App;

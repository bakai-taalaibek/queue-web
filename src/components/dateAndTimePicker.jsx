import { useState } from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"
import ru from 'date-fns/locale/ru'
import { useServiceChooser } from "../utilities/zustand"
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import dayjs from 'dayjs';
import arrow from '../assets/arrow.svg'
import { useNavigate } from 'react-router-dom'


export const DateAndTimePicker = () => {
  const [appointmentDate, setAppointmentDate] = useState(null)
  const [appointmentTime, setAppointmentTime] = useState(dayjs().set('hour', 9).startOf('hour'))
  const { parameters, setServerResponse, resetSomeState, setIsAppointment, allBranches } = useServiceChooser()
  const navigate = useNavigate()

  const addDays = (date, days) => {
    const initialDate = new Date(date)
    const finalDate = initialDate.setDate(initialDate.getDate() + days)
    return finalDate
  }

  const handleSubmit = () => {
    const year = appointmentDate.getFullYear()
    const month = appointmentDate.getMonth()
    const day = appointmentDate.getDate()
    const hour = appointmentTime.$d.getHours()
    const minute = appointmentTime.$d.getMinutes()
    const chosenTime = new Date(year, month, day, hour, minute)
    const chosenTimeISO = chosenTime.toISOString()
  }

  // To check if today the bank branch is still available for appointment, 
  // we compare current time to working hours
  const currentHour = new Date().getHours()
  const currentMinute = new Date().getMinutes()

  const scheduleDayStartTime = allBranches.find(branch => branch.id === parameters.branch).work_time_start
  const scheduleDayEndTime = allBranches.find(branch => branch.id === parameters.branch).work_time_end
  const scheduleHour = +scheduleDayEndTime.slice(0, 2)
  const scheduleMinute = +scheduleDayEndTime.slice(3, 5)
  
  const handleEnqueue = async () => {
    const result = await mainService.enqueue(parameters)
    await setServerResponse(result)
    console.log(result)
    resetSomeState()
    navigate('../view')
  }

  const handleCancel = () => {
    resetSomeState()
    navigate('/')
  }
  
  let firstDay = new Date() 
  if (currentHour > scheduleHour) {
    firstDay = addDays(firstDay, 1)
  } else if (currentHour === scheduleHour && currentMinute > scheduleMinute) {
    firstDay = addDays(firstDay, 1)
  }

  const lastDay = addDays(firstDay, 6)
  const monthsToShow = new Date(lastDay).getMonth() - new Date(firstDay).getMonth() + 1


  const theme = createTheme({
    // typography: {
    //   fontSize: 12,
    //   fontFamily: "Segoe UI, Helvetica, Arial, sans-serif",
    // },
    // palette: {
    //   primary: {
    //     main: 'rgb(66, 127, 232)',
    //   },
    //   secondary: {
    //     main: '#f44336',
    //   },
    // },    
    components: {
      // MuiInputBase: {
      //   styleOverrides: {
      //     root: {
      //       backgroundColor: "white",
      //       border: 'none',
      //     },
      //     input: {
      //       display: 'flex',
      //       justifyContent: 'center',
      //       textAlign: 'center',
      //       paddingTop: '0',
      //     },
      //   }
      // },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            alignSelf: 'center',
            backgroundColor: "white",
            border: 'none',
            outline: 'none',
            width: '24rem',
            height: '2.5rem',
            paddingLeft: '3rem'
          },
          input: {
            display: 'flex',
            justifyContent: 'center',
            textAlign: 'center',
            paddingTop: '0.3rem',
            paddingBottom: '0.3rem',
            fontSize: '1.3rem'
          },
          '&.Mui-active': {
            border: 'none',
            ouline: 'none',
          }
        }
      },      
      // To move the popup window to the right
      MuiPickersPopper: {
        styleOverrides: {
          root: {
            top: '-140px !important' ,
            left: '317px !important',
          },
        }
      },
      // To prevent scrolling wheel from hiding numbers
      MuiMultiSectionDigitalClockSection: {
        styleOverrides: {
          root: {
            width: '6rem',
          },
          active: {
            border: 'none',
            outline: 'none',
          },
          item: {
            marginLeft: '1.5rem'
          },
          active: {
            border: 'none',
            outline: 'none',
          }
        }
      }
      // MuiPopper: {
      //   styleOverrides: {
      //     root: {
      //       top: '-140px !important' ,
      //       left: '318px !important',
      //     },
      //     select: {
      //       inset: '10px auto auto 0px',
      //       transform: 'translate3d(0,0,0)',
      //       style: { transform: 'translate3d(0,0,0)' },
      //     },
      //   }
      // },
      // MuiPickersLayout: {
      //   styleOverrides: {
      //     root: {
      //       top: '80px',
      //       right: '10px',
      //     },
      //     select: {
      //       inset: '10px auto auto 0px',
      //       transform: 'translate3d(0,0,0)',
      //       style: { transform: 'translate3d(0,0,0)' },
      //     },
      //   }
      // },
    }
  });

  const startTime = dayjs().set('hour', +scheduleDayStartTime.slice(0, 2)).set('minute', +scheduleDayStartTime.slice(3, 5)).set('second', 0)
  const endTime = dayjs().set('hour', +scheduleDayEndTime.slice(0, 2)).set('minute', +scheduleDayStartTime.slice(3, 2) - 15).set('second', 0)
  const currentDate = dayjs().set('hour', 0).set('minute', 0).set('second', 0).set('millisecond', 0)
  const currentTime = dayjs()

  return(
    <div className='glass-container glass-container--grid-3'>
      <button 
        onClick={ () => navigate(-1) } 
        className="arrow arrow--left"
      >
        <img src={ arrow } className="arrow__icon"></img>
      </button> 

      <p className='text'>Выберите дату и время</p>

      <div className='picker' style={{ marginBottom: '1.3rem' }}>
        <DatePicker 
          wrapperClassName="datePicker"
          selected={ appointmentDate } 
          onChange={ (newDate) => setAppointmentDate(newDate) } 
          minDate={ firstDay }
          maxDate={ lastDay }      
          monthsShown={ monthsToShow }
          dateFormat="dd.MM.yyyy"
          calendarStartDay={ 1 }
          locale={ ru }
          popperModifiers={[
            {
              name: "offset",
              options: {
                offset: [ monthsToShow === 2 ? -50 : -30, 0],
              },
            }
          ]}
        />
        {/* <p className='text'>Выберите время</p> */}

        <ThemeProvider theme={ theme }>   
          <LocalizationProvider dateAdapter={ AdapterDayjs }>
            <TimePicker         
              value={ appointmentTime } 
              onChange={ (newTime) => setAppointmentTime(newTime) } 
              ampm={ false }
              minTime={ currentDate.$d - appointmentDate === 0 ? currentTime : startTime }
              maxTime={ endTime }
              // skipDisabled={ true }
              timeSteps={{ minutes: 1}}
              views={['hours', 'minutes']}
              inputProps={{
                style: {
                  backgroundColor: '#202020',
                },
              }}
            />
          </LocalizationProvider>        
        </ThemeProvider> 
      </div>
      
      
      <div className="horisontal-group">
        <div 
          className="button"
          // style={{ display: parameters.is_appointment === false ? 'block' : 'none' }} 
          onClick={ handleCancel }
        >
          Отменить
        </div>
        <div 
          className={`button button--blue ${ appointmentDate ? '' : 'button--disabled' }`}
          onClick={ handleEnqueue }
        >
          Получить талон
        </div>
      </div>


    </div>
  )
}
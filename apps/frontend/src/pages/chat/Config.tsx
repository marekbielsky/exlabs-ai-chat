import Home from "../home/Home.tsx";
import {Link} from "react-router";
import './Config.css'
import {useEffect, useRef} from "react";
import {v4} from "uuid";
import {subMonths, format, lastDayOfMonth, startOfQuarter, endOfQuarter} from "date-fns";

function Config() {
  const timeFormat = 'yyyy-MM-dd';
  const today = new Date();
  const drawerRef = useRef(null);
  const startDateInputRef = useRef(null);
  const endDateInputRef = useRef(null);

  useEffect(() => {
    if (drawerRef.current) {
      drawerRef.current.style.transform = 'translateX(-1190px)';
    }
  }, []);

  const datesToQuery = (start: Date, end = today) => {
    return `?start=${format(start, 'yyyy-MM-01')}&end=${format(lastDayOfMonth(end), timeFormat)}`
  }

  return (
    <>
      <Home/>

      <div className='drawer'>
        <div className='drawer-mask'></div>
        <div className='drawer-content-wrapper chat-config-drawer-size' ref={drawerRef}>
          <div className='drawer-content'>
            <div className='drawer-header'>
              <div>New Founder Update</div>
              <div>
                <Link to='/'>
                  <img src='/close.svg' alt='close'/>
                </Link>
              </div>
            </div>
            <div className='drawer-body'>
              <div className='chat-config-drawer-columns'>
                <div className='drawer-body-section'>
                  <div className='drawer-body-title'>Timescale</div>
                  <div className='chat-config-drawer-buttons'>
                    <button>
                      <Link to={`/chat/${v4()}${datesToQuery(subMonths(today, 2))}` }>
                        Since last update
                      </Link>
                    </button>
                    <button>
                      <Link to={`/chat/${v4()}${datesToQuery(subMonths(today, 1),subMonths(today, 1))}`}>
                        Last month
                      </Link>
                    </button>
                    <button>
                      <Link to={`/chat/${v4()}${datesToQuery(startOfQuarter(subMonths(today, 3)), endOfQuarter(subMonths(today, 3)))}`}>
                        Last quarter
                      </Link>
                    </button>
                  </div>
                  <div className='chat-config-drawer-custom-date'>
                    <div className='chat-config-drawer-custom-date-text'>
                      Or choose a date range
                    </div>
                    <div className='chat-config-drawer-custom-date-picker'>
                      Date Range
                      <input
                        type='date'
                        name='custom-start'
                        placeholder='start'
                        ref={startDateInputRef}
                      />
                      <input
                        type='date'
                        name='custom-end'
                        placeholder='end'
                        ref={endDateInputRef}
                      />
                    </div>
                  </div>
                </div>
                <div className='drawer-body-section'>
                  <div className='chat-config-drawer-infobox'>
                    <div>
                      <img src='/info.svg' alt='info'/>
                    </div>
                    <div>
                      Education / Information
                      <br/>
                      <br/>
                      Lorem ipsum
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Config;
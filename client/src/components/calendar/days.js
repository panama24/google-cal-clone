import React, { useRef, useState } from 'react';
import moment from 'moment';
import { PlaceholderEvent, ScheduledEvents } from './events';
import { Day, Number, NumberWrapper } from './styles';
import Form from '../form';
import Popup from '../popup';
import { getDailyEvents } from '../../shared/helpers';

const DayNumber = ({ day, today }) => day && (
  <NumberWrapper>
    <Number today={today}>
      {day}
    </Number>
  </NumberWrapper>
);

const noop = () => ({});
const DayContainer = ({
  clearFormValues,
  clickableDay,
  currentDate,
  formSubmissionHandler,
  dayIdx,
  deleteEvent,
  isShowing,
  popupId,
  schedulingEvent,
  scheduledEvents,
  selectedDay,
  setId,
  toggle,
  eventAction,
  togglingEventAction,
  viewingEvent,
}) => {
  const [clientRect, setClientRect] = useState({});
  const inputEl = useRef(null);

  const isToday = currentDate.date() === clickableDay && moment().isSame(currentDate, 'month');
  const year = currentDate.year();
  const month = currentDate.month();
  const formatMonth = String(month).length > 1 ? month : `0${month}`;
  const formatDay = String(clickableDay).length > 1 ? clickableDay : `0${clickableDay}`;
  const dateStr = `${year}-${formatMonth}-${formatDay}`;
  const formatDate = moment(dateStr, 'YYYY-MM-DD').add(1, 'month')

  const events = getDailyEvents(scheduledEvents, formatDate);
  const uniquePopupId = `schedule-event-${clickableDay}`;

  const clickHandler = () => {
    const clientRectObj = inputEl.current.getBoundingClientRect();
    setClientRect(clientRectObj);
    schedulingEvent(formatDate, uniquePopupId);
  };

  const isScheduling = isShowing && (popupId ===  uniquePopupId);
  return (
    <>
      <Day ref={inputEl} onClick={() => { clickableDay ?  clickHandler() : noop()}}>
        <DayNumber day={clickableDay} today={isToday} />
        {isScheduling && <PlaceholderEvent eventAction={eventAction} /> }
        <ScheduledEvents
          clickableDay={clickableDay}
          deleteEvent={deleteEvent}
          eventAction={eventAction}
          events={events}
          isShowing={isShowing}
          popupId={popupId}
          toggle={toggle}
          viewingEvent={viewingEvent}
        />
      </Day>
      <Popup
        dayIdx={dayIdx}
        hide={toggle}
        isOpen={isScheduling}
        clientRect={clientRect}
      >
        <Form
          formSubmissionHandler={formSubmissionHandler}
          clearFormValues={clearFormValues}
          day={selectedDay}
          togglingEventAction={togglingEventAction}
        />
      </Popup>
    </>
  );
};

export default DayContainer;

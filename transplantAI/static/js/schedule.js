let calendar_options = {
    displayEventEnd: true,
    // timeFormat: 'hh:mm',
    themeSystem: 'bootstrap5',
    headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'listMonth,dayGridMonth,timeGridWeek'
    },
    selectable: true,
    selectHelper: true,
    select: function (info) {
        $('#fc_create').click();
        console.log(info.startStr+"T09:00:00.00");
        $('#start').val(info.startStr+"T09:00:00.00");
        $('#end').val(info.startStr+"T10:00:00.00");

        // let $('#fc-event-time').val(info.endStr);

        

        console.log(info.startStr, info.endStr);

        let started = info.start;
        let ended = info.end;

        $(".antosubmit").on("click", function () {
            var title = $("#title").val();
            if (info.end) {
                ended = info.end;
            }

            categoryClass = $("#event_type").val();

            if (title) {
                calendar.fullCalendar('renderEvent', {
                    title: title,
                    start: started,
                    end: info.end,
                    allDay: info.allDay
                },
                    true // make the event "stick"
                );
            }


            $('#title').val('');

            calendar.fullCalendar('unselect');

            $('.antoclose').click();

            return false;
        });
    },
    eventClick: function (calEvent, jsEvent, view) {
        console.log(calEvent);
        console.log(calEvent.event.startStr.split('+')[0]+".00");
        $('#fc_edit').click();
        $('#title2').val(calEvent.event.title);
        $('#descr2').val(calEvent.event.extendedProps.description);
        $('#event_edit_id').val(calEvent.event.id);
        $('#start_edit').val(calEvent.event.startStr.split('+')[0]+".00");
        $('#end_edit').val(calEvent.event.endStr.split('+')[0]+".00");

        categoryClass = $("#event_type").val();

        $(".antosubmit2").on("click", function () {
            calEvent.title = $("#title2").val();

            calendar.fullCalendar('updateEvent', calEvent);
            $('.antoclose2').click();
        });

        calendar.fullCalendar('unselect');
    },
    editable: true,
    eventTextColor: '#ffffff',
    eventColor: '#4e73df',
    eventDisplay: 'list-item'
};

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }


function init_calendar() {

    let url = "/get_user_schedule";
    if(getCookie("transplantAI_role") == "Doctor"){
        url = '/get_all_schedule'
    }

    console.log("-------------------------------------------");
    console.log(url);
    console.log("-------------------------------------------");



    fetch(url)
        .then(response => {
            if (!response.ok) {
                alert("Error in getting schedules!")
            }
            return response.json();
        })
        .then(events => {
            let user_schedule = events.map(function (event) {
                return {
                    title: event.title,
                    start: Date.parse(event.start),
                    end: Date.parse(event.end),
                    description: event.description,
                    id: event.id
                };
            });

            var calendarEl = document.getElementById('calendar');
            calendar_options.events = user_schedule;
            var calendar = new FullCalendar.Calendar(calendarEl, calendar_options);
            calendar.render();
        
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });

};


$(document).ready(function () {
    init_calendar();
});

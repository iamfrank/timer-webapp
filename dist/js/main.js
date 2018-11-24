(function timer() {

    // Properties

    let state = {}
    let stored_state = localStorage.getItem('timerstate')

    const ui_start_btn = document.querySelector('.timer--btn-start'),
          ui_stop_btn = document.querySelector('.timer--btn-stop'),
          ui_resume_btn = document.querySelector('.timer--btn-resume'),
          ui_clear_btn = document.querySelector('.timer--btn-clear'),
          ui_sec_el = document.querySelector('.timer-time--seconds'),
          ui_min_el = document.querySelector('.timer-time--minutes'),
          ui_hrs_el = document.querySelector('.timer-time--hours')

    // Methods

    function startTimer(state) {
        ui_start_btn.style.display = 'none'
        ui_stop_btn.style.display = 'block'
        state.started = Date.now()
        state.engaged = true
        localStorage.setItem('timerstate', JSON.stringify(state))
        ticktock()
    }

    function resumeTimer(state) {
        ui_start_btn.style.display = 'none'
        ui_resume_btn.style.display = 'none'
        ui_clear_btn.style.display = 'none'
        ui_stop_btn.style.display = 'block'
        state.resumable = state.elapsed
        state.started = Date.now()
        state.engaged = true
        ticktock()
    }

    function stopTimer(state) {
        ui_stop_btn.style.display = 'none'
        ui_resume_btn.style.display = 'block'
        ui_clear_btn.style.display = 'block'
        state.engaged = false
    }

    function clearTimer(state) {
        ui_resume_btn.style.display = 'none'
        ui_clear_btn.style.display = 'none'
        ui_start_btn.style.display = 'block'
        state.started = null
        state.elapsed = 0
        state.resumable = 0
        localStorage.setItem('timerstate', null)
        updateTime(state.elapsed)
    }

    function updateTime(elapsed) {
        const time = Math.floor( elapsed / 1000 ),
              secs = time % 60,
              mins = Math.floor( time / 60) % 60,
              hrs = Math.floor( time / 3600 )
        ui_sec_el.innerHTML = dispNum(secs)
        ui_min_el.innerHTML = dispNum(mins)
        ui_hrs_el.innerHTML = dispNum(hrs)
    }

    function ticktock() {
        if (state.engaged) {
            state.elapsed = ( Date.now() - state.started ) + state.resumable
            localStorage.setItem('timerstate', JSON.stringify(state))
            updateTime(state.elapsed)
            requestAnimationFrame(ticktock)
        }
    }

    function dispNum(num) {
        var s = num + ""
        while (s.length < 2) s = "0" + s
        return s
    }

    // Initialise

    console.log(stored_state)

    ui_start_btn.addEventListener('click', function() { startTimer(state) })
    ui_stop_btn.addEventListener('click', function() { stopTimer(state) })
    ui_resume_btn.addEventListener('click', function() { resumeTimer(state) })
    ui_clear_btn.addEventListener('click', function() { clearTimer(state) })

    if (stored_state) {
        state = JSON.parse(stored_state)
        resumeTimer(state)
    } else {
        state = {
            engaged: false,
            started: null,
            elapsed: 0,
            resumable: 0
        }
    }

})()

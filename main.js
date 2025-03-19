const moodOptionsContainer = document.querySelector(".mood-option-container");
const moodTrackForm = document.getElementById("mood-track-form");
const formContainer = document.getElementById("form-container");
const quoteContainer = document.getElementById("quote-container");
const submitBtn = document.getElementById("submit-btn");

const MOOD_SET = [
  { id: "happy", label: "Happy", emoji: "happy.gif" },
  { id: "neutral", label: "Neutral", emoji: "neutral.gif" },
  { id: "sad", label: "Sad", emoji: "sad.gif" },
  { id: "angry", label: "Angry", emoji: "angry.gif" },
  { id: "excited", label: "Excited", emoji: "excited.gif" },
  { id: "tired", label: "Tired", emoji: "tired.gif" },
  { id: "love", label: "Love", emoji: "love.gif" },
  { id: "sick", label: "Sick", emoji: "sick.gif" },
  { id: "unstable", label: "Unstable", emoji: "unstable.gif" },
];

const MOOD_QUOTES = {
  happy: {
    quote:
      "Happiness is not something ready-made. It comes from your own actions.",
    author: "Dalai Lama",
  },
  neutral: {
    quote:
      "Peace is the result of retraining your mind to process life as it is, not as you think it should be.",
    author: "Wayne Dyer",
  },
  sad: {
    quote:
      "Tears water our growth. Even in darkness, you are being shaped into light.",
    author: "Victoria Erickson",
  },
  angry: {
    quote:
      "For every minute you remain angry, you give up sixty seconds of peace of mind.",
    author: "Ralph Waldo Emerson",
  },
  excited: {
    quote:
      "Enthusiasm is the electricity of life. How do you get it? You act enthusiastic until you make it a habit!",
    author: "Gordon Parks",
  },
  tired: {
    quote:
      "Rest when you're weary. Refresh and renew yourself, your body, your mind, your spirit. Then get back to work.",
    author: "Ralph Marston",
  },
  love: {
    quote: "Love is not only something you feel, it is something you do.",
    author: "David Wilkerson",
  },
  sick: {
    quote:
      "Healing is a matter of time, but it is sometimes also a matter of opportunity.",
    author: "Hippocrates",
  },
  unstable: {
    quote:
      "Even the darkest storm eventually runs out of rain. Hold on, this too shall pass.",
    author: "Unknown",
  },
};

class MoodEntry {
  constructor(date, mood) {
    this.date = date;
    this.mood = mood;
  }
}

const existingMoodLogs = JSON.parse(localStorage.getItem("moodLogs"));
const moodLogs = existingMoodLogs || [];
const todayDate = new Date().toLocaleDateString("en-CA");
const todayData = moodLogs.find((e) => e.date == todayDate);

const getMoodData = (mood) => {
  return MOOD_SET.find((e) => e.id === mood);
};

const fetchDataForCalendar = (moodLogs) => {
  return moodLogs.map((log, index) => {
    const moodData = getMoodData(log.mood);
    return {
      id: index,
      title: `<img src="./assets/${moodData.emoji}" 
               alt="${moodData.label}" 
               class="mood-gif" 
               width="30" 
               height="30"><p>${moodData.label}</p>`,
      start: log.date,
      allDay: true,
      editable: false,
      extendedProps: {
        label: moodData.label,
      },
    };
  });
};

const createMoodOption = (mood) => {
  return `<div class="mood-option">
            <input class="mood-input" type="radio" name="mood" id="${mood.id}" value="${mood.id}">
            <label class="mood-label" for="${mood.id}">
                <img src="./assets/${mood.emoji}" alt="${mood.id}" class="mood-gif">
                <span class="mood-text">${mood.label}</span>
            </label>
        </div>`;
};

const showMoodQuote = (moodId) => {
  const moodData = getMoodData(moodId);
  const quoteData = MOOD_QUOTES[moodId] || {
    quote:
      "Your feelings are valid. Take a moment to breathe and be present with yourself.",
    author: "Anonymous",
  };

  return `<div class="quote-icon mb-20">
            <div class="mood-option">
                  <label class="mood-label" for="${moodData.id}">
                      <img src="./assets/${moodData.emoji}" alt="${moodData.id}" class="mood-gif">
                      <span class="mood-text fs-20">${moodData.label}</span>
                  </label>
              </div>
        </div>
          <div class="quote-text">"${quoteData.quote}"</div>
          <div class="quote-author">— ${quoteData.author}</div>
          <div class="mt-30 fs-14 text-muted">Track your mood daily and uncover patterns in your mood swings!</div>
        `;
};

const toggleFormCard = (data) => {
  if (!data) {
    formContainer.style.display = "block";
    quoteContainer.style.display = "none";
    MOOD_SET.forEach((mood) => {
      let moodOption = createMoodOption(mood);
      let wraperDiv = document.createElement("div");
      wraperDiv.classList.add("wrapper");
      wraperDiv.innerHTML = moodOption;
      moodOptionsContainer.append(wraperDiv);
    });
  } else {
    formContainer.style.display = "none";
    quoteContainer.style.display = "block";
    quoteContainer.innerHTML = showMoodQuote(data.mood);
  }
};

document.addEventListener("DOMContentLoaded", function () {
  moodOptionsContainer.innerHTML = null;

  toggleFormCard(todayData);

  var calendarEl = document.getElementById("calendar");
  var calendar = new FullCalendar.Calendar(calendarEl, {
    headerToolbar: {
      left: "title",
      right: "dayGridDay,dayGridWeek,dayGridMonth",
    },
    events: function (fetchInfo, successCallback) {
      successCallback(fetchDataForCalendar(moodLogs));
    },
    eventDidMount: function (info) {
      info.el.style.cursor = "pointer";
    },
    eventContent: function (info) {
      return { html: info.event.title };
    },
    eventClick: function (info) {
      const modal = document.getElementById("eventModal");
      const title = info.event.title;
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      const date = info.event.start
        ? info.event.start.toLocaleDateString("en-US", options)
        : "No date";
      const label = info.event.extendedProps.label;
      document.getElementById("mood-label").textContent = label;
      document.getElementById("mood-emoji").innerHTML = title;
      document.getElementById("mood-date").textContent = date;
      modal.style.display = "block";
    },
  });

  calendar.render();

  const modal = document.getElementById("eventModal");
  document.querySelector(".close").addEventListener("click", () => {
    modal.style.display = "none";
  });

  document.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  moodTrackForm.addEventListener("submit", function (event) {
    event.preventDefault();
    submitBtn.classList.add("loading");

    const formData = new FormData(this);
    const mood = formData.get("mood");

    if (!mood) {
      submitBtn.classList.remove("loading");
      return;
    }

    this.reset();
    const newEntry = new MoodEntry(todayDate, mood);
    moodLogs.push(newEntry);
    localStorage.setItem("moodLogs", JSON.stringify(moodLogs));
    submitBtn.classList.remove("loading");

    toggleFormCard(newEntry);

    calendar.refetchEvents();
  });
});

// localStorage.clear();
